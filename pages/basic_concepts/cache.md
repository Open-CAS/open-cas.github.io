---
title: What is cache?
last_updated: January 25, 2019
toc: false
permalink: cache.html
---

In general **cache (1)** is a component that mediates data exchange
between application and **backend storage (2)**, selectively storing
most accessed data on relatively smaller and faster **cache storage (3)**.
Every time cached data is accessed by the application, the I/O operation
is performed on cache storage, decreasing data access time and improving
performance of the whole system.

<center><img src="images/cache.png"></center>

Application data is handled by cache with [**cache line**](/cache_line.html)
granularity. Every **cache line** is associated with corresponding
[**core line**](/cache_line.html) on backend storage. However not
every **core line** has corresponding **cache line** at particular
moment in time. If it has, we say that this **core line** is *mapped*
into the **cache**. Otherwise it's *unmapped*.

If application performs I/O operation, **cache** checks if **core lines**
being accessed are already mapped **cache lines** in **cache**. If it's
not, then we deal with [**cache miss**](/cache_operations.html). In such
situation **cache engine** has to access data on **backend storage**,
which is slower than accessing data on **cache storage**. After that,
depending on current [**cache mode**](/cache_mode.html), cache may decide
map the **core line** into **cache**, and thus perfom
[**cache insert**](/cache_operations.html) operation.

On the other hand, if accessed **core line** is mapped into cache, then
we have [**cache hit**](/cache_operations.html). It's the optimistic
scenario, in which we are able to serve data to application directly
from **cache storage**.

## Cache object

In OCF **cache** object provides interface for interacting with cache
state machine. Its API allows for attaching **cache storage**, adding
and removing [**cores**](/core.html), modifying various configuration
parameters and getting statistics. Every cache operates on single **cache
storage** (represented by cache [**data object**](/data_object.html))
where it stores data and metadata.

Single **cache** can handle data from many [**cores**](/core.html). It's
called *multi-core configuration*. The **core** object can become
**backend storage** of another **core** or **cache storage** of some
**cache**, which makes it possible to construct complex multilevel
configurations.
