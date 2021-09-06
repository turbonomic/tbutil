# TbUtil Version 2.0h - Kubernetes POD deployments

Released: 6 Sep 2021

Unsupported software, Copyright (C) Turbonomic 2018 .. 2021

---

When running TbUtil in a Turbonomic V8 deployment, we generally recommend deploying as a pod in you Turbonomic instance's Kubernetes name space. Some use cases actually mandate this approach.

A number of pre-defined "flavours" of container are made available which you can either use as-is, or as the base image for a pod of your own design.

The following documents are available on this subject ...

| File Name | MD5 Checksum | Notes |
| --------- | ------------ | ----- |
| [ACTIONSCRIPTS.md](../docs/K8S/ACTIONSCRIPTS.md) | 01d80eb381da76c3d1bc1bf06d4cd52b | TBUtil Action Scripts Pod |
| [CHROMEDP.md](../docs/K8S/CHROMEDP.md) | 47ccf0f2f087cc7f739b29eaa405deb4 | TBUtil ChromeDP integration pod. |
| [FLEXERA.md](../docs/K8S/FLEXERA.md) | 8c6cf59b09494857cf1235c9a1f80455 | TBUtil Flexera intergration Pod |
| [HOTWARM.md](../docs/K8S/HOTWARM.md) | 3440e7da9cb7b04a50117a1e62995703 | TBUtil Hot/Warm Standby Pod |
| [INSTALL.md](../docs/K8S/INSTALL.md) | da3fb0de7d00e7daaa689ef5b5cb21bc | Installing TBUtil PODs |
| [INTERNALS.md](../docs/K8S/INTERNALS.md) | ecbcb11f5c1328065e76cf2507a6fc7b | TBUtil POD Internals. |
