---
title: Open CAS Linux - Admin Guide
last_updated: April 29, 2019
toc: true
permalink: guide_product_specs_requirements.html
---

Product Specifications and System Requirements
==============================================

Operating Systems
---------------------------

The following table lists the platforms for 64-bit processors that Open CAS Linux
is tested on.

Table 2: Supported Operating Systems

| **Operating System**                                                                                                                                                                                       | **Kernel**                           |
|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------|
| Red Hat\* Enterprise Linux\* (RHEL\*) 6.9                                                                                                                                                        | x86_64, Kernel 2.6.32-696.20.1                 |
| Red Hat\* Enterprise Linux\* (RHEL\*) 6.10                                                                                                                                                       | x86_64, Kernel 2.6.32-754                      |
| Red Hat\* Enterprise Linux\* (RHEL\*) 7.4                                                                                                                                                        | X86_64, Kernel 3.10.0-693.17.1                 |
| Red Hat\* Enterprise Linux\* (RHEL\*) 7.5                                                                                                                                                        | X86_64, Kernel 3.10.0-862                      |
| SUSE\* Linux\* Enterprise Server (SLES\*) Version 12 SP2                                                                                                                                         | x86_64, Kernel 4.4.103-92.56-default           |
| SUSE\* Linux\* Enterprise Server (SLES\*) Version 12 SP3                                                                                                                                         | x86_64, Kernel 4.4.103-6.38-default            |
| Other distros - Open CAS Linux may compile from source on other distros and other kernels, but the user may be required to reproduce any issues on a validated distro & kernel                   | Other kernels                                  |

System Requirements
-------------------

The following table lists system requirements for Open CAS Linux.

Table 5: Open CAS Linux for Linux System Requirements

| Memory           | RAM requirement is approximately 1GiB + 2% cache device capacity \* 4KiB/\<selected cache line size\>. For example, when using 4KiB (default) cache line size, RAM requirement is approximately 1GiB + 2% cache device capacity.                                                                                                        |
|------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| CPU Overhead     | Open CAS Linux consumes minimal CPU bandwidth (less than 10% in most cases). Ensure that Open CAS Linux has adequate CPU capacity to function optimally.                                                                                                                                                                                          |
| Flash/SSD        | Any Linux flash device (SAS, SATA, PCIe\*, Fibre Channel, RAID) is supported, and can be direct attached, expander attached, or attached via SAN (with a single worker). Additionally, the following Intel® SSDs have been fully qualified:                                                                                              |
| Storage          | Primary storage devices: Any device that appears as a local block device. For example, local disk, RAID, SAN iSCSI (via Fibre Channel, Infiniband, Ethernet), etc. Core device (HDD) logical block size must be 512 bytes or larger. Operating system must be on separate partition or drive than the core storage device to be cached. |
| File Systems     | The following file systems are supported for primary storage or core storage:                                                                                                                                                                                                                                                           |
| Software         | The following prerequisite software must be installed prior to Open CAS Linux installation:                                                                                                                                                                                                                                                  |
| Power Management | Power Management Suspend (S3) and Hibernate (S4) states must be disabled.                                                                                                                                                                                                                                                               |

-   Intel® SSD DC S3700 Series

-   Intel® SSD DC P3700 Series

Cache device logical block size must be smaller than or equal to the logical
block size of the core storage device. 60GB or larger capacity is recommended.

**NOTE:** Older firmware on some SSDs lose their format after reboot and cause
data loss. We highly recommend that you upgrade to the latest recommended
firmware and boot loader versions for your devices. For example, as of the
writing of this document, the firmware versions (8DV101H0 for firmware &
8B1B0133 for bootloader) should be used for Intel SSD DC P3700 Series drives.

-   ext3 (limited to 16TiB volume size). This is an ext3 file system limitation.

-   ext4

-   xfs

**NOTE:** For best performance, core device file system block size should match
the core device partition logical block size.

**NOTE:** For best performance, IO request sizes in multiples 4KiB are
recommended.

-   bzip2

-   tar

-   sed

-   make

-   gcc

-   kernel-devel

-   kernel-headers

-   python2

-   lsblk

-   lsof

-   argparse (python module)

The following software is optional. If desired, it must be installed prior to
Open CAS Linux installation:

-   dkms (<http://linux.dell.com/dkms/>)
