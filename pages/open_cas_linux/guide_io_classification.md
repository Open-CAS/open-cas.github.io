---
title: Open CAS Linux - Admin Guide
last_updated: June, 2025
toc: true
permalink: guide_io_classification.html
---

IO Classification
=================

IO Class Configuration
----------------------

Open CAS Linux provides the ability to control data caching with classification
granularity. Open CAS Linux can analyze every IO on the fly to determine whether the
requested block is filesystem metadata or data and - if it is data - its properties 
(e.g. the size of the destination file). Using this information the administrator
can determine the best IO class configuration settings for the typical workload,
set cache occupancy limits for IO classes, and set a priority level for each IO
class. As a result, when it becomes necessary to evict a cache line, the
software will evict cache lines of the lowest priority first (a major
improvement compared to traditional LRU eviction).

The IO classification is configured using an IO classification file. The table
below summarizes the configurable fields in this IO classification file.

**IO Class Configuration File Fields**

| **Field**         | **Description**                                                                                                                                                                                                                                        |
|-------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| IO class id       | Unique ID for the IO class. (NOTE: The ID for *unclassified* must always be 0)                                                                                                                                                                         |
| IO class name     | The name of the IO class. The name can be a known class name such as *metadata* or *unclassified* or *direct* . It can also consist of a user-defined rule. A rule consists of conditions separated by logical operators and/or arithmetic operators.  |
| Eviction priority | Sets the priority number for the IO class. Priority range is 0-255 with zero having the highest priority. The IO classes with the lowest priority will be evicted first. Special case: **pinned IO class** - if the eviction priority is left empty in the configuration file then the IO class will be *pinned* and will not be evicted by any other IO class. |
| Allocation        | Decimal value that allows the user to configure what part of the cache a certain IO class can occupy at most. Allocation range is 0.00-1.00. 0=do not cache, 0.66=IO class can occupy at most 66% of the cache, 1=IO class can occupy the whole cache. |

IO class names can consist of user-specified rules to satisfy. Multiple
conditions can be combined using logical operators and can be fine-tuned using
arithmetic operators. The available operators and names are specified below.

**IO Class Configuration File Logical Operators**

| **Operator** | **Description** |
|--------------|-----------------|
| &            | Logical and     |
| \|           | Logical or      |

**IO Class Configuration File Arithmetic Operators**

| **Operator** | **Description**          |
|--------------|--------------------------|
| eq           | Equals                   |
| ne           | Not equal                |
| lt           | Less than                |
| gt           | Greater than             |
| le           | Less than or equal to    |
| ge           | Greater than or equal to |

**Available IO Class Names and Conditions**

| **IO Class Name** | **Description**                                                                                                                         |
|-------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| unclassified      | The IO cannot be classified by any other class ID.                                                                                      |
| metadata          | The IO contains filesystem metadata.                                                                                                    |
| direct            | The IO is flagged to be performed directly on the device without buffering. This may be set by the application using the O_DIRECT flag. |
| core_id           | The IO belongs to a particular core. For example to classify the IO to a core with id 1: core_id:eq:1                                   |
| file_size         | The IO belongs to a file with a specific size in bytes. For example if the file size is less or equal to 4096 bytes: file_size:le:4096  |
| directory         | The IO belongs to a specific directory path. For example: directory:/data/datab                                                         |
| io_class          | The IO can be classified by a previously defined io_class ID. For example, to reference IO class with ID 3: io_class:3                  |
| extension         | The IO belongs to a file with a specific extension. For example: extension:txt                                                          |
| file_name_prefix  | The IO belongs to a file with a specific name prefix. For example, all files with name starting with foo: file_name_prefix:foo          |
| lba               | The IO belongs to a specific range of lba’s on core device.  For example: lba:ge:2000&lba:le:5000                                       |
| pid               | The IO was triggered by a process with particular pid. For example: pid:eq:7890                                                         |
| process_name      | The IO was triggered by a process with particular name. For example: process_name:fio                                                   |
| file_offset       | The IO belongs to an offset within a file. For example: file_offset:gt:2000&file_offset:lt:5000                                         |
| request_size      | The IO belongs to a request with particular size. For example: request_size:ge:8192&request_size:le:16384&done                          |
| io_direction      | The IO has a specific direction (read/write). For example: io_direction:read                                                            |
| wlth              | The IO uses application/user-space write hints. For example: wlth:eq:0                                                                  |


The table below shows the structure of the IO classification file. This table
shows IO class 0 is unclassified and has a high eviction priority of 0 to
ensure unclassified data is evicted last. The allocation of 1 specifies this
data type is cachable and can occupy the whole cache.

**IO Class Configuration File Structure**

| **IO Class** | **IO Class Name** | **Eviction Priority** | **Allocation** |
|--------------|-------------------|-----------------------|----------------|
| 0            | unclassified      | 0                     | 1.00           |

The IO classification file entries are comma-separated and should follow this
format:

>>   **IO class id,IO class name,Eviction priority,Allocation**   
>>   0,unclassified,0,1

Open CAS Linux iterates over all the IO classes specified in the classification file
and if an I/O request satisfies the given rule, the I/O will be assigned to this
IO class and move on to the next IO class in the file. Open CAS Linux can optionally
be configured to terminate upon IO class assignment and not move on to the next
IO class with the special keyword *“&done”*.

### Enabling IO Classification

-  To enable IO classification and selective allocation, first look at the
    provided example IO class configuration file and edit it to suit your needs:

>   \# vi utils/ioclass-config.csv

-  After you have completed your changes to the example IO class configuration
    and saved the file, you must load the configuration for your cache device
    with ID number represented by \<ID\> from file \<FILE\>:

>   \# casadm -\-io-class -\-load-config -\-cache-id \<ID\> -f \<FILE\>

-  Verify that the configuration file was successfully loaded:

>   \# casadm -\-io-class -\-list -\-cache-id \<ID\>

### File Size-Based Caching

The default IO class configuration file (which has been revised from previous
versions) allows the user to specify the file size range of interest using
keyword *“file_size”*. It is shown below.

>>   IO class id,IO class name,Eviction priority,Allocation
>>
>>   0,unclassified,22,1  
>>   1,metadata&done,0,1  
>>   11,file_size:le:4096&done,9,1  
>>   12,file_size:le:16384&done,10,1  
>>   13,file_size:le:65536&done,11,1  
>>   14,file_size:le:262144&done,12,1  
>>   15,file_size:le:1048576&done,13,1  
>>   16,file_size:le:4194304&done,14,1  
>>   17,file_size:le:16777216&done,15,1  
>>   18,file_size:le:67108864&done,16,1  
>>   19,file_size:le:268435456&done,17,1  
>>   20,file_size:le:1073741824&done,18,1  
>>   21,file_size:gt:1073741824&done,19,1  
>>   22,direct&done,20,1

### Directory-Based Caching

IO classification by directory is also configurable using the keyword
*“directory”*. Directory-based caching adds new options to user-specified
caching, and works in conjunction with file size-based caching.

The IO classification example below shows a directory caching entry:

>>   IO class id,IO class name,Eviction priority,Allocation  
>>
>>   0,unclassified,22,0  
>>   1,directory:/data/dataa\|directory:/data/datab,1,1  
>>   2,metadata,3,0.2

In the above example, to specify the directories to be cached, IO Class 1 shows
an IO Class Name of:

>>   directory:/data/dataa\|directory:/data/datab

This example specifies that all data in the /data/dataa or /data/datab
directories will be cached; unclassified data will not be cached (allocation=0);
metadata will be cached, but will not take more than 20% of the cache (allocation=0.2).

If a directory referenced in classification rule "directory" condition is
modified (created / removed / moved), it might take a few seconds until the CAS
classification procedure picks up the change and starts classifying IO according
to the changed directory contents.

### Combined IO Classification Rules

The IO classification example below shows a combination of file size and
directory based caching. IO class 2 demonstrates that IDs may be combined to
form a new classification rule.  
Also note that IO class 1 has allocation set to 0.5 - meaning that although IO class 1
has the highest priority it can occcupy at most 50% of the cache, leaving the rest
for other IO classes.  

>>   IO class id,IO class name,Eviction priority,Allocation
>>
>>   0,unclassified,22,1  
>>   1,file_size:gt:40960,2,0.5  
>>   2,io_class:1&file_size:lt:81920&done,3,1  
>>   3,directory:/mnt/drv1/dir,5,1  
>>   4,directory:/mnt/drv1/dir/subdir/\|directory:/mnt/drv1/dir/subdir2/,4,1  

IO class name length limit is 1024 characters. If exceeded, IO class
configuration will fail. The valid IO class id range is 0-32. Please note that
multiple classification rules must be combined using the same logical operator.
For example, *metadata\|file_size:lt:4096\|io_class:3* only uses the "**\|**"
operator. Or in another example, *file_size:gt:4096&file_size:lt:40960&io_class:3*
only uses the "**&**" operator.  

Rules with more than one logical operator will lead
to an unmatched evaluation (for example, *metadata\|file_size:lt:4096&io_class:3*
will lead to an undefined condition evaluation due to the use of both "**&**" and
"**\|**" operators).  

The keyword **&done** can always be added at the end of any
valid combined rule. Note that the classifier is unable to further categorize IO
when it is in direct mode, therefore, IO classified as direct cannot jointly
classify other conditions such as file_size or directory.
