---
title: Promotion policies
last_updated: January 11, 2023
toc: false
permalink: promotion.html
---

## What is promotion policy
Promotion policy is a "filter" working on per-request basis that determines
what gets inserted(promoted) into the cache. This filter is meant to limit cache
pollution resulting from insertion of rarely accessed data (e.g. I/Os resulting
from Ceph scrub operation). If promotion policy rejects a request it is
handled in pass-through, similarly to what happens when request couldn't be inserted
into cache because of other reasons (e.g. unable to evict enough cache lines).

Currently OCF implements only **nhit** promotion policy.

## Nhit promotion policy
### Description
Nhit promotion policy works by tracking accesses to core lines and allowing cache
insertion for those, which were accessed `insertion_threshold` times. Nhit policy
will let all requests through and won't count any accesses until cache occupancy
reaches `trigger_threshold`%.

Because of per-request nature of promotion policy nhit will only let through such
request that all core lines belonging to it were accessed at least
`insertion_threshold` times. E.g. given request to core lines 100 and 101 if line
100 was accessed more than `insertion_threshold` number of times, but 101 was
never seen by nhit then such request would not be promoted to cache.

Additionaly any hit or partially-hit requests are promoted to tak advantage of
already-cached data.


### Nhit algorithm
OCF early in its generic I/O request handling calls into promotion policy with
`ocf_promotion_req_should_promote` callback. Nhit then performs following
operations:
1. If cache occupancy > `trigger_threshold` then return true
2. For each core line in request:
    1. If core line is tracked then increment its access counter and check if
    `insertion_threshold` is exceeded
    2. If core line is not tracked then start tracking
3. If all core lines's access counter exceeded the `insertion_threshold` or
request is (partially)hit then return true, else return false


### Metadata footprint
To conserve system memory nhit promotion policy will count limited amount of core
lines tracked in its internal structures. Maximal amount of core lines tracked is
equal to `NHIT_MAPPING_RATIO * cache_capacity_in_clines`. `NHIT_MAPPING_RATIO`
is a compile-time constant currently set to 2.

### Core lines tracking
Core lines metadata is stored in a ring buffer type of structure which also
dictates the insertion/eviction mechanism for tracked core lines. Whenever new
core line needs to be tracked the ring buffer pointer is advanced by one and core
line occupying slot pointed at is evicted and new core line is inserted. This means
that not-promoted core lines will be evicted after
`NHIT_MAPPING_RATIO * cache_capacity_in_clines` untracked core lines were seen.
Other circumstances in which core lines would be purged from nhit are:
- core line was a part of request that was promoted and subsequently inserted
into cache
- core line was a part of discard request


