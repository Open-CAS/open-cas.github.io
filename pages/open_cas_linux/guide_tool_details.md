---
title: Open CAS Linux - Admin Guide
last_updated: April 29, 2019
toc: true
permalink: guide_tool_details.html
---

Configuration Tool Details
==========================

The Open CAS Linux product includes a user-level configuration tool that provides
complete control of the caching software. The commands and parameters available
with this tool are detailed in this chapter.

To access help from the CLI, type the *-H* or -*-help* parameter for details.
You can also view the man page for this product by entering the following
command:

>   \# man casadm

\-S \| -\-start-cache
--------------------

**Usage:** casadm -\-start-cache -\-cache-device \<DEVICE\> [option...]

**Example:**

>   \# casadm -\-start-cache -\-cache-device /dev/disk/by-id/nvme-INTEL_SSD

  or

>   \# casadm -S -d /dev/disk/by-id/nvme-INTEL_SSD

**Description:** Prepares a block device to be used as device for caching other
block devices. Typically the cache devices are SSDs or other NVM block devices
or RAM disks. The process starts a framework for device mappings pertaining to a
specific cache ID. The cache can be loaded with an old state when using the *-l*
or *-\-load* parameter (previous cache metadata will not be marked as invalid) or
with a new state as the default (previous cache metadata will be marked as
invalid).

**Required Parameters:**

**[-d, -\-cache-device \<DEVICE\>] :** Caching device to be used. This is an SSD or
any NVM block device or RAM disk shown in the */dev/disk/by-id* directory. \<device\> needs
to be the complete path describing the caching device to be used, for example
/dev/disk/by-id/nvme-INTEL_SSD.

**Optional Parameters:**

**[-i, -\-cache-id \<ID\>]:** Cache ID to create; \<1 to 16384\>. The ID may be
specified or by default the command will use the lowest available number first.

**[-l, -\-load]:** Load existing cache metadata from caching device. If the cache
device has been used previously and then disabled (like in a reboot) and it is
determined that the data in the core device has not changed since the cache
device was used, this option will allow continuing the use of the data in the
cache device without the need to re-warm the cache with data.

- *Caution:* You must ensure that the last shutdown followed the instructions
in section [**Stopping Cache Instances**](/guide_running.html#stopping-cache-instances). If there was any
change in the core data prior to enabling the cache, data would be not
synced correctly and will be corrupted.

**[-f, -\-force]:** Forces creation of a cache even if a file system exists on
the cache device. This is typically used for devices that have been previously
utilized as a cache device.

 - *Caution:* This will delete the file system and any existing data on the
 cache device.

**[-c, -\-cache-mode \<NAME\>]:** Sets the cache mode for a cache instance the
first time it is started or created. The mode can be one of the following:

 *wt:* (default mode) Turns write-through mode on. When using this parameter,
 the write-through feature is enabled which allows the acceleration of only
 read intensive operations.

 *wb:* Turns write-back mode on. When using this parameter, the write-back
 feature is enabled which allows the acceleration of both read and write
 intensive operations.

 - *Caution:* A failure of the cache device may lead to the loss of data that
 has not yet been flushed to the core device.

 *wa:* Turns write-around mode on. When using this parameter, the
 write-around feature is enabled which allows the acceleration of reads only.
 All write locations that do not already exist in the cache (i.e. the
 locations have not be read yet or have been evicted), are written directly
 to the core drive bypassing the cache. If the location being written already
 exists in cache, then both the cache and the core drive will be updated.

 *pt:* Starts cache in pass-through mode. Caching is effectively disabled in
 this mode. This allows the user to associate all their desired core devices
 to be cached prior to actually enabling caching. Once the core devices are
 associated, the user would dynamically switch to their desired caching mode
 (see ‘-Q \| -\-set-cache-mode’ for details).

 *wo:* Turns write-only mode on. When using this parameter, the write-only
 feature is enabled which allows the acceleration of write
 intensive operations primarily.

 - *Caution:* A failure of the cache device may lead to the loss of data that
 has not yet been flushed to the core device.

**[-x, -\-cache-line-size \<SIZE\>]:** Set cache line size {4 (default), 8, 16, 32,
64}. The cache line size can only be set when starting the cache and cannot be
changed after cache is started.

\-T \| -\-stop-cache
-------------------

**Usage:** casadm -\-stop-cache -\-cache-id \<ID\> [option...]

**Example:**

>   \# casadm -\-stop-cache -\-cache-id 1  

or  
>   \# casadm -T -i 1

**Description:** Stops all cache-core pairs associated with the cache device.

**Required parameters:**

**[-i, -\-cache-id \<ID\>]:** Unique identifier for cache \<1 to 16384\>.

**Optional parameters:**

**[-n, -\-no-data-flush]:** Do not flush dirty data on exit (UNSAFE). This
parameter will not allow the flushing of dirty data from the cache device to the
core device upon the stopping of the cache. This will significantly reduce the
time needed to stop the cache to allow for activities such as a fast reboot. The
core device should not be used until the cache is started again with the -\-load
parameter. Then the Open CAS Linux device can be used as normal.

-   *Caution:* Data on the core device will not be complete or in sync with the
   cache device upon stopping the device. If the core device is used without
   starting Open CAS Linux cache it will lead to data corruption or data loss.

-  The user may interrupt the blocking -\-stop-cache operation by pressing
    CTRL-C. When dirty data exists, interrupting the operation prior to the
    cache being fully stopped will result in the cache continuing to run. If the
    desire is to stop the cache without flushing the dirty data, use the
    -\-no-data-flush command.

\-Q \| -\-set-cache-mode
-----------------------

**Usage:** casadm -\-set-cache-mode -\-cache-mode \<NAME\> -\-cache-id \<ID\>
-\-flush-cache \<yes/no\>

**Example:**

>   \# casadm -\-set-cache-mode -\-cache-mode wb -\-cache-id 1 -\-flush-cache yes  

   or  
>   \# casadm -Q -c wb -i 1 -f yes

**Description:** Allows users to dynamically change cache modes while the cache
is running.

**Required Parameters:**

**[-c, -\-cache-mode \<NAME\>]:**

-   **wt -** switch from the current cache mode to write-through mode.

-   **wb -** switch from the current cache mode to write-back mode.

-   **wo -** switch from the current cache mode to write-only mode.

-   **wa -** switch from the current cache mode to write-around mode

-   **pt -** switch from the current cache mode to pass-through mode.

    +  Dynamically switching to pass-through mode is useful in preventing cache
    pollution when the system is undergoing maintenance operations, for example.

**[-i, -\-cache-id \<ID\>]:** Unique identifier for cache \<1 to 16384\>

**[-f, -\-flush-cache]:** (required only when switching from write-back mode)

*Caution:* You should carefully consider the following choices.

-   **yes** - Flush cache contents immediately to core drive before switching to
    new cache mode.

    +   When choosing *yes* to flush the cache immediately, the operation may take a
   long time to complete depending on number of dirty blocks. IO to the device
   will continue at reduced performance until flush completes.

-   **no** - Begin transition to new cache mode immediately, but flush cache
    contents opportunistically.

    +   When choosing *no*, IO to the device will continue at normal performance,
   but you must be aware that the cache will be in a transition state, and not
   yet in the newly chosen state until the cache is fully flushed. The
   transition to the new state will take longer than choosing the *yes* option.
   Current cache state and flush % can be checked using the casadm -L command.

\-A \| -\-add-core
-----------------

**Usage:** casadm -\-add-core -\-cache-id \<ID\> -\-core-device \<DEVICE\>
[option...]

**Example:**

>   \# casadm -\-add-core -\-cache-id 1 -\-core-device /dev/disk/by-id/wwn-0x50014ee004276c68  

or  
>   \# casadm -A -i 1 -d /dev/disk/by-id/wwn-0x50014ee004276c68

**Description:** Adds/maps a core device (either the full device or a partition)
to the framework associated with a specified cache ID. This command can be
repeated using the same *cache-id* number to map multiple cores to the same
cache device.

**Required Parameters:**

**[-i, -\-cache-id \<ID\>]:** Unique identifier for cache \<1 to 16384\>.

**[-d, -\-core-device \<DEVICE\>]:** Location of the HDD storage/core device.  
You must use the complete device path in the */dev/disk/by-id directory*, for example
/dev/disk/by-id/wwn-0x50014ee004276c68.

**Optional Parameters:**

**[-j, -\-core-id \<ID\>]:** Unique identifier for core \<0 to 4095\>.

\-R \| -\-remove-core
--------------------

**Usage:** casadm -\-remove-core -\-cache-id \<ID\> -\-core-id \<ID\> [option...]

**Example:**

>   \# casadm -\-remove-core -\-cache-id 1 -\-core-id 1  

or  
>   \# casadm -R -i 1 -j 1

**Description:** Deletes the cache/core device mapping, which is one way to
disable caching of a device.

**Required Parameters:**

**[-i, -\-cache-id \<ID\>]:** Unique identifier for cache \<1 to 16384\>

**[-j, -\-core-id \<ID\>]:** Unique identifier for core \<0 to 4095\>.  
You can identify the assigned value for a particular core device using the
casadm -L command.

-  *Caution:* Before using casadm -R, stop all IO to the mapped core device,
   ensure it is not in use, and unmount it.

-   You can interrupt the blocking -\-remove-core operation by pressing CTRL-C.
    When dirty data exists, interrupting the operation prior to the core being
    fully removed will result in the core continuing to be cached.

-  Although legal core ID range starts with 0, Open CAS Linux engine would resort to
    assigning core ID value  
    of 0 only if all other core IDs within cache instance are used. In other
    words the order of core assignment is as follows: 1, 2, 3, ..., 4094, 4095,
    0.

**Optional parameters:**

**[-f, -\-force]:** Do not flush dirty data while removing the core device.

\-\-remove-detached
------------------

**Usage:** casadm -\-remove-detached -\-device \<DEV_NAME\>

**Example:**

>   \# casadm -\-remove-detached -\-device /dev/disk/by-id/wwn-0x50014ee0042769ef  

or  
>   \# casadm -\-remove-detached -d /dev/disk/by-id/wwn-0x50014ee0042769ef

**Description:** Removes a device from the core pool. A device is in the core
pool when it’s listed in *opencas.conf* as a core in a configured cache
instance, and this cache instance is not yet started (for example, missing the
NVMe drive). This command does not currently have a short form.

**Required Parameters:**

**-d \| -\-device \<DEV_NAME\>**

Where DEV_NAME is a device name from the core pool

\-\-remove-inactive
------------------

**Usage:** casadm -\-remove-inactive -\-device \<DEV_NAME\>

**Example:**

>   \# casadm -\-remove-detached -\-cache-id 1 -\-core-id 1  

or  
>   \# casadm -\-remove-detached -i 1 -j 1

**Description:** Deletes the cache/inactive core device mapping, which is one
way to disable caching of an inactive device.

**Required Parameters:**

**[-i, -\-cache-id \<ID\>]:** Unique identifier for cache \<1 to 16384\>

**[-j, -\-core-id \<ID\>]:** Unique identifier for core \<0 to 4095\>.  
You can identify the assigned value for a particular core device using the
casadm -L command.

-  *Caution:* Before using casadm -\-remove-inactive, stop all IO to the mapped
    core device, ensure it is not in use, and unmount it.

-  Although legal core ID range starts with 0, Open CAS Linux engine would
    resort to assigning core ID value of 0 only if all other core IDs within
    cache instance are used. In other words the order of core assignment is
    as follows: 1, 2, 3, ..., 4094, 4095, 0.

\-L \| -\-list-caches
--------------------

**Usage:** casadm -\-list-caches

**Example:**

>   \# casadm -\-list-caches  

or  
>   \# casadm -L

**Description:** Displays each cache instance with the following details:

-   Flash/SSD cache ID used in the instance

-   Storage device used in the instance

-   Status of the instance

-   Write Policy of the instance (write-through by default)

Also displays the associated core devices with the following details:

-   Core Pool label

-   Numeric ID and disk name

-   Status

-   Open CAS Linux exported device ID

-   Placement within the core pool

**Example output:**

> type id disk status write policy device
>
> cache 1 /dev/nvme0n1p1 Incomplete wt -
>
> \+core 1 /dev/disk/by-id/wwn-0x500....-part1 Inactive - /dev/cas1-1
>
> \+core 2 /dev/sdc1 Active - /dev/cas1-2

\-P \| -\-stats
--------------

**Usage:** casadm -\-stats -\-cache-id \<ID\> [option...]

**Example:**

>   \# casadm -\-stats -\-cache-id 1  

or  
>   \# casadm -P -i 1

**Description:** Prints performance and status counters for a specific cache
instance. The section [**Viewing Cache Statistics**](/guide_monitoring.html#viewing-cache-statistics) shows the detailed output.

**Required Parameters:**

**[-i, -\-cache-id \<ID\>]:** Unique identifier for cache \<1 to 16384\>.

**Optional Parameters:**

**[-j, -\-core-id \<ID\>]**: Unique identifier for core \<0 to 4095\>. Display
statistics for a specific core device.

**[-d, -\-io-class-id \<ID\>]**: Unique identifier for io class \<0 to 23\>.
Display statistics for a specific IO class.

-  \<ID\> is optional. When the -\-io-class-id parameter is specified without
    specifying an \<ID\>, statistics will be displayed for each individual IO
    class.

**[-f, -\-filter \<filter-spec\>]**: Comma separated list of filters (e.g.,
-\-filter conf, req). Filter statistics output to only the requested statistics.

-   *all:* (default mode) Displays all available cache statistics.

-   *conf:* Displays cache and core configuration information and dirty
    timestamp.

-   *usage:* Displays statistics on occupancy, free, clean, and dirty.

-   *req:* Displays IO request level statistics.

-   *blk:* Displays block level statistics.

-   *err:* Displays IO error statistics.

**[-o, -\-output-format \<format\>]**: Sets desired output format for statistics.

-   *table:* (default mode) Displays a table of the statistics information.

-   *csv:* Outputs a comma separated list of statistics information. This output
    can be piped to a file and easily parsed or opened in a spreadsheet editor.

**Example output:**

>\# casadm -P -i 1
> <pre>
Cache Id                  1
Cache Size                43708 [4KiB Blocks] / 0.17 [GiB]
Cache Device              /dev/nvme0n1p1
Core Devices              2
Inactive Core Devices     1
Write Policy              wt
Eviction Policy           lru
Cleaning Policy           alru
Cache line size           4 [KiB]
Metadata Memory Footprint 19.6 [MiB]
Dirty for                 0 [s] / Cache clean
Metadata Mode             normal
Status                    Incomplete
+==================+=======+=======+=============+
| Usage statistics | Count |   %   |   Units     |
+==================+=======+=======+=============+
| Occupancy        |   164 |   0.4 | 4KiB blocks |
| Free             | 43544 |  99.6 | 4KiB blocks |
| Clean            |   164 | 100.0 | 4KiB blocks |
| Dirty            |     0 |   0.0 | 4KiB blocks |
+==================+=======+=======+=============+
+===========================+=======+======+=============+
| Inactive usage statistics | Count |  %   |   Units     |
+===========================+=======+======+=============+
| Inactive Occupancy        |    82 |  0.2 | 4KiB blocks |
| Inactive Clean            |    82 | 50.0 | 4KiB blocks |
| Inactive Dirty            |     0 |  0.0 | 4KiB blocks |
+===========================+=======+======+=============+
+======================+=======+=======+==========+
| Request statistics   | Count |   %   | Units    |
+======================+=======+=======+==========+
| Read hits            |   328 |  99.7 | Requests |
| Read partial misses  |     0 |   0.0 | Requests |
| Read full misses     |     0 |   0.0 | Requests |
| Read total           |   328 |  99.7 | Requests |
+----------------------+-------+-------+----------+
| Write hits           |     0 |   0.0 | Requests |
| Write partial misses |     0 |   0.0 | Requests |
| Write full misses    |     0 |   0.0 | Requests |
| Write total          |     0 |   0.0 | Requests |
+----------------------+-------+-------+----------+
| Pass-Through reads   |     1 |   0.3 | Requests |
| Pass-Through writes  |     0 |   0.0 | Requests |
| Serviced requests    |   328 |  99.7 | Requests |
+----------------------+-------+-------+----------+
| Total requests       |   329 | 100.0 | Requests |
+======================+=======+=======+==========+
+==================================+=======+=======+=============+
| Block statistics                 | Count |   %   |   Units     |
+==================================+=======+=======+=============+
| Reads from core(s)               |     1 | 100.0 | 4KiB blocks |
| Writes to core(s)                |     0 |   0.0 | 4KiB blocks |
| Total to/from core(s)            |     1 | 100.0 | 4KiB blocks |
+----------------------------------+-------+-------+-------------+
| Reads from cache                 |    82 | 100.0 | 4KiB blocks |
| Writes to cache                  |     0 |   0.0 | 4KiB blocks |
| Total to/from cache              |    82 | 100.0 | 4KiB blocks |
+----------------------------------+-------+-------+-------------+
| Reads from exported object(s)    |    83 | 100.0 | 4KiB blocks |
| Writes to exported object(s)     |     0 |   0.0 | 4KiB blocks |
| Total to/from exported object(s) |    83 | 100.0 | 4KiB blocks |
+==================================+=======+=======+=============+
+====================+=======+=====+==========+
| Error statistics   | Count |  %  | Units    |
+====================+=======+=====+==========+
| Cache read errors  |     0 | 0.0 | Requests |
| Cache write errors |     0 | 0.0 | Requests |
| Cache total errors |     0 | 0.0 | Requests |
+--------------------+-------+-----+----------+
| Core read errors   |     0 | 0.0 | Requests |
| Core write errors  |     0 | 0.0 | Requests |
| Core total errors  |     0 | 0.0 | Requests |
+--------------------+-------+-----+----------+
| Total errors       |     0 | 0.0 | Requests |
+====================+=======+=====+==========+


\-Z \| -\-reset-counters
-----------------------

**Usage:** casadm -\-reset-counters -\-cache-id \<CACHE_ID\> [-\-core-id
\<CORE_ID\>]

**Example:**

>   \# casadm -\-reset-counters -\-cache-id 1  

or  
>   \# casadm -Z -i 1

**Description:** Resets performance and status counters for specific cache/core
pairs.

**Required Parameters:**

**[-i, -\-cache-id \<ID\>]:** Unique identifier for cache \<1 to 16384\>.

**Optional Parameters:**

**[-j, -\-core-id \<ID\>]:** Unique identifier for core \<0 to 4095\>. If a
core(s) is not specified, statistic counters are reset for all cores in a
specified cache instance.

\-F \| -\-flush-cache
--------------------

**Usage:** casadm -\-flush-cache -\-cache-id \<ID\>

**Example:**

>   \# casadm -\-flush-cache -\-cache-id 1  

or  
>   \# casadm -F -i 1

**Description:** Flushes all dirty data from the cache device to all the
associated core devices.

**Required Parameters:**

**[-i, -\-cache-id \<ID\>]:** Unique identifier for cache \<1 to 16384\>.

-  You can interrupt the blocking -\-flush-cache operation by pressing CTRL-C.
    When dirty data exists, interrupting the operation prior to the cache being
    fully flushed will result in some dirty data remaining in the cache. The
    dirty data will be flushed opportunistically as normal. IO to the device
    will continue with reduced performance during cache flushing.

\-E \| -\-flush-core
-------------------

**Usage:** casadm -\-flush-core -\-cache-id \<ID\> -\-core-id \<ID\>

**Example:**

>   \# casadm -\-flush-core -\-cache-id 1 -\-core-id 2  

or  
>   \# casadm -E -i 1 -j 2

**Description:** Flushes all dirty data from the specified cache device to the
specified associated core device.

**Required parameters:**

**[-i, -\-cache-id \<ID\>]:** Unique identifier for cache \<1 to 16384\>.

**[-j, -\-core-id \<ID\>]:** Unique identifier for core \<0 to 4095\>.

-  You can interrupt the blocking -\-flush-core operation by pressing CTRL-C.
    When dirty data exists, interrupting the operation prior to the cache being
    fully flushed will result in some dirty data remaining in the cache. The
    dirty data will be flushed opportunistically as normal. IO to the device
    will continue with reduced performance during cache flushing.

\-\-zero-metadata
------------------

**Usage:** casadm -\-zero-metadata -\-device \<DEV_NAME\> [option]

**Example:**

>   \# casadm -\-zero-metadata -\-device /dev/disk/by-id/wwn-0x50014ee0042769ef  

or  
>   \# casadm -\-zero-metadata -d /dev/disk/by-id/wwn-0x50014ee0042769ef

**Description:** Clears metadata from the caching device.
This command does not currently have a short form.

**Required Parameters:**

**-d \| -\-device \<DEV_NAME\>**

Where DEV_NAME is a device name from the core pool

**Optional parameters:**

**[-f, -\-force]:** Forces clearing metadata from a cache device even if
a potential dirty data system exists on the cache device. This is typically
used for devices that have been previously utilized as a cache device.

 - *Caution:* This will delete and any existing metadata on the cache device.

\-H \| -\-help
-------------

**Usage**: casadm -\-help or casadm -\-\<command\> -\-help

**Examples:**

>   \# casadm -\-help  

or  
>   \# casadm -H  

>   \# casadm -\-start-cache -\-help  

or  
>   \# casadm -S -H

**Description:** Displays a list of casadm commands along with a brief
description. Use this command to also get more information on specific commands.

\-V \| -\-version
----------------

**Usage:** casadm -\-version

**Example:**

>   \# casadm -\-version  

or  
>   \# casadm -V

**Description:** Reports the Open CAS Linux kernel module and command line utility
version numbers.

**Optional parameters:**

**[-o, -\-output-format \<format\>]**: Sets desired output format of the IO class
configuration.

-   *table:* (default mode) Displays a table of the IO class configuration.

-   *csv:* Outputs a comma separated list of the IO class configuration. This
    output can be piped to a file and easily parsed or opened in a spreadsheet
    editor.

\-C \| -\-io-class
-----------------

###  -C \| -\-load-config

**Usage:** casadm -\-io-class -\-load-config -\-cache-id \<ID\> -\-file
\<file_path\>

**Example:**

>   \# casadm -\-io-class -\-load-config -\-cache-id 1 -\-file
>   ioclass-config.csv  

 or  
>   \# casadm -C -C -i 1 -f ioclass-config.csv

**Description:** Loads IOclass configuration settings for the selected cache.

**Required parameters:**

**[-i, -\-cache-id \<ID\>]:** Unique identifier for cache \<1 to 16384\>.

**[-f,-\-file]:** Specifies the IO class configuration csv file to load.

###  -L \| -\-list

**Usage:** casadm -\-io-class -\-list -\-cache-id \<ID\> [option...]

**Example:**

>   \# casadm -\-io-class -\-list -\-cache-id 1  

or  
>   \# casadm -C -L -i 1

**Description:** Displays the current IO class configuration settings for the
specified cache ID.

**Required parameters:**

**[-i, -\-cache-id \<ID\>]:** Unique identifier for cache \<1 to 16384\>.

**Optional parameters:**

**[-o, -\-output-format \<format\>]**: Sets desired output format of the IO class
configuration.

-   *table:* (default mode) Displays a table of the IO class configuration.

-   *csv:* Outputs a comma separated list of the IO class configuration. This
    output can be piped to a file and easily parsed or opened in a spreadsheet
    editor.

\-X \| -\-set-param
------------------

**Description:**  Used in conjunction with caching parameters or namespaces to
set cache policies. This command is targeted to add additional parameters in
future releases. See applicable configuration details below.

###  seq-cutoff

**Usage:** casadm -\-set-param -\-name seq-cutoff -\-cache-id \<CACHE_ID\>
[-\-core-id \<CORE_ID\>] [-\-policy \<POLICY\>] [-\-threshold \<THRESHOLD\>]
[-\-promotion-count \<NUMBER\>]

**Example:**

>   \# casadm -\-set-param -\-name seq-cutoff -\-cache-id 1 -\-core-id 1 -\-policy
>   always -\-threshold 4096  

or  
>   \# casadm -X -n seq-cutoff -i 1 -j 1 -p always -t 4096

**Description:** Set a cutoff size in KiB to stop the caching of sequential IO
reads or writes.

**Required parameters:**

**NOTE:** -p and -t parameters aren't both required. At least one is required.

**[-i, -\-cache-id \<ID\>]:** Unique identifier for cache \<1 to 16384\>.

**[-p, -\-policy \<POLICY\>]:** Sequential cutoff policy to be implemented.

*Seq-cutoff policies:*

-   *always* - sequential cutoff is always enabled regardless of cache
    occupancy; sequential data will not be cached at all after threshold is
    reached.

-   *full* - sequential cutoff is enabled only when the cache is full.

-   *never* - sequential cutoff is disabled and will not be triggered;
    sequential data is handled using current cache policy.

**[-t, -\-threshold \<THRESHOLD\>]:** a value from range 1-4194181 (inclusive).
Threshold is expressed in KiB.

**Optional parameters:**

**[-j, -\-core-id \<ID\>]**: Unique identifier for core \<0 to 4095\>. If not
specified, core parameter is set to all cores in a given cache.

**[-\-promotion-count \<NUMBER\>]**: Specify number of IO operations required for the
tracking information of a sequential stream to be moved from a per-CPU data structures
to the global data structures.
This process of moving tracking information to global context is called stream promotion.
Once a stream is promoted, CAS will continue recognize its continuation even after
application gets migrated to another CPU. If a stream is migrated to another CPU before
it gets promoted, it will not be recognized as a continuation and it will be treated as
a new stream instead. The lower the promotion threshold, the more synchronization between
processors occurs, potentially affecting IO performance. On the other hand, the higher the
promotion threshold, the more likely it is for CAS to lose track of sequential stream due
to its origin application being moved to another CPU. Recommendation is to set this
parameter to value low enough so that an I/O stream is expected to send this many I/O
requests before being rescheduled to another CPU.

###  cleaning

**Usage:** casadm -\-set-param -\-name cleaning -\-cache-id \<CACHE_ID\> -\-policy
\<POLICY\>

**Example:**

>   \# casadm -\-set-param -\-name cleaning -\-cache-id 1 -\-policy acp  

or  
>   \# casadm -X -n cleaning -i 1 -p acp

**Description:** This parameter specifies the flushing policy to be used for the
applicable cache instance, thus customizing the behavior for flushing dirty
data.

**Required parameters:**

**[-i, -\-cache-id \<ID\>]:** Unique identifier for cache \<1 to 16384\>.

**[-p, -\-policy \<POLICY\>]:** Flushing policy to be used.

*Cleaning policies:*

-   *acp* - (Aggressive Cleaning Policy) Cleans dirty cache lines as fast as
    possible so as to maintain the highest possible bandwidth to the backend
    storage, typically HDD’s. ACP is intended to stabilize the timing of
    write-back mode data flushing and to sustain more consistent cache
    performance.

-   *alru* - (Approximate Least Recently Used) A modified least recently used
    method that will flush dirty data periodically (default mode).

-   *nop* - (No Operation) Disables cache flushing except as needed for cache
    line replacement.

###  cleaning-acp

**Usage:** casadm -\-set-param -\-name cleaning-acp -\-cache-id \<CACHE_ID\>
[-\-wake-up \<NUMBER\>] [-\-flush-max-buffers \<NUMBER\>]

**Example:**

>   \# casadm -\-set-param -\-name cleaning-acp -\-cache-id 1 -\-wake-up 20
>   -\-flush-max-buffers 50  

 or  
>   \# casadm -X -n cleaning-acp -i 1 -w 20 -b 50

**Description:** This parameter specifies the desired characteristics of the acp
flushing policy to be used for the applicable cache instance.

**Required parameters:**

**NOTE:** -w and -b parameters aren't both required. At least one is required.

**[-w, -\-wake-up \<NUM\>]:** Period of time between awakenings of flushing thread
in milliseconds. MIN: 0, MAX: 10000 (inclusive), DEFAULT: 10.

**[-b, -\-flush-max-buffers \<NUM\>]:** Number of dirty cache blocks to be flushed
in one cleaning cycle. MIN: 1, MAX: 10000 (inclusive), DEFAULT: 128.

###  cleaning-alru

**Usage:** casadm -\-set-param -\-name cleaning-alru -\-cache-id \<CACHE_ID\>
[-\-wake-up \<NUMBER\>] [-\-staleness-time \<NUMBER\>] [-\-flush-max-buffers
\<NUMBER\>] [-\-activity-threshold \<NUMBER\>]

**Example:**

>   \# casadm -\-set-param -\-name cleaning-alru -\-cache-id 1 -\-wake-up 30
>   -\-staleness-time 120 -\-flush-max-buffers 50 -\-activity-threshold 5000  

or  
>   \# casadm -X -n cleaning-alru -i 1 -w 30 -s 120 -b 50 -t 5000

**Description:** This parameter specifies the desired characteristics of the
alru flushing policy to be used for the applicable cache instance.

**Required parameters:**

**NOTE:** -w, -s, -b, and -t parameters aren't all required. At least one is
required.

**[-w, -\-wake-up \<NUM\>]:** Period of time between awakenings of flushing thread
in seconds. MIN: 0, MAX: 3600, DEFAULT: 20.

**[-s, -\-staleness-time \<NUM\>]:** Time that has to pass from the last write
operation before a dirty cache block can be scheduled to be flushed in seconds.
MIN: 1, MAX: 3600, DEFAULT: 120.

**[-b, -\-flush-max-buffers \<NUM\>]:** Number of dirty cache blocks to be flushed
in one cleaning cycle. MIN: 1, MAX: 10000, DEFAULT: 100.

**[-t, -\-activity-threshold \<NUM\>]:** Cache idle time before flushing thread can
start in milliseconds. MIN: 0, MAX: 1000000, DEFAULT: 10000.

###  promotion  

**Usage:** casadm -\-set-param -\-name promotion -\-cache-id \<CACHE_ID\> -\-policy <POLICY>

**Example:**  

>   \# casadm -\-set-param -\-name promotion -\-cache-id 1 -\-policy always

or  
>   \# casadm -X -n promotion -i 1 -p always


**Description:** This parameter specifies the desired promotion policy of core lines  

**Required Parameters:**  

**[-p, -\-policy \<POLICY\>]:** The policy desired for promotion of core lines  

*Promotion policies:*

-   *always* - Core lines are attemped to be promoted each time they are accessed.

-   *nhit* - Core lines are attemped to be promoted after the n-th access.
             This n-th access threshold can be set using one of these commands:

       casadm –\-set-param -\-name promotion-nhit -\-cache-id \<CACHE_ID\> [-o, -\-trigger] \<PERCENTAGE\>  
       **Description:** Percent of cache to be occupied before cache inserts will be filtered by the policy.  

       casadm –\-set-param –\-name promotion-nhit -\-cache-id \<CACHE_ID\>  [-t, -\-threshold] \<NUMBER\>  
      **Description:** Number of core line accesses required for it to be inserted into cache. Valid values are from range <2-1000>.


\-G \| -\-get-param
------------------

**Description:**  This command will retrieve a variety of cache/core parameters
which are set via -\-set-param. See applicable configuration details below.

###  seq-cutoff

**Usage:** casadm -\-get-param -\-name seq-cutoff -\-cache-id \<CACHE_ID\>
-\-core-id \<CORE_ID\> [-\-output-format \<FORMAT\>]

**Example:**

>   \# casadm -\-get-param -\-name seq-cutoff -\-cache-id 1 -\-core-id 1
>   -\-output-format csv  

or  
>   \# casadm -G -n seq-cutoff -i 1 -j 1 -o csv

**Description:**  Allows the ability to obtain current values of seq-cutoff
cache/core parameters which are set with -\-set-param. Parameters that are
returned: Sequential Cutoff Threshold and Sequential Cutoff Policy.

**Required Parameters:**

**[-i, -\-cache-id \<ID\>]:** Unique identifier for cache \<1 to 16384\>.

**Optional Parameters:**

**[-j, -\-core-id \<ID\>]**: Unique identifier for core \<0 to 4095\>. Display
statistics for a specific core device. If not specified, core parameter is set
to all cores in a given cache.

**[-o, -\-output-format \<format\>]**: Sets desired output format for statistics.

-   *table:* (default mode) Displays a table of the statistics information.

-   *csv:* Outputs a comma separated list of statistics information. This output
    can be piped to a file and easily parsed or opened in a spreadsheet editor.

###  cleaning

**Usage:** casadm -\-get-param -\-name cleaning -\-cache-id \<CACHE_ID\>
[-\-output-format \<FORMAT\>]

**Example:**

>   \# casadm -\-get-param -\-name cleaning -\-cache-id 1 -\-output-format csv  

or  
>   \# casadm -G -n cleaning -i 1 -o csv

**Description:** Allows the ability to obtain current values of cleaning
cache/core parameters which are set with -\-set-param. Parameters that are
returned: Cleaning Policy Type.

**Required parameters:**

**[-i, -\-cache-id \<ID\>]:** Unique identifier for cache \<1 to 16384\>.

**Optional Parameters:**

**[-o, -\-output-format \<format\>]**: Sets desired output format for statistics.

-   *table:* (default mode) Displays a table of the statistics information.

-   *csv:* Outputs a comma separated list of statistics information. This output
    can be piped to a file and easily parsed or opened in a spreadsheet editor.

###  cleaning-acp

**Usage:** casadm -\-get-param -\-name cleaning-acp -\-cache-id \<CACHE_ID\>
[-\-output-format \<FORMAT\>]

**Example:**

>   \# casadm -\-get-param -\-name cleaning-acp -\-cache-id 1 -\-output-format csv

or  
>   \# casadm -G -n cleaning-acp -i 1 -o csv

**Description:** Allows the ability to obtain current values of acp cache/core
parameters which are set with -\-set-param. Parameters that are returned: Wake Up
Time and Flush Max Buffers.

**Required parameters:**

**[-i, -\-cache-id \<ID\>]:** Unique identifier for cache \<1 to 16384\>.

**Optional Parameters:**

**[-o, -\-output-format \<format\>]**: Sets desired output format for statistics.

-   *table:* (default mode) Displays a table of the statistics information.

-   *csv:* Outputs a comma separated list of statistics information. This output
    can be piped to a file and easily parsed or opened in a spreadsheet editor.

###  cleaning-alru

**Usage:** casadm -\-get-param -\-name cleaning-alru -\-cache-id \<CACHE_ID\>
[-\-output-format \<FORMAT\>]

**Example:**

>   \# casadm -\-get-param -\-name cleaning-alru -\-cache-id 1 -\-output-format csv  

or  
>   \# casadm -G -n cleaning-alru -i 1 -o csv

**Description:** Allows the ability to obtain current values of alru cache/core
parameters which are set with -\-set-param. Parameters that are returned: Wake Up
Time, Flush Max Buffers, Stale Buffer Time, and Activity Threshold.

**Required parameters:**

**[-i, -\-cache-id \<ID\>]:** Unique identifier for cache \<1 to 16384\>.

**Optional Parameters:**

**[-o, -\-output-format \<format\>]**: Sets desired output format for statistics.

-   *table:* (default mode) Displays a table of the statistics information.

-   *csv:* Outputs a comma separated list of statistics information. This output
    can be piped to a file and easily parsed or opened in a spreadsheet editor.

### promotion
**Usage:** casadm –\-get-param –\-name promotion –\-cache-id \<CACHE_ID\>

**Example:**

>   \# casadm -\-get-param -\-name promotion -\-cache-id 1 -\-output-format csv  

or
>   \# casadm –G –n promotion –i 1

**Description:** Retrieves the promotion policy

**Required parameters:**  

**[-i, -\-cache-id \<ID\>]**: Unique identifier for cache \<1 to 16384\>.


The additional command below can be used to obtain the nhit promotion values for the *nhit* policy

**Usage:** casadm –\-get-param –\-name promotion-nhit –\-cache-id \<CACHE_ID\>

**Example:**

>   \# casadm -\-get-param -\-name promotion-nhit -\-cache-id 1 -\-output-format csv  

or
>   \# casadm –G –n promotion-nhit –i 1

**Description:** Retrieves the nhit promotion policy values

**Required parameters:**

**[-i, -\-cache-id \<ID\>]:** Unique identifier for cache \<1 to 16384\>.
