---
title: Open CAS Linux - Admin Guide
last_updated: April 24, 2020
toc: true
permalink: guide_upgrading.html
---

Upgrading Open CAS Linux version
=====================

Open CAS Linux doesn't support a smooth version upgrade. To perform an upgrade,
all dirty data has to be flushed to core devices and all running cache
instances have to be stopped. To perform both this actions at once, the
following command can be used
>   \# casctl stop --flush

To allow restoring an existing configuration after an upgrade,
the /etc/opencas/opencas.conf file has to be preserved.

After preserving the config file and stopping all the running cache instances,
the old version of Open CAS Linux must be removed.

Installing a new version of Open CAS Linux is covered in
[**Installing CAS**](/guide_installing.html)

After the new version of Open CAS Linux is installed, the old config can be
restored using the preserved config file with
>   \# casctl init --force
