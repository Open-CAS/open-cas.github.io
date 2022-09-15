---
title: Cleaning
last_updated: August 17, 2022
toc: false
permalink: cleaning.html
---

Cleaning is a process of flushing [**dirty cache lines**](/cache_line.html#valid-and-dirty-bits)
to the core device and setting corresponding dirty bits in the metadata to
zero.

Cleaning is done in the background, periodically flushing the data. How and 
when the cleaning is performed can be controlled by setting a desired cleaning
policy and setting its parameters accordingly.

Apart from background cleaning, dirty cache lines cleaning may occur in the 
following cases: 
* read partial dirty hit - some of the read data is dirty. Most cache modes 
would flush the dirty sectors so an up-to-date version of data can be read 
from the core in a subsequent step.
* ad-hoc cleaning in case of eviction failure, where cache is 100% dirty and 
cache lines cannot be evicted or replaced
* user requested flush (casadm -F/-E commands)
* other management operations, e.g. cache stop, core removal

