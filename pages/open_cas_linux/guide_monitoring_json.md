---
title: Open CAS Linux - Admin Guide
last_updated: October 15, 2021
toc: true
permalink: guide_monitoring_json.html
---

Monitoring Open CAS Linux - JSON API
=====================

Json API overview
---------------------

Json API provides two basic functionalities for inspecting CAS: retrieving CAS statistics and listing CAS devices. All requests, responses and errors are in json format.

**Statistics**

Statistics can be requested on different levels cache, core or io class. It is dependant on passing optional arguments in request as core id or io class.

**List CAS devices**

Lists all cache instances and their core devices.

**Json request**

Request consist of header with name of command and additional request detials as cache info, core info and io class info. Info includes parameters passed to CAS monitoring tool from which depends statistics level. Cache id is obligatory while core id and io class are optional parameters.

**Example request:**
```json
{
  "header": {
    "command": "stats",
    "subcommands": ["cache info", "core info", "io class info"]
  },
  "info": {
    "cache id": 1,
    "core id": 0,
    "io class": 0
  }
}
```

**Json responses**

Responses consists of all requested components or in case of trouble error response also encoded to json format.

**Example statistics response structure:**

Statistics details
-   Usage statistics

-   Inactive Usage statistics

-   Request statistics

-   Block statistics

-   Error statistics

Optional details

-    Cache info

-    Core info
    
-    IO class info

**Example statistics response:**

```json
{
  "Cache info": {
    "Cache id": 1,
    "Cache device": "/dev/disk/by-id/nvme-nvme.8086-50484b53373438323030335433373541474e-494e54454c20535344504544314b3337354741-00000001-part4",
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
  },
  "Core info": {
    "Core id": 1,
    "Core path": "/dev/disk/by-id/nvme-nvme.8086-50484b45373331353030304c37353042474e-494e54454c20535344504532314b3735304741-00000001-part3",
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
  "IO class": {
    "Class id": 0,
    "Info": {
      "Name": "unclassified",
      "Cache mode": "max",
      "Priority": 255,
      "Current size [cache line]": 518,
      "Min size [%]": 0,
      "Max size [%]": 100,
      "Cleaning policy": "alru"
    }
  },
  "Statistics": {
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
}

```

**List caches**

Inspect CAS devices with casadm list caches mentioned in [**Monitoring CAS**](/guide_monitoring.html).

```console
[root@localhost json]# casadm -L
\type    id   disk             status    write policy   device
cache   1    /dev/nvme3n1p4   Running   wt             -
├core   1    /dev/nvme0n1p3   Active    -              /dev/cas1-1
└core   2    /dev/nvme0n1p4   Active    -              /dev/cas1-2
```

Inspect the same CAS devices with json API

**Example statistics response structure:**

Statistics details
-   Cache instance

    -   Core devices



**Example list caches response:**

```json
[
  {
    "Cache": {
      "Cache id": 1,
      "Cache device": "/dev/disk/by-id/nvme-nvme.8086-50484b53373438323030335433373541474e-494e54454c20535344504544314b3337354741-00000001-part4",
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
    },
    "Cores": [
      {
        "Core id": 1,
        "Core path": "/dev/disk/by-id/nvme-nvme.8086-50484b45373331353030304c37353042474e-494e54454c20535344504532314b3735304741-00000001-part3",
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
        "Core path": "/dev/disk/by-id/nvme-nvme.8086-50484b45373331353030304c37353042474e-494e54454c20535344504532314b3735304741-00000001-part4",
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

**Example error response:**

```json
{
  "error log": {
    "cas_ctrl object access failed": "open /dev/cas_ctrl: permission denied",
    "failed to retrive statistics": "open /dev/cas_ctrl: permission denied"
  }
}
```

**Summary**

Json Api is good start and building block to RESTful API which can provide good integration CAS with other tools. For now it plays role of command line tool providing request and responses in json format.