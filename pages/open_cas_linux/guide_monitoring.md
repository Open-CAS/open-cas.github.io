---
title: Open CAS Linux - Admin Guide
last_updated: April 29, 2019
toc: true
permalink: guide_monitoring.html
---

Monitoring Open CAS Linux
=====================

There are a number of performance counters available for viewing. These counters
are accessible using the  
casadm -P -i \<cache_id\> command. This section contains a brief description of
data included in the *stats* command line option.

>   \# casadm --stats --cache-id \<ID\>

or

>   \# casadm -P -i \<ID\>

See the ‘-P \| --stats’ section for details.

The output of this command contains five tables that describe the activities in
the caching system:

-   **Usage statistics**

-   **Inactive Usage statistics**

-   **Request statistics**

-   **Block statistics**

-   **Error statistics**

Entries are in the form: stat, actual number, percent of overall, units.

You can use these statistics to learn about your data usage. For example,
looking at the sequential versus random read statistics reveals how your data is
used.

The following tables list the statistics (counters) that Open CAS Linux records:

Table 8: Usage Statistics

| **Statistic** | **Description**                                                            |
|---------------|----------------------------------------------------------------------------|
| Occupancy     | Number of cached blocks                                                    |
| Free          | Number of empty blocks in the cache                                        |
| Clean         | Number of clean blocks (cache data matches core data)                      |
| Dirty         | Number of dirty blocks (block written to cache but not yet synced to core) |

Table 9: Inactive Usage Statistics (printed only in special cases, such as when
a core is detached from cache)

| **Statistic**                    | **Description**                                                                     |
|----------------------------------|-------------------------------------------------------------------------------------|
| Inactive Occupancy [4KiB Blocks] | Number of inactive cached blocks                                                    |
| Inactive Clean [4KiB Blocks]     | Number of inactive clean blocks (cache data matches core data)                      |
| Inactive Dirty [4KiB Blocks]     | Number of inactive dirty blocks (block written to cache but not yet synced to core) |

Table 10: Request Statistics

| **Statistic**        | **Description**                                                                                                                                                                                                                  |
|----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Read hits            | Number of reads that were cache hits                                                                                                                                                                                             |
| Read partial misses  | Number of reads that spanned both data that was in the cache and data that was not in the cache                                                                                                                                  |
| Read full misses     | Number of reads that were cache misses                                                                                                                                                                                           |
| Read total           | Total number of reads                                                                                                                                                                                                            |
| Write hits           | Number of writes that were cache hits                                                                                                                                                                                            |
| Write partial misses | Number of writes that spanned both data that was in the cache and data that was not in the cache                                                                                                                                 |
| Write full misses    | Number of writes that were cache misses                                                                                                                                                                                          |
| Write total          | Total number of writes                                                                                                                                                                                                           |
| Pass-through reads   | Number of read requests sent directly to the core device (not cached by Open CAS Linux). This statistic is incremented when the request is handled while the cache is in pass-through mode (see -Q \| --set-cache-mode for details).  |
| Pass-through writes  | Number of write requests sent directly to the core device (not cached by Open CAS Linux). This statistic is incremented when the request is handled while the cache is in pass-through mode (see -Q \| --set-cache-mode for details). |
| Serviced requests    | Total number of IO requests serviced (that did not bypass the cache)                                                                                                                                                             |
| Total requests       | Total number of IO requests (both serviced and bypassed requests)                                                                                                                                                                |

Percentages are calculated as percentage of total requests. (e.g. Read Hits % =
100\*(\# read hits / total requests)).

Table 11: Block Statistics

| **Statistic**                    | **Description**                                                   |
|----------------------------------|-------------------------------------------------------------------|
| Reads from core(s)               | Number of blocks read from core device(s)                         |
| Writes to core(s)                | Number of blocks written to core device(s)                        |
| Total to/from core(s)            | Total number of blocks read from or written to core device(s)     |
| Reads from cache                 | Number of blocks read from cache device                           |
| Writes to cache                  | Number of blocks written to cache device                          |
| Total to/from cache              | Total number of blocks read from or written to cache device       |
| Reads from exported object(s)    | Number of blocks read from exported object(s) (eg. intelcas1-1)   |
| Writes to exported object(s)     | Number of blocks written to exported object(s)                    |
| Total to/from exported object(s) | Total number of blocks read from or written to exported object(s) |

Table 12: Error Statistics

| **Statistic**      | **Description**                                                   |
|--------------------|-------------------------------------------------------------------|
| Cache read errors  | Number of read errors to the cache device                         |
| Cache write errors | Number of write errors to the cache device                        |
| Cache total errors | Total number of read or write errors to the cache device          |
| Core read errors   | Number of read errors to the core device(s)                       |
| Core write errors  | Number of write errors to the core device(s)                      |
| Core total errors  | Total number of read or write errors to the core device(s)        |
| Total errors       | Total number of read or write errors to the cache or core devices |

Viewing Cache Statistics
------------------------

Usage example for cache-level statistics:

>   \# casadm -P -i 1

Watch statistics updates real time:

>   \# watch -d casadm -P -i 1

Returned output:

> <pre>
Cache Id                  1
Cache Size                12055031 [4KiB Blocks] / 45.99 [GiB]
Cache Device              /dev/nvme0n1p1
Core Devices              3
Inactive Core Devices     0
Write Policy              wt
Eviction Policy           lru
Cleaning Policy           alru
Cache line size           4 [KiB]
Metadata Memory Footprint 639.1 [MiB]
Dirty for                 0 [s] / Cache clean
Metadata Mode             normal
Status                    Running
╔══════════════════╤══════════╤═══════╤═════════════╗
║ Usage statistics │  Count   │   %   │   Units     ║
╠══════════════════╪══════════╪═══════╪═════════════╣
║ Occupancy        │ 12055001 │ 100.0 │ 4KiB blocks ║
║ Free             │       30 │   0.0 │ 4KiB blocks ║
║ Clean            │ 12055001 │ 100.0 │ 4KiB blocks ║
║ Dirty            │        0 │   0.0 │ 4KiB blocks ║
╚══════════════════╧══════════╧═══════╧═════════════╝
╔══════════════════════╤═══════════╤═══════╤══════════╗
║ Request statistics   │   Count   │   %   │ Units    ║
╠══════════════════════╪═══════════╪═══════╪══════════╣
║ Read hits            │  50532296 │  32.8 │ Requests ║
║ Read partial misses  │    202850 │   0.1 │ Requests ║
║ Read full misses     │  48537517 │  31.5 │ Requests ║
║ Read total           │  99272663 │  64.4 │ Requests ║
╟──────────────────────┼───────────┼───────┼──────────╢
║ Write hits           │  31762847 │  20.6 │ Requests ║
║ Write partial misses │       436 │   0.0 │ Requests ║
║ Write full misses    │  16197432 │  10.5 │ Requests ║
║ Write total          │  47960715 │  31.1 │ Requests ║
╟──────────────────────┼───────────┼───────┼──────────╢
║ Pass-Through reads   │   2779876 │   1.8 │ Requests ║
║ Pass-Through writes  │   4027209 │   2.6 │ Requests ║
║ Serviced requests    │ 147233378 │  95.6 │ Requests ║
╟──────────────────────┼───────────┼───────┼──────────╢
║ Total requests       │ 154040463 │ 100.0 │ Requests ║
╚══════════════════════╧═══════════╧═══════╧══════════╝
╔══════════════════════════════════╤═══════════╤═══════╤═════════════╗
║ Block statistics                 │   Count   │   %   │   Units     ║
╠══════════════════════════════════╪═══════════╪═══════╪═════════════╣
║ Reads from core(s)               │ 471298381 │  57.4 │ 4KiB blocks ║
║ Writes to core(s)                │ 349624858 │  42.6 │ 4KiB blocks ║
║ Total to/from core(s)            │ 820923239 │ 100.0 │ 4KiB blocks ║
╟──────────────────────────────────┼───────────┼───────┼─────────────╢
║ Reads from cache                 │ 140451806 │  16.5 │ 4KiB blocks ║
║ Writes to cache                  │ 713000302 │  83.5 │ 4KiB blocks ║
║ Total to/from cache              │ 853452108 │ 100.0 │ 4KiB blocks ║
╟──────────────────────────────────┼───────────┼───────┼─────────────╢
║ Reads from exported object(s)    │ 611750187 │  63.6 │ 4KiB blocks ║
║ Writes to exported object(s)     │ 349624858 │  36.4 │ 4KiB blocks ║
║ Total to/from exported object(s) │ 961375045 │ 100.0 │ 4KiB blocks ║
╚══════════════════════════════════╧═══════════╧═══════╧═════════════╝
╔════════════════════╤═══════╤═════╤══════════╗
║ Error statistics   │ Count │  %  │ Units    ║
╠════════════════════╪═══════╪═════╪══════════╣
║ Cache read errors  │     0 │ 0.0 │ Requests ║
║ Cache write errors │     0 │ 0.0 │ Requests ║
║ Cache total errors │     0 │ 0.0 │ Requests ║
╟────────────────────┼───────┼─────┼──────────╢
║ Core read errors   │     0 │ 0.0 │ Requests ║
║ Core write errors  │     0 │ 0.0 │ Requests ║
║ Core total errors  │     0 │ 0.0 │ Requests ║
╟────────────────────┼───────┼─────┼──────────╢
║ Total errors       │     0 │ 0.0 │ Requests ║
╚════════════════════╧═══════╧═════╧══════════╝
</pre>

Usage example for core-level statistics:

>   \# casadm -P -i 1 -j 1

Returned output:
>  <pre>
Core Id         		1
Core Device     		/dev/sdd1
Exported Object 		/dev/intelcas1-1
Status             	Active
Seq cutoff threshold 	1024 [KiB]
Seq cutoff policy    	full
Core Size       		36620800 [4KiB Blocks] / 139.70 [GiB]
Dirty for       		0 [s] / Cache clean
╔══════════════════╤═════════╤═══════╤═════════════╗
║ Usage statistics │  Count  │   %   │   Units     ║
╠══════════════════╪═════════╪═══════╪═════════════╣
║ Occupancy        │ 4363950 │  36.2 │ 4KiB blocks ║
║ Free             │       1 │   0.0 │ 4KiB blocks ║
║ Clean            │ 4363950 │ 100.0 │ 4KiB blocks ║
║ Dirty            │       0 │   0.0 │ 4KiB blocks ║
╚══════════════════╧═════════╧═══════╧═════════════╝
╔══════════════════════╤══════════╤═══════╤══════════╗
║ Request statistics   │  Count   │   %   │ Units    ║
╠══════════════════════╪══════════╪═══════╪══════════╣
║ Read hits            │ 21075939 │  29.7 │ Requests ║
║ Read partial misses  │    77109 │   0.1 │ Requests ║
║ Read full misses     │ 18448305 │  26.0 │ Requests ║
║ Read total           │ 39601353 │  55.9 │ Requests ║
╟──────────────────────┼──────────┼───────┼──────────╢
║ Write hits           │ 17240919 │  24.3 │ Requests ║
║ Write partial misses │      105 │   0.0 │ Requests ║
║ Write full misses    │  9972336 │  14.1 │ Requests ║
║ Write total          │ 27213360 │  38.4 │ Requests ║
╟──────────────────────┼──────────┼───────┼──────────╢
║ Pass-Through reads   │   983305 │   1.4 │ Requests ║
║ Pass-Through writes  │  3053282 │   4.3 │ Requests ║
║ Serviced requests    │ 66814713 │  94.3 │ Requests ║
╟──────────────────────┼──────────┼───────┼──────────╢
║ Total requests       │ 70851300 │ 100.0 │ Requests ║
╚══════════════════════╧══════════╧═══════╧══════════╝
╔═══════════════════════════════╤═══════════╤═══════╤═════════════╗
║ Block statistics              │   Count   │   %   │   Units     ║
╠═══════════════════════════════╪═══════════╪═══════╪═════════════╣
║ Reads from core               │ 156393665 │  57.0 │ 4KiB blocks ║
║ Writes to core                │ 118061392 │  43.0 │ 4KiB blocks ║
║ Total to/from core            │ 274455057 │ 100.0 │ 4KiB blocks ║
╟───────────────────────────────┼───────────┼───────┼─────────────╢
║ Reads from cache              │  49888641 │  17.7 │ 4KiB blocks ║
║ Writes to cache               │ 231251909 │  82.3 │ 4KiB blocks ║
║ Total to/from cache           │ 281140550 │ 100.0 │ 4KiB blocks ║
╟───────────────────────────────┼───────────┼───────┼─────────────╢
║ Reads from exported object    │ 206282306 │  63.6 │ 4KiB blocks ║
║ Writes to exported object     │ 118061392 │  36.4 │ 4KiB blocks ║
║ Total to/from exported object │ 324343698 │ 100.0 │ 4KiB blocks ║
╚═══════════════════════════════╧═══════════╧═══════╧═════════════╝
╔════════════════════╤═══════╤═════╤══════════╗
║ Error statistics   │ Count │  %  │ Units    ║
╠════════════════════╪═══════╪═════╪══════════╣
║ Cache read errors  │     0 │ 0.0 │ Requests ║
║ Cache write errors │     0 │ 0.0 │ Requests ║
║ Cache total errors │     0 │ 0.0 │ Requests ║
╟────────────────────┼───────┼─────┼──────────╢
║ Core read errors   │     0 │ 0.0 │ Requests ║
║ Core write errors  │     0 │ 0.0 │ Requests ║
║ Core total errors  │     0 │ 0.0 │ Requests ║
╟────────────────────┼───────┼─────┼──────────╢
║ Total errors       │     0 │ 0.0 │ Requests ║
╚════════════════════╧═══════╧═════╧══════════╝
</pre>

Usage example for IO class-level statistics:

>   \# casadm -P -i 1 -j 1 -d

Returned output:
>   <pre>
IO class ID          1
IO class name        Metadata
Eviction priority    0
Selective allocation Yes
╔══════════════════╤════════╤═══════╤═════════════╗
║ Usage statistics │ Count  │   %   │   Units     ║
╠══════════════════╪════════╪═══════╪═════════════╣
║ Occupancy        │ 864660 │   7.2 │ 4KiB blocks ║
║ Free             │      0 │   0.0 │ 4KiB blocks ║
║ Clean            │ 864660 │ 100.0 │ 4KiB blocks ║
║ Dirty            │      0 │   0.0 │ 4KiB blocks ║
╚══════════════════╧════════╧═══════╧═════════════╝
╔══════════════════════╤═════════╤══════╤══════════╗
║ Request statistics   │  Count  │  %   │ Units    ║
╠══════════════════════╪═════════╪══════╪══════════╣
║ Read hits            │ 8097835 │ 11.4 │ Requests ║
║ Read partial misses  │       0 │  0.0 │ Requests ║
║ Read full misses     │      17 │  0.0 │ Requests ║
║ Read total           │ 8097852 │ 11.4 │ Requests ║
╟──────────────────────┼─────────┼──────┼──────────╢
║ Write hits           │  414587 │  0.6 │ Requests ║
║ Write partial misses │     104 │  0.0 │ Requests ║
║ Write full misses    │  273056 │  0.4 │ Requests ║
║ Write total          │  687747 │  1.0 │ Requests ║
╟──────────────────────┼─────────┼──────┼──────────╢
║ Pass-Through reads   │       2 │  0.0 │ Requests ║
║ Pass-Through writes  │    5517 │  0.0 │ Requests ║
║ Serviced requests    │ 8785599 │ 12.4 │ Requests ║
╟──────────────────────┼─────────┼──────┼──────────╢
║ Total requests       │ 8791118 │ 12.4 │ Requests ║
╚══════════════════════╧═════════╧══════╧══════════╝
╔══════════════════╤═════════╤═════╤═════════════╗
║ Block statistics │  Count  │  %  │   Units     ║
╠══════════════════╪═════════╪═════╪═════════════╣
║ Blocks reads     │ 8097854 │ 3.9 │ 4KiB blocks ║
╟──────────────────┼─────────┼─────┼─────────────╢
║ Blocks writes    │ 9007260 │ 7.6 │ 4KiB blocks ║
╚══════════════════╧═════════╧═════╧═════════════╝
</pre>

  This command will output the above format for each defined IO class.

Usage example for IO class-level statistics output in csv format and saved to
file

>   \# casadm -P -i 1 -j 1 -d -o csv \> stats.txt

Returned output:

>   IO class ID,IO class name,Eviction priority,Selective allocation,Occupancy
>   [4KiB blocks],Occupancy [%],Free [4KiB blocks],Free [%],Clean [4KiB
>   blocks],Clean [%],Dirty [4KiB blocks],Dirty [%],Read hits [Requests],Read
>   hits [%],Read partial misses [Requests],Read partial misses [%],Read full
>   misses [Requests],Read full misses [%],Read total [Requests],Read total
>   [%],Write hits [Requests],Write hits [%],Write partial misses
>   [Requests],Write partial misses [%],Write full misses [Requests],Write full
>   misses [%],Write total [Requests],Write total [%],Pass-Through reads
>   [Requests],Pass-Through reads [%],Pass-Through writes
>   [Requests],Pass-Through writes [%],Serviced requests [Requests],Serviced
>   requests [%],Total requests [Requests],Total requests [%],Blocks reads [4KiB
>   blocks],Blocks reads [%],Blocks writes [4KiB blocks],Blocks writes [%]  
>   0,Unclassified,22,Yes,0,0.0,97,100.0,0,0.0,0,0.0,0,0.0,0,0.0,82,0.0,82,0.0,0,0.0,0,0.0,0,0.0,0,0.0,1,0.0,0,0.0,82,0.0,83,0.0,83,0.0,0,0.0  
>   1,Metadata,0,Yes,864660,7.2,0,0.0,864660,100.0,0,0.0,8068949,11.4,0,0.0,17,0.0,8068966,11.4,413037,0.6,104,0.0,273056,0.4,686197,1.0,2,0.0,5517,0.0,8755163,12.4,8760682,12.4,8068968,3.9,8979669,7.6

  This command will output the above format for each defined IO class.

  Any of the previously referenced examples can be output to csv format as
    well.

Resetting the Performance Counters
----------------------------------

The performance counters are automatically reset every time the cache is
started. To manually clear the performance counters, use the casadm -Z -i
\<cache_id\> -j \<core_id\> command line option.
