---
title: "Windows Template"
date: 2024-04-01
draft: true
description: "Create Windows 2k22 & Windows 11 Template"
tags: ["proxmox"]
categories: ["security lab"]
---

{{< badge >}}
Proxmox
{{< /badge >}}

## Downlaod windows ISO's 
- [Windows Server2022] (https://www.microsoft.com/en-us/evalcenter/evaluate-windows-server-2022) [Windows 11](https://www.microsoft.com/software-download/windows11)
- [Windows VirtIO Drivers](https://pve.proxmox.com/wiki/Windows_VirtIO_Drivers)
- Upload it to proxmox storage.
## Download scripts folder from https://github.com/Aabayoumy/Security-LAB

## Create Windows Server 2022 STD Template 
- [Windows 2022 guest best practices](https://pve.proxmox.com/wiki/Windows_2022_guest_best_practices)
- [Virtualize Windows Server 2022 in Proxmox - VLANs, Sysprep, and Template!](https://www.youtube.com/watch?v=1MjA-rBV9Q4)
- Windows Server 2022 VM conf file:
```
root@pve1:~# cat /etc/pve/qemu-server/901.conf
agent: 1
bios: ovmf
boot: order=scsi0;ide0;ide2;net0
cores: 4
cpu: host
efidisk0: local-lvm:vm-901-disk-0,efitype=4m,pre-enrolled-keys=1,size=4M
ide0: storage:iso/virtio-win-0.1.229.iso,media=cdrom,size=522284K
ide2: storage:iso/windows_server_2022_dec_2023_x64.iso,media=cdrom,size=5241400K
machine: pc-q35-8.1
memory: 8192
meta: creation-qemu=8.1.5,ctime=1711960168
name: Win2k22
net0: virtio=BC:24:11:BC:DB:59,bridge=vmbr0,firewall=1
numa: 0
ostype: win11
scsi0: local-lvm:vm-901-disk-1,cache=writeback,discard=on,size=128G,ssd=1
scsihw: virtio-scsi-pci
smbios1: uuid=5aa16e2e-3af5-4559-ad60-0b0689208e58
sockets: 1
tpmstate0: local-lvm:vm-901-disk-2,size=4M,version=v2.0
vmgenid: c6a03c43-1501-49ee-8539-0812576159b3
```
- Start the VM, install windows:
    - Select to install **Windows Server 2022 Standard(Desktop Experiance)**
    - Follow the installer steps until you reach the installation type selection where you need to select "Custom (advanced)" Now click "Load driver" to install the VirtIO drivers for hard disk and the network.
      - Hard disk: Browse to the CD drive where you mounted the VirtIO driver and select folder "amd64\2k22" and confirm. Select the "Red Hat VirtIO SCSI pass-through controller" and click next to install it. Now you should see your drive.
      - Network: Repeat the steps from above (click again "Load driver", etc.) and select the folder "NetKVM\2k19\amd64", confirm it and select "Redhat VirtIO Ethernet Adapter" and click next.
      - Memory Ballooning: Again, repeat the steps but this time select the "Balloon\2k19\amd64" folder, then the "VirtIO Balloon Driver" and install it by clicking next. With these three drivers you should be good covered to run a fast virtualized Windows Server 2022 system.
    - Choose the drive and continue the Windows installer steps.
- Install drivers from VirtIO mounted ISO "virtio-win-gt-x64.msi" then restart.
- Install the "Qemu Guest Agent". The installer is located on the driver CD under guest-agent\qemu-ga-x86_64.msi.
- Make full windows update and install any needed sonfware.
- Copy Script folder to C:\Scripts
- Open PowerShell As Admin:
```
cd c:\Scripts
.\sysprep.cmd
```
- After VM shutdown, convert it to Template.

## Create Windows 11 Enterprise Template
Same as Windows servers steps 



