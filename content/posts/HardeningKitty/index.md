---
title: 'HardeningKitty'
date: 2024-02-14
draft: false
tags: ["Active Directory", "Security Hardening","Links"]
externalUrl: "https://github.com/scipag/HardeningKitty"
summary: "HardeningKitty supports hardening of a Windows system."
showReadingTime: false
---

How to Run
Run the script with administrative privileges to access machine settings. For the user settings it is better to execute them with a normal user account. Ideally, the user account is used for daily work.

Download HardeningKitty and copy it to the target system (script and lists). Then HardeningKitty can be imported and executed:

```PowerShell
Import-Module .\HardeningKitty.psm1
Invoke-HardeningKitty -EmojiSupport
```
