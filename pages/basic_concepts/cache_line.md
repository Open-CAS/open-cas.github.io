---
title: What is cache line?
last_updated: February 8, 2019
toc: false
permalink: cache_line.html
---

The **cache line** is the smallest portion of data that can be mapped
into the [**cache**](/cache.html). Every mapped **cache line** is
associated with **core line**, which is corresponding region on the
**backend storage**. Both **cache storage** and **backend storage**
are splitted into blocks of the size of **cache line**, and all the
**cache** mappings are aligned to these blocks. Relationship between
**cache line** and **core line** is illustrated on the picture below.

<center><img src="images/cache_line.png"></center>

## Cache line metadata

OCF maintains small portion of metadata per each **cache line**, which
contains following information:
- *core id*,
- *core line number*,
- *valid* and *dirty* bits for every sector.

The *core id* determines on which **core** is the **core line**
corresponding to given **cache line**, whereas *core line number*
determines precise **core line** location on the **backend storage**.
*Valid* and *dirty* bits are explained below.

### Valid and dirty bits

*Valid* and *dirty* bits define current **cache line** state. When **cache
line** is *valid* it means, that it's mapped to **core line** determined
by *core id* and *core line number*. Otherwise all the other **cache line**
metadata information is invalid and should be ignored. When **cache line**
is in *invalid* state, it may be used to map **core line** accessed by
I/O request, and then it becomes *valid*. There are few situations in
which **cache line** can return to *invalid* state:
- When cache line is being [**evicted**](/cache_operations.html).
- When **core** pointed by *core id* is being
  [**removed**](/cache_management.html).
- When **core** pointed by *core id* is being
  [**purged**](/cache_operations.html).
- When entire **cache** is being **purged**.
- During *discard* operation being performed on corresponding **core line**.

The *dirty* bit determines if **cache line** data stored in **cache**
is in sync with data on **backend storage**. If **cache line** is *dirty*,
then only data on **cache storage** is up to date, and it will need to
be **flushed** at some point in the future (after that it will be marked
as *clean* by zeroing *dirty* bit). The **cache line** can become dirty
only during write operation in *Write-Back* mode.

*Valid* and *dirty* bits are maintained per sector, which means that
not every sector in *valid* **cache line** has to be *valid*, as well
as not every sector in *dirty* **cache line** has to be *dirty*. The
entire **cache line** is considered as *valid* if at least one of its
sectors is *valid*, and similarly it's considered as *clean* if at least
one of its sectors is *clean*.
