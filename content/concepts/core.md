---
title: "What is core?"
weight: 30
toc: false
aliases: ["/core.html"]
---

The **core** object is an abstraction that allows application access to
**backend storage** cached by a [**cache**](/concepts/cache/). It provides API
for submitting I/O requests, which are handled according to current
[**cache mode**](/concepts/cache-configuration/) and other **cache** and
**core** configuration parameters. During normal **cache** operation
the **backend storage** is exclusively owned by the **cache** object,
and application should never access it directly unless the **core** is
removed from the **cache**. That's it, using the **core** API is the
only proper way of accessing the data on the **backend storage**.

<center><img src="/images/core.png"></center>
