---
title: Cache configuration
last_updated: January 29, 2019
permalink: cache_configuration.html
---

This page describes various [**cache**](/cache.html) configuration
parameters. They may be used to alter **cache** behavior in some
situations and to configure a way in which the I/O requests are handled
by the cache engines.

## Cache mode
The **cache mode** parameter determines how incoming I/O requests are
handled by cache engine. Depending on **cache mode** some requests may
be inserted to **cache** or not. **Cache mode** determines also if data
stored on **cache** should always be coherent with data stored on
**backend storage** (if there is possibility of
[**dirty data**](/cache_operations.html)).

Currently there are five **cache modes** supported by OCF:
- *Write-Through (WT)*,
- *Write-Back (WB)*,
- *Write-Around (WA)*,
- *Write-Invalidate (WI)*,
- *Pass-Through (PT)*.

### Write-Through
In *Write-Through* mode, the **cache engine** writes data to the **cache
storage** and simultaneously writes the same data “through” to the **backend
storage**. *Write-Through* ensures the data written to **core** is always
in sync with data on the **backend storage**. This mode will accelerate
only read operations, as writes need to be performed on both backend
storages.

### Write-Back
In *Write-Back* mode, the **cache engine** writes the data first to the
**cache storage** and acknowledges to the application that the write
is completed before the data is written to the **backend storage**.
Periodically, those writes are “written back” to the **backend storage**
opportunistically (depending on [**cleaning policy**](/cleaning.html)).
While *Write-Back* mode will improve both write and read intensive operations,
there is a risk of data loss if the **cache storage** fails before the
data is written to the **backend storage**.

### Write-Around
In *Write-Around* mode, the **cache engine** writes data to the **cache
storage** if and only if that **cache line** is already mapped into the
**cache** (it can be mapped during read request) and simultaneously writes
the same data “through” to the **backend storage**. *Write-Around* is
similar to *Write-Through* in that it ensures the **core** is 100% in
sync with the **backend storage** and in that this **cache mode** will
accelerate only read intensive operations. *Write-Around* further optimizes
the **cache** to avoid *cache pollution* in cases where written data
is not often subsequently re-read.

### Write-Invalidate
In *Write-Invalidate* mode, the **cache engine** handles write requests
by writing data directly to **backend storage**, and if written **cache
line** is already mapped into the **cache**, then it becomes
[**invalid**](/cache_line.html). In this mode only read requests are
mapped into the **cache** (they are handled the same way as in
*Write-Through* mode). *Write-Invalidate* mode will improve only read
intensive operation. It also reduces number of
[**eviction**](/cache_opeartions.html) operation for workloads where
written data is not often subsequently read.


### Pass-Through
In *Pass-Through* mode, the **cache engine** will bypass the **cache**
for all operations. This allows the user to enable and disable caching
dynamically (by switching between *Pass-Through* and other **cache modes**)
without need to manually alter I/O path in the application. If the **cache**
contained a **dirty data** before switching to *Pass-Through* mode, then
[**read hits**](/cache_operations.html) will be handled by reading data
from **cache storage** until all the cache lines will be
[**cleaned**](/cache_operations.html).

## Cache line size

The **cache line size** parameter determines size of data block on which
**cache** operates ([**cache line**](/cache_line.html)). It's the minimum
portion of data on **backend storage** ([**core line**](/cache_line.html))
that can be mapped into the **cache**.

OCF allows to set **cache line size** to one of the following values:
- 4 KiB,
- 8 KiB,
- 16 KiB,
- 32 KiB,
- 64 KiB.

<small>[[TODO](/authoring.html)] Add missing parameters</small>
