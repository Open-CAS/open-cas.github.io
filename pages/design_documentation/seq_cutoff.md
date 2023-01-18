---
title: Sequential Cutoff
last_updated: January, 2023
toc: false
permalink: seq_cutoff.html
---

In some usage scenarios, it is desirable not to cache sequential workloads. This 
kind of workloads is handled quite well by the storage devices, both traditional and 
solid state. More often than not, sequential data are cold (not subsequently used)
as well as not being critical to the system performance, e.g. maintenance processes.

Open CAS can be configured not to cache sequential workloads by using a feature
called Sequential Cutoff.

# Sequential Cutoff - general description
Sequential Cutoff allows the user to specify the following parameters
 * **cache-id** - identifier of a cache instance. <1-16384> 
 * **core-id** - identifier of a core instance. If not specified, Sequential Cutoff parameters
are set for all cores in a cache instance. <0-4095>
 * **seq-threshold** - the amount of data after which an I/O request is handled by [**Pass Through cache mode**](/cache_configuration#pass-through).
[KiB]
 * **seq-policy** - sequential cutoff policy to be used with a given core. Possible options are 
    * **always** - always bypass the cache if the amount of data is over threshold
    * **full** - only bypass the cache if the cache is full and the amount of data is over threshold (default),
    * **never** - disable Sequential Cutoff entirely






