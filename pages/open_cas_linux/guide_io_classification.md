---
title: Open CAS Linux - Admin Guide
last_updated: April 29, 2019
toc: true
permalink: guide_io_classification.html
---

IO Classification
=================

IO Class Configuration
----------------------

Open CAS Linux provides the ability to control data caching with classification
granularity. Open CAS Linux can analyze every IO on the fly to determine whether the
requested block is filesystem metadata or data and, if it is data, the size of
the destination file. Using this information the administrator can determine the
best IO class configuration settings for the typical workload and can set which
IO classes to cache and not to cache, and set a priority level for each IO
class. As a result, when it becomes necessary to evict a cache line, the
software will evict cache lines of the lowest priority first (a major
improvement compared to traditional LRU eviction).

The IO classification is configured using an IO classification file. The table
below summarizes the configurable fields in this IO classification file.

Table 5: IO Class Configuration File Fields

| **Field**         | **Description**                                                                                                                                                                                                                                       |
|-------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| IO class id       | Unique ID for the IO class. Values in this field are fixed and should not be modified. (eg. ID for Metadata must always be 1)                                                                                                                         |
| IO class name     | The name of the IO class. The name can be a known class name such as *metadata* or *unclassified* or *direct* . It can also consist of a user-defined rule. A rule consists of conditions separated by logical operators and/or arithmetic operators. |
| Eviction priority | Sets the priority number for the IO class. Priority range is 0-255 with zero having the highest priority. The IO classes with the lowest priority will be evicted first.                                                                              |
| Allocation        | Boolean value that allows the user to decide whether data of this IO class will be cached or not. 0=do not cache, 1=cache.                                                                                                                            |

IO class names can consist of user-specified rules to satisfy. Multiple
conditions can be combined using logical operators and can be fine-tuned using
arithmetic operators. The available operators and names are specified below.

Table 6: IO Class Configuration File Logical Operators

| **Operator** | **Description** |
|--------------|-----------------|
| &            | Logical and     |
| \|           | Logical or      |

Table 7: IO Class Configuration File Arithmetic Operators

| **Operator** | **Description**          |
|--------------|--------------------------|
| eq           | Equals                   |
| ne           | Not equal                |
| lt           | Less than                |
| gt           | Greater than             |
| le           | Less than or equal to    |
| ge           | Greater than or equal to |

Table 8: Available IO Class Names and Conditions

| **IO Class Name** | **Description**                                                                                                                         |
|-------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| unclassified      | The IO cannot be classified by any other class ID.                                                                                      |
| metadata          | The IO contains filesystem metadata.                                                                                                    |
| direct            | The IO is flagged to be performed directly on the device without buffering. This may be set by the application using the O_DIRECT flag. |
| file_size         | The IO belongs to a file with a specific size in bytes. For example if the file size is less or equal to 4096 bytes: file_size:le:4096  |
| directory         | The IO belongs to a specific directory path. For example: directory:/data/datab                                                         |
| io_class          | The IO can be classified by a previously defined io_class ID. For example, to reference IO class with ID 3: io_class:3                  |

The table below shows the structure of the IO classification file. This table
shows IO class 0 is unclassified and has a high eviction priority of 22 to
ensure unclassified data is evicted last. The allocation of 1 specifies this
data type is cachable.

Table 9: IO Class Configuration File Structure

| **IO Class** | **IO Class Name** | **Eviction Priority** | **Allocation** |
|--------------|-------------------|-----------------------|----------------|
| 0            | unclassified      | 22                    | 1              |

The IO classification file entries are comma-separated and should follow this
format:

>>   **IO class id,IO class name,Eviction priority,Allocation**   
>>   0,unclassified,22,1

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

>   \# casadm --io-class --load-config --cache-id \<ID\> -f \<FILE\>

-  Verify that the configuration file was successfully loaded:

>   \# casadm --io-class --list --cache-id \<ID\>

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
>>   2,metadata,3,1

In the above example, to specify the directories to be cached, IO Class 1 shows
an IO Class Name of:

>>   directory:/data/dataa\|directory:/data/datab

This example specifies that all data in the /data/dataa or /data/datab
directories will be cached; unclassified data will not be cached; metadata will
be cached (due to allocation 1 or 0).

If a directory referenced in classification rule "directory" condition is
modified (created / removed / moved), it might take a few seconds until the CAS
classification procedure picks up the change and starts classifying IO according
to the changed directory contents.

### Combined IO Classification Rules

The IO classification example below shows a combination of file size and
directory based caching. Class ID 4 demonstrates that ID’s may be combined to
form a new classification rule:

>>   IO class id,IO class name,Eviction priority,Allocation
>>
>>   0,unclassified,22,1  
>>   1,metadata,1,1  
>>   2,direct,1,1  
>>   3,file_size:gt:40960,1,1  
>>   4,io_class:3&file_size:lt:81920&done,1,1  
>>   6,directory:/mnt/drv1/dir,1,1  
>>   7,directory:/mnt/drv1/dir/subdir/\|directory:/mnt/drv1/dir/subdir2/,1,1  

IO class name length limit is 1024 characters. If exceeded, IO class
configuration will fail. The valid IO class id range is 0-32. Please note that
multiple classification rules must be combined using the same logical operator
(for example, metadata\|file_size:lt:4096\|io_class:3 only uses the “\|”
operator. Or in another example, file_size:gt:4096&file_size:lt:40960&io_class:3
only uses the “&” operator). Rules with more than one logical operator will lead
to an unmatched evaluation (for example, metadata\|file_size:lt:4096&io_class:3
will lead to an undefined condition evaluation due to the use of both “&” and
“\|” operators). The keyword “*&done*” can always be added at the end of any
valid combined rule. Note that the classifier is unable to further categorize IO
when it is in direct mode, therefore, IO classified as direct cannot jointly
classify other conditions such as file_size or directory.
