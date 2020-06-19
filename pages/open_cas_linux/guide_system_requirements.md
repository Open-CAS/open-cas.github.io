---
title: Open CAS Linux - Admin Guide
last_updated: April 29, 2019
toc: true
permalink: guide_system_requirements.html
---

System Requirements
==============================================

The following table lists system requirements for Open CAS Linux.  

| Component        | Requirement                                                                                                                                                                                                                                                                                                                             |
|------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Memory           | RAM requirement is approximately 1GiB + (2% \* 4KiB/\<selected cache line size\> + 0.05%) \* cache device capacity. For example, when using 4KiB (default) cache line size, RAM requirement is approximately 1GiB + 2.05% cache device capacity.                                                                                                        |
| CPU Overhead     | Open CAS Linux consumes minimal CPU bandwidth (less than 10% in most cases). Ensure that Open CAS Linux has adequate CPU capacity to function optimally.                                                                                                                                                                                |
| Flash/SSD        | Any Linux flash device (SAS, SATA, PCIe\*, Fibre Channel, RAID) is supported, and can be direct attached, expander attached, or attached via SAN (with a single worker).                                                                                                                                                                |
| Storage          | Primary storage devices: Any device that appears as a local block device. For example, local disk, RAID, SAN iSCSI (via Fibre Channel, Infiniband, Ethernet), etc. Core device (HDD) logical block size must be 512 bytes or larger. Operating system must be on separate partition or drive than the core storage device to be cached. |
| File Systems     | The following file systems are supported for primary storage or core storage: {::nomarkdown}<ul><li>ext3 (limited to 16TiB volume size). This is an ext3 file system limitation</li><li>ext4</li><li>xfs</li></ul>{:/}                                                                                                                  |
| Software         | The following prerequisite software must be installed prior to Open CAS Linux installation:  {::nomarkdown}<ul><li>sed</li><li>make</li><li>gcc</li><li>kernel-devel</li><li>kernel-headers</li><li>python3</li><li>lsblk</li><li>argparse (python module)</li><li>elfutils-libelf-devel</li></ul>{:/}                         |
| Power Management | Power Management Suspend (S3) and Hibernate (S4) states must be disabled.                                                                                                                                                                                                                                                               |


**NOTE:** The cache device logical block size must be smaller than or equal to the logical
block size of the core storage device.  

**NOTE:** For best performance, core device file system block size should match
the core device partition logical block size.  

**NOTE:** For best performance, IO request sizes in multiples 4KiB are
recommended.  
