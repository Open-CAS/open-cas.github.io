---
title: What is OCF?
last_updated: January 29, 2019
toc: false
permalink: ocf_intro.html
---

## What is OCF?
Open CAS Framwework (OCF) is high performance block storage caching
meta-library written in C. It's entirely platform and system independent,
accessing system API through user provided environment wrappers layer.
OCF tightly integrates with the rest of software stack, providing flawless,
high performance, low latency caching utility.

## What's in it for me?
For short - performance. OCF enables easy block cache deployment for any
performance sensitive application that works with huge data sets stored
on persistent memory. It was primarily designed to cache data from HDD
drives on SSDs, but it also can be used for caching data from QLC SSD on
TLC SSD, Optane drives, RAM memory, or any combination of above including
all kinds of multilevel configurations.

## Who already uses OCF?
Open CAS Framework is heart of block caching in two established projects:
- [Open CAS Linux](https://github.com/Open-CAS/open-cas-linux)
- [Storage Performance Development Kit](https://spdk.io/)


## Who contributes to OCF?
OCF is community maintained project. It was originally developed by Intel.
The core community comprises people who developed OCF for many years.
We are open for contributions of any kind. If you feel like helping us
make OCF better, take a look at [Contributing](contributing.html) page.

## How do I get it?
We are fully open source. Visit our [GitHub](https://github.com/Open-CAS/ocf) page.
