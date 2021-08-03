# TbUtil Version {{release}} - Kubernetes POD deployments

Released: {{ release_date }}

Unsupported software, Copyright (C) Turbonomic 2018 .. 2021

---

When running TbUtil in a Turbonomic V8 deployment, we generally recommend deploying as a pod in you Turbonomic instance's Kubernetes name space. Some use cases actually mandate this approach.

A number of pre-defined "flavours" of container are made available which you can either use as-is, or as the base image for a pod of your own design.

The following documents are available on this subject ...

| File Name | MD5 Checksum | Notes |
| --------- | ------------ | ----- |
{{- range getK8SMdNames }}
| [{{ . }}](../docs/K8S/{{.}}) | {{ mdsum (strcat "K8S/" .) }} | {{ getMdNote (strcat "K8S/" .) }} |
{{- end }}
