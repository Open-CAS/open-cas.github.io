---
title: "What is cache?"
weight: 20
toc: false
aliases: ["/cache.html"]
---

The following section explains the idea of caching and briefly describes
role of the **cache** abstraction in OCF. You can learn more about how
the **cache** works reading [Cache operations](/concepts/cache-operations/)
page. If you want to learn more about the **cache** configuration
parameters, like **cache mode** and **cache line size**, read the
[Cache configuration](/concepts/cache-configuration/) page.

## Caching concept

In general a **cache (1)** is a component that mediates data exchange
between an application and a **backend storage (2)**, selectively storing
most accessed data on a relatively smaller and faster **cache storage (3)**.
Every time the cached data is accessed by the application, an I/O operation
is performed on the cache storage, decreasing data access time and improving
performance of the whole system.

<center><img src="/images/cache.png"></center>

Application data is handled by the cache with [**cache line**](/concepts/cache-line/)
granularity. Every **cache line** is associated with corresponding
[**core line**](/concepts/cache-line/) on the backend storage. However not
every **core line** has corresponding **cache line** at a particular
moment in time. If it has, we say that this **core line** is *mapped*
into the **cache**. Otherwise it's *unmapped*.

If an application performs an I/O operation, the **cache** checks if
**core lines** being accessed are already mapped to **cache lines** in
the **cache**. If they're not, then we deal with a
[**cache miss**](/concepts/cache-operations/). In such situation the **cache
engine** has to access data on the **backend storage**, which is slower
than accessing data on the **cache storage**. After that, depending on
current [**cache mode**](/concepts/cache-configuration/) cache engine may
decide to map the **core line** into **cache**, and thus perfom a
[**cache insert**](/concepts/cache-operations/) operation.

On the other hand, if the accessed **core line** is mapped into cache,
then we have a [**cache hit**](/concepts/cache-operations/). It's the optimistic
scenario, in which we are able to serve data to the application directly
from the **cache storage**.

## Cache object

In OCF a **cache** object provides an interface for interacting with
the cache state machine. Its API allows for attaching **cache storage**,
adding and removing [**cores**](/concepts/core/), modifying various configuration
parameters and getting statistics. Every cache operates on a single **cache
storage** (represented by the cache [**volume**](/concepts/volume/)) where
it stores data and metadata.

Single **cache** can handle data from many [**cores**](/concepts/core/). It's
called a *multi-core configuration*. The **core** object can become
**backend storage** of another **core** or **cache storage** of some
**cache**, which makes it possible to construct complex multilevel
configurations.
