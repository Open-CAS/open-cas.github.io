---
title: Open CAS Linux - Admin Guide
last_updated: April 29, 2019
toc: true
permalink: guide_installing.html
---

Installing Open CAS Linux
=====================

This section describes how to perform a typical installation of Open CAS Linux. The
installation package consists of loadable kernel modules that provide the
caching layer and a management CLI that controls caching behavior.

Disabling Sleep States
----------------------

Before configuring Open CAS Linux, you must disable Power Management Suspend (S3) and
Hibernate (S4) states on your OS. Consult your OS documentation for how to
accomplish this on your particular OS.

Configuring the Flash Device
----------------------------

Before configuring Open CAS Linux, you must have a flash device installed. The flash
device can be any solid state drive (SSD) or any PCIe\* flash drive supported by
the Linux operating system (see [System Requirements](/guide_system_requirements.html) for details).

Follow the instructions in the installation guide included with the flash
device, and make note of the device’s serial number or WWN so you can identify
it once the system is up and running. All devices to be used for Open CAS Linux
should be un-mounted and any auto-mount procedures disabled. When using a
partition of a device as cache space, make sure the partition is aligned to the
device’s physical sector size for best performance.

For best performance, it is recommended to use the *noop* (or *None* for NVMe devices) IO scheduler on the
cache device (SSD). Initially, the cas virtual block device that is created
when caching is enabled will inherit the IO scheduler of the primary storage
device. If desired, the user can change the IO schedulers of the virtual block
device and primary storage device independently after the virtual block device
is created.

**NOTE:** Mounting file systems by label, such as in */etc/fstab*, should not be used
in older SysV based operating systems (RHEL 6.x, CentOS 6.x, etc) because it
interferes with proper startup of Open CAS Linux. This is due to the file system
already being mounted by the operating system when Open CAS Linux tries to start.


Code compilation
-------------------------

Before you begin installation, log on as an administrator or verify that you
have the requisite privileges to install software. You must have “root”
privileges or login as “root” in order to proceed.

1.  Download or clone the Open CAS Linux source files to a directory on the target
    system. The installation instructions use the example of \~ or \~/
    (equivalent of \$HOME) on the server file system. Optionally, Open CAS Linux can
    be cloned with:
> git clone https://github.com/Open-CAS/open-cas-linux

2. Change current directory to project folder and update submodules
> cd open-cas-linux   
> git submodule update -\-init

3. Configure Open CAS Linux
> ./configure

4. Compile Open CAS Linux and install it
> make  
> make install

5. The main outputs of the compilation will be :
  - cas_disk.ko  - CAS Disk Kernel Module
  - cas_cache.ko - CAS Cache Kernel module
  - casadm       - CAS Administration Tool
  Note that the kernel modules will be inserted during the installation phase

6. Verify casadm shows the inserted kernel module versions
> casadm -V


Creating RPM/DEB packages
-------------------------

You can generate RPM/DEB packages from Open CAS Linux sources and install them,
instead of compiling the code and installing files manually. That is also an easy
way to manage kernel modules updates from one kernel version to another.
To generate packages, simply run:
`make rpm` or `make deb`
(package generating script will inform you of any missing dependencies or other problems)

Your packages will be placed in _packages/_ directory. There will be two main ones
(with utils and modules) and also debug symbols. You can ignore and delete all those
containing _debug_ or _dbg_ in the file name.

Install _open-cas-linux_ and _open-cas-linux-modules_ by running:
`dnf install ./packages/open-cas-linux*.rpm`
or
`apt install ./packages/open-cas-linux*.deb`

> To install common dependencies for building RPM packages:
> `dnf install rpm-build`
>
> To install common dependencies for building DEB packages:
> `apt install debhelper devscripts dkms`
