# TbUtil Version 2.0c

Released: 22 Jul 2021

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
| [tbutil-2_0c-linux.zip](https:/turbonomic/tbutil/releases/download/v2.0c/tbutil-2_0c-linux.zip) | 3ee876e170e90ccf8bfe1d0615967660 | Download for x86_64 Linux |
| [tbutil-2_0c-mac.zip](https:/turbonomic/tbutil/releases/download/v2.0c/tbutil-2_0c-mac.zip) | 704ab01c6cc6ebb4936f2b94dcfc5c68 | Download for MAC (64 bit) |
| [tbutil-2_0c-windows.zip](https:/turbonomic/tbutil/releases/download/v2.0c/tbutil-2_0c-windows.zip) | 8e5c07428c7df9576fea0fb66487c4aa | Download for Windows (64 bit) |

## Downloads for K8S POD installation

Please refer to [K8S/INSTALL.md](../docs/K8S/INSTALL.md) for information on downloading and installing a TBUtil POD into a V8 system.

## MarkDown Documents

| File Name | MD5 Checksum | Notes |
| --------- | ------------ | ----- |
| [BUILDING.md](../docs/BUILDING.md) | ebf98032f19dbd1aea1913993e8e8185 | TButil 2.0c - Building from source |
| [EXAMPLES.md](../docs/EXAMPLES.md) | 3a4044400965ce4fca4279f271e280d8 | TButil (VERSION) - Example scripts |
| [IWO.md](../docs/IWO.md) | 0f0224b79cb5ac8472f3ee7621ae7b1e | TBUtil 2.0c IWO Instance Credentials |
| [JS-ADDINS.md](../docs/JS-ADDINS.md) | 11ba5d2abd880154c7cd86558373ddc5 | Add-ins available to TBUtil 2.0c JS formatters and TBScripts |
| [K8S/ACTIONSCRIPTS.md](../docs/K8S/ACTIONSCRIPTS.md) | 88f7fbdfb90d4d688a42766daaf6edbd | TBUtil Action Scripts Pod |
| [K8S/FLEXERA.md](../docs/K8S/FLEXERA.md) | 6d50d030c5754b56979092619a2cdb5e | TBUtil Flexera intergration POD |
| [K8S/HOTWARM.md](../docs/K8S/HOTWARM.md) | 34796930ebd85b76622e9c8415d3435f | TBUtil Hot/Warm Standby Pod |
| [K8S/INSTALL.md](../docs/K8S/INSTALL.md) | 73b2a732f60dcb488add8d30fc32b708 | Installing TBUtil PODs |
| [K8S/INTERNALS.md](../docs/K8S/INTERNALS.md) | ecbcb11f5c1328065e76cf2507a6fc7b | TBUtil POD Internals. |
| [PLUGINS.md](../docs/PLUGINS.md) | ed6652618f7b1bde8364cffe69e6565c | TB Script Plugins |
| [QUICK-INSTALL.md](../docs/QUICK-INSTALL.md) | 9195fe499cf1aae296abaeb59277ffce | TBUtil 2.0c Quick Install Guide. |
| [README.md](../docs/README.md) | e54816aa531dff607b3a647bd37dc6fc | TButil 2.0c - Turbonomic Command-Line Utility |
| [RUNNING-PLANS.md](../docs/RUNNING-PLANS.md) | f6e688f29d478064d40cfd6c81809d23 | Running plans with tbutil 1.1n or later. |
| [SUBCOMMANDS.md](../docs/SUBCOMMANDS.md) | 13c2a3784821dd1c645a19a32c4d42b8 | TBUtil 2.0c Sub Commands |
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
