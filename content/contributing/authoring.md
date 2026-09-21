---
title: "Authoring"
weight: 10
toc: false
aliases: ["/authoring.html"]
---

This document is a brief guide for Open CAS documentation writers. If you feel
that there is something missing in documentation feel free to let us know or
submit your own piece of documentation. We really do appreciate that.

## Documentation repository

Open CAS documentation is developed in a dedicated
[GitHub repository](https://github.com/Open-CAS/open-cas.github.io) and
published to [open-cas.com](https://open-cas.com/) with
[Hugo](https://gohugo.io/) and the [Hextra](https://imfing.github.io/hextra/)
theme.

Pages are plain Markdown under `content/`, and the directory layout *is* the
site navigation — a page's position in the sidebar comes from its folder and
its `weight`, so there is no separate navigation file to keep in sync.

## Previewing locally

You need [Hugo extended](https://gohugo.io/installation/). Clone with
submodules, since the theme is one:

```shell
git clone --recurse-submodules https://github.com/Open-CAS/open-cas.github.io.git
cd open-cas.github.io
hugo server
```

The preview is served at <http://localhost:1313/> and reloads as you edit.

## Writing pages

Each page starts with a small frontmatter block:

```yaml
---
title: "Cache configuration"
weight: 70
---
```

Do not add a "last updated" date by hand. The date shown on each page is taken
from its last git commit, so it stays correct on its own.

When you move or rename a page, add its previous address to `aliases` so old
links keep working:

```yaml
aliases: ["/cache_configuration.html"]
```

## Contributing

Contributing rules of documentation repository are the same as in case of the
OCF repository. The only difference is that for merging documentation pull
request only one LGTM comment is needed.

You can find a complete guide at the [Contributing](/contributing/) page.
