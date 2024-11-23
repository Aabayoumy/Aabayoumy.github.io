---
title: "My lab beased on Virt-manager"
date: 2024-11-23
draft: true
description: "Build Active Directory lab in linux with KVM,libvirt & Virt-Manager"
tags: ["Active Directory","lab", "Virt-Manager"]
categories: ["Active Directory Lab"]
---

{{< badge >}}
ActiveDirectory Lab
{{< /badge >}}

I reinstall my PC with [ArchLinux](https://archlinuxarm.org/) With [Hyprland](https://hyprland.org/), then install KVM,qemu,libvert and mange it with Virt-Manager, I just follow this gret [article](https://sysguides.com/install-kvm-on-linux).

Today i will create master image of Windows 11 Enterprise (you can use other edditions).

We need [Windows 11 iso](https://www.microsoft.com/software-download/windows11).
Download requred drivers ISO [virtio](https://fedorapeople.org/groups/virt/virtio-win/direct-downloads/).

Script to create VM & sysprem unattend.xml in my repo https://github.com/Aabayoumy/libvirt-scripts

## Resorces
- Install KVM on Linux https://sysguides.com/install-kvm-on-linux
- Install a Windows 11 Virtual Machine on KVM : https://sysguides.com/install-a-windows-11-virtual-machine-on-kvm
- My Scripts https://github.com/Aabayoumy/libvirt-scripts.git


