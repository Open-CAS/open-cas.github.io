---
title: Open CAS Linux - Admin Guide
last_updated: April 29, 2019
toc: true
permalink: guide_configuring.html
---

Configuring Open CAS Linux
======================

Open CAS Linux Configuration File - */etc/opencas/opencas.conf*
-------------------------------------------------------------

Once Open CAS Linux has been installed, the next stop for the Open CAS Linux administrator
should be the *opencas.conf*. This file is the primary point for system cache
and core device configuration and is essential to correct Open CAS Linux operation.

The file is read by system udev rules upon startup. For each block device that
appears in the system, rules check to see if the device is in the
*opencas.conf*, and take action accordingly. The file is divided into two main
sections:

1.  Caches configuration section

2.  Core devices configuration

The Caches configuration section specifies:

1.  Cache ID. This indicates the ID used for starting a cache instance on a
    given device.

2.  Path to the NVMe or other cache device(s). The recommended cache device is a
    Non-volatile Memory Express (NVMe) solid state drive. Open CAS Linux has been
    engineered to take advantage of the high speed and low latency of even the
    latest NVMe drives.

3.  Desired cache mode.

4.  Extra fields, such as the full path to the custom IO Classification file.

The Core devices configuration section specifies:

1.  Cache ID. Specifies which cache device each core corresponds to.

2.  Core ID. Indicates the ID used for core device(s) corresponding to a
    specific cache within the system.

3.  Path to the core device(s).

Example of caches and cores configuration in an operational *opencas.conf*
file:

  >> \#\# Caches configuration section
  >>
  >> [caches]
  >>
  >> \#\# Cache ID Cache device Cache mode Extra fields (optional)
  >>
  >> 1 /dev/disk/by-id/nvme-SSD WT
  >> ioclass_file=/etc/opencas/ioclass-config.csv
  >>
  >> \#\# Core devices configuration
  >>
  >> [cores]
  >>
  >> \#\# Cache ID Core ID Core device
  >>
  >> 1 1 /dev/disk/by-id/wwn-0x50014ee0aed22393
  >>
  >> 1 2 /dev/disk/by-id/wwn-0x50014ee0042769ef
  >>
  >> 1 3 /dev/disk/by-id/wwn-0x50014ee00429bf94
  >>
  >> 1 4 /dev/disk/by-id/wwn-0x50014ee0aed45a6d
  >>
  >> 1 5 /dev/disk/by-id/wwn-0x50014ee6b11be556
  >>
  >> 1 6 /dev/disk/by-id/wwn-0x50014ee0aed229a4
  >>
  >> 1 7 /dev/disk/by-id/wwn-0x50014ee004276c68

Further details are available in the complete default
*/etc/opencas/opencas.conf* file, as follows:

>> version=19.03.00  
>> \# Version tag has to be first line in this file   
>>
>> \# Open CAS configuration file - for reference on syntax  
>> \# of this file please refer to appropriate documentation  
>>
>> \# NOTES:  
>> \# 1) It is highly recommended to specify cache/core device using path  
>> \# that is constant across reboots - e.g. disk device links in  
>> \# /dev/disk/by-id/, preferably those using device WWN if available:  
>> \#   /dev/disk/by-id/wwn-0x123456789abcdef0  
>> \# Referencing devices via /dev/sd* may result in cache misconfiguration after  
>> \# system reboot due to change(s) in drive order.  
>>
>> \## Caches configuration section  
>> [caches]  
>> \## Cache ID     Cache device                            Cache mode      Extra fields (optional)  
>> \## Uncomment and edit the below line for cache configuration  
>> \#1              /dev/disk/by-id/nvme-SSDP..       WT  
>>
>> \## Core devices configuration  
>> \[cores]  
>> \## Cache ID     Core ID         Core device  
>> \## Uncomment and edit the below line for core configuration  
>> \#1              1               /dev/disk/by-id/wwn-0x123456789abcdef0  
>>
>> \## To specify use of the IO Classification file, place content of the following line in the  
>> \## Caches configuration section under Extra fields (optional)  
>> \## ioclass_file=/etc/opencas/ioclass-config.csv  


Field details:

-   *\<Cache ID\>* is a numeric value between 1 and 16,384 (valid cache instance
    numbers).

-   *\<Core ID\>* is a numeric value between 0 and 4095 (valid core instance
    numbers)

-   Cache and core devices must point to existing HDD and SSD devices, referenced
    by the by-id name (ls -l /dev/disk/by-id). Core devices should reference
    the WWN identifier, while Cache devices should use model and Serial Number.

-   Mode determines the cache mode, either write-through, write-back,
    write-around, write-only, or pass-through.

-   *Optional:* Extra flags allow extra settings for the cache and core devices
    and are comma separated.

    -   *ioclass_file* allows the user to load a file that specifies an IO class
        policy for this cache.

    -   *cleaning_policy* allows the user to specify the cache cleaning policy
        to be used for this cache, either acp, alru, or nop.

    -   *promotion_policy* allows the user to specify the promotion policy
        to be used for this cache, either always or nhit.

    -   *cache_line_size* allows the user to specify the cache line size to be
        used for this cache in kibibytes, either 4, 8, 16, 32, or 64.

    -   *target_failover_state* allows the user to specify the state in which 
        the cache will be loaded - active (default) or standby for failover cache
        instance

    -   *lazy_startup* if set to true it allows to skip waiting for given device
        on system boot. WARNING: It should be used with care. Setting lazy_startup
        on cores while using WB cache might cause data corruption if Open CAS
        loses the race for device with application using given core.

The Open CAS Linux Configuration Utility - casadm
---------------------------------------------

Open CAS Linux provides a user-level utility called casadm to allow for configuration
and management of the caching software.

In using casadm, it is important to understand certain restrictions:

-   You must be logged on as root or have root privileges to start, stop, or
    configure Open CAS Linux.

-   You cannot accelerate the partition where the operating system resides.

-  If a super user promotes you to root, there is no guarantee that the */sbin*
    directory will be in your \$PATH environment variable. If casadm is not
    accessible, check this variable first. Use the command’s full path.

If you launch the configuration utility via casadm -H, a list of command line
options and arguments is returned. For more detailed information on the
different command line options, see the section [Configuration Tool Details](/guide_tool_details.html#configuration-tool-details).

For Open CAS Linux configuration, note that the term “cache device” refers to the
SSD/NVMe device or RAM disk that is used for caching data from a slower device,
while the term “core device” refers to the slower device to be cached.

Using the Configuration Utility
-------------------------------

While configuration of Open CAS Linux via the *opencas.conf* file is highly
recommended, the following sections detail how to manually configure Open CAS Linux
options using casadm. For more details on available commands for the casadm
utility, see the section [Configuration Tool Details](/guide_tool_details.html#configuration-tool-details).

The following is assumed for the subsequent instructions:

-   The cache device (SSD) is */dev/sdc*. The cache device is either a raw block
    device or ram disk accessed as a block device. Ensure that the cache device
    does not have a file system and is not mounted.

-  Back up all data on your cache device before completing these steps as all
    data will be overwritten.

-   The core device (primary storage) to be cached is */dev/sdb*.

-   The core device may contain a filesystem (with or without data) or may be a
   raw block device. See system requirements for specific file system
   types and limitations for Open CAS Linux. Ensure that the device is not mounted.

-   Perform an *ls -l* or *ll* on the */dev/disk/by-id* directory
    to obtain correct paths to devices that are being configured.

-   Core device (HDD) logical block size must be 512 bytes or larger.

-   Cache device logical block size must be smaller than or equal to the logical
    block size of the core storage device.

-   Ensure that both devices are removed from */etc/fstab* and any other
    mechanism that auto mounts either the cache device or core device.

If the Open CAS Linux module is not loaded, follow the [installation](/guide_installating.html)
instructions. If the Open CAS Linux installation fails, contact the OCF community for
support.

Manual Configuration for Write-through Mode
-------------------------------------------

In write-through mode, which is the Open CAS Linux default caching mode, the caching
software writes data to the flash device and simultaneously writes the same data
“through” to the core device (disk drives). Write-through ensures the core
device is 100% in sync with the cache and its data is always available to other
servers sharing that storage. However, this type of cache will accelerate only
read intensive operations.

-  Ensure that the core device (*/dev/sdb*) is not mounted and that the cache
    device (*/dev/sdc*) is not mounted and contains no data to be saved.
    Entering the following command will display all mount points:

>   \# mount

-  Start a new cache with an ID of “1”:

>   \# casadm -S -i 1 -d /dev/disk/by-id/nvme-SSD

-   You may notice a brief delay after entering the casadm -S command.
   Typically, this is less than 60 seconds, but can be longer.

-   If the cache device is formatted or a file system already exists, you will
   need to use the “-f” force flag (for example,
   casadm -S -d /dev/disk/by-id/nvme-SSD -f).

-  All information on the cache device will be deleted if the -f option is
    used. Please ensure all data has been backed up to another device (see
    Configuration Tool Details section for further details).

-  Pair the core device to this new cache:

>   \# casadm -A -i 1 -d /dev/disk/by-id/wwn-0x50014ee00429bf94

-   The *add-core* command creates a new device in the */dev* directory with the
   following name format:

>   cas\<cache ID\>-\<core \#\> for example: */dev/cas1-1.*

-   This new device can be treated as a regular block device.

Manual Configuration for Write-back Mode
----------------------------------------

In write-back mode, the caching software writes the data first to the cache and
acknowledges to the application that the write is completed, before the data is
written to the core device. Periodically, those writes are “written back” to the
disk opportunistically. While write-back caching will improve both write and
read intensive operations, there is a risk of data loss if the cache device
fails before the data is written to the core device.

Write-back mode is enabled when starting a new cache device with the option “-c
wb”:

>   \# casadm -S -i 1 -d /dev/disk/by-id/nvme-SSD -c wb

Pairing of a core device is similar to the previous step for Manual
Configuration for Write-through Mode section.

Manual Configuration for Write-around Mode
------------------------------------------

In write-around mode, the caching software writes data to the flash device if
and only if that block already exists in the cache and simultaneously writes the
same data “through” to the core device (disk drives). Write-around is similar to
write-through in that it ensures the core device is 100% in sync with the cache
and in that this type of cache will accelerate only read intensive operations.
However, write-around further optimizes the cache to avoid cache pollution in
cases where data is written and not often subsequently re-read.

Write-around mode is enabled when starting a new cache device with the option
“*-c wa”*:

>   \# casadm -S -i 1 -d /dev/disk/by-id/nvme-SSD -c wa

Pairing of a core device is similar to the Manual Configuration for
Write-through Mode section.

Manual Configuration for Pass-through Mode
------------------------------------------

In pass-through mode, the caching software will bypass the cache for all
operations. This allows the user to associate all their desired core devices to
be cached prior to actually enabling caching. Once the core devices are
associated, the user would dynamically switch to their desired caching mode.

Pass-through mode is enabled when starting a new cache device with the option
“*-c pt”*:

>   \# casadm -S -i 1 -d /dev/disk/by-id/nvme-SSD -c pt

Pairing of a core device is similar to the Manual Configuration for
Write-through Mode section.

Manual Configuration for Write-only Mode
------------------------------------------

In write-only mode, the caching software writes the data first to the cache and
acknowledges to the application that the write is completed, before the data is
written to the core device. Periodically, those writes are written back to the
core device opportunistically. The caching software bypasses the cache for new read
operations. Read operations can be served from the caching device only if
the data was previously written to the cache device.
Write-only caching will improve write intensive operations
primarily, however, there is a risk of data loss if the cache device
fails before the data is written to the core device.

Write-only mode is enabled when starting a new cache device with the option
“*-c wo”*:

>   \# casadm -S -i 1 -d /dev/disk/by-id/nvme-SSD -c wo

Pairing of a core device is similar to the Manual Configuration for
Write-through Mode section.

Switching Caching Modes
-----------------------

You can switch between different caching modes any time without rebooting or
restarting Open CAS Linux. For example, you can switch from WT mode to PT mode to
stop caching during maintenance or for testing purposes.

To switch from WB to any other mode, you must specify whether dirty data should
be flushed now or later using the -\-flush-cache option. Depending on the
-\-flush-cache option used, switching from WB to other caching modes may require
time to complete before caching mode is changed.

The following example places Open CAS Linux into PT mode for cache id 1.

>   \# casadm -\-set-cache-mode -\-cache-mode pt -\-cache-id 1

  or

>   \# casadm -Q -c pt -i 1

Automatic Partition Mapping
---------------------------

If the core device to be accelerated has existing partitions, selecting the
parent device as the core device to be accelerated (e.g. */dev/sdc* as in the
previous examples) will accelerate all of the underlying partitions with a
single command.

Open CAS Linux will automatically hide the existing core device partitions (ex.
*/dev/sdc1*, */dev/sdc2*, etc.) from the Operating System, create partitions on
the exported device (e.g. */dev/cas1-1p1*, */dev/cas1-1p2*, etc.), and
make the exported device a child of the core device.

**Comparison of logical device layout before and after Open CAS Linux
acceleration**

| **Before**      | **After**                 |
|-----------------|---------------------------|
|  */dev/sdc*     |  */dev/sdc*               |
|    */dev/sdc1*  |    */dev/cas1-1*     |
|    */dev/sdc2*  |      */dev/cas1-1p1* |
|    */dev/sdc3*  |      */dev/cas1-1p2* |
|  */dev/nvme0n1* |      */dev/cas1-1p3* |
|                 |   */dev/nvme0n1*          |


This scheme ensures compatibility with existing object storage device creation
and activation scripts from common software defined storage systems (e.g. Ceph).

Mounting an Open CAS Linux Device as a Data Volume
----------------------------------------------

For some applications, a storage system or cluster may require the Open CAS Linux
exported device to be mounted to the file system to allow for its use as a data
volume.

The file system should be created directly on the core device before it is added
to the cache instance. It’s not recommended to run mkfs commands on the exported
device (*casX-Y*) as the process can be very slow.

**Format the core device as ext4**

> \# mkfs.ext4 /dev/sdb1

**Format the core device as xfs**

> \# mkfs.xfs -f /dev/sdb1

Once the cache instance has been started and core devices added, the Open CAS Linux
exported name can be used for the mount function. The device designation of
*casX-Yp1* will be used for mounting since the file system partition on the
exported device is required to mount into the file system directory.

As a reminder, a directory must already exist in order to mount the exported
device. In this example, the device is */dev/cas1-1p1* and the mount point
directory is */mnt/cache1*. Create the mount point directory if it does not
exist.

Mount an Open CAS Linux exported device:

>   \# mount -t xfs /dev/cas1-1p1 /mnt/cache1

1.  Open CAS Linux ensures that no changes are required to the application; it can
    use the same file system mount point (for example, */local/data*) as the
    core device previously used.

2.  If your application uses the raw device directly (for example, some
    installations of Oracle\*), then you must configure the application to use
    the exported device (e.g. *cas1-1*) instead.

3.  To take advantage of the new TRIM functionality, the file system must be
    mounted with additional options. Please see the [Trim Support](/guide_advanced_options.html#trim-support) section for further details.

4.  It may be necessary to change ownership and/or permissions for the mount
    point directory to grant applications access to the cache. Modify as
    required to allow access.

**Persistent mounting of the Open CAS Linux exported device(s)**

After the caching devices have been created and Open CAS Linux is running, you can
use the */etc/fstab* file to ensure persistent mounts of your mounted Open CAS Linux
volumes. Use of the *fstab* file as follows assumes that Open CAS Linux is active and
that exported devices have been configured to agree with the contents of the
*fstab*.

>   \# cat /etc/fstab

>>   ...  
>>   /dev/cas1-1p1 /mnt/cache1 xfs defaults 0 0  
>>   /dev/cas1-2p1 /mnt/cache2 xfs defaults 0 0  


*NOTE:* In the case when the caching device is formatted with a 4KiB physical block size
and the backend core device is formatted with a 512B physical block size, the caching device should
be re-formatted with a 512B block size so that a cache volume can be built correctly.
