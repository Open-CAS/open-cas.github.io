---
title: What is volume?
last_updated: February 4, 2019
toc: false
permalink: volume.html
---

A **volume** is generic representation of a storage, that allows
OCF to access different types of storages using common abstract interface.
OCF uses a **volume** interface for accessing both **backend storage**
and **cache storage**. Storage represented by **volume** may be any
kind of storage that allows for random block access - it may be HDD or
SSD drive, ramdisk, network storage or any other kind of non-volatile
or volatile memory.

<center><img src="images/volume.png"></center>
