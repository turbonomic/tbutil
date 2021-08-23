# TbUtil Version 2.0g

Released: 23 Aug 2021

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
| [ACTIONSCRIPTS.md](../docs/K8S/ACTIONSCRIPTS.md) | a6f3711d342828c4daf6de9acb44f632 | TBUtil Action Scripts Pod |
| [CHROMEDP.md](../docs/K8S/CHROMEDP.md) | 66044ee0107f2e7b80f1842e46566291 | TBUtil ChromeDP integration pod. |
| [FLEXERA.md](../docs/K8S/FLEXERA.md) | 144f89e42c50f44bc5a2de8a2dc30d2f | TBUtil Flexera intergration Pod |
| [HOTWARM.md](../docs/K8S/HOTWARM.md) | 01b88463646699edc47bafbc0a9b1e27 | TBUtil Hot/Warm Standby Pod |
| [INSTALL.md](../docs/K8S/INSTALL.md) | a4b75f477cdc255a31e7f824dca68595 | Installing TBUtil PODs |
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
| [tbutil-2_0g-linux.zip](https:/turbonomic/tbutil/releases/download/v2.0g/tbutil-2_0g-linux.zip) | 02ca49c1ccaefb56cdc8546b5ec7e3e4 | Download for x86_64 Linux |
| [tbutil-2_0g-mac.zip](https:/turbonomic/tbutil/releases/download/v2.0g/tbutil-2_0g-mac.zip) | 78c9a37f2ae0aff74cef96fea9b3e04f | Download for MAC (64 bit) |
| [tbutil-2_0g-windows.zip](https:/turbonomic/tbutil/releases/download/v2.0g/tbutil-2_0g-windows.zip) | 46f57f3b707a609cada08f98ac92ed2f | Download for Windows (64 bit) |

## Other MarkDown Documents

| File Name | MD5 Checksum | Notes |
| --------- | ------------ | ----- |
| [EXAMPLES.md](../docs/EXAMPLES.md) | 3a4044400965ce4fca4279f271e280d8 | TButil (VERSION) - Example scripts |
| [IWO.md](../docs/IWO.md) | 3c4b25b77f1d56b376e7ffc9d46fb54d | TBUtil 2.0g IWO Instance Credentials |
| [JS-ADDINS.md](../docs/JS-ADDINS.md) | 61e7595ef015c7d9b1d6878cfc4130f3 | Add-ins available to TBUtil 2.0g JS formatters and TBScripts |
| [PLUGINS.md](../docs/PLUGINS.md) | ed6652618f7b1bde8364cffe69e6565c | TB Script Plugins |
| [QUICK-INSTALL.md](../docs/QUICK-INSTALL.md) | 4d56f448a937b842836c469d39c98217 | TBUtil 2.0g Quick Install Guide. |
| [README.md](../docs/README.md) | 15ba02ec72d9396574aed43b3c343feb | TButil 2.0g - Turbonomic Command-Line Utility |
| [RUNNING-PLANS.md](../docs/RUNNING-PLANS.md) | f6e688f29d478064d40cfd6c81809d23 | Running plans with tbutil 1.1n or later. |
| [apiv1-plugin.md](../docs/apiv1-plugin.md) | d08527538dad5ff9fb626b38afec03da | API V1 plugin for TBUtil |
| [arangodb-plugin.md](../docs/arangodb-plugin.md) | 0818044a7f82cf5ef4542bc458cc5c9d | ArangoDB plugin for TBUtil |
| [chromedp-plugin.md](../docs/chromedp-plugin.md) | b18682a1ae29a655e225a5228cbe5544 | ChromeDP Plugin for TBUtil |
| [excel-plugin.md](../docs/excel-plugin.md) | 16840a8e061179604a9121ad042b8549 | EXCEL plugin for TBUtil |
| [kafka-plugin.md](../docs/kafka-plugin.md) | b0af359a196945b3c38b24a98b9cf0bc | Kafka plugin for TBUtil |
| [mysql-plugin.md](../docs/mysql-plugin.md) | 20e993f0ab3139da3bcd0d7dd6a0e34c | MySQL Plugin for TBUtil |
| [pdf-plugin.md](../docs/pdf-plugin.md) | b05688a37a126461c2fa3237107f5cff | PDF Plugin for TBUtil |
| [release.md](../docs/release.md) | d41d8cd98f00b204e9800998ecf8427e | <no value> |
| [smtp-plugin.md](../docs/smtp-plugin.md) | d91866f80dbb736aa02106aa6e1fef76 | SMTP Plugin for TBUtil |
| [sqlite3-plugin.md](../docs/sqlite3-plugin.md) | 2077a643e0a871d1e87c00847129f824 | SqLite3 Plugin for TBUtil |
| [sys-plugin.md](../docs/sys-plugin.md) | fbe724697242912c8f7d9e1360560b71 | SYS Plugin for TBUtil |
| [vcenter-plugin.md](../docs/vcenter-plugin.md) | 2a4ec85b97455d26b8846ad707dee73f | vCenter plugin for TBUtil |
| [xml-plugin.md](../docs/xml-plugin.md) | 90173ac91b852ed969c32f97b1bd8099 | XML Plugin for TBUtil |


## Open-source Licenses

TBUtil is built in the GO language from opensource components. Tbutil and the majority of its componets are licensed with the [Apache License V2.0 (Jan 2004)](../licenses/git.turbonomic.com/cs/turbo-util/LICENSE), but some use different licenses.

The component license files and source code (where the license mandates that it is provided) can be browsed [here](../licenses).
