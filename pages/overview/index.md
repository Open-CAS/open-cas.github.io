---
title: "Open Cache Acceleration Software"
last_updated: January 24, 2019
toc: false
permalink: index.html
---

## Introduction
Open Cache Acceleration Software (Open CAS) is an open source project encompassing block caching software libraries, adapters, tools and more.  The main goal of this cache acceleration software is to accelerate a backend block device(s) by utilizing a higher performance device(s).  

At the core of Open CAS is the Open CAS Framework (OCF). To build upon OCF and in order to provide complete caching solutions, Open CAS also provides adapter implementations for Linux operating systems and for SPDK applications.  See the sections [Open CAS Linux](/index.html#open-cas-linux) and [SPDK Block Device](/index.html#storage-performance-development-kit-ocf-block-device) below for more information.  

The figure below shows the software stack of complete caching solutions using SPDK and Open CAS Linux.

![alt text](images/ocf_examples.jpg "Software Stack for SPDK and Open CAS Linux")

The main sub-projects of Open CAS are:
- Open CAS Framework (OCF)
- Open CAS Linux
- SPDK OCF Block Device

## Open CAS Framework (OCF)
The Open CAS Framework (OCF) is a high performance block storage caching meta-library written in C.  
OCF is the foundation which Open CAS Linux and SPDK depend on to provide complete caching solutions.

Visit the [What is OCF](ocf_intro.html) and [OCF Quick Setup](getting_started_ocf.html) pages for more information.

## Open CAS Linux
Open CAS Linux provides kernel adapters to OCF in order to implement a high performance, low latency complete caching solution for Linux operating systems.  
The picture below depicts in green the integration of OCF and the implemented kernel adapters provided with Open CAS Linux.  

![alt text](images/ocf_software_stack_layers.jpg "Open CAS Linux Software Stack")

Visit the [Open CAS Linux Quick Setup](getting_started_open_cas_linux.html) and [Open CAS Linux Admin Guide](guide_introduction.html) pages for more information.

## Storage Performance Development Kit OCF Block Device
The Storage Performance Development Kit (SPDK) is a set of tools and libraries for building high performance applications.
Open CAS enhances SPDK by providing an OCF SPDK block device adapter to build high performance caching-aware applications.
The SPDK OCF block device is independent from Open CAS Linux as it implements a different type of adapter while still utilizing OCF.
The picture below depicts the integration of OCF and SPDK.  

![alt text](images/spdk_software_stack_layers.jpg "OCF and SPDK Software Stack")  

Visit the [Storage Performance Development Kit](https://spdk.io/) and [SPDK Quick Setup](getting_started_spdk.html) pages for more information.  
