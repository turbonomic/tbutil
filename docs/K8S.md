# TbUtil Version 2.0f - Kubernetes POD deployments

Released: 17 Aug 2021

Unsupported software, Copyright (C) Turbonomic 2018 .. 2021

---

When running TbUtil in a Turbonomic V8 deployment, we generally recommend deploying as a pod in you Turbonomic instance's Kubernetes name space. Some use cases actually mandate this approach.

A number of pre-defined "flavours" of container are made available which you can either use as-is, or as the base image for a pod of your own design.

The following documents are available on this subject ...

| File Name | MD5 Checksum | Notes |
| --------- | ------------ | ----- |
| [ACTIONSCRIPTS.md](../docs/K8S/ACTIONSCRIPTS.md) | 9927c4a55d27e9f6d6a49c1328bff713 | TBUtil Action Scripts Pod |
| [CHROMEDP.md](../docs/K8S/CHROMEDP.md) | c1ed21390b1354a5c240c0cfb541cf29 | TBUtil ChromeDP integration pod. |
| [FLEXERA.md](../docs/K8S/FLEXERA.md) | 1ec3f034bb385b11da3c1b742e925491 | TBUtil Flexera intergration Pod |
| [HOTWARM.md](../docs/K8S/HOTWARM.md) | dfc1cb0ec2f7f2deb48203de28c80431 | TBUtil Hot/Warm Standby Pod |
| [INSTALL.md](../docs/K8S/INSTALL.md) | 032e2eaff5875f3a7c300f569c4b0a60 | Installing TBUtil PODs |
| [INTERNALS.md](../docs/K8S/INTERNALS.md) | ecbcb11f5c1328065e76cf2507a6fc7b | TBUtil POD Internals. |
