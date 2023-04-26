---
title: Contributing
last_updated: Feb 7, 2022
permalink: contributing.html
---

## License
Open CAS is distributed on **BSD-3-Clause** license. Please navigate
[here](https://spdx.org/licenses/BSD-3-Clause.html) for full license text.

## Issue tracking
Issues and potential feature requests are tracked using **Github Issues**
mechanism. It is advised to label issue to indicate its type (e.g. defect,
feature request, etc.)

### Reporting sighting/defect
When submitting a defect report it is advised to provide all the relevant
information to reproduce the issue. This ideally includes:
* HW configuration, such as: CPU used, memory, disk, etc.
* SW configuration, such as: Linux distribution version, Linux kernel version.
* Steps to reproduce (e.g. simple script with indication failing steps).

### Feature request
To submit feature request please provide information on the usage scenario,
feature requirements and expected implementation timeline for the feature. This
information will help Open CAS community to plan feature implementation.

## Contributing
All contributions are welcome! Don't hesitate to submit a pull request!
Patch submission requirements:
* Contributions are accepted on **BSD-3-Clause** license.
* All patches must be `signedoff` by the developer, which indicates that
  submitter agrees to the **Developer Certificate of Origin**
  ([DCO](https://developercertificate.org)).
* Commits must conform to Open CAS coding standard which is based on Linux
  kernel coding standard ([coding style](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/Documentation/process/coding-style.rst)).
* Commits should build and pass tests.
* Commits should contain a clear message describing purpose of the commit (e.g. bug
  fix, improvement, etc.). Ideal commit description should provide information
  on why change is needed (e.g. what problem is being solved) and how this
  change solves the problem.

**Example commit with title, description and signoff information:**
~~~{.sh}
commit 6598b61a478d44c26e3147baec6ce002a4c77fa8 (HEAD -> contributions)
Author: John Doe <john.doe@example_org.com>
Date:   Thu Jan 17 22:06:10 2019 -0700

    Example change fixing SW problem

    This change fixes a SW crash occurring when software is used in
    scenario A, B and C. That crash impacts user data availability. This
    commit fixes this problem by introducing following changes.

    Signed-off-by: John Doe <john.doe@example_org.com>
~~~

Code review is performed using the Github's default review tool. 2 approves are
required for the pull request to be merged into main branch.

### Typical flow for introducing changes

In Open CAS we use fork->PR development process, where every developer
creates his own fork of upstream repository, and then pushes branches
to that fork in order to create Pull Requests to the upstream repository.

It's helpful to have two remotes added in local repository to have an easy
access to both fork and upstream repositories. Example remotes configuration
on local repository may look like this:

~~~{.sh}
$ git remote -v
origin		git@github.com:example-user/open-cas-linux.git (fetch)
origin		git@github.com:example-user/open-cas-linux.git (push)
upstream	git@github.com:Open-CAS/open-cas-linux.git (fetch)
upstream	git@github.com:Open-CAS/open-cas-linux.git (push)
~~~

Usually development starts with checking out current 'master' branch
of the upstream reposityry, where you will start introducing your changes.

~~~{.sh}
$ git fetch upstream
$ git checkout upstream/master
~~~

To create a new local branch named 'my_changes', based on 'upstream/master'
branch run following command.

~~~{.sh}
$ git checkout -b my_changes origin/master
~~~

Introduce changes to desired files and commit changes to the local repository.
Edit commit title and description. Common practices to maintain good commit
description is to adhere to following rules:
1. Separate commit title from description.
2. Commit title message should be short (less than 50 characters) and should
   summarize the change. Start title with capital letter, do not end with a
   period.
3. Longer commit description should come after title and should be separated
   with single a blank line. Message should wrap at 72 characters and provide
   description for the change explaining *what*, *why*, *how*.
4. Make sure that your name and email address for author and signoff sections
   are correct.

~~~{.sh}
# Stage files for commit
$ git add example_file.txt

# Commit files locally
$ git commit --signoff
~~~

Finally push branch containing changes to the remote repository and open new
pull request on the github.

~~~{.sh}
$ git push origin my_changes
~~~

Detailed description of how you can create PR from branch on the fork
repository can be found [here](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork).

## Naming conventions in the documentation
**The product name**
* Open CAS Linux

**The write policies**
* Write-Through
* Write-Back
* Write-Around
* Pass-Through
* Write-Only

**The cleaning policies abbreviations**
* ALRU
* ACP
* NOP

**The sequential cutoff policies**
* never
* full
* always

**The promotion policies**
* always
* nhit

**The devices**
* cache
* cache device
* exported object == cache volume
* core device == backend device

**Miscellaneous**
* IO class
* sequential cutoff
* promotion policy
* cache line
* IO request

## Maintainers
Maintainers primary responsibility is to provide technical guidance on
contributions, perform code review and oversight of project direction.
The primary contact:
* [Robert Bałdyga](mailto:baldyga.r@gmail.com)
