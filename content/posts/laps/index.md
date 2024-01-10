---
title: "Create new local user to use with LAPS"
date: 2023-05-29
draft: false
description: "Create new local user to use with LAPS"
tags: ["Active Directory", "LAPS"]
---

{{< badge >}}
Active Directory
{{< /badge >}}

## Prerequisite

- Implement new LAPS https://learn.microsoft.com/en-us/windows-server/identity/laps/laps-overview
- This script will not work with legacy LAPS

## PowerShell Script

```powershell
$op = Get-LocalUser | where-Object Name -eq "ladmin" | Measure
if ($op.Count -eq 0) { # if user not exist - create it
$password = ConvertTo-SecureString "P@ssw0rd@1411P@ssw0rd" -AsPlainText -Force
New-LocalUser -Name "ladmin" -Password $password -FullName "adminuser" -Description "Local Admin For LAPS"

Add-LocalGroupMember -Name 'Administrators' -Member 'adminUser'
Reset-LapsPassword # LAPS wil lreset the password
}
```

Save the script in sysvol Netlogon folder , in my domain `\\abayoumy.local\NETLOGON\localadmin.ps1`

## Create GPO

Create new GPO or add this settings to same LAPS GPO [My LAPS GP Report](LAPS.html)

Computer Configuration > Preferences > Control Panel Settings > Scheduled Tasks
Right click and select Immediate Task (At least Windows 7) (Name: ladmin)

Set to run as user :NT AUTHORITY\System
Select **Run with highest privileges**

In Action tab :

- Program/script: `C:\WINDOWS\system32\WindowsPowerShell\v1.0\powershell.exe`
- Arguments: `-ExecutionPolicy Bypass -command "& \\abayoumy.local\NETLOGON\localadmin.ps1"`

Apply the GPO to target computers OU and on computer run 'GPupdate /force' user must create immediately and LAPS set new password
