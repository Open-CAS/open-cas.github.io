---
title: Open CAS Linux - Admin Guide
last_updated: April 29, 2019
toc: true
permalink: guide_introduction.html
---

Introduction
============

This guide offers instruction on the installation and use of Open Cache
Acceleration Software for Linux (Open CAS Linux). It will be helpful for the end user to have
a basic knowledge of storage management and Linux\* system administration.

Open CAS Linux Overview
-------------------

Open CAS Linux accelerates Linux applications by caching active (*hot*) data to a
local flash device inside servers. Open CAS Linux implements caching at the server
level, using local high-performance flash media as the cache drive media within
the application server, thus reducing storage latency.

Open CAS Linux installs into the Linux operating system as a kernel module. The
nature of the integration provides a cache solution that is transparent to
users, applications and your existing storage infrastructure. No storage
migration or application changes are required.

As shown in the figure below, initial read data is retrieved from backend storage and
copied to the Open CAS Linux cache. A second read promotes data to system memory.
Subsequent reads are returned at high-performance RAM or flash speed. In
Write-through mode, all data is written synchronously to both the backend
storage and the cache. In Write-back mode, all data is written to the cache then
eventually flushed to the backend storage. When the cache is full, newly
identified active data evicts stale data from the cache, utilizing the Open CAS Linux
proprietary eviction algorithm.


![alt text](images/guide_figure1.jpg "Figure 1")
**Block Diagram - Write-through and Write-back modes**  

Open CAS Linux, by default, employs a block-based caching architecture that caches
all of the activity on the selected core device.

Documentation Conventions
-------------------------

The following conventions are used in this manual:

>  code examples, command line entries (may also begin with #)

>> file content examples

-   *Italic* - user interface items, filenames, etc.

-   **\< \> -** denotes mandatory commands

-   **[ ] -** denotes optional commands

References
----------

Refer to the resources and tools listed in the following table for assistance
with Open CAS Linux testing and operations, or to learn more about caching and
application IO performance management.

Reference Documents

| **Name**                        | **Location**                                                      |
|---------------------------------|-------------------------------------------------------------------|
| DT generic data testing program | <https://github.com/RobinTMiller/dt>                    |
| FIO                             | <https://github.com/axboe/fio>                                    |
| Vdbench                         | [http://vdbench.sourceforge.net](http://vdbench.sourceforge.net/) |

Revision History
----------------

| **Revision Number** | **Description**                                                | **Date**       |
|---------------------|----------------------------------------------------------------|----------------|
| 01                  | Initial Release based on CAS v3.8 GA (GM)                      | April 2018     |
