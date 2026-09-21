---
title: "Quick Start"
weight: 10
toc: false
aliases: ["/getting_started_ocf.html"]
---

This page describes the basic steps to get started on Open Cache Acceleration Software (CAS) Framework

## About
The Open CAS Framework (OCF) is a high performance block storage caching meta-library.
OCF is not intended to compile on its own as it represents the core caching API.
OCF is intended to be used as a caching engine by applications that implement their own adaptation layers.

There are existing implementations which include OCF and provide a more comprehensive functionality.
Some of these implementations include:
* [**Open CAS Linux**](/open-cas-linux/quick-start/).  
  Open CAS Linux implements OCF to provide a Linux kernel adapter

* [**SPDK OCF Bdev**](/spdk/).  
  SPDK OCF Bdev implements OCF to provide a virtual block device to use inside SPDK

OCF contains a sample application to exemplify the usage of OCF.
This getting started guide will show how to download OCF and compile this sample application.

OCF is hosted in this [**GitHub repository**](https://github.com/Open-CAS/ocf).

## Getting Started
1. First clone the OCF project
   > ```git clone https://github.com/Open-CAS/ocf```

2. Change the current directory to the project folder
   > ```cd ocf```   

3. Change directories to example application and compile it
   > ```cd example/simple```  
   > ```make```

Review the example/simple/main.c code and refer to the [**OCF API Documentation**](https://api.open-cas.com/) for more details.
