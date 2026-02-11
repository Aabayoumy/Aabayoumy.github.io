---
title: "Incident Response: Why Attackers Abuse the Windows Hosts File (and How to Disable It)"
date: 2026-02-11
lastmod: 2026-02-11
draft: false
description: "During AV/security incidents, attackers often weaponize the Windows hosts file to block updates or redirect traffic. Two practical ways to disable or harden it: Domain GPO or local lockdown."
tags: ["Windows", "Incident Response", "DNS", "Hardening"]
categories: ["Windows Security"]
---

{{< badge >}}
Windows IR / Hardening
{{< /badge >}}

During malware activity (including post-exploitation following a security product incident), attackers often tamper with the Windows **hosts** file because it provides a fast, local way to control name resolution without touching DNS servers.

Example (what this can look like during an AV incident): an attacker (or follow-on malware) edits `hosts` to block the security vendor's update or support endpoints so the endpoint cannot recover or receive new detections. If you're responding to an eScan-related incident, start from the official support channel and vendor guidance, then validate name resolution locally:

- eScan Technical Support: https://www.escanav.com/en/support/escan-tech-support.asp

Typical malicious `hosts` entries look like this:

```text
127.0.0.1 update.vendor.example
0.0.0.0   support.vendor.example
```

- **Path:** `%SystemRoot%\System32\drivers\etc\hosts`
- **Why it's abused:** entries in `hosts` can override DNS and silently block or redirect traffic.

Common attacker outcomes:

- Block AV/EDR updates by mapping vendor domains to `127.0.0.1` / `0.0.0.0`
- Redirect a trusted hostname to an attacker-controlled IP
- Break remediation by blocking Microsoft/security tooling sites

Below are two practical ways to disable or harden the hosts file (domain and non-domain).

---

## Option 1: Disable/harden via Domain Group Policy (Recommended for fleets)

There is no "turn off hosts file" switch in Windows. In enterprises, the reliable control is to **lock down write access** (and optionally enforce a clean baseline).

### A) Lock the ACL using Group Policy (File System security)

1. Open **Group Policy Management** (`gpmc.msc`).
2. Create/link a GPO to the target computer OU.
3. Go to:
   `Computer Configuration -> Policies -> Windows Settings -> Security Settings -> File System`
4. Add the file path:
   `%SystemRoot%\System32\drivers\etc\hosts`
5. Set permissions to prevent edits by standard users:
   - `SYSTEM`: Full control
   - `Administrators`: Full control
   - `Users` (or `Authenticated Users`): Read & execute (read-only)

This blocks most tampering that relies on user-level access.

### B) (Optional) Enforce a known-good hosts file using Group Policy Preferences

If you want to continuously restore a clean file:

- `Computer Configuration -> Preferences -> Windows Settings -> Files`
- Create/Replace `%SystemRoot%\System32\drivers\etc\hosts` with your approved baseline contents.

Operational note: if you legitimately use hosts entries (legacy apps, labs), define and deploy an approved baseline rather than blanking it.

---

## Option 2: Not domain-joined (local lockdown)

On standalone machines, you can disable practical tampering by setting **read-only** plus **tight ACLs** (run as Administrator).

```powershell
$Hosts = "$env:windir\System32\drivers\etc\hosts"

# Backup
Copy-Item $Hosts "$Hosts.bak-$(Get-Date -Format yyyyMMddHHmmss)"

# Inspect/edit once (remove suspicious lines, keep only what you approve)
notepad $Hosts

# Make read-only (lightweight)
attrib +R $Hosts

# Lock ACLs (stronger): only SYSTEM/Admins can modify; users can read
icacls $Hosts /inheritance:r
icacls $Hosts /grant:r "SYSTEM:(F)" "Administrators:(F)" "Users:(R)"

# Flush caches
ipconfig /flushdns
Restart-Service dnscache
```

If the machine is actively compromised with SYSTEM-level control, it may still revert changes. Treat this as a containment step while you investigate persistence and regain trust in the endpoint.

---

## Quick verification

- Review file:
  - `notepad %SystemRoot%\System32\drivers\etc\hosts`
- Check permissions:
  - `icacls %SystemRoot%\System32\drivers\etc\hosts`
- Confirm resolution isn't overridden:
  - `Resolve-DnsName <hostname>` and compare with a known-good system

---
