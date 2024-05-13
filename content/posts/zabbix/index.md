---
title: "Install Zabbix"
date: 2024-05-13
draft: false
description: "Install Zabbix on Ubuntu Server 24.04"
tags: ["Zabbix"]
categories: ["Tools"]
---

## Install Ubutnu Server 24.04
## Install [MariaDB](https://linuxsecurity.com/howtos/secure-my-webserver/installing-securing-mariadb)
```shell 
sudo apt update && apt fullupgrade -y
sudo apt install mariadb-server
sudo systemctl enable --now mariadb
sudo mysql_secure_installation
```

## Install [Zabbix](https://www.zabbix.com/download?zabbix=6.4&os_distribution=ubuntu&os_version=24.04&components=server_frontend_agent&db=mysql&ws=apache)
```shell
#run all next commands as root
sudo su
```
```shell
cd /tmp
wget https://repo.zabbix.com/zabbix/6.4/ubuntu/pool/main/z/zabbix-release/zabbix-release_6.4-1+ubuntu24.04_all.deb
dpkg -i zabbix-release_6.4-1+ubuntu24.04_all.deb
apt update && apt fullupgrade -y
apt install zabbix-server-mysql zabbix-frontend-php zabbix-apache-conf zabbix-sql-scripts zabbix-agent
```
- Create initial database 
```shell
mysql -uroot -p
#Enter root password
create database zabbix character set utf8mb4 collate utf8mb4_bin;
create user zabbix@localhost identified by 'Zabbi1x';
grant all privileges on zabbix.* to zabbix@localhost;
set global log_bin_trust_function_creators = 1;
quit;
```
- Import DB 
```shell
zcat /usr/share/zabbix-sql-scripts/mysql/server.sql.gz | mysql --default-character-set=utf8mb4 -uzabbix -p zabbix
#Enter Zabbix user password
```
- Disable log_bin_trust_function_creators option after importing database schema.
```shell
mysql -uroot -p
#Enter root password
 set global log_bin_trust_function_creators = 0;
 quit;
```
- Configure the database for Zabbix server
Edit file /etc/zabbix/zabbix_server.conf `DBPassword=password`
- Start Zabbix server and agent processes
```shell
systemctl restart zabbix-server zabbix-agent apache2
systemctl enable zabbix-server zabbix-agent apache2 
```
- Open Zabbix UI web page http://host/zabbix