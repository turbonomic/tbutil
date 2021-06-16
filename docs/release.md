# TbUtil Version 2.0a

Released: 16 Jun 2021

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

Please note: `github` uses URL redirection for released files (such as those listed in the table below). This means that if you download using the `curl` Linux command, you need to use the options "-O" and "-L" (not just "-O") when downloading. For example:

```bash
curl -O -L https://...........
```

**ALWAYS** check the MD5 sum of any files downloaded before attempting to use them. You can do this by running the `md5sum` command and comparing the hex string it displays against the value shown for the relevant file in the table below. The Linux command for this is..

```base
md5sum FILE-NAME-GOES-HERE
```

| File Name | MD5 Checksum | Notes |
| --------- | ------------ | ----- |
| [tbutil-2_0a-linux.zip](https:/turbonomic/tbutil/releases/download/v2.0a/tbutil-2_0a-linux.zip) | 9a8219d498c116f1718596e628615087 | Download for x86_64 Linux |
| [tbutil-2_0a-mac.zip](https:/turbonomic/tbutil/releases/download/v2.0a/tbutil-2_0a-mac.zip) | 2f8b31b526e3207520ba4bdeb4c14e9e | Download for MAC (64 bit) |
| [tbutil-2_0a-windows.zip](https:/turbonomic/tbutil/releases/download/v2.0a/tbutil-2_0a-windows.zip) | b1bddde67ea2c80794976766c354dd3f | Download for Windows (64 bit) |

## Downloads for K8S POD installation

Please refer to [K8S/INSTALL.md](../docs/K8S/INSTALL.md) for information on downloading and installing a TBUtil POD into a V8 system.

## MarkDown Documents

| File Name | MD5 Checksum | Notes |
| --------- | ------------ | ----- |
| [BUILDING.md](../docs/BUILDING.md) | 5b38824f19e063050bc8cb372a68cf11 | TButil 2.0a - Building from source |
| [EXAMPLES.md](../docs/EXAMPLES.md) | 3a4044400965ce4fca4279f271e280d8 | TButil (VERSION) - Example scripts |
| [IWO.md](../docs/IWO.md) | 53856a6dd62598adae436f0ee2d88d67 | TBUtil 2.0a IWO Instance Credentials |
| [JS-ADDINS.md](../docs/JS-ADDINS.md) | dbceabcd195b8dfd43f2cfc8509fc202 | Add-ins available to TBUtil 2.0a JS formatters and TBScripts |
| [K8S/ACTIONSCRIPTS.md](../docs/K8S/ACTIONSCRIPTS.md) | 55542e37fd40f06da7aebc2b3eb8ba17 | TBUtil Action Scripts Pod |
| [K8S/FLEXERA.md](../docs/K8S/FLEXERA.md) | 2b30780d2581e3abc978b1931ee5ba72 | TBUtil Flexera intergration POD |
| [K8S/HOTWARM.md](../docs/K8S/HOTWARM.md) | acddda1225cf7632491709b9881ef9f5 | TBUtil Hot/Warm Standby Pod |
| [K8S/INSTALL.md](../docs/K8S/INSTALL.md) | 9e2831edf2fd8d9f16c8c7c4bbfb09f3 | Installing TBUtil PODs |
| [K8S/INTERNALS.md](../docs/K8S/INTERNALS.md) | ecbcb11f5c1328065e76cf2507a6fc7b | TBUtil POD Internals. |
| [PLUGINS.md](../docs/PLUGINS.md) | ed6652618f7b1bde8364cffe69e6565c | TB Script Plugins |
| [QUICK-INSTALL.md](../docs/QUICK-INSTALL.md) | e6eeb3914b8566282492b80ddd9f8fbb | TBUtil 2.0a Quick Install Guide. |
| [README.md](../docs/README.md) | 6469e44da748f9ed64622a6024f43953 | TButil 2.0a - Turbonomic Command-Line Utility |
| [RUNNING-PLANS.md](../docs/RUNNING-PLANS.md) | f6e688f29d478064d40cfd6c81809d23 | Running plans with tbutil 1.1n or later. |
| [SUBCOMMANDS.md](../docs/SUBCOMMANDS.md) | 15007d3040768451f7248aa1f8a869ba | TBUtil 2.0a Sub Commands |
| [apiv1-plugin.md](../docs/apiv1-plugin.md) | 64621c70e36cad25c95d31b0775e7c2d | API V1 plugin for TBUtil |
| [arangodb-plugin.md](../docs/arangodb-plugin.md) | 0818044a7f82cf5ef4542bc458cc5c9d | ArangoDB plugin for TBUtil |
| [excel-plugin.md](../docs/excel-plugin.md) | 16840a8e061179604a9121ad042b8549 | EXCEL plugin for TBUtil |
| [mysql-plugin.md](../docs/mysql-plugin.md) | a24ae3e0e7d87329601e1aca305a671b | MySQL Plugin for TBUtil |
| [pdf-plugin.md](../docs/pdf-plugin.md) | b05688a37a126461c2fa3237107f5cff | PDF Plugin for TBUtil |
| [smtp-plugin.md](../docs/smtp-plugin.md) | 20fe08d8818442ac9a1cd13e120b6fe3 | SMTP Plugin for TBUtil |
| [sqlite3-plugin.md](../docs/sqlite3-plugin.md) | 0723761207cc626e3eb6a5d61d489f40 | SqLite3 Plugin for TBUtil |
| [sys-plugin.md](../docs/sys-plugin.md) | bdb7612638df01977c69e33ef30770b4 | SYS Plugin for TBUtil |
| [vcenter-plugin.md](../docs/vcenter-plugin.md) | 2a4ec85b97455d26b8846ad707dee73f | vCenter plugin for TBUtil |
| [xml-plugin.md](../docs/xml-plugin.md) | 90173ac91b852ed969c32f97b1bd8099 | XML Plugin for TBUtil |


## Open-source Licenses

TBUtil is built in the GO language from opensource components. Tbutil and the majority of its componets are licensed with the [Apache License V2.0 (Jan 2004)](../licenses/git.turbonomic.com/cs/turbo-util/LICENSE), but some use different licenses.

The component license files and source code (where the license mandates that it is provided) can be browsed [here](../licenses).
