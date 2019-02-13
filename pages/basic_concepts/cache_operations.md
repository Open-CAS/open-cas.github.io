---
title: Cache operations
last_updated: February 13, 2019
toc: false
permalink: cache_operations.html
---

There are several basic operations upon which the entire caching logic
is constructed. Getting familiar with them is essential to understanding
how OCF caching engines work, and how individual I/O requests are handled
depending on the current cache state. The following section provides
a brief introduction to these operations.

## Mapping
*Mapping* is an operation of linking up a **core line** with a **cache
line** in the **cache** metadata. During *mapping* the **cache storage**
area of size of a single **cache line** is being assigned to the **core
line**, and during **cache** operation this area can be used for storing
**core line** data, until the **cache line** is being *evicted*.

*Mapping* updates *core id* and *core line number* in **cache line**
metadata as well as *hash map* information.

## Insertion
*Insertion* is an operation of writing **core line** data to a **cache
line**. During *insertion* the data of I/O request is being written to
an area of **cache storage** storing data of the **cache line**
corresponding to the **core line** being accessed. The *valid* and *dirty*
bits of the **cache line** in the metadata are being updated accordingly
during this operation.

*Insertion* doesn't change **cache line** mapping metadata, but only
*valid* and *dirty* bits. Because of that it can be done only after
successfull *mapping* operation. However, unlike *mapping*, which operates
on whole **cache lines**, *insertion* is performed with sector granularity.
Every change of *valid* bit from 0 to 1 is considered an *insertion*.

*Insertion* may occur for both read and write requests. Additionally,
in the *Write-Back* mode the *insertion* may introduce a *dirty data*.
In such situation, besides setting a *valid* bit, it also sets a *dirty*
bit for accessed sectors.

## Update
*Update* is an operation of overwriting **cache line** data in the
**cache storage**. It's performed when the **core line** accessed during
a write request is mapped into the **cache** and the accessed sectors
are marked as *valid*. When some of the written sectors within the **cache
line** are *invalid*, then those sectors are *inserted*, which means that
*update* and *insertion* can be done together by a single I/O request.

*Update* can be performed only during a write request (a read can never
change the data) and similarly to *insert* it can introduce *dirty data*,
so it may update *dirty* bit for accessed sectors in the **cache line**.
However it will never change *valid* bit, as *update* touches only sectors
that are already *valid*.

## Invalidation
*Invalidation* is an operation of marking one or more **cache line**
sectors as *invalid*. It can be done for example during handling of
*discard* request, during *purge* operation, or as result of some internal
**cache** operations. More information about cases when *invalidation*
is performed can be found [here](/cache_line.html#valid-and-dirty-bits).

## Eviction
*Eviction* is an operation of removing **cache line** mappings. It's
performed when there is not sufficient space in the **cache storage**
for *mapping* data of incoming I/O requests (when cache occupancy is
close to 100%). The **cache lines** to be *evicted* are selected by
an *eviction policy* algorithm. Currently OCF supports one *eviction
policy*, the *Least Recently Used* (*LRU*) which selects **cache lines**
that have not been accessed for the longest period of time.

## Flushing
*Flushing* is an operation of synchronizing data in the **cache storage**
and the **backend storage**. It involves reading sectors marked as *dirty*
from the **cache storage**, writing them to the **backend storage**,
and setting *dirty* bits in **cache line** metadata to zero.

*Flushing* is a **cache** management operation, and it has to be triggered
by the user, and it's typically done in order to safely detach the **core**
from the **cache** without risking data loss.

## Cleaning
*Cleaning* is an operation very simillar to *flushing*, but it's performed
by the **cache** automatically as a background task. Process of *cleaning*
is controlled by a *cleaning policy*. OCF currently supports three
*cleaning policies*:
- *Approximately Least Recently Used* (*ALRU*),
- *Aggressive Cleaning Policy* (*ACP*),
- *No Operation* (*NOP*).
