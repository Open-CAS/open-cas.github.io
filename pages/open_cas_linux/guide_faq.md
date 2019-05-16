---
title: Open CAS Linux - Admin Guide
last_updated: April 29, 2019
toc: true
permalink: guide_faq.html
---

Frequently Asked Questions
==========================

This appendix provides contact information and answers to frequently asked
questions.

**How do I post an issue related to Open CAS Linux**

Post a new issue at the following URL:  
-   Open CAS GitHub Issue (<https://github.com/Open-CAS/open-cas-linux/issues/new>)

**Why does Open CAS Linux use some DRAM space?**

Open CAS Linux uses a small amount of system memory for metadata, which tells us
which data is in the SSD, which is in the HDD. The amount of memory needed is
proportional to the size of the cache space. This is true for any caching
software solution. However with Open CAS Linux this memory footprint can be decreased
using a larger cache line size set by the parameter *--cache-line-size* which may be useful in high density servers with many large HDDs.

**Does Open CAS Linux work with non-Intel® SSDs?**

Yes, however we validate only on Intel(R) SSDs. In addition Open CAS Linux utilizes the
features of Intel SSD to provide improved performance and functionality that may
not be available with third party products. Open CAS Linux is also favorably priced
when purchased with Intel SSDs.

**How do I test performance?**

In addition to the statistics provided (see Monitoring Open CAS Linux for details),
third-party tools are available that can help you test IO performance on your
applications and system, including:

-   FIO (<http://freecode.com/projects/fio>)

-   dt (<http://www.scsifaq.org/RMiller_Tools/dt.html>) for disk access
    simulations

**Is it possible to experience slower than HDD performance when using caching?**

Yes, it is possible. For example, if the cache is in write-back mode and the
entire cache is full of dirty data and a read occurs which requires new blocks
to be loaded into the cache, performance will be degraded even if the read is
sequential. The cache must first evict dirty blocks, which requires random
writes to the HDD, then read the new data from the HDD and finally, write it to
the cache. Whereas, without caching it would have simply resulted in a single
read from the HDD. To avoid situations such as these, Open CAS Linux
opportunistically flushes dirty data from the cache during idle IO times.

**Where are the cached files located?**

Open CAS Linux does not store files on disk; it uses a pattern of blocks on the SSD
as its cache. As such, there is no way to look at the files it has cached.

**How do I delete all the Open CAS Linux installation files?**

Stop the Open CAS Linux software as described in the section [**Stopping Cache Instances**](/guide_running.html#stopping-cache-instances),
then unload any CAS kernel modules and remove the source files.

**Does Open CAS Linux support write-back caching?**

Yes. Open CAS Linux v2.6 and newer supports write-back caching. See the section [**Manual Configuration for Write-Back Mode**](/guide_configuring.html#manual-configuration-for-write-back-mode) for details.

**Must I stop caching before adding a new pair of cache/core devices?**

No, you can create new cache instances while other instances are running.

**Can I assign more than one core device to a single cache?**

Yes. With Open CAS Linux for Linux v2.5 and newer, many core devices (up to 32 have
been validated) may be associated with a single cache drive or instance. You can
add them using the casadm -A command.

**Can I add more than one cache to a single core device?**

No, if you want to map multiple cache devices to a single core device, the cache
devices must appear as a single block device through the use of a system such as
RAID-0.

**Why do tools occasionally report data corruption with Open CAS Linux?**

Some applications, especially micro benchmarks like *dt* and *FIO*, may use a
device to perform direct or raw accesses. Some of these applications may also
allow you to configure values like a device’s alignment and block size
restrictions explicitly, for instance via user parameters (rather than simply
requesting these values from the device). In order for these programs to work,
the block size and alignment for the cache device must match the block size and
alignment selected in the tool.

**Do I need to partition the cache device?**

No. If you do not specify a partition, Open CAS Linux uses the entire device as the
cache device.

**Can I use a partition on a SSD as a cache device?**

Yes, however, using the entire SSD device as the cache is highly recommended for
best performance.

**Do I need to format the partition or the device configured as the cache
device?**

No, the cache device has no format requirement. If any formatting is used, it is
transparent to the caching software.

**What is the logical and physical block size for Open CAS Linux cache volumes (for
exported objects)?**

The logical block size for Open CAS Linux cache volumes is inherited from the core
device, while the physical block size will be represented as the larger of the
physical block sizes of the cache or core devices.

It is not possible to add a core device to a cache instance when the logical
    block size of the cache device is greater than that of the core device (eg.
    when the SSD has 4KiB logical block size and the HDD has 512B logical block
    size).

**What happens if my SSD or HDD becomes unresponsive or disconnected?**

In the event of a cache or core device becoming unresponsive, Open CAS Linux will
fail all IO to all exported devices for the related cache (eg. /dev/cas1-1,
/dev/cas1-2, etc.). To resume IO to the exported devices for the given
cache, the user must restart the affected cache (in this example, cache ID 1).

**When my device becomes disconnected, will I receive any notification from
Cache Acceleration Software (CAS)?**

No. The OS does not send notification to Open CAS Linux of the disconnection of the
device, so the software will not know of this event until IO to the device is
attempted. The device will still be listed in the --list-caches and --stats
output, and no warning will be logged, until IO to the device is attempted.
Check /var/log/messages and dmesg for standard Linux device IO errors.

**Where is the log file located?**

All events are logged in the standard Open CAS Linux system logs. Use the *dmesg*
command or inspect the */var/log/messages* file.

To log all messages during testing or kernel debugging, use the command echo 8
\> /proc/sys/kernel/printk.

Typical log sample of successful cache initialization:
>> Cache line size: 64 KiB  
>> Metadata capacity: 25 MiB  
>> Parameters (policies) accepted:: 0 1 1 4  
>> Pre-existing metadata, Clean shutdown  
>> Done saving cache state!  
>> Cache 1 successfully added  
>> IO Scheduler of cas1-1 is cfq  
>> Core "/dev/sdc" successfully added

Typical log sample of successful cache removal:
>> Removing Cache 1  
>> Trying to remove 1 cached device(s)  
>> Removed device cas1-1.  
>> Done saving cache state!  
>> Cache 1 successfully removed

**Why does flushing the cache drive in Write Back mode take so long?**

Flushing time has many factors, including but not limited to, cache device
capacity, storage performance, and overall system utilization. Flushing time can
vary greatly depending on these factors. You can check the status of the cache
device being flushed by using the -L option in casadm.

>   \# casadm -L

The following command can be used as well to verify activity and loading of the
IO devices.

>   \# iostat -xmt 1

**Should nr_request be modified for further tuning?**

The *nr_requests* controls how many requests may be allocated in the block layer
for read or write requests. It represents the IO queue size. Each request queue
has a limit on the total number of request descriptors that can be allocated for
each read and write IO. By default, the number is 128, meaning 128 reads and 128
writes can be queued at a time before putting a process to sleep.

Large values of *nr_request* may increase throughput for workloads writing many
small files. For larger IO operations, you may decrease the *nr_request* value.
To get better read performance, you can set the *nr_request* value to 1024 for
example, but increasing the value too high might introduce latency and degrade
write performance. For latency sensitive applications, the converse is also
true.

Configuring *nr_requests* to a larger value may improve performance for some
customers who are caching multi-HDD RAID onto one SSD. However, this may not be
useful with environments, such as Ceph, where each HDD is being cached to one
SSD or a partition on an SSD. Your application and its IO patterns may vary and
require a detailed tuning exercise.

To change the *nr_requests* value, use the following procedure:
>   \# cat /sys/block/sda/queue/nr_requests  
>   128  
>   \# echo 256 \> /sys/block/sda/queue/nr_requests
