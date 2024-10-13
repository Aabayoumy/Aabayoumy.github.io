---
title: "PowerShell Profile"
date: 2024-10-13
draft: false
description: "PowerShell Profile & Windows Terminal Settings"
tags: ["PowerShell"]
categories: ["Tools"]
---

{{< youtube  ZAvacWsiKJw >}}

## Install PowerShell 7
From [Microsoft Documentation](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-windows?view=powershell-7.4), or using winget:
```powershell 
winget install --id Microsoft.PowerShell --source winget
```
If it's new installed system I like to install all my tools at once with [winutil](https://github.com/ChrisTitusTech/winutil)
```powershell
powershell -Command "iwr -useb https://christitus.com/win | iex" 
```

## [Install my profile](https://github.com/Aabayoumy/PS-Profile)
Run powershell 7 As Administrator then:
```powershell
pwsh -ExecutionPolicy Bypass -NoProfile -c "iwr https://raw.githubusercontent.com/Aabayoumy/PS-Profile/main/Setup.ps1 | iex"
```

## Customize Windows Terminal
Open Windows terminal Settings.
Set font to one of nerd fonts.
Add color Scheme https://github.com/VictorPLopes/OneDark-Pro-Windows-Terminal or https://github.com/catppuccin/windows-terminal, https://windowsterminalthemes.dev/. 
Save the settings and restart Windows Terminal to apply the changes.

My Terminal Settings:
```json
{
    "$help": "https://aka.ms/terminal-documentation",
    "$schema": "https://aka.ms/terminal-profiles-schema",
    "actions": 
    [
        {
            "command": 
            {
                "action": "copy",
                "singleLine": false
            },
            "id": "User.copy.644BA8F2",
            "keys": "ctrl+c"
        },
        {
            "command": "paste",
            "id": "User.paste",
            "keys": "ctrl+v"
        },
        {
            "command": "find",
            "id": "User.find",
            "keys": "ctrl+shift+f"
        },
        {
            "command": 
            {
                "action": "splitPane",
                "split": "auto",
                "splitMode": "duplicate"
            },
            "id": "User.splitPane.A6751878",
            "keys": "alt+shift+d"
        }
    ],
    "copyFormatting": "none",
    "copyOnSelect": false,
    "defaultProfile": "{574e775e-4f2a-5b96-ac1e-a2962a402336}",
    "newTabMenu": 
    [
        {
            "type": "remainingProfiles"
        }
    ],
    "profiles": 
    {
        "defaults": 
        {
            "colorScheme": "One Dark Pro",
            "cursorShape": "filledBox",
            "font": 
            {
                "cellHeight": "1.4",
                "face": "JetBrainsMono Nerd Font",
                "size": 12
            },
            "opacity": 80,
            "scrollbarState": "hidden",
            "useAcrylic": true
        },
        "list": 
        [
            {
                "commandline": "%SystemRoot%\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
                "guid": "{61c54bbd-c2c6-5271-96e7-009a87ff44bf}",
                "hidden": false,
                "name": "Windows PowerShell"
            },
            {
                "commandline": "%SystemRoot%\\System32\\cmd.exe",
                "guid": "{0caa0dad-35be-5f56-a8ff-afceeeaa6101}",
                "hidden": false,
                "name": "Command Prompt"
            },
            {
                "guid": "{574e775e-4f2a-5b96-ac1e-a2962a402336}",
                "hidden": false,
                "name": "PowerShell",
                "source": "Windows.Terminal.PowershellCore"
            },
            {
                "guid": "{46ca431a-3a87-5fb3-83cd-11ececc031d2}",
                "hidden": false,
                "name": "kali-linux",
                "source": "Windows.Terminal.Wsl"
            },
            {
                "guid": "{b453ae62-4e3d-5e58-b989-0a998ec441b8}",
                "hidden": false,
                "name": "Azure Cloud Shell",
                "source": "Windows.Terminal.Azure"
            },
            {
                "guid": "{2ece5bfe-50ed-5f3a-ab87-5cd4baafed2b}",
                "hidden": false,
                "name": "Git Bash",
                "source": "Git"
            }
        ]
    },
    "schemes": 
    [
        {
            "background": "#282C34",
            "black": "#3F4451",
            "blue": "#4AA5F0",
            "brightBlack": "#4F5666",
            "brightBlue": "#4DC4FF",
            "brightCyan": "#4CD1E0",
            "brightGreen": "#A5E075",
            "brightPurple": "#DE73FF",
            "brightRed": "#FF616E",
            "brightWhite": "#D7DAE0",
            "brightYellow": "#F0A45D",
            "cursorColor": "#ABB2BF",
            "cyan": "#42B3C2",
            "foreground": "#ABB2BF",
            "green": "#8CC265",
            "name": "One Dark Pro",
            "purple": "#C162DE",
            "red": "#E05561",
            "selectionBackground": "#FFFFFF",
            "white": "#E6E6E6",
            "yellow": "#D18F52"
        },
        {
            "name": "Catppuccin Mocha",
            "cursorColor": "#F5E0DC",
            "selectionBackground": "#585B70",
            "background": "#1E1E2E",
            "foreground": "#CDD6F4",
            "black": "#45475A",
            "red": "#F38BA8",
            "green": "#A6E3A1",
            "yellow": "#F9E2AF",
            "blue": "#89B4FA",
            "purple": "#F5C2E7",
            "cyan": "#94E2D5",
            "white": "#BAC2DE",
            "brightBlack": "#585B70",
            "brightRed": "#F38BA8",
            "brightGreen": "#A6E3A1",
            "brightYellow": "#F9E2AF",
            "brightBlue": "#89B4FA",
            "brightPurple": "#F5C2E7",
            "brightCyan": "#94E2D5",
            "brightWhite": "#A6ADC8"
        }
    ],
    "themes": []
}
```


