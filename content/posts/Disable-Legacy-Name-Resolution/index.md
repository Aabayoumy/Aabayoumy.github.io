---
title: "Disable Legacy Name Resolution in Active Directory"
date: 2025-12-25
lastmod: 2025-12-25
draft: false
description: "Stop NetBIOS, LLMNR, and mDNS from leaking credentials by Group Policy."
tags: ["Active Directory", "Group Policy", "DNS", "Hardening"]
categories: ["AD Security"]
---

{{< badge >}}
Active Directory Hardening
{{< /badge >}}

Modern Windows clients obediently fall back to legacy discovery methods whenever a DNS query fails. That behavior—intended to keep file shares reachable—now feeds credential-relay kits that wait for multicast or broadcast requests and answer faster than the real server. This post documents why NetBIOS, LLMNR, and mDNS are dangerous in an AD environment, the exact Group Policy settings to disable them, and how to prove the controls are holding.

----
## Attack Simulation
{{< youtube geRyLUCdQM4 >}}

---

## Why legacy name resolution is still a problem

| Protocol    | Default behavior                                                          | Attack surface                                                                              |
| ----------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **NetBIOS** | Broadcasts over UDP/137-138 when DNS fails.                               | Tools like _Responder_ spoof replies and capture NTLM hashes or coerce SMB sessions.        |
| **LLMNR**   | IPv4 multicast 224.0.0.252 (or IPv6 ff02::1:3) with zero authentication.  | First responder wins, so attackers can deliver fake IPs or harvest credentials.             |
| **mDNS**    | Enabled by default on Windows 11/Server 2022 for local service discovery. | Poisoned replies reroute traffic or leak secrets; often overlooked after LLMNR is disabled. |

As long as these protocols remain enabled, any failure—even a brief DNS hiccup—causes clients to shout their queries onto the LAN, where an adversary only has to listen.

---

## Tools & prerequisites

1. **Group Policy Management Console (GPMC)** – to create and link the hardening GPO.
2. **PowerShell with RSAT** – for validation (`Get-DnsClientGlobalSetting`, `Get-CimInstance`, etc.).
3. **Packet capture or attack simulation tool** – _Responder_, _Inveigh_, or Wireshark confirm there is no remaining multicast chatter.
4. **Change management plan** – pilot ring OUs and a rollback procedure for legacy apps that still rely on broadcasts.

---

## Disable the fallback path with Group Policy

### 1. Create and scope the policy

1. Open **gpmc.msc** and create a new GPO named **"Disable Legacy Name Resolution"**.
2. Link it to workstation and member-server OUs (stage via security filtering if needed).
3. Keep Domain Controllers out of scope unless you have tested DC compatibility.

### 2. Turn off LLMNR & mDNS

`Computer Configuration → Policies → Administrative Templates → Network → DNS Client`

| Setting                                        | Value                         | Result                                                                      |
| ---------------------------------------------- | ----------------------------- | --------------------------------------------------------------------------- |
| **Turn off multicast name resolution**         | **Enabled**                   | Sets `EnableMulticast = 0`, killing both LLMNR and Windows mDNS responders. |
| **Turn off smart multi-homed name resolution** | **Enabled**                   | Stops simultaneous queries across interfaces that can re-trigger LLMNR.     |
| **Configure mDNS responder** (Win11/2022+)     | **Disabled**                  | Completely disables mDNS advertisement and queries.                         |
| **Dynamic update**                             | **Disabled** or "Secure only" | Prevents ad hoc registrations when DNS is unavailable.                      |

### 3. Disable NetBIOS over TCP/IP

`Computer Configuration → Preferences → Control Panel Settings → Network Options`

1. Add a **Network Adapter** preference item and target **All LAN adapters**.
2. In the **WINS** tab select **Disable NetBIOS over TCP/IP**.

_Registry alternative:_ set `HKLM\SYSTEM\CurrentControlSet\Services\NetBT\Parameters\Interfaces\Tcpip_*` → `NetbiosOptions = 2` via Preferences.

### 4. Optional: block the ports outright

`Computer Configuration → Policies → Windows Settings → Security Settings → Windows Defender Firewall with Advanced Security`

Create inbound and outbound block rules for:

- UDP/137-138 (NetBIOS Name/Datagram)
- UDP/5355 (LLMNR)
- UDP/5353 (mDNS)

This ensures even manually enabled services cannot speak the legacy protocols.

---

## Verification checklist

```powershell
# Confirm policy application
Get-GPResultantSetOfPolicy -ReportType Html -Path C:\temp\rsop.html

# Inspect DNS client fallbacks
Get-DnsClientGlobalSetting | Select-Object Llmnr, Mdns, EnableMulticast

# Check NetBIOS state (2 = disabled)
Get-CimInstance Win32_NetworkAdapterConfiguration -Filter "IPEnabled = True" |
  Select-Object Description, TcpipNetbiosOptions

# Negative test: no fallback after an invalid lookup
Resolve-DnsName does-not-exist.corp.local -ErrorAction SilentlyContinue
```

Field-test the change:

1. Run **Responder** or **Inveigh** on a lab VLAN. With the GPO applied you should see zero LLMNR/NetBIOS hits.
2. Capture traffic with Wireshark looking for `udp.port == 5355 || 5353 || 137 || 138`; there should be no packets after boot.
3. Monitor `Microsoft-Windows-DNS-Client/Operational` for Event IDs 3008/3010 to ensure clients only query approved DNS servers.
4. On endpoints, run `netstat -aon | findstr "137 138 5355 5353"` to confirm there are no listening sockets or established sessions on the legacy name-resolution ports.

---

## Operational tips

- Roll out in rings (pilot ➜ IT ➜ workstations ➜ servers) to catch legacy dependencies early.
- Document an exception workflow that requires packet-capture proof before re-enabling any protocol.
- Pair this hardening step with secure-only dynamic DNS updates, credential guard, and SMB signing to further reduce lateral-movement options.
- Keep an "assume breach" mindset—rerun Responder or multicast sweeps quarterly to ensure the setting stays enforced.

By removing every fallback mechanism, you force clients to rely solely on authenticated DNS, closing one of the most abused credential-harvest channels inside Active Directory networks.
