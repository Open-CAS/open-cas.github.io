---
title: Cache modes implementation - I/O engines.
last_updated: September 14, 2022
toc: false
permalink: ocf_io_engines.html
---

# OCF I/O engines - general description.
Open CAS implements several [**cache modes**](/cache_configuration.html), 
each suitable for a different usage scenario. This is a per-cache setting 
set during creation of the cache.

Open CAS Framework uses basic building blocks called **I/O engines**. These 
blocks implement specific data write or read algorithms, e.g. write-through, 
write-back, read-generic etc.

To patch these two concepts together, Open CAS uses I/O interfaces - sets of 
callback function pointers that call a particular I/O engine to handle the 
request. In other words, any given **cache mode**, selected by the user during 
creation of a cache, maps to a specific **I/O interface** that eventually calls
a specific **I/O engine**.

This is an excerpt from an I/O interface definition:
~~~~~~~
// definition of cache modes I/O interfaces
static const struct ocf_io_if IO_IFS[OCF_IO_PRIV_MAX_IF] = {
	[OCF_IO_WT_IF] = {
		.read = ocf_read_generic,       
                .write = ocf_write_wt,          
                .name = "Write Through"
	}
        [OCF_IO_WB_IF] = { 
                .read = ocf_read_generic,       
                .write = ocf_write_wb,          
                .name = "Write Back"            
        },
[...]
~~~~~~~
For these particular interfaces, only the write path engines are different.
The read path is handled by a generic read function.

## I/O request handling by the engines

When an I/O request is issued from an application using OpenCAS, the framework
determines the cache mode and then a proper handling function is called via the
determined I/O interface.

Most of the time, the engine implementing a configured cache mode read or write
path is used. For example, for a write request to a cache running in a *write-back*
mode - *ocf_write_wb()* will be called.

However, when handling an I/O request, I/O engines may also redirect the request 
to any other engine, effectively changing the handler on-the-fly, should such 
need arise (e.g. sequential cutoff threshold hit, cache drive I/O error, 
unaligned I/O, etc.).


# OCF I/O engines - detailed description.
Open CAS Framework uses the following I/O engines:

* [**Generic Read**](/ocf_io_engines.html#generic-read)
* [**Write Through**](/ocf_io_engines.html#write-through-wt)
* [**Write Back**](/ocf_io_engines.html#write-back-wb)
* [**Write Around**](/ocf_io_engines.html#write-around-wa)
* [**Pass Through**](/ocf_io_engines.html#pass-through-pt)
* [**Write Invalidate**](/ocf_io_engines.html#write-invalidate-wi)
* [**Write Only**](/ocf_io_engines.html#write-only-wo)
* [**Backfill**](/ocf_io_engines.html#backfill-bf)
* [**Fast**](/ocf_io_engines.html#fast)
* [**Direct To Core**](/ocf_io_engines.html#direct-to-core-d2c)
* [**Invalidate**](/ocf_io_engines.html#invalidate)
* [**Discard**](/ocf_io_engines.html#discard)
* [**Ops Engine**](/ocf_io_engines.html#ops-engine)


## Generic Read
This is a bread-and-butter data read implementation provided by *ocf_read_generic()* 
function.

If the requested data exists in the cache - a cache hit situation - the data is 
read from a cache drive.

If the data is not completely clean (read partial dirty hit) and partially invalid,
a [**cleaner**](/cleaner.html) is invoked to clean the data, i.e. flush the dirty
data to the core. Afterwards, the request is handled again and the data is
read from the core and returned.

If the data does not exist in the cache (cache miss), the requested data is read 
from the core device. Additionally, a [**Backfill**](/ocf_io_engines.html#backfill-bf)
is performed in the background, where the missing data will eventually be 
inserted into the cache to accelerate subsequent reads.

In case of a partial miss and if some target sectors are dirty (partial dirty miss),
cleaning is performed first and then the data will be read from the core.

## Write Through (WT)
This engine, provided by the *ocf_write_wt()* function, writes the data to both 
cache and core devices, simultaneously. This effectively puts clean cache 
lines after each write operation into cache. Thus, when combined with 
[**Generic Read**](/ocf_io_engines.html#generic-read) engine, read operations 
will be accelerated.

If the data in the cache is dirty or it is a cache miss, the respective metadata 
bits are updated accordingly so the data in cache becomes valid and clean.

In some less common circumstances, the data may be written using
[**Write Invalidate (WI)**](/ocf_io_engines.html#write-invalidate-wi) engine 
(via *write()* call to the pass-through I/O interface), bypassing the cache
device altogether. This may happen if it is a miss and logic in 
*ocf_prepare_cachelines()* decides is not subject to insertion. 

## Write Back (WB)
In this engine, providing *ocf_write_wb()* function, the requested data 
is written to the cache device only, producing dirty data.
This data is then periodically cleaned by the [**cleaner**](/cleaning.html),
i.e. flushed to a core device.

The request may be handled by [**Write Invalidate**](/ocf_io_engines.html#write-invalidate-wi) 
engine if it cannot be handled by Write Back method, thus bypassing the cache.

This engine is used by the [**Write Back cache mode**](/cache_configuration.html#write-back)
to accelerate both write and read operations at the cost of a higher risk of 
data loss if the cache drive fails. It is also used by 
[**Write Only cache mode**](/cache_configuration.html#write-only), where cache 
is used as an accelerated write buffer.

## Write Around (WA)
This engine, provided by *ocf_write_wa()* function, writes the data to the cache
and to the core by executing [**Write Through (WT)**](/ocf_io_engines.html#write-through-wt) 
internally **if and only if the data has already been mapped**. Otherwise, the 
data goes to the core device only and are invalidated in the cache, by executing
[**Write Invalidate (WI)**](/ocf_io_engines.html#write-invalidate-wi) internally.

Used solely by Write Around cache mode, a mode used for disjointed workloads,
where read requests are accelerated with cache, but written data are effectively 
filtered out of cache. See [**write around cache mode configuration**](/cache_configuration.html#write-around)  

## Write Invalidate (WI)
Writes are issued only to the core device and then any data hit in the cache is 
invalidated (purged). Dirty data would be purged as well, as the most recent data 
has already been written to the core. 

## Pass Through (PT)
In most cases, the data is read from the core device. As the cache is bypassed, 
backfill is not performed - reads are not accelerated in this case.

If a sequential cutoff threshold is hit and the data is 100% dirty, a regular 
[**Generic Read**](/ocf_io_engines.html#generic-read) is performed, effectively
reading the data from the cache.

If some sectors are dirty, a cleaning is performed before reading the data from
a core device.

Used by the [**Pass Through cache mode**](/cache_configuration#pass-through).

## Write Only (WO)
This engine, provided by *ocf_read_wo* function, reads the data from a suitable 
device (either cache or core) but does not change the metadata, therefore it 
never cleans any dirty data. A backfill is NOT performed.

Because of that, some of the requested data may be read from the core, but a 
valid, clean data may be read from the cache device.

## Backfill (BF)
This engine is used internally by [**Generic Read**](/ocf_io_engines.html#generic-read)
in case of a cache miss. In such situation, backfill engine submits missed
cache lines into the cache to accelerate subsequent reads.

## Fast
This engine was implemented for historical reasons - BIO vs request-based 
IO interfaces in Linux kernel spawned a change in the IO path implementation.

In contrast to a regular CAS IO handling by using request queues and I/O threads,
Fast engine, or Fast Path, executes engine logic synchronously.

I/Os handled by Fast Path are 
* read and write hit in WB and WO cache modes
* other cache modes except PT - read hit only

## Direct To Core (D2C)
Direct To Core, or D2C, was implemented for handling a detached cache drive 
state of CAS. In this mode, cache metadata is neither referenced nor modified 
and all read and write I/O requests go directly to the core device.

## Invalidate
This engine is used internally by other engines in case of a write request error.
It invalidates the cache lines when such condition occurs.

## Discard
Discard operations issued to a cache instance results in purging the cache lines
covered by the discarded address range and passing the discard operation to the 
core device. This engine is optimized to handle large requests, such as whole 
drive discards.

## Ops Engine
Ops engine is used when a preflush request was sent to the block device, requesting
the device's volatile write-back cache to be flushed. This flush request will 
be sent to the cache and the core device.
