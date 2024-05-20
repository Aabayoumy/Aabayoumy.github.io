---
title: "Time Sync Configuration in Active Directory"
date: 2023-01-13
draft: false
description: "Time Configuration in Active Directory"
slug: "ntp"
tags: ["Active Directory", "NTP", "Windows Time Service"]
showDate: true
showAuthor: true
showReadingTime: true
showEdit: false
showTableOfContents: true
showComments: true
---

{{< badge >}}
Active Directory
{{< /badge >}} {{< badge >}}
Windows Time Service
{{< /badge >}}

This is enhanced ver of old [Microsoft Article](https://learn.microsoft.com/en-us/archive/blogs/nepapfe/its-simple-time-configuration-in-active-directory)

## Why time sync in active directory is important?

- If client computer time out of sync from DC more than 5 min , Kerberos will not work, and DC will refuse to issue TGT :)
- Also DC's resolve replication conflict by comparing time.
- Business applications record operations time stamp ,and not synced time create issues, specially on Banks & governmental environment.

> You have 3 Options to set windows Time service setting
>
> 1.  Registry : Not recommended to directly edit Registry.
> 2.  Commands : you will execute w32tm command on each computer.
> 3.  Group Policy : Prefeared to automate the setting.

## Configure Windows Time Service by w32tm Command:

1. On PDC execute command : `w32tm /config /manualpeerlist: time.windows.com:0x9 /syncfromflags:manual /reliable:yes /update`
2. On all other DC's , Member servers & Domain computers `w32tm /config /syncfromflags:domhier /update`

> When move PDC FSMO : you have to run this commands on old and new PDC.

## Configure Windows Time Service by Group Policy

We will create 2 GPO's each one with WMI filter, Open Group Policy Management console :

1. Create WMI filter name it **PDC** with value:
   `Select * from Win32_ComputerSystem where DomainRole = 5`
   this will be true only if computer is DC and have PDC FSMO.
2. Create WMI filter name it **NOT PDC** with value:
   `Select * from Win32_ComputerSystem where DomainRole <> 5`
   this will be true on all other computers other that DC with PDC FSMO.
3. Create New GPO Name it **TimeSync for PDC** and edit, goto this path:
   `Computer Configuration\Administrative Templates\System\Windows Time Service\Time Providers` double click `Configure Windows NTP Client` keep `NtpServer` as defult and change `Type` = **NTP** , Then Enable Windows NTP Client.

4. Create New GPO Name it **TimeSync for All** and edit, goto this path:
   `Computer Configuration\Administrative Templates\System\Windows Time Service\Time Providers` double click `Configure Windows NTP Client` keep `NtpServer` as default and change `Type` = **NT5DS**, Then Enable Windows NTP Client.

5. Link GPO **TimeSync for All** to domain top level and force it .
6. Link GPO **TimeSync for PDC** to `Domain Controllers` OU.

> When move PDC FSMO : Setting will correct after automate or manually group policy.

## Test configuration:

### PDC

1. On `PDC` force Group Policy update `Gpupdate /force`
2. Force time sync `w32tm  /resync /rediscover`
3. Check status & last sync `w32tm  /query /status` source must be `time.windows.com`
4. Check effective configuration `w32tm  /query /configuration`

### Other DC

1. On any `DC` ,force Group Policy update `Gpupdate /force`
2. Force time sync `w32tm  /resync /rediscover`
3. Check status & last sync `w32tm  /query /status` source must be the `PDC`.
4. Check effective configuration `w32tm  /query /configuration`

### Any Member server or workstation

1. On any other computer,force Group Policy update `Gpupdate /force`
2. Force time sync `w32tm  /resync /rediscover`
3. Check status & last sync `w32tm  /query /status` source must be any `DC`.
4. Check effective configuration `w32tm  /query /configuration`
