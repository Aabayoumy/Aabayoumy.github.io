---
title: "Proxmox Reinstall"
date: 2024-03-30
draft: false
description: "Reinstall my proxmox & lab"
tags: ["proxmox"]
categories: ["proxmox lab"]
---

{{< badge >}}
Proxmox
{{< /badge >}}

I changed my main SSD for Proxmox that i used for Active Directory & security LAB, I'm docment hear my configration and prefeard settings.
Also I will include my resorces.

## My Hardware Configuration:
- CPU : AMD Ryzen 5 PRO 4650G With GPU
- OS Drive : SATA SSD 128G
- VM Drive : 1 TB M.2 NVME
- Data Drives : 2 * 4 TB HDD --> ZFS Mirrord --> tank pool

## Intial Configuration:
- Proxmox installed on 128G SSD
- Hostname **pve1**
- Remove **local-lvm** and expand **local** storage Must be done before create any VM Or contianer
- Resorces: [Proxmox install](https://www.youtube.com/watch?v=_u8qTN3cCnQ&t=629s)
- Settings for update using Proxmox Post Install Script https://tteck.github.io/Proxmox/
 ### Storage:
 1TB SSD formate and used as **local-lvm**
* From Datacenter > pve1 > Disks > LVM-Thin > Add.
* Used for VM & Continers Storage
 ZFS dataset **storage** mounted as directory storage for backup, ISO's & LXC templates.
 
## Base Containers: 
I alrady have backups from this continers so i just restored theme 😊
### Files Share container (fs01):
* Using TurnKey template --> https://www.youtube.com/watch?v=I7nfSCNKeck
* ZFS dataset named **data** Mounted to Continer 
* Share **data** with SMB & NFS
### Apt-Cacher-NG:
* Becase i'm installing a lot of Debian based VM's and continers so this continer will download APT packegaes once then proxe it to all my VM's and continers.
* Installed form https://tteck.github.io/Proxmox/ select to be privilaged continer.
* Add line `mp1: /tank/data/apt-cacher-ng,mp=/var/cache/apt-cacher-ng` to continet config `/etc/pve/lxc/101.conf` to mount folder from data storage inside continer .
* Run this command on clints to use it as APT proxy `echo 'Acquire::HTTP::Proxy "http://10.0.0.110:3142";' > /etc/apt/apt.conf.d/01-proxy`



