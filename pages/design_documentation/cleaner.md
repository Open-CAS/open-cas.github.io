---
title: Cleaner
last_updated: August 17, 2022
toc: false
permalink: cleaner.html
---

Cleaner is a necessary feature of any caching solution. In the end, if there is
[**dirty data**](/cache_line.html#valid-and-dirty-bits), it must always be 
[**cleaned**](/cleaning.html) by flushing the dirty data from the cache to a 
backing storage.

In the Open CAS Framework, depending on a selected cache mode and a particular 
use case, data is cleaned in different situations and by different means. For 
example, the dirty data may be cleaned in the backround by the cleaner task or 
the cleaning may be triggered by an I/O engine. Moreover, dirty data must be 
cleaned in order to perform eviction, when cache is 100% full and the data is 
100% dirty. On top of that, user can also request a manual data flush by calling 
appropriate management function.

## Background cleaning
The Open CAS Framework implements different strategies of determining when and what 
data is subject to being cleaned by the background cleaner. These strategies are 
different [**cleaning policies**](/cleaner.html#cleaning-policies). 

The cleaning is performed by periodically invoking *ocf_cleaner_run()* by the 
OCF adapter. Adapter is expected to call it as a response to the *kick()* callback and 
then according to the interval returned by the cleaner completion callback.
For example, in Open CAS Linux, it is implemented using a background thread, however
other OCF adapters may implement it differently, if at all.

When *ocf_cleaner_run()* is called, sanity checks are performed. If those are 
successful, a cleaning policy specific *perform_cleaning()* operation is called. 
After determining what data is to be cleaned, the policy then invokes 
the cleaner function - *ocf_cleaner_fire()*. This function performs the actual 
flushing, moving the dirty data to a core device.


## Cleaning policies
The algorithm used for deciding what and when to clean is determined by the 
cleaning policy. The [**ALRU**](/cleaner.html#alru---approximately-least-recently-used)
cleaning policy is selected during cache startup and may be changed during runtime. 

Currently, Open CAS supports the following cleaning policies:

### ALRU - Approximately Least Recently Used
Approximately Least Recently Used (ALRU) is the default cleaning policy. It is based 
on a classic least-recently-used list (LRU) approach.


#### Configuration
ALRU policy uses several config parameters to tune the behavior of the cleaner.

* **Wake Up Time** - cleaning idle sleep wake up time (default: 20s). The time 
between cleaning attempts when there were no data to clean or when the cleaning was
not possible due to activity time limit.
* **Staleness Time** - the time a cache line resides in the ALRU list before it can 
be cleaned (default: 120s) 
* **Flush Max Buffers** - maximum amount of dirty cache lines to flush in one cleaning 
operation, i.e. one *ocf_cleaner_run()* call (default: 100 cache lines)
* **Activity Threshold** - cache I/O activity time period. Cleaning will not be 
commenced before this time period has expired since the last I/O activity.
(default: 10000 ms) 


#### Operation
The LRU list grows as the dirty data are being produced - when a cache line is 
hot, i.e. has been just written by the **write-back engine** or the 
**write-only engine**, it is added to the beginning of the LRU list, 
tagged with current timestamp. 

If a cache line already exists on the list, it is moved to the beginning of the 
list and its timestamp is updated.

After **Wake Up Time** has passed, background cleaning needs to be performed
by calling *ocf_cleaner_run()*, which is a responsibility of the OCF adapter. 
The actual interval is passed as a parameter to its completion callback. 
If ALRU decides there is another iteration of cleaning to be performed,
it passes the interval value of 0, effectively expecting the adapter to call 
*ocf_cleaner_run()* immediately. This process is repeated until there is 
no further data to clean. However, the actual cleaning will only be performed
when cache I/O **activity threshold** time has expired.

If all the conditions are met, a flush list of up to **Flush Max Buffers** 
is built by removing the cache lines from the back of the LRU list if their 
**staleness time** has expired.

This list is then provided to the OCF cleaner by issuing *ocf_cleaner_fire()*. 
OCF cleaner then issues an asynchrounous flushing request, eventually writing 
the dirty data to the core device.


### ACP - Aggressive Cleaning Policy
Aggressive Cleaning Policy (ACP) takes a rather different approach than ALRU. 
It organizes the core device into 100MiB chunks, maintaining a list of them. The 
chunks are put into "buckets" of varying dirty data percentage. There are 11 
buckets in the ACP, holding data chunks from 0% dirty up to 100% dirty, with 
a 10% granularity. ACP cleans the dirtiest chunks first, as described below.


#### Configuration
ACP uses these config parameters to tune the behavior of the cleaner:

* **Wake Up Time** - cleaning idle sleep wake up time (default: 10s). The time
between cleaning attempts.

* **Flush Max Buffers** - maximum amount of dirty cache lines to flush in one cleaning 
operation (default: 128 lines)


#### Operation
ACP creates the chunks lists per each core as a part of core adding process.
A chunk represents a linear, 100MiB part of the core device address space.
This creates an ACP-specific mapping of cache lines to the chunks. These chunks
are then put into buckets by the percentage of dirty cache lines in a chunk.

When a cache line is written and dirty data is created, the dirty lines counter 
in the chunk the cache line belongs to is incremented. Since the chunks are placed 
in the buckets according to the dirty lines percentage in a chunk, a chunk may be
moved to another bucket once the percentage threshold is met.

After **Wake Up Time** time has passed, background cleaning needs to be called by 
the adapter by issuing *ocf_cleaner_run()*. In the ACP, the cleaning logic selects 
the chunk to clean starting from the buckets with the higest dirty data percentage.
As soon as there is a non-empty chunk list within a bucket, first chunk from that 
list is selected.


The list of up to **Flush Max Buffers** of cache lines is provided to the OCF
cleaner. The *ocf_cleaner_fire()* is called and the OCF cleaner issues an 
asynchrounous flushing request, eventually writing the dirty data to the core 
device.

After a successful flush, the *ocf_cleaner_run()* callback will be called with the 
**Wake Up Time** time interval parameter, and the selection of a chunk to clean 
will commence again. If the chunk that was previously cleaned still has some dirty
data, it will be selected again and the cleaning constraints will be evaluated again.
The next portion of up to **Flush Max Buffers** of cache lines of this chunk will 
be flushed.


### NOP - No Operation Policy
No Operation Policy (NOP) is equivalent to no operation is performed by the background 
cleaner task, no logic is called to select and/or flush the data. This effectively 
disables the periodic background cleaning. Other cleaning cases remain unaffected. 

The *ocf_cleaner_run()* will not perform any cleaning and the callback will always
be called with an *interval* set to OCF_CLEANER_DISABLE. 

