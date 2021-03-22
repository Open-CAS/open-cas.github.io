---
title: Open CAS Linux - Admin Guide
last_updated: April 29, 2019
toc: true
permalink: guide_running.html
---

Running Open CAS Linux
==================

This chapter describes how to perform typical administrative activities with
Open CAS Linux.

Initial configuration of Cache instances
----------------------------------------

Once Open CAS Linux is installed, but no cache instances are yet configured and
running, the user can easily configure and start cache instances. Refer to the
guidance in [**Configuring CAS**](/guide_configuring.html) for configuring the
file */etc/opencas/opencas.conf*, then follow these steps:

1. Edit and configure caches and cores as desired via the
*opencas.conf* file.

2. Execute the following:

>   \# casctl init

Open CAS Linux will read contents of the *opencas.conf* file, initialize the
cache/core pairings, and place caches/core devices into an operational or active
status.

3. If the cache device contains data, partitions, or a file system from
prior use, it will not normally initialize. If you receive a message during
initialization about an existing file system, it may need the --force option
to initialize. Be aware that the --force option will destroy any data or
formatting on the device. Caches will be started regardless of existing data
or partitions. Execute the following:

>   \# casctl init --force

 This command yields the same results as: casadm -S -d /dev/sdX --force for a
 single cache instance.

Startup of Cache instances
---------------------------

In order to start all previously initialized cache instances configured in the
*opencas.conf* file, the user should execute the following:

>   \# casctl start

Use of the casctl start command assumes that the configured cache instances
were previously running.

Rebooting, Power Cycling, and Open CAS Linux Autostart
--------------------------------------------------

Once the *opencas.conf* file is configured correctly to include
the cache and core devices, Open CAS Linux devices will automatically become
available for use after a restart of the system. That is, Open CAS Linux defaults to
being enabled within the system, checks the previously initialized Open CAS Linux
configuration, along with contents of the *opencas.conf* file for device
configuration, and performs the appropriate actions.

If the user does not wish to start Open CAS Linux caching after reboot, it will be
necessary to comment out the cache/core devices in the *opencas.conf* file.
This will effectively disable Open CAS Linux and prevent autostart of the devices
following a system restart.

If the *opencas.conf* file is not yet configured, and Open CAS Linux devices were
previously manually started/added, a system reboot will require another manual
restart of the cache and addition of the cores to the cache device.

Start Open CAS Linux using the following command syntax:

>   \# casadm -S -i \<cache_id\> -d \<cache_device\> -c \<cache_mode\>

>   \# casadm -A -i \<cache_id\> -d \<core_device\>

NOTE: If after installing CAS, your system boots into emergency mode due to the
**"Failed to start opencas initialization service."** error, you need to force SELinux
relabelling in permissive mode on your filesystem.
The easiest and quickest way to do this is to add those kernel parameters to your
grub entry at boot time:

>   autorelabel=1 enforcing=0

1. When the grub loads during boot, press *e* on the entry you want to boot.
2. Then navigate to the *kernel/linux* line and add those parameters at the end.
3. After that press *Ctrl+x* to boot.

This will set those changes only for the current boot, so you don't need
to change them back again.

Alternatively you can change SELinux mode in */etc/selinux/config*:

>   SELINUX=permissive

then force relabelling by creating an empty *.autorelabel* file in the / directory:

>   touch /.autorelabel

and reboot your system.

Stopping Cache Instances
------------------------

Prior to a shutdown or reboot of your system, it is recommended to cleanly stop
Open CAS Linux whenever possible. Even though Open CAS Linux will typically restart
cleanly following a server hang or pulled plug scenario, protection of data is
always of paramount consideration.

In order to stop all cache instances which are configured via the
*opencas.conf* file, the user should execute the following:

>   \# casctl stop

If the operating Open CAS Linux mode is write-back mode and dirty data may exist
within the caching environment, Open CAS Linux must be stopped using:

>   \# casctl stop --flush

The most common reason for corrupt data or other data irregularities within an
Open CAS Linux environment is improper accounting for dirty data as part of a system
or cluster change. It is not recommended to operate a system or cluster which
contains dirty data as both an Open CAS Linux-enabled and Open CAS Linux-disabled platform
as may be relevant to a test environment. Close awareness, and flushing, of
dirty data prior to system shutdown and changes are highly recommended.

*Caution:* If the file system changes while caching is not running, data loss
may occur. Do not issue any IO to the core device until caching has successfully
restarted.

Disabling Open CAS Linux
--------------------

In order to disable Open CAS Linux on one or more devices, the user should perform
either of the following operations:

1.  Stop caching via casctl stop (--flush as appropriate). Remove or comment
    devices from the *opencas.conf* file.  

2.  Stop caching or remove cores using casadm -T or casadm -R commands. Remove
    or comment devices from the *opencas.conf* file.  

Handling an Unplanned Shutdown
------------------------------

An unplanned shutdown is any time Open CAS Linux devices are not shutdown properly as
described in the previous section. This can include power cycling the system, or
a power loss to the system, without properly shutting down Open CAS Linux devices.

After an unplanned shutdown, there are two options for restarting caching. The
first option is to start the cache in load mode (-l option), which will utilize
the dirty data currently in cache for faster recovery, and no flushing of cache
will be done. This process is performed automatically in accordance with system
Udev rules.

The second option is to reinitialize the cache with new metadata, which will
clear the cache, resulting in the loss of all dirty data that is currently in
the cache. See the following options for details.

*Caution:* If the file system changes while caching is not running, data loss
may occur. Do not issue any IO to the core device until caching has successfully
restarted.

### Recovering the Cache

To manually start Open CAS Linux with recovery enabled, enter the following command.
All previously attached cores will be reattached to the cache after this
command.

>   \# casadm -S -d /dev/sdc -l

For more details, see ‘-S \| --start-cache’.

### Reinitializing the Cache

To clear or empty the cache device (invalidate the entire cache), manually start
the cache including the -f parameter (and omitting the -l parameter), as shown
below:

>   \# casadm -S -d /dev/sdc -f  
>   \# casadm -A -i 1 -d /dev/sdb

This reinitializes the cache instead of loading the old state and results in
zero cache occupancy.

Reinitializing the cache with new metadata will destroy all write-cached data
that has not yet been flushed to the disk. In addition, reinitializing the cache
with the -force (-f) option is still valid and will destroy all existing cache
data.

Open CAS Linux maintains state across a reboot. If the system is rebooted without
starting the caching subsystem, then the state of the cache data may become out
of sync with the data in primary storage (core device). In this case, restarting
the cache system without clearing the cache may result in data corruption.

Device IO Error Handling
------------------------

In the event of a read or write IO error from either the cache device (SSD) or
the core device (HDD), Open CAS Linux will intelligently handle the error and, if
possible, will return the requested data and continue processing IO in certain
cases.

Cases where Open CAS Linux will *return data* and *continue processing IO* include
*cache device IO errors* when attempting to:

-   Read clean data from the cache

-   Write data to the cache on a read operation (attempting to cache the data
    that was read)

-   Write data to the cache in write-through or write-around modes on a write
    operation

Cases where Open CAS Linux will *return an error* to the calling application and
*stop processing IO* for any exported devices (e.g. cas1-1) served by the
cache SSD on which the IO error occurred include *cache device IO* errors when
attempting to:

-   Read dirty data from the cache

-   Write data to the cache in write-back mode or write-only mode

Cases where Open CAS Linux will *return an error* to the calling application and
*continue processing IO* include *core device IO errors* when attempting to:

-   Read data from the core device

-   Write data to the core device
