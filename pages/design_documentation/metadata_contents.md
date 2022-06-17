---
title: Metadata contents
last_updated: June 20, 2022
toc: false
permalink: metadata_contents.html
---

OCF metadata comprises multiple sections representing different types of
metadata. Sections can be assigned to one of few categories determining
how they are handled:

### Config vs runtime

**Config sections** updates are only done as a part of management operation
handling. They are always flushed to the cache volume before the management
operation completes.

**Runtime sections** can be updated at any time, during I/O handling or on
any asynchronous event like backfill or cleaning.

Runtime sections that are not used for recovery are flushed only on the
cache stop/detach. Those sections contain mostly stat counters, which
are not essential during cache recovery, thus can be safely reset to the
initial value after dirty shutdown event.

Runtime sections that are used for recovery may be flushed only partially,
during I/O handling or any asynchronous event.

### Fixed size vs variable size

**Fixed size sections** have the same size regardless of the number of cache
lines. They store cache configuration and statistics.

**Variable size sections** have size that scales linearly with number of cache
lines. They store per-cache-line information, e.g. about the cache mapping.

### Flapped vs non-flapped

**Flapped sections** use flapping technique to assure atomic update of metadata
on the cache volume in case of power failure. They maintain two copies of the
metadata and information about which copy is valid. On the metadata update the
metadata flush is performed to invalid copy, and then only after this operation
succeeds the updated copy is marked as valid in superblock, which is flushed
afterwards.

**Non-flapped sections** maintain only one copy of the metadata.

### Load vs recovery

**Load sections** are used only during clean cache load. They are ignored
during power failure recovery.

**Recovery sections** are used during load after dirty shutdown or during
standby activate. They contain essential information required to rebuild cache
configuration and recover cache line mapping. This category does not include
sections that store auxiliary information which is not flushed to the cache
volume in the runtime. Thus after the recovery those sections need to be
rebuilt over time, which may lead to temporary performance degradation.

## Sections classification

Below table presents how metadata sections map to categories described above:

| Name                | C/R     | F/V      | F/NF        | L/R      |
|---------------------|---------|----------|-------------|----------|
| Super block config  | Config  | Fixed    | Flapped     | Recovery |
| Super block runtime | Runtime | Fixed    | Non-flapped | Load     |
| Reserved            | N/A     | Fixed    | Non-flapped | N/A      |
| Part config         | Config  | Fixed    | Flapped     | Recovery |
| Part runtime        | Runtime | Fixed    | Non-flapped | Load     |
| Core config         | Config  | Fixed    | Flapped     | Recovery |
| Core runtime        | Runtime | Fixed    | Non-flapped | Load     |
| Core UUID           | Config  | Fixed    | Flapped     | Recovery |
| Cleaning            | Runtime | Variable | Non-flapped | Load     |
| LRU list            | Runtime | Variable | Non-flapped | Load     |
| Collision           | Runtime | Variable | Non-flapped | Recovery |
| List info           | Runtime | Variable | Non-flapped | Load     |
| Hash                | Runtime | Variable | Non-flapped | Load     |

## Sections content

### Super block config

**Super block config** section contains all the essential information that
is needed to identify and interpret all the other metadata sections. It
includes information about cache state and configuration. It also contains
CRC checksums of all metadata sections and flapping id for sections that
are flapped. Superblock size is kept under 4k, which makes it possible
to flush it atomically with single 4k I/O.

### Super block runtime

**Super block runtime** section contains runtime counters that are global
for the entire cache instance.

### Reserved

**Reserved** section does not hold any meaningful metadata. It's intended
to be used by runtime feature check to determine cache device behavior.

### Part config

**Part config** section contains information about configuration of cache
partitions, which includes minimum and maximum partition size, eviction
priority and cache mode.

### Part runtime

**Part config** section contains information about LRU list pointers for
each cache partition as well as per-partition metadata of cleaning policy
(e.g. ALRU list head/tail).

### Core config

**Core config** section contains information about per-core configuration.
This includes core name and size, core volume type, sequential cutoff
configuration and per-core user data buffer.

### Core runtime

**Core runtime** section contains information about per-core statistics,
i.e. occupancy, number of dirty cache lines, accounted with per-ioclass
granularity.

### Core UUID

**Core UUID** section holds Universal Unique IDs of all core volumes.

### Cleaning

**Cleaning** section contains per-cache-line metadata of cleaning policy.
Contents depend on selected cleaning policy:
- for ALRU policy it's next/prev pointer pair of given cache line on
  the ALRU list,
- for ACP it's cache line 'dirty' bit.
As this section is not flushed during I/O, the ALRU order is not preserved
over the power failure, which may lead to temporary performance degradation.

### LRU list

**LRU list** section contains per-cache-line LRU list node information.
As this section is not flushed during I/O, the LRU order is not preserved
over the power failure, which may lead to temporary performance degradation.

### Collision

**Collision** section holds cache_line to core_id/core_line pair mapping.
It also stores status bits (valid/dirty) for each sector within the cache
line.

### Hash

**Hash** section contains hash table that maps core_id/core_line pair
to cache_line.

### List info

**List info** provides per-cache-line linked lists node which are used
to create hash collision lists. It also stores information about partition
to which given cache line is assigned.
