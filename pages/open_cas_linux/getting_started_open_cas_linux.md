---
title: Getting Started
last_updated: April 29, 2019
toc: false
permalink: getting_started_open_cas_linux.html
---

This page describes the basic steps to get started on Open CAS Linux

## About
Open CAS Linux builds upon the Open CAS Framework by implementing kernel adapters for the Linux operating system.
The Open CAS Linux project is hosted in this [**GitHub repository**](https://github.com/Open-CAS/open-cas-linux).

## Getting Started
1. First clone the Open CAS Linux project
   > ```git clone https://github.com/Open-CAS/open-cas-linux```

2. Change current directory to project folder and update submodules
   > ```cd open-cas-linux```   
   > ```git submodule update --init```

3. Configure Open CAS Linux
    > ```./configure```

4. Compile Open CAS Linux and install it
   > ```make```  
   > ```make install```  

5. Verify the kernel modules were inserted by checking their versions
   > ```casadm -V```

6. CAS should now be ready to start. For example, to use block device /dev/nvme0n1 as a caching device:
 > ```casadm -S -d /dev/disk/by-id/nvme-INTEL_SSD```

7. The output should return the cache instance number, use it to add a backend device.
For example, to use block device /dev/sda1 as a backend device to cache instance 1:
 > ```casadm -A -d /dev/disk/by-id/wwn-0x1234567890b100d-part1 -i 1```

8. Verify CAS instance is operational with:
  > ```casadm -L```

The output should state status is *Running*.
Additionally, a command to list block devices such as ```lsblk``` should show the exported CAS device for example */dev/cas1-1*

- To stop the cache device execute a command similar to ```casadm -T -i 1```.


For complete guide to Open CAS Linux please refer to the [**Admin Guide**](/open_cas_linux_admin_guide.html)
