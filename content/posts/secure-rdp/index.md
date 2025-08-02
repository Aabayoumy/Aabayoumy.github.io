+++
title = "Secure RDP with Group Policy and a Custom Certificate Template"
date = 2025-07-14T12:35:03+03:00
draft = true
author = "Ahmed Bayoumy"
tags = ["RDP", "Group Policy", "Active Directory", "Security"]
categories = ["Active Directory"]
+++

## Introduction

Remote Desktop Protocol (RDP) is a fundamental tool for administering Windows servers. However, default RDP settings can be vulnerable to attacks. To enhance security, it's essential to configure RDP to use strong authentication and encryption. This guide details how to secure RDP using a custom certificate template and Group Policy within an Active Directory environment.

## Step 1: Create a Custom Certificate Template for RDP

First, we need a certificate template to issue certificates to our servers for RDP authentication.

1.  **Open the Certificate Authority Console:** On your CA server, open the `certsrv.msc` console.
2.  **Manage Templates:** Right-click on **Certificate Templates** and select **Manage**.
3.  **Duplicate Template:** Right-click the **Computer** template and select **Duplicate Template**.
4.  **Configure Template Properties:**
    *   **General Tab:** Name the template something descriptive, like `RDP SSL`, and define a validity period that aligns with your organization's security policies.
    *   **Subject Name Tab:** Choose **Build from this Active Directory information** and select `DNS name` as the subject name format.
    *   **Cryptography Tab:** Set a strong key size, such as `2048` bits or higher.
    *   **Extensions Tab:**
        *   Select **Application Policies** and click **Edit**.
        *   Ensure both **Client Authentication** and **Server Authentication** are present.
    *   **Security Tab:**
        *   Add the **Domain Computers** group and grant them **Read**, **Enroll**, and **Auto Enroll** permissions.
5.  **Issue the Template:**
    *   Return to the Certificate Authority console, right-click **Certificate Templates**, select **New**, and then **Certificate Template to Issue**.
    *   Select the `RDP SSL` template you just created.

## Step 2: Configure Certificate Auto-Enrollment via Group Policy

Next, we'll configure domain computers to automatically request and manage these certificates.

1.  **Open Group Policy Management:** Launch `gpmc.msc`.
2.  **Create or Edit a GPO:** Either create a new GPO or modify an existing one that applies to the OU containing the computers you wish to configure.
3.  **Configure Auto-Enrollment:**
    *   Navigate to `Computer Configuration -> Policies -> Windows Settings -> Security Settings -> Public Key Policies`.
    *   Double-click **Certificate Services Client - Auto-Enrollment**.
    *   Set the **Configuration Model** to **Enabled**.
    *   Enable `Renew expired certificates...` and `Update certificates that use certificate templates`.

## Step 3: Configure RDP and Firewall using Group Policy

Finally, we'll enforce secure RDP settings and configure the necessary firewall rules using Group Policy.

1.  **Enforce Secure RDP Settings:**
    In your GPO, go to `Computer Configuration -> Policies -> Administrative Templates -> Windows Components -> Remote Desktop Services -> Remote Desktop Session Host -> Security`.

    *   **Require use of specific security layer for remote (RDP) connections:**
        *   Enable this policy and select **SSL (TLS 1.0)** from the dropdown.
    *   **Set client connection encryption level:**
        *   Enable this policy and set the **Encryption Level** to **High Level**.
    *   **Require user authentication for remote connections by using Network Level Authentication (NLA):**
        *   Enable this policy to ensure NLA is required.
    *   **Server authentication certificate template:**
        *   Enable this policy and enter the name of the certificate template you created, `RDP SSL`.

2.  **Configure Firewall Rules:**
    In the same GPO, navigate to `Computer Configuration -> Policies -> Windows Settings -> Security Settings -> Windows Firewall with Advanced Security -> Inbound Rules`.

    *   **Allow RDP (Port 3389):**
        *   Right-click **Inbound Rules** and select **New Rule...**.
        *   Choose **Port**, then click **Next**.
        *   Select **TCP** and specify port `3389`. Click **Next**.
        *   Select **Allow the connection**. Click **Next**.
        *   Select the profiles (Domain, Private, Public) that align with your security policy. Click **Next**.
        *   Name the rule, for example, `Allow RDP (3389)`. Click **Finish**.

## Conclusion

By implementing these Group Policy settings, your servers will automatically enroll for RDP certificates and enforce secure communication settings. This greatly reduces the risk of unauthorized access and eavesdropping. Always verify the RDP connection is secure by checking the certificate information in the RDP client after connecting.

***Disclaimer: This post was created with the assistance of Google's Gemini.***
