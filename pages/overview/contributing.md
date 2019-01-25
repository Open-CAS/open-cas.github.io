---
title: Contributing
last_updated: January 25, 2019
permalink: contributing.html
---

## License
Open CAS is distributed on **BSD-3-Clause** license. Please navigate
[here](https://spdx.org/licenses) for full license text.

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

Code review is performed using **Reviewable**. 2 LGTMs (Looks Good To Me) are
required for the pull request to be merged into main branch.

### Typical flow for introducing changes

Usually development starts with cloning and checking out recent 'master'
branch, where you will start introducing your changes.
To create a new local branch named 'my_changes', based off 'origin/master'
branch run following command.

~~~{.sh}
git checkout -b my_changes origin/master
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
git add example_file.txt

# Commit files locally
git commit --signoff
~~~

Finally push branch containing changes to the remote repository and open new
pull request on the github.

~~~{.sh}
git push my_changes origin
~~~

## Maintainers
Maintainers primary responsibility is to provide technical guidance on
contributions, perform code review and oversight of project direction.
The primary contact:
* [Robert Bałdyga](mailto:robert.baldyga@intel.com)
