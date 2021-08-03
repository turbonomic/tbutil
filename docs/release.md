# TbUtil Version 2.0e

Released: 2 Aug 2021

Unsupported software, Copyright (C) Turbonomic 2018 .. 2021

## Starting points.

Refer to [README.md](../docs/README.md) for a high-level overview of TBUtil.

Refer to [QUICK-INSTALL.md](../docs/QUICK-INSTALL.md) for:

- Installation into Turbonimic V6 systems
- Installing directly onto the OVA of Turbonomic V8 systems
- Installing onto non-Turbonomic systems (such as your laptop).

Refer to [K8S.md](../docs/K8S.md) for information on installing as a pod into a V8 system's Kubernetes namespace.

Refer to [IWO.md](../docs/IWO.md) for information about installing TBUtil for use with IWO.

**Turbonomic employees**: Refer to the ["#tbutil" slack channel](https://turbonomic.slack.com/messages/CQCSKJN3Y) for updates, support and discussion.

## TbUtil K8S PODs - Markdown Documents

| File Name | MD5 Checksum | Notes |
| --------- | ------------ | ----- |
| [ACTIONSCRIPTS.md](../docs/K8S/ACTIONSCRIPTS.md) | f1d14f26b957579e3536a78404672c00 | TBUtil Action Scripts Pod |
| [FLEXERA.md](../docs/K8S/FLEXERA.md) | 331d513fec3a8b08d4c0659cebf48d2a | TBUtil Flexera intergration POD |
| [HOTWARM.md](../docs/K8S/HOTWARM.md) | a8519eda4d8c942dc62dbe877773a083 | TBUtil Hot/Warm Standby Pod |
| [INSTALL.md](../docs/K8S/INSTALL.md) | 33fa644b857aaed095af3214f3f1c935 | Installing TBUtil PODs |
| [INTERNALS.md](../docs/K8S/INTERNALS.md) | ecbcb11f5c1328065e76cf2507a6fc7b | TBUtil POD Internals. |

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
| [tbutil-2_0e-linux.zip](https:/turbonomic/tbutil/releases/download/v2.0e/tbutil-2_0e-linux.zip) | 42bf2821f750875fc18bf8b07225776a | Download for x86_64 Linux |
| [tbutil-2_0e-mac.zip](https:/turbonomic/tbutil/releases/download/v2.0e/tbutil-2_0e-mac.zip) | 5099607f6cfb8657f256153ab102e1ea | Download for MAC (64 bit) |
| [tbutil-2_0e-windows.zip](https:/turbonomic/tbutil/releases/download/v2.0e/tbutil-2_0e-windows.zip) | 55094dff775128911362974169a52c7d | Download for Windows (64 bit) |

## Other MarkDown Documents

| File Name | MD5 Checksum | Notes |
| --------- | ------------ | ----- |
| [EXAMPLES.md](../docs/EXAMPLES.md) | 3a4044400965ce4fca4279f271e280d8 | TButil (VERSION) - Example scripts |
| [IWO.md](../docs/IWO.md) | e0410a82542bcc4fd41e7187ae6255ca | TBUtil 2.0e IWO Instance Credentials |
| [JS-ADDINS.md](../docs/JS-ADDINS.md) | 34c1eb00a2a2c97067813b138eeacd32 | Add-ins available to TBUtil 2.0e JS formatters and TBScripts |
| [PLUGINS.md](../docs/PLUGINS.md) | ed6652618f7b1bde8364cffe69e6565c | TB Script Plugins |
| [QUICK-INSTALL.md](../docs/QUICK-INSTALL.md) | b48aac32e122641d9cbf4ed383781cc7 | TBUtil 2.0e Quick Install Guide. |
| [README.md](../docs/README.md) | 8ab96ec6b74553f1be7ed4f8b770578e | TButil 2.0e - Turbonomic Command-Line Utility |
| [RUNNING-PLANS.md](../docs/RUNNING-PLANS.md) | f6e688f29d478064d40cfd6c81809d23 | Running plans with tbutil 1.1n or later. |
| [apiv1-plugin.md](../docs/apiv1-plugin.md) | 64621c70e36cad25c95d31b0775e7c2d | API V1 plugin for TBUtil |
| [arangodb-plugin.md](../docs/arangodb-plugin.md) | 0818044a7f82cf5ef4542bc458cc5c9d | ArangoDB plugin for TBUtil |
| [excel-plugin.md](../docs/excel-plugin.md) | 16840a8e061179604a9121ad042b8549 | EXCEL plugin for TBUtil |
| [mysql-plugin.md](../docs/mysql-plugin.md) | a24ae3e0e7d87329601e1aca305a671b | MySQL Plugin for TBUtil |
| [pdf-plugin.md](../docs/pdf-plugin.md) | b05688a37a126461c2fa3237107f5cff | PDF Plugin for TBUtil |
| [release.md](../docs/release.md) | d41d8cd98f00b204e9800998ecf8427e | <no value> |
| [smtp-plugin.md](../docs/smtp-plugin.md) | 20fe08d8818442ac9a1cd13e120b6fe3 | SMTP Plugin for TBUtil |
| [sqlite3-plugin.md](../docs/sqlite3-plugin.md) | 0723761207cc626e3eb6a5d61d489f40 | SqLite3 Plugin for TBUtil |
| [sys-plugin.md](../docs/sys-plugin.md) | bdb7612638df01977c69e33ef30770b4 | SYS Plugin for TBUtil |
| [vcenter-plugin.md](../docs/vcenter-plugin.md) | 2a4ec85b97455d26b8846ad707dee73f | vCenter plugin for TBUtil |
| [xml-plugin.md](../docs/xml-plugin.md) | 90173ac91b852ed969c32f97b1bd8099 | XML Plugin for TBUtil |


## Open-source Licenses

TBUtil is built in the GO language from opensource components. Tbutil and the majority of its componets are licensed with the [Apache License V2.0 (Jan 2004)](../licenses/git.turbonomic.com/cs/turbo-util/LICENSE), but some use different licenses.

The component license files and source code (where the license mandates that it is provided) can be browsed [here](../licenses).
