# TbUtil Version 1.3h

Released: 10 May 2021

Unsupported software, Copyright (C) Turbonomic 2018 .. 2021

## Starting points.

Refer to [README.md](../docs/README.md) for a high-level overview of TBUtil.

Refer to [QUICK-INSTALL.md](../docs/QUICK-INSTALL.md) for:

- Installation into Turbonimic V6 systems
- Installing directly onto the OVA of Turbonomic V8 systems
- Installing onto non-Turbonomic systems (such as your laptop).

Refer to [IWO.md](../docs/IWO.md) for information about installing TBUtil for use with IWO.

Refer to [K8S/INSTALL.md](../docs/K8S/INSTALL.md) for information on installing as a POD into a V8 system.

**Turbonomic employees**: Refer to the ["#tbutil" slack channel](https://turbonomic.slack.com/messages/CQCSKJN3Y) for updates, support and discussion.

## Downloads for OVA or Laptop installation

If using "curl" to download these files, please be sure to use both the "-O" and "-L" options, like this..

```
curl -O -L https://...........

```

And then check the md5sum afterwards.


| File Name | MD5 Checksum | Notes |
| --------- | ------------ | ----- |
| [tbutil-1_3h-linux.zip](https:/turbonomic/tbutil/releases/download/v1.3h/tbutil-1_3h-linux.zip) | 56ce28bce758dcadceefc3e1063589b4 | Download for x86_64 Linux |
| [tbutil-1_3h-mac.zip](https:/turbonomic/tbutil/releases/download/v1.3h/tbutil-1_3h-mac.zip) | cea2f088c32dec889ded5c7ed2bb7496 | Download for MAC (64 bit) |
| [tbutil-1_3h-windows.zip](https:/turbonomic/tbutil/releases/download/v1.3h/tbutil-1_3h-windows.zip) | 953cf964ba8692c5052bc6863fd1cf57 | Download for Windows (64 bit) |


## MarkDown Documents

| File Name | MD5 Checksum | Notes |
| --------- | ------------ | ----- |
| [API-REFERENCE.md](../docs/API-REFERENCE.md) | 3cd1df0883aa69201e07fbaea6c4b848 | REST API Reference (For Turbonomic 6.4.35) |
| [BUILDING.md](../docs/BUILDING.md) | 33d93f0f84d410f3d3957413a0ce2e93 | TButil 1.3h - Building from source |
| [EXAMPLES.md](../docs/EXAMPLES.md) | ce9a11f73dea14c09b65e0cd6447ec96 | TButil (VERSION) - Example scripts |
| [IWO.md](../docs/IWO.md) | 9f32e6a5f5863fa41d7175d71b059c11 | TBUtil 1.3h IWO Instance Credentials |
| [JS-ADDINS.md](../docs/JS-ADDINS.md) | 9e392ad0e7b54a8bd4dfabc9680727e4 | Add-ins available to TBUtil 1.3h JS formatters and TBScripts |
| [K8S/ACTIONSCRIPTS.md](../docs/K8S/ACTIONSCRIPTS.md) | 38d25cf258dcbe19f90a8e72e382fc93 | TBUtil Action Scripts Pod |
| [K8S/FLEXERA.md](../docs/K8S/FLEXERA.md) | 4c53c02027206da3ed648e17f4b1dcdd | TBUtil Flexera intergration POD |
| [K8S/HOTWARM.md](../docs/K8S/HOTWARM.md) | 08153916a2ce865dd00525180d2f5e35 | TBUtil Hot/Warm Standby Pod |
| [K8S/INSTALL.md](../docs/K8S/INSTALL.md) | 01c25d604a32d21a597824a61398da40 | Installing TBUtil PODs |
| [K8S/INTERNALS.md](../docs/K8S/INTERNALS.md) | ecbcb11f5c1328065e76cf2507a6fc7b | TBUtil POD Internals. |
| [PLUGINS.md](../docs/PLUGINS.md) | ed6652618f7b1bde8364cffe69e6565c | TB Script Plugins |
| [QUICK-INSTALL.md](../docs/QUICK-INSTALL.md) | e5fe93d43fdec8722b9af590e31e7237 | TBUtil 1.3h Quick Install Guide. |
| [README.md](../docs/README.md) | 44bd5642d8d2958371fd9aaab67825e7 | TButil 1.3h - Turbonomic Command-Line Utility |
| [RUNNING-PLANS.md](../docs/RUNNING-PLANS.md) | f6e688f29d478064d40cfd6c81809d23 | Running plans with tbutil 1.1n or later. |
| [SUBCOMMANDS.md](../docs/SUBCOMMANDS.md) | d6400e31b1dadd86d032a96013685a30 | TBUtil 1.3h Sub Commands |
| [apiv1-plugin.md](../docs/apiv1-plugin.md) | 27ed3c9d2cdbec08f81fd822bab8ea2a | API V1 plugin for TBUtil |
| [arangodb-plugin.md](../docs/arangodb-plugin.md) | ed02bf8b2f2ab2f1b3eff4c4cdeb17b0 | ArangoDB plugin for TBUtil |
| [excel-plugin.md](../docs/excel-plugin.md) | cf7b9afbdeb58f296f2c2f89b53f15f9 | EXCEL plugin for TBUtil |
| [mysql-plugin.md](../docs/mysql-plugin.md) | 664f70782384e739b12e0c1bb719974e | MySQL Plugin for TBUtil |
| [pdf-plugin.md](../docs/pdf-plugin.md) | 0b18fd231f07d65b33a7b302f2eb2f01 | PDF Plugin for TBUtil |
| [smtp-plugin.md](../docs/smtp-plugin.md) | 71acc2bf0783100e542fb9bb53e4e686 | SMTP Plugin for TBUtil |
| [sqlite3-plugin.md](../docs/sqlite3-plugin.md) | 610f5081ddba9f12306fe408dd5aa566 | SqLite3 Plugin for TBUtil |
| [sys-plugin.md](../docs/sys-plugin.md) | 27d8dc082c2bb0a34b519e4c3a6629ed | SYS Plugin for TBUtil |
| [vcenter-plugin.md](../docs/vcenter-plugin.md) | 51aa53e3156f2787b7e6cd90513c9e95 | vCenter plugin for TBUtil |
| [xml-plugin.md](../docs/xml-plugin.md) | 15ffd69581b8e391976330207a596d60 | XML Plugin for TBUtil |


## Open-source Licenses

TBUtil is built in the GO language from opensource components. Tbutil and the majority of its componets are licensed with the [Apache License V2.0 (Jan 2004)](../licenses/git.turbonomic.com/cs/turbo-util/LICENSE), but some use different licenses.

The component license files and source code (where the license mandates that it is provided) can be browsed [here](../licenses).
