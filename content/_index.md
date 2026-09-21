---
title: "Open Cache Acceleration Software"
type: docs
toc: false
---

Open CAS is an open source project encompassing block caching software
libraries, adapters and tools. It accelerates backend block devices by
caching their hot data on higher performance devices.

At its core is the **Open CAS Framework (OCF)**, a block storage caching
meta-library written in C. Two adapters build complete caching solutions on
top of it: **Open CAS Linux** for the Linux kernel, and the **SPDK block
device** for userspace SPDK applications.

Start with the [Introduction](/introduction/) for how the pieces fit together,
or go straight to the part you need:

- [Concepts](/concepts/) — what caches, cores, volumes and cache modes are
- [Open CAS Linux](/open-cas-linux/) — install, configure and run a cache on Linux
- [Open CAS Framework](/ocf/) — integrate OCF into your own application
- [SPDK](/spdk/) — the SPDK OCF block device adapter
