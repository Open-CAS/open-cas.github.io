---
title: Open CAS-Linux - Admin Guide
last_updated: October 15, 2021
toc: true
geometry: "left=3cm,right=3cm,top=2cm,bottom=2cm"
permalink: guide_monitoring_json.html
---

Monitoring Open-CAS Linux - JSON API
=====================

# Overview

The JSON API provides basic functionalities for inspecting CAS (retrieving CAS statistics on various levels, listing CAS devices and providing cache, core or IO class details). All requests, responses and errors are in JSON format.

**JSON request**

Requests consist of a header with the name of a command and parameters with additional request details, such as: cache id, core id or IO class id. Different parameters are required for various commands.

**JSON responses**

Responses consist of all requested components or in case of trouble an error also encoded in JSON format.

# Statistics

Statistics can be requested on different levels: cache, core or IO class. There are four specific commands with different parameters responsible for inspecting those statistics.

**Statistics requests:**

-   core with specific IO class statistics

-   Cache statistics

-   Core statistics

-   IO class statistics

# Example statistics requests

**A request for statistics for a specified cache**

```json
{
  "command": "opencas.cache.stats.get",
  "params": {
    "cache id": 1,
  }
}
```

**A request for statistics for a specified core**

```json
{
  "command": "opencas.cache.core.stats.get",
  "params": {
    "cache id": 1,
    "core id": 1,
  }
}
```

**A request for statistics for a specified IO class on a specified cache**

```json
{
  "command": "opencas.cache.ioclass.stats.get",
  "params": {
    "cache id": 1,
    "io class": 0 
  }
}
```

**A request for statistics for a specified IO class on a specified core**

```json
{
  "command": "opencas.cache.core.ioclass.stats.get",
  "params": {
    "cache id": 1,
    "core id": 1,
    "io class": 0 
  }
}
```

# Example statistics response

**statistics response structure:**

Statistics details
-   Usage statistics

-   Inactive Usage statistics

-   Request statistics

-   Block statistics

-   Error statistics

```json
{
  "Cache id": 1,
  "Core id": 1,
  "IO class": 0,
  "Usage": {
    "Occupancy": {
      "Page": 259,
      "Fraction": 0
    },
    "Free": {
      "Page": 0,
      "Fraction": 0
    },
    "Clean": {
      "Page": 259,
      "Fraction": 10000
    },
    "Dirty": {
      "Page": 0,
      "Fraction": 0
    }
  },
  "Requests": {
    "Read hits": {
      "Page": 0,
      "Fraction": 0
    },
    "Read partial misses": {
      "Page": 0,
      "Fraction": 0
    },
    "Read full misses": {
      "Page": 43,
      "Fraction": 10000
    },
    "Read total": {
      "Page": 43,
      "Fraction": 10000
    },
    "Write hits": {
      "Page": 0,
      "Fraction": 0
    },
    "Write partial misses": {
      "Page": 0,
      "Fraction": 0
    },
    "Write full misses": {
      "Page": 0,
      "Fraction": 0
    },
    "Write total": {
      "Page": 0,
      "Fraction": 0
    },
    "Pass-Trough reads": {
      "Page": 0,
      "Fraction": 0
    },
    "Pass-Trough writes": {
      "Page": 0,
      "Fraction": 0
    },
    "Serviced requests": {
      "Page": 43,
      "Fraction": 10000
    },
    "Total requests": {
      "Page": 43,
      "Fraction": 10000
    }
  },
  "Blocks": {
    "Reads from core(s)": {
      "Page": 259,
      "Fraction": 10000
    },
    "Writes from core(s)": {
      "Page": 0,
      "Fraction": 0
    },
    "Total from/to core(s)": {
      "Page": 259,
      "Fraction": 10000
    },
    "Reads from cache(s)": {
      "Page": 0,
      "Fraction": 0
    },
    "Writes from cache(s)": {
      "Page": 259,
      "Fraction": 10000
    },
    "Total from/to cache(s)": {
      "Page": 259,
      "Fraction": 10000
    },
    "Reads from exported object(s)": {
      "Page": 259,
      "Fraction": 10000
    },
    "Writes from exported object(s)": {
      "Page": 0,
      "Fraction": 0
    },
    "Total from/to exported object(s)": {
      "Page": 259,
      "Fraction": 10000
    }
  },
  "Errors": {
    "Core read errors": {
      "Page": 0,
      "Fraction": 0
    },
    "Core write errors": {
      "Page": 0,
      "Fraction": 0
    },
    "Core total errors": {
      "Page": 0,
      "Fraction": 0
    },
    "Cache read errors": {
      "Page": 0,
      "Fraction": 0
    },
    "Cache write errors": {
      "Page": 0,
      "Fraction": 0
    },
    "Cache total errors": {
      "Page": 0,
      "Fraction": 0
    },
    "Total errors": {
      "Page": 0,
      "Fraction": 0
    }
  }
}
```

# List caches

Listing CAS devices with casadm, mentioned in [**Monitoring CAS**](/guide_monitoring.html).

```console
# casadm --list-caches
\type    id   disk             status    write policy   device
cache   1    /dev/nvme3n1p4   Running   wt             -
 core   1    /dev/nvme0n1p3   Active    -              /dev/cas1-1
 core   2    /dev/nvme0n1p4   Active    -              /dev/cas1-2
```

# Example list caches request

```json
{
  "command": "opencas.cache_list.get",
  "params": {
  }
}
```

# Example list caches response

**Example List caches response structure:**

-   for each cache instance:
    -   Cache details
    -   for each core attached to a cache:
        -   Core details
  
```json
[
  {
    "Cache": {
      "Cache id": 1,
      "Cache device": "/dev/disk/by-id/nvme-nvme.8086-part4",
      "Core(s) id(s)": [
        1,
        2
      ],
      "Cache details": {
        "Attached": true,
        "Status": "stopping",
        "Size [cache lines]": 5183520,
        "Inactive cores": {
          "Occupancy": {
            "Page": 0,
            "Fraction": 0
          },
          "Clean": {
            "Page": 0,
            "Fraction": 0
          },
          "Dirty": {
            "Page": 0,
            "Fraction": 0
          }
        },
        "Occupancy [cache lines]": 518,
        "Dirty [cache lines]": 0,
        "Dirty for [s]": 0,
        "Initially dirty [cache lines]": 0,
        "Cache mode": "wt",
        "Pass-Trough fallback statistics": {
          "IO errors count": 0,
          "Status": false
        },
        "Cleaning policy": "alru",
        "Promotion policy": "always",
        "Cache line size [B]": 4096,
        "Flushed blocks": 0,
        "Core count": 2,
        "Metadata footprint [B]": 262553896,
        "Metadata end offset [4 KiB blocks]": 59296
      }
    },
    "Cores": [
      {
        "Core id": 1,
        "Core path": "/dev/disk/by-id/nvme-nvme.8086-part3",
        "Core details": {
          "Core size [line size]": 5242816,
          "Core size [B]": 21474574336,
          "Flushed blocks": 0,
          "Dirty blocks": 0,
          "Dirty for [s]": 0,
          "Sequential cutoff threshold [B]": 1048576,
          "Sequential cutoff policy [B]": "full"
        },
        "State": "active"
      },
      {
        "Core id": 2,
        "Core path": "/dev/disk/by-id/nvme-nvme.8086-part4",
        "Core details": {
          "Core size [line size]": 5242816,
          "Core size [B]": 21474574336,
          "Flushed blocks": 0,
          "Dirty blocks": 0,
          "Dirty for [s]": 0,
          "Sequential cutoff threshold [B]": 1048576,
          "Sequential cutoff policy [B]": "full"
        },
        "State": "active"
      }
    ]
  }
]
```
# Example cache info request

```json
{
  "command": "opencas.cache.info.get",
  "params": {
    "cache id": 1,
  }
}
```

# Example cache info response

```json
{
  "Cache id": 1,
  "Cache device": "/dev/disk/by-id/nvme-nvme.8086-part4",
  "Core(s) id(s)": [
    1,
    2
  ],
  "Cache details": {
    "Attached": true,
    "Status": "stopping",
    "Size [cache lines]": 5183520,
    "Inactive cores": {
      "Occupancy": {
        "Page": 0,
        "Fraction": 0
      },
      "Clean": {
        "Page": 0,
        "Fraction": 0
      },
      "Dirty": {
        "Page": 0,
        "Fraction": 0
      }
    },
    "Occupancy [cache lines]": 518,
    "Dirty [cache lines]": 0,
    "Dirty for [s]": 0,
    "Initially dirty [cache lines]": 0,
    "Cache mode": "wt",
    "Pass-Trough fallback statistics": {
      "IO errors count": 0,
      "Status": false
    },
    "Cleaning policy": "alru",
    "Promotion policy": "always",
    "Cache line size [KiB]": 4096,
    "Flushed blocks": 0,
    "Core count": 2,
    "Metadata footprint [B]": 262553896,
    "Metadata end offset [4 KiB blocks]": 59296
  }
}
```

# Example core info request

```json
{
  "command": "opencas.core.info.get",
  "params": {
    "cache id": 1,
    "core id": 1,
  }
}
```

# Example core info response

```json
{
    "Core id": 1,
    "Core path": "/dev/disk/by-id/nvme-nvme.8086-part3",
    "Core details": {
      "Core size [line size]": 5242816,
      "Core size [B]": 21474574336,
      "Flushed blocks": 0,
      "Dirty blocks": 0,
      "Dirty for [s]": 0,
      "Sequential cutoff threshold [B]": 1048576,
      "Sequential cutoff policy [B]": "full"
    },
    "State": "active"
  }
```

# Example IO class info request

```json
{
  "command": "opencas.ioclass.info.get",
  "params": {
    "cache id": 1,
    "io class": 0 
  }
}
```

# Example io class info response

```json
{
  "Class id": 0,
  "Info": {
    "Name": "unclassified",
    "Cache mode": "max",
    "Priority": 255,
    "Current size [cache lines]": 518,
    "Min size [%]": 0,
    "Max size [%]": 100,
    "Cleaning policy": "alru"
  }
}
```

# Example error response

```json
{
  "cas_ctrl object access failed": "open /dev/cas_ctrl: permission denied",
  "failed to retrieve statistics": "open /dev/cas_ctrl: permission denied"
}
```
