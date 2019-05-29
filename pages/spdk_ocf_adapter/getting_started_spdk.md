---
title: Getting Started
last_updated: April 29, 2019
toc: false
permalink: getting_started_spdk.html
---

This page describes the basic steps to get started on SPDK with OCF block devices.

## About
SPDK (Storage Performance Development Kit) is a set of tools and libraries for writing high performance, user-mode storage applications.
The SPDK and OCF teams worked in conjunction to develop an OCF virtual block device (vbdev) submodule for SPDK.
The SPDK project is hosted in this [**GitHub repository**](https://github.com/spdk).

## Getting Started
1. First clone the SPDK project
   > ```git clone https://github.com/spdk/spdk.git```

2. Change current directory to project folder and update submodules
   > ``cd spdk``   
   > ```git submodule update --init```

3. Configure SPDK to use OCF
  > ```./configure --with-ocf```

4. Compile SPDK
   > ```make```

5. An SPDK application can now be started. For example, to use the SPDK target app and configure OCF via remote procedure calls (RPCs) :
 * Setup SPDK
 > ```scripts/setup.sh```
 * Start the SPDK Target App in the background
 > ```sudo app/spdk_tgt/spdk_tgt &```
 * Configure an NVMe bdev named *Nvme0* using PCI device at address 0000:00:0e.0
 > ```sudo scripts/rpc.py construct_nvme_bdev -b Nvme0 -t PCIe -a 0000:00:0e.0```
 * Configure a Memory bdev named *Malloc0* using 200MB of RAM and 4096 KB block size
 > ```sudo scripts/rpc.py construct_malloc_bdev -b Malloc0 200 4096```
 * Create a write-through (wt) OCF bdev named *Cache1* using Malloc0 as a caching device for Nvme0n1
  > ```sudo scripts/rpc.py construct_ocf_bdev Cache1 wt Malloc0 Nvme0n1```
 * The output should state the OCF bdev is *Successfully added*. Additionally, the RPC command to list OCF bdevs ```sudo scripts/rpc.py get_ocf_bdev``` should show the CAS device
 * To delete the OCF bdev execute an RPC command similar to ```sudo scripts/rpc.py delete_ocf_bdev Cache1```


For more information on SPDK please refer to the [**SPDK documentaiton**](https://spdk.io/doc/index.html)
