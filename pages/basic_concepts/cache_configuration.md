---
title: Cache configuration
last_updated: January 28, 2019
toc: false
permalink: cache_configuration.html
---

Following section describes [**cache**](/cache.html) configuration
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
