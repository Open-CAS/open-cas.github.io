---
title: Open CAS Linux - Admin Guide
last_updated: January 27, 2023
toc: false
permalink: guide_boot.html
---

Understanding Open CAS Linux startup flow
======================

Open CAS Linux goals wrt to startup flow
------------------------------------------

Primary goal of Open CAS Linux during startup is to prevent data corruption and
only then to assure system/software availability. In general we assume that
any time software claims [**core device**](/core.html) directly the data
contained within might be corrupted. This is because cache device might contain 
dirty data belonging to that core.


OCL startup tools suite
--------------------

OCL achieves above goals using few OS facing pieces of software/configuration:
- `open-cas.service` - systemd service
- `60-persistent-storage-cas-load.rules` - udev rules

Additionally there are some supporting files for graceful shutdown
- `open-cas-shutdown.service` - systemd service
- `open-cas.shutdown` - systemd-shutdown plugin

Which in turn use casctl and open-cas-loader CLI utilities.

Mode of operation
-----------------

Given below configuration:

  >> \#\# Caches configuration section
  >>
  >> [caches]
  >>
  >> \#\# Cache ID Cache device Cache mode Extra fields (optional)
  >>
  >> 1 /dev/disk/by-id/nvme-INTEL_SSD WB
  >>
  >> \#\# Core devices configuration
  >>
  >> [cores]
  >>
  >> \#\# Cache ID Core ID Core device
  >>
  >> 1 1 /dev/disk/by-id/wwn-0x50014ee0aed22393
  >>
  >> 1 2 /dev/disk/by-id/wwn-0x50014ee0042769ef, lazy_startup=true

our goal is to make sure core 1 is claimed by OCL before any other well-behaving
software attempts to claim/access it. Core 2, being marked as `lazy_startup`
is not required to start in this timeframe.

Component responsible for handling this is `open-cas.serice`. It is a one-shot
service positioned before `local-fs-pre` systemd target which indicates that
it should be run before any local filesystems are made available to the software.
It runs `casctl settle` which blocks until every required core is either started
or in core pool. It also sets a timeout to not block indefinitely.

Asynchronously whenever a block device shows up (is discovered by OS)
`60-persistent-storage-cas-load.rules` is run by udev. This component checks if
given block device is configured as cache/core in `/etc/opencas/opencas.conf` and,
if yes, it configures a cache on it (if its a cache) or adds it to existing
cache/core pool (if its a core).

If timeout expires for `casctl settle` it prints out every not-initialized
device that was required in journal and quits, which in turn triggers emergency
mode entry to avoid data corruption.


Troubleshooting
---------------
If properly configured CAS still triggers emergency mode entry it might be the
case that the devices used by CAS are showing up late in boot process or, if it's
a cache device that triggers it, the device is so big that its initialization
time is longer than timeout. If that's the case the user can extend the timeout
using drop-in config files like so:

1. In `/etc/systemd/system/open-cas.service.d/` directory create a drop-in config
file, e.g. `10-extend-timeout.conf`
2. Paste the following snippet as its content modifying `<timeout>` to desired
value in seconds

  >> [Service]
  >> ExecStart=
  >> ExecStart=-/sbin/casctl settle --timeout `<timeout>`
  >> TimeoutStartSec=`<timeout>`

3. Issue `systemctl daemon-reload` command to reload configuration
4. If OS is currently in emergency mode hit `<Ctrl-D>`
