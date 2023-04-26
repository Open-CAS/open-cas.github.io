---
title: Open CAS Linux - Admin Guide
last_updated: April 8, 2020
toc: true
permalink: guide_advanced_options.html
---

Advanced Options
================

Many-to-one Option
------------------

You can add multiple core devices to a single cache device. An example
*opencas.conf* demonstrates:

>> \#\# Caches configuration section
>>
>> [caches]
>>
>> \#\# Cache ID Cache device Cache mode Extra fields (optional)
>>
>> 1 /dev/disk/by-id/nvme-SUPER_FAST_DISK-part5 wb ioclass_file=/etc/opencas/ioclass-config.csv
>>
>> \#\# Core devices configuration
>>
>> [cores]
>>
>> \#\# Cache ID Core ID Core device
>>
>> 1 1 /dev/disk/by-id/wwn-0x123456789abcdef0
>>
>> 1 2 /dev/disk/by-id/wwn-0x888844445ab100d1
>>
>> 1 3 /dev/disk/by-id/wwn-0xd00de123456789ab
>>
>> 1 4 /dev/disk/by-id/wwn-0x213745689abcdef5

This example shows 4 core devices paired with a single NVMe drive partition.

For each core device added, a cache-core pair will be created with the following
naming format:

-   */dev/cas1-1* will be created associated with *\<cache_id\> =1*, first
   core device.   (For example: */dev/disk/by-id/wwn-0x123456789abcdef0*)

-   */dev/cas1-2* will be created associated with *\<cache_id\>=1*, second core device.  
   (For example: */dev/disk/by-id/wwn-0x888844445ab100d1*)

Display cache listing via `casadm -L`:

> \# casadm -L
> type id disk status write policy device
>
> cache 1 /dev/nvme0n1p5 Running wb -  
> ├core 1 /dev/sda Active - /dev/cas1-1  
> ├core 2 /dev/sdb Active - /dev/cas1-2  
> ├core 3 /dev/sdc Active - /dev/cas1-3  
> └core 4 /dev/sdd Active - /dev/cas1-4  



Multi-Level Caching
-------------------

Open CAS Linux supports multi-level caching. For example, this enables the user to
cache warm data from slow HDD media to faster SSD media, and then cache hot data
from the SSD to an even faster media such as a RAMdisk. In this case, a fixed
portion of DRAM will be allocated for buffering, and the SSD will remain as a
fully inclusive cache so DRAM cache data will always be available on the SSD.

To set up a RAMdisk-based cache level, do the following:

-  Create a RAMdisk (100 MB or larger).

-   In RHEL, for example, the default RAMdisk size is 8 MB so it must be
    configured to be equal or greater than 40 MB.

-  For kernels 3.0 or newer, issue the following command to increase the
    RAMdisk size to 100 MB:

>   \# modprobe brd rd_size=102400

-  Do not format or create a file system or mount the RAMdisk, at this time.

-  Do not use */dev/ram0* since it is reserved by the kernel. Use any available
    RAMdisk */dev/ram1* or greater. We will use */dev/ram1* in this example.

-  Reboot the system and start a fresh Open CAS Linux install, if necessary.

-  Create the SSD cache instance, where */dev/sdc* is your SSD cache device:

>   \# casadm -S -d /dev/disk/by-id/nvme-SSD

-  Add a core device (*/dev/sdb*) mapping to the SSD cache instance:

>   \# casadm -A -i 1 -d /dev/disk/by-id/wwn-0x50014ee0aed22393

-  Create by-id link to RAMdisk */dev/ram1*:

>   \# ln -s /dev/ram1 /dev/disk/by-id/ram-disk-part1

-  Create the RAMdisk cache instance:

>   \# casadm -S -d /dev/disk/by-id/ram-disk-part1 -i 2

-  Add the tiered core device (*/dev/cas1-1*) mapping to the RAMdrive
    cache instance:

>   \# casadm -A -i 2 -d /dev/cas1-1

-  Create the file system from the newly created tiered cache drive:

>   \# mkfs -b 4096 -t ext3 /dev/cas2-1

   or

>   \# mkfs.ext4 -b 4096 /dev/cas2-1

   or

>   \# mkfs.xfs -f -i size=2048 -b size=4096 -s size=4096 /dev/cas2-1

-  Create a cache directory and mount the cache to it:

>   \# mkdir -p /mnt/cache1  
>   \# mount /dev/cas2-1 /mnt/cache1

The newly created and mounted cache drive */mnt/cache1* is ready for use.

By default, any RAMdisk tiered buffering setup is volatile and will need to be
set up again following a system restart. Any data should remain in the SSD
following a clean restart. See section [**Stopping Cache Instances**](/guide_running.html#stopping-cache-instances) for details on stopping
Open CAS Linux.

*Caution:* If the RAMdisk cache tier is started in write-back mode and there is
a dirty shutdown, data loss may occur.

Linux\* LVM support
-------------------

Open CAS Linux supports LVM in two ways.

1.  LVM physical volumes can be created directly on Open CAS Linux devices. This
    allows creation of volume groups thereon, and later creation of logical
    volumes on those groups.

    With older versions of LVM, you must first create a partition on the core
    device (eg. if the core device is /dev/sdc, you must create /dev/sdc1) prior
    to accelerating that device with Open CAS Linux device and creating the physical
    volume or creation of the logical volume will fail. If you see the following
    warning: *“WARNING: Ignoring duplicate config node: types (seeking types);
    Found duplicate PV”*, then you must use this workaround.

2.  LVM logical volumes can be used as core devices, just like regular
    partitions.

LVM must be configured in the system before using it with Open CAS Linux, which is
outside of the scope of this document.

Ensure Open CAS Linux devices are listed as acceptable block device types in
*/etc/lvm/lvm.conf* by adding the following line to the advanced settings:

>>   \# Advanced settings.  
>>   \# List of pairs of additional acceptable block device types found  
>>   \# in /proc/devices with maximum (non-zero) number of partitions.  
>>   *types = [ "cas", 16 ]*

After the LVM is configured and an Open CAS Linux device has been created (see
[**Configuring CAS**](/guide_configuring.html) for further details) a physical
volume can be created thereon:

>   \# pvcreate /dev/cas1-1   

or if creating the physical volume from a partition on the Open CAS Linux device  
> \#pvcreate /dev/cas1-1p1

Additionally, after the Open CAS Linux PV volume has been created it is imperative
the underlying core device is excluded for use by LVM. Excluding the device will
avoid LVM warnings about duplicate metadata between the exported Open CAS Linux drive
and the core drive. It will also ensure Open CAS Linux starts cleanly after system
reboots by preventing LVM from opening the core drive when it has been already
opened exclusively by Open CAS Linux. To exclude the core drive from LVM populate the
global_filter variable in the */etc/lvm/lvm.conf* file with the core drive’s
unique storage identifier (WWN). For example, to exclude the core device with
unique identifer *wwn-0x5000c50066d547a9-part1* add the following lines to
*/etc/lvm/lvm.conf* :

>>   \# Exclude the core device for use by LVM using a global filter.  
>>   \# Use the full WWN path in the format [“r\|WWN\|”]  
>>   *global_filter = [ "r\|/dev/disk/by-id/wwn-0x5000c50066d547a9-part1\|" ]*

After the physical volume is created, the user can create a volume group, for
example: *vg_cas*, and then a logical volume on it, for example: *lv_cas*:

>   \# vgcreate vg_cas /dev/cas1-1  
>   \# lvcreate -n lv_cas -l 100%FREE vg_cas

   Create and mount LVM filesystem to “*vfs_cas*”:

>   \# mkfs.ext4 \<-b 4096\> /dev/vg_cas/lv_cas  
>   \# mkdir -p /mnt/vfs_cas  
>   \# mount /dev/vg_cas/lv_cas /mnt/vfs_cas

  To remove the LVM device, use the following steps:

>   \# umount /mnt/vfs_cas  
>   \# vgchange -an vg_cas  
>   \# casadm -R -i \<cache_id\> -j \<core_id\>  
>   \# casadm -T -i 1

Dynamic logical volume reduction or extension is not automatically supported
(e.g. vgreduce or vgextend). The user must remove the Open CAS Linux device (e.g.
*cas1-1*) as the physical volume, perform the necessary size changes and
then recreate the physical volume based on the Open CAS Linux device. Consult LVM man
pages and web wikis for details on how to use and manage LVMs.

Trim Support
------------

The trim command (known as TRIM in the ATA command set, and UNMAP in the SCSI
command set) allows an operating system to inform an SSD which blocks of data
are no longer considered in use and can be wiped internally. TRIM is enabled by
default and supported by Open CAS Linux. When a user or application deletes
data, Open CAS Linux will free the cache lines associated with that data when
TRIM is used. This avoids the time required to flush that data to the backend
storage such as hard drives.

In order to take advantage of this feature, the Linux file system has to be
configured so TRIM requests are properly sent to Open CAS Linux for processing. The
configuration consist of mounting the file system with the discard option, which
applies to most file systems, such as ext4 or xfs.

The following command is an example:

>   \# mount -o discard /dev/cas1-1 /mnt

Kernel Module Parameters
------------------------

Following is a list of available system and kernel parameters that can be
modified to further improve the performance of certain applications. These
parameters should not be modified without advanced tuning expertise and a
thorough knowledge of the workload. Please contact the Open CAS community  for further
details or support.

The parameters are: unaligned_io, metadata_layout, and
use_io_scheduler.

*   **unaligned_io:** This parameter enables user to specify how IO requests
    unaligned to 4KiB should be handled. This parameter should be changed if
    caching such requests cause performance drop.

    +   Possible values: 0 - handle unaligned requests using PT mode, or 1 - handle
        unaligned requests using current cache mode (default)

*   **metadata_layout:** This parameter enables user to specify layout of
    metadata on SSD. This is an advanced parameter for **controlling** Open CAS Linux
    internal metadata layout.

    + Possible values: 0 - striping (default), or 1 - sequential

*   **use_io_scheduler:** This parameter enables user to specify how IO requests
    are handled - if IO scheduler will be used or not. **User** can disable IO
    scheduler on Open CAS Linux device if there is another block device with its own
    scheduler on top of it (for example LVM). This parameter has no effect for
    write-back mode. 

    +  Possible values: 0 - handle IO requests in application context, thus omit IO
       scheduler, or 1 - handle IO using IO scheduler (default)

The parameters can only be changed during module loading and must be added to
the system startup so they would take effect upon reboots. To change the values
of these parameters without modifying Open CAS Linux startup files, you can create a
configuration file in */etc/modprobe.d* directory. For example, on a RHEL 7.3
system, create the file */etc/modprobe.d/cas_cache.conf* with the following
content, then restart Open CAS Linux or reboot the system:

> \# cat /etc/modprobe.d/cas_cache.conf
>
> options cas_cache unaligned_io=0 seq_cut_off_mb=10

**NOTE:** The example above may not apply to your specific Operating System.
Please see the appropriate documents for your operating system for properly
modifying these parameters.

**Performance Options**
In some instances, like sequential read on a newly created cache device, the
cache device may become overloaded, causing slower performance, and the queue
may increase, consuming system buffers. To avoid this issue, it may be necessary
to manually force an optimal queue size for the cache write queue specific to a
use case. The default max_writeback queue_size value is 65,536. Another
parameter may also be used to determine the unblock threshold for this queue:
writeback_queue_unblock_size (default value is set at 60,000). You can use the
following command to overwrite this default value and set a custom max_writeback
queue_size or alter the writeback_queue_unblock_size threshold:

>   \# modprobe cas_cache max_writeback_queue_size=\<size\>
>   writeback_queue_unblock_size=\<size\>

   or

>   \# insmod cas_cache max_writeback_queue_size=\<size\>
>   writeback_queue_unblock_size=\<size\>

The above examples are each a single line.

Keep in mind that the modinfo command only displays the default values of these
parameters. To check the actual values of the parameters that you have modified,
you can do so by examining /sys/modules/cas_cache/parameters/\* files:

>>   /sys/module/cas_cache/parameters/max_writeback_queue_size  
>>   /sys/module/cas_cache/parameters/writeback_queue_unblock_size.

If you are not seeing the correct values in the sysfs files, it is most likely
because you have not unloaded the Open CAS Linux module prior to running modprobe.
The modprobe command does not return any errors when you try to run it against a
module that is already loaded.


*Writeback Throttling*  
One can disable WB throttling for a block device via sysfs, similarly to how IO scheduler is changed:

> echo 0 > /sys/block/<device>/queue/wbt_lat_usec

It is recommended to apply this setting to all core/cache devices on all systems with WB throttling functionality and kernel version below 4.19. This feature was introduced in kernel 4.10, however it is possible that distributions would port it to older kernels. Thus the best approach is to disable WB throttling on susceptible kernels whenever the sysfs file exists.

If CAS core/cache device is not dedicated for CAS exclusive use (e.g. partitioned drive used as CAS cache and journal) then disabling WB throttling might affect quality of service for the I/O concurrent to CAS. In this case user needs to either find a compromise or move to a kernel 4.19 or newer.

