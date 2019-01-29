---
title: What is core?
last_updated: January 29, 2019
toc: false
permalink: core.html
---

The **core** object is an abstraction that allows application access
**backend storage** cached by [**cache**](/cache.html). It provides API
for submitting I/O requests, which are handled depending on current
[**cache mode**](/cache_configuration.html) and other **cache** and
**core** configuration parameters. During the normal **cache** operation
the **backend storage** is exclusively owned by **cache** object, and
application should never access it directly unless **core** is removed
from **cache**. That's it, using the **core** API is the only proper way
of accessing to the data on the **backend storage**.

<center><img src="images/core.png"></center>
