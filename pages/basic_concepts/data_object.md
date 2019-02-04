---
title: What is data object?
last_updated: February 4, 2019
toc: false
permalink: data_object.html
---

A **data object** is generic representation of a storage, that allows
OCF to access different types of storages using common abstract interface.
OCF uses a **data object** interface for accessing both **backend storage**
and **cache storage**. Storage represented by **data object** may be any
kind of storage that allows for random block access - it may be HDD or
SSD drive, ramdisk, network storage or any other kind of non-volatile
or volatile memory.

<center><img src="images/data_object.png"></center>
