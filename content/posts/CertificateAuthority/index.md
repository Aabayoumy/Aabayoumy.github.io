---
title: "4- Install Certificate Authority"
date: 2023-05-07
draft: false
description: "Install Certificate Authority"
tags: ["Certificate Authority", "LAB"]
categories: ["Active Directory Lab"]
---

{{< badge >}}
Certificate Authority
{{< /badge >}}
{{< badge >}}
Active Directory
{{< /badge >}}

We need Certificate Authority to secure LDAP , Remote Desktop & Remote PowerShell Connections.

> It's not recommended to install on Domain Controller in production.

First Install Certificate Authority:

{{< youtube  yZSju2EOPNY >}}

## Update Domain Controller Template [MS1]:

1. Open the Certification Authority management console with domain Admin user
2. Right-click Certificate Templates > Manage
3. In the Certificate Template Console, right-click the **Kerberos Authentication** template in the details pane and select Duplicate Template
4. On the **Compatibility** tab:
   - Clear the Show resulting changes check box
   - Select **Windows Server 2016 from the Certification Authority** list
   - Select **Windows 10 / Windows Server 2016 from the Certificate** Recipient list
5. On the **General** tab
   - Type **Domain Controller Authentication (Kerberos)** in Template display name
   - Adjust the validity and renewal period to meet your enterprise's needs
6. On the **Subject Name** tab:
   - Select the **Build from this Active Directory information** button if it isn't already selected
   - Select **None** from the Subject name format list
   - Select **DNS name** from the Include this information in alternate subject list
   - **Clear all other items**
7. On the **Cryptography** tab:
   - Select **Key Storage Provider** from the Provider Category list
   - Select **RSA** from the Algorithm name list
   - Type **2048** in the Minimum key size text box
   - Select **SHA256** from the Request hash list
8. Select the **Superseded Templates** tab. Select Add
   - From the Add Superseded Template dialog, select the **Domain Controller** certificate template and select OK > Add
   - From the Add Superseded Template dialog, select the **Domain Controller Authentication** certificate template and select OK
   - From the Add Superseded Template dialog, select the **Kerberos Authentication** certificate template and select OK
     -Add any other enterprise certificate templates that were previously configured for domain controllers to the Superseded Templates tab
9. Select OK and close the Certificate Templates console
10. Right-click Certificate Templates > New > Certificate Template to Issue
11. Select **Domain Controller Authentication (Kerberos)** & Ok

## Configure Group Policy to autoenroll certificates [MS2]:

1. Open the Group Policy Management console.
2. In the navigation pane, expand Forest: YourForestName, expand Domains, expand YourDomainName, expand Group Policy Objects, right-click **Default Domain Controllers Policy** GPO, and then click Edit.
3. In the navigation pane, expand the following path: **Computer Configuration** > **Policies** > **Windows Settings** > **Security Settings** > **Public Key Policies**.
4. Double-click **Certificate Services Client - Auto-Enrollment**.
5. In the **Properties** dialog box, change **Configuration Model** to **Enabled**.
6. Select both **Renew expired certificates, update pending certificates, and remove revoked certificates** and **Update certificates that use certificate templates**.
7. Click OK to save your changes. Computers apply the GPO and download the certificate the next time Group Policy is refreshed.
8. On Domain Controllers run command 'gpupdate /force' on administrative PowerShell or CMD.
9. In Certification Authority management console Check **Issued Certificates**.

[MS1]: https://learn.microsoft.com/en-us/windows/security/identity-protection/hello-for-business/hello-key-trust-validate-pki "Configure domain controller certificates"
[MS2]: https://learn.microsoft.com/en-us/windows/security/threat-protection/windows-firewall/configure-group-policy-to-autoenroll-and-deploy-certificates
