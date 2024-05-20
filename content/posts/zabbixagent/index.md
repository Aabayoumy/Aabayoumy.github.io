---
title: "Install Zabbi Agent"
date: 2024-05-15
draft: false
description: "Install Zabbix Agent using PowerShell & Group Policy"
tags: ["Zabbix"]
categories: ["Tools"]
---

{{< youtube  (kmMc-zqCGiA) >}}

- Download [Zabbix Agent for Windows](https://www.zabbix.com/download_agents?version=6.4&release=6.4.14&os=Windows&os_version=Any&hardware=amd64&encryption=OpenSSL&packaging=MSI&show_legacy=0).
- Copy it to domain sysvol folder.
- Create Script and save it to sysvol
```PowerShell
### Created using ChatGPT
# Check if Zabbix agent is already installed
if (Get-WmiObject -Class Win32_Product | Where-Object { $_.Name -eq "Zabbix Agent (64-bit)" }) {
    Write-Output "Zabbix Agent is already installed. Exiting..."
    Exit
}
$sharedFolderPath = "\\server\share\zabbix_agent.msi"
$zabbixServerIP = "ZABBIX_SERVER_IP"
$destinationFolder = "$env:TEMP\ZabbixAgent"
$hostname = $env:COMPUTERNAME
$logFilePath = "C:\ZabbixAgentInstallation_$(Get-Date -Format 'yyyyMMdd_HHmmss').log"
# Start transcript to log actions
Start-Transcript -Path $logFilePath -Force
New-Item -ItemType Directory -Path $destinationFolder -Force | Out-Null
Copy-Item -Path $sharedFolderPath -Destination $destinationFolder -Force
$msiArguments = "/qn /i `"$destinationFolder\zabbix_agent.msi`" SERVER=$zabbixServerIP HOSTNAME=$hostname"
Start-Process -FilePath msiexec.exe -ArgumentList $msiArguments -Wait
Remove-Item -Path $destinationFolder -Recurse -Force
# Stop transcript
Stop-Transcript
```
- Create GPO and set it as startup script in Computer policy.
- link GPO to required OU.