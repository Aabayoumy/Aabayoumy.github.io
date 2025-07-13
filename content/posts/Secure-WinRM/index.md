+++
title = "Secure WinRM with Group Policy and a Custom Certificate Template"
date = 2025-07-13T12:35:03+03:00
draft = false
author = "Ahmed Bayoumy"
tags = ["WinRM", "Group Policy", "Active Directory", "Security"]
categories = ["Active Directory"]
+++

## Introduction

Windows Remote Management (WinRM) is a powerful tool for managing Windows servers remotely, but by default, it uses unencrypted communication. For a secure environment, it's crucial to configure WinRM to use HTTPS. This post will guide you through securing WinRM using a custom certificate template and Group Policy in an Active Directory environment.

## Step 1: Create a Custom Certificate Template

First, we need a certificate template for our WinRM servers.

1.  **Open the Certificate Authority Console:** On your CA server, open the `certsrv.msc` console.
2.  **Manage Templates:** Right-click on **Certificate Templates** and select **Manage**.
3.  **Duplicate Template:** Right-click the **Computer** template and select **Duplicate Template**.
4.  **Configure Template Properties:**
    *   **General Tab:** Give the template a descriptive name like `WinRM SSL` and set a validity period that aligns with your security policies.
    *   **Subject Name Tab:** Select **Build from this Active Directory information** and choose `DNS name` for the subject name format.
    *   **Cryptography Tab:** Ensure the key size is adequate (e.g., `2048` bits or higher).
    *   **Extensions Tab:**
        *   Select **Application Policies** and click **Edit**.
        *   Remove **Client Authentication** and ensure **Server Authentication** is present.
    *   **Security Tab:**
        *   Add the **Domain Computers** group and grant them **Read** and **Enroll** permissions.
5.  **Issue the Template:**
    *   Back in the Certificate Authority console, right-click **Certificate Templates**, go to **New**, and select **Certificate Template to Issue**.
    *   Choose the `WinRM SSL` template you just created.

## Step 2: Configure Certificate Auto-Enrollment via Group Policy

Now, let's configure our domain computers to automatically request and renew this certificate.

1.  **Open Group Policy Management:** Open `gpmc.msc`.
2.  **Create or Edit a GPO:** Create a new GPO or edit an existing one that is linked to the Organizational Unit (OU) containing the computers you want to configure.
3.  **Configure Auto-Enrollment:**
    *   Navigate to `Computer Configuration -> Policies -> Windows Settings -> Security Settings -> Public Key Policies`.
    *   Double-click on **Certificate Services Client - Auto-Enrollment**.
    *   Set the **Configuration Model** to **Enabled**.
    *   Check the boxes for `Renew expired certificates...` and `Update certificates that use certificate templates`.

## Step 3: Configure WinRM HTTPS Listener with a Startup Script

The final step is to configure the WinRM listener on each machine. A startup script deployed via GPO is an effective way to do this.

1.  **Create the PowerShell Script:**
    Create a PowerShell script named `Configure-WinRMHTTPS.ps1` with the following content. This script finds the correct certificate and creates the HTTPS listener if it doesn't exist.

    ```powershell
    # Get the FQDN of the computer
    $fqdn = (Get-WmiObject Win32_ComputerSystem).DNSHostName + "." + (Get-WmiObject Win32_ComputerSystem).Domain

    # Find the certificate issued from our template
    $cert = Get-ChildItem -Path Cert:\LocalMachine\My | Where-Object {
        $_.Subject -match "CN=$fqdn" -and $_.Extensions.EnhancedKeyUsage -match "Server Authentication"
    } | Select-Object -First 1

    if ($cert) {
        $thumbprint = $cert.Thumbprint
        $listener = Get-Item -Path "WSMan:\localhost\Listener\*" | Where-Object { $_.Keys -contains "Transport=HTTPS" }

        if (-not $listener) {
            New-Item -Path "WSMan:\localhost\Listener" -Transport HTTPS -Address * -CertificateThumbprint $thumbprint -Force
        }
    }
    ```

2.  **Deploy the Script:**
    *   Save the script to a network location that domain computers have read access to, such as the `NETLOGON` share on a domain controller.
    *   In your GPO, navigate to `Computer Configuration -> Policies -> Windows Settings -> Scripts (Startup/Shutdown)`.
    *   Double-click **Startup**, go to the **PowerShell Scripts** tab, and add your `Configure-WinRMHTTPS.ps1` script.

3.  **Enable WinRM Service:**
    *   In the same GPO, navigate to `Computer Configuration -> Policies -> Administrative Templates -> Windows Components -> Windows Remote Management (WinRM) -> WinRM Service`.
    *   Enable the **Allow remote server management through WinRM** policy. For enhanced security, you can specify IP address ranges in the IPv4 and IPv6 filters instead of using `*`.

## Conclusion

After applying the GPO, your computers will automatically enroll for the WinRM certificate and configure a secure HTTPS listener. This significantly improves the security of your remote management infrastructure. Remember to test the connection using `Test-WSMan` from another machine, ensuring you use the `-UseSSL` switch.