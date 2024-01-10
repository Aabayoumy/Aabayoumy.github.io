---
title: "3- Create VM from Master Image"
date: 2023-04-30
draft: false
description: "Create VM from Master Image"
tags: ["Hyper-V", "LAB"]
categories: ["Active Directory Lab"]
---

{{< badge >}}
Hyper-V
{{< /badge >}}
{{< badge >}}
Windows Server 2022
{{< /badge >}}
{{< badge >}}
Active Directory
{{< /badge >}}

### PreRequest

#### [Hyper-v installation](/lab/prerequest/)

#### [Create Windows Server 2022 Master Disk with SysPrep](/lab/master2022)

---

## Install Active directory 1st Domain Controller

### Create VM

Open PowerShell as administrator and run this commands:

```PowerShell

$vm = "DC01" # name of VM, this just applies in Windows, it isn't applied to the OS guest itself.
$vhdx = "D:\images\windows2022-master.vhdx"
$vmswitch = "NAT" # name of your local vswitch
$port = "port1" # port on the VM
$vlan = 1 # VLAN that VM traffic will be send in
$cpu =  2 # Number of CPUs
$ram = 4GB # RAM of VM. Note this is not a string, not in quotation marks

# Create a new VM
New-VM  $vm -Generation 2
# Set the CPU and start-up RAM
Set-VM $vm -ProcessorCount $cpu -MemoryStartupBytes $ram

# Get default VHD path (requires administrative privileges)
$vmms = Get-WmiObject -namespace root\virtualization\v2 Msvm_VirtualSystemManagementService
$vmmsSettings = Get-WmiObject -namespace root\virtualization\v2 Msvm_VirtualSystemManagementServiceSettingData
$vhdxPath = Join-Path $vmmsSettings.DefaultVirtualHardDiskPath "$vm-disk1.vhdx"
Copy-Item -Path $vhdx -Destination $vhdxPath

# Add the new disk to the VM
Add-VMHardDiskDrive -VMName $vm -Path $vhdxPath

# Remove the default VM NIC named 'Network Adapter'
Remove-VMNetworkAdapter -VMName $vm
# Add a new NIC to the VM and set its name
Add-VMNetworkAdapter -VMName $vm -Name $port
# Configure the NIC as access and assign VLAN
#Set-VMNetworkAdapterVlan -VMName $vm -VMNetworkAdapterName $port
# Connect the NIC to the vswitch
Connect-VMNetworkAdapter -VMName $vm -Name $port -SwitchName $vmswitch
Set-VM -Name $vm -CheckpointType Disabled
Disable-VMIntegrationService -VMName $vm "Time Synchronization"
Enable-VMIntegrationService -VMName $vm "Guest Service Interface"
Start-VM -VMName $vm
VMConnect.exe localhost  $vm
```

In first boot you need to set Administrator password and wait till windows fully loaded .

### Set VM static IP, Hostname & Restart

```PowerShell
$plainPassword = "P@ssw0rd"
$password = $plainPassword | ConvertTo-SecureString -asPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential("administrator", $password)
$vm = "DC01"

$session = New-PSSession -Vmname $vm -Credential $credential -Verbose

$code = {
netsh int ip set address "ethernet" static 172.30.0.10 255.255.255.0 172.30.0.1 1
netsh interface ipv4 add dnsserver name=Ethernet address=172.30.0.12 index=1 validate=no
netsh interface ipv4 add dnsserver name=Ethernet address=172.30.0.10 index=2 validate=no
netsh interface ipv4 add dnsserver name=Ethernet address=8.8.8.8 index=3 validate=no
Rename-Computer DC01 -Force -Restart
Exit
}
Invoke-Command -Session $session -ScriptBlock $code
```

Wait till windows restart.

### Install Active Directory Domain

```PowerShell
$plainPassword = "P@ssw0rd"
$password = $plainPassword | ConvertTo-SecureString -asPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential("administrator", $password)
$vm = "DC01"

$session = New-PSSession -Vmname $vm -Credential $credential -Verbose

$code = {
 $plainPassword = "P@ssw0rd" # Administrator Password
 $password = $plainPassword | ConvertTo-SecureString -asPlainText -Force
 $credential = New-Object System.Management.Automation.PSCredential("administrator", $password)

$SafeModeAdministratorPassword = "P@ssw0rd" | ConvertTo-SecureString -asPlainText -Force # DSRM  Password

$domainName = "contoso"
 $domain = "$domainName.local"

Write-Host "Installing management tools"
 Import-Module ServerManager
 Add-WindowsFeature RSAT-AD-PowerShell,RSAT-AD-AdminCenter

Write-Host "Deploying Active Directory Domain..."
 Install-WindowsFeature AD-domain-services, DNS -IncludeAllSubFeature -IncludeManagementTools -Restart
 Import-Module ADDSDeployment
 Install-ADDSForest `
 -SafeModeAdministratorPassword $SafeModeAdministratorPassword `
 -CreateDnsDelegation:$false `
 -DatabasePath "C:\Windows\NTDS" `
 -DomainMode "7" `
 -DomainName $domain `
 -DomainNetbiosName $domainName `
 -ForestMode "7" `
 -InstallDns:$true `
 -LogPath "C:\Windows\NTDS" `
 -NoRebootOnCompletion:$true `
 -SysvolPath "C:\Windows\SYSVOL" `
 -Force:$true

Restart-Computer -Force -Verbose
}
Invoke-Command -Session $session -ScriptBlock $code
```

After VM restart, you can logon to new created Domain :)

---

## Install Additional Domain Controller

### Create new VM

Open PowerShell as administrator and run this commands:

```PowerShell
$vm = "DC02" # name of VM, this just applies in Windows, it isn't applied to the OS guest itself.
$vhdx = "D:\images\windows2022-master.vhdx"
$vmswitch = "NAT" # name of your local vswitch
$port = "port1" # port on the VM
$vlan = 1 # VLAN that VM traffic will be send in
$cpu =  2 # Number of CPUs
$ram = 4GB # RAM of VM. Note this is not a string, not in quotation marks

# Create a new VM
New-VM  $vm -Generation 2
# Set the CPU and start-up RAM
Set-VM $vm -ProcessorCount $cpu -MemoryStartupBytes $ram

# Get default VHD path (requires administrative privileges)
$vmms = Get-WmiObject -namespace root\virtualization\v2 Msvm_VirtualSystemManagementService
$vmmsSettings = Get-WmiObject -namespace root\virtualization\v2 Msvm_VirtualSystemManagementServiceSettingData
$vhdxPath = Join-Path $vmmsSettings.DefaultVirtualHardDiskPath "$vm-disk1.vhdx"
Copy-Item -Path $vhdx -Destination $vhdxPath

# Add the new disk to the VM
Add-VMHardDiskDrive -VMName $vm -Path $vhdxPath

# Remove the default VM NIC named 'Network Adapter'
Remove-VMNetworkAdapter -VMName $vm
# Add a new NIC to the VM and set its name
Add-VMNetworkAdapter -VMName $vm -Name $port
# Configure the NIC as access and assign VLAN
#Set-VMNetworkAdapterVlan -VMName $vm -VMNetworkAdapterName $port
# Connect the NIC to the vswitch
Connect-VMNetworkAdapter -VMName $vm -Name $port -SwitchName $vmswitch
Set-VM -Name $vm -CheckpointType Disabled
Disable-VMIntegrationService -VMName $vm "Time Synchronization"
Enable-VMIntegrationService -VMName $vm "Guest Service Interface"
Start-VM -VMName $vm
VMConnect.exe localhost  $vm
```

In first boot you need to set Administrator password and wait till windows fully loaded .

### Set VM static IP, Hostname & Restart

```PowerShell
$plainPassword = "P@ssw0rd"
$password = $plainPassword | ConvertTo-SecureString -asPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential("administrator", $password)
$vm = "DC02"

$session = New-PSSession -Vmname $vm -Credential $credential -Verbose

$code = {
netsh int ip set address "ethernet" static 172.30.0.12 255.255.255.0 172.30.0.1 1
netsh interface ipv4 add dnsserver name=Ethernet address=172.30.0.10 index=1 validate=no
netsh interface ipv4 add dnsserver name=Ethernet address=8.8.8.8 index=3 validate=no
Rename-Computer DC02 -Force -Restart
Exit
}
Invoke-Command -Session $session -ScriptBlock $code
```

Wait till windows restart.

### Install Additional Domain Controller

```PowerShell
$plainPassword = "P@ssw0rd"
$password = $plainPassword | ConvertTo-SecureString -asPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential("administrator", $password)
$vm = "DC02"

$session = New-PSSession -Vmname $vm -Credential $credential -Verbose

$code = {
 $plainPassword = "P@ssw0rd" # Administrator Password
 $password = $plainPassword | ConvertTo-SecureString -asPlainText -Force
 $credential = New-Object System.Management.Automation.PSCredential("administrator", $password)

$SafeModeAdministratorPassword = "P@ssw0rd" | ConvertTo-SecureString -asPlainText -Force # DSRM  Password

$domainName = "contoso"
 $domain = "$domainName.local"

Write-Host "Installing management tools"
 Import-Module ServerManager
 Add-WindowsFeature RSAT-AD-PowerShell,RSAT-AD-AdminCenter

Write-Host "Deploying Additional Domain Controller..."
 Install-WindowsFeature AD-domain-services, DNS -IncludeAllSubFeature -IncludeManagementTools -Restart
 Import-Module ADDSDeployment
 Install-ADDSDomainController `
 -SafeModeAdministratorPassword $SafeModeAdministratorPassword `
 -CreateDnsDelegation:$false `
 -DatabasePath "C:\Windows\NTDS" `
 -DomainName $domain `
 -InstallDns:$true `
 -Credential (Get-Credential) `
 -LogPath "C:\Windows\NTDS" `
 -NoRebootOnCompletion:$true `
 -SysvolPath "C:\Windows\SYSVOL" `
 -Force:$true

Restart-Computer -Force -Verbose
}
Invoke-Command -Session $session -ScriptBlock $code
```

Will ask you for domain Admin user & Password .

## Next

### [Time Sync Configuration in Active Directory](/posts/ntp/)
