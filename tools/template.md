# TbUtil Version {{release}}

Released: {{ release_date }}

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


{{- if zipExists "*" }}

## Downloads for OVA or Laptop installation

| File Name | MD5 Checksum | Notes |
| --------- | ------------ | ----- |
| [tbutil-{{reltag}}-linux.zip]({{urlbase}}/tbutil-{{reltag}}-linux.zip) | {{ zipsum "linux" }} | Download for x86_64 Linux |
| [tbutil-{{reltag}}-mac.zip]({{urlbase}}/tbutil-{{reltag}}-mac.zip) | {{ zipsum "mac" }} | Download for MAC (64 bit) |
| [tbutil-{{reltag}}-windows.zip]({{urlbase}}/tbutil-{{reltag}}-windows.zip) | {{ zipsum "windows" }} | Download for Windows (64 bit) |

{{- end }}
{{/*- if tgzExists "*" }}

## Downloads for K8S POD installation

| File Name | MD5 Checksum | Notes |
| --------- | ------------ | ----- |
{{- if tgzExists "base" }}
| [tbutil-base-k8s-{{release}}.tgz]({{urlbase}}/tbutil-base-k8s-{{release}}.tgz) | {{ tgzsum "base" }} | Base POD from which all others are built. |
{{- end }}
{{- if tgzExists "actionscripts" }}
| [tbutil-actionscripts-k8s-{{release}}.tgz]({{urlbase}}/tbutil-actionscripts-k8s-{{release}}.tgz) | {{ tgzsum "actionscripts" }} | Template POD for action script implementation |
{{- end }}
{{- if tgzExists "flexera" }}
| [tbutil-flexera-k8s-{{release}}.tgz]({{urlbase}}/tbutil-flexera-k8s-{{release}}.tgz) | {{ tgzsum "flexera" }} | Flexera integration POD |
{{- end }}
{{- if tgzExists "hotwarm" }}
| [tbutil-hotwarm-k8s-{{release}}.tgz]({{urlbase}}/tbutil-hotwarm-k8s-{{release}}.tgz) | {{ tgzsum "hotwarm" }} | Turbonomic Hot/Warm standby POD. |
{{- end }}
{{- if tgzExists "full" }}
| [tbutil-full-k8s-{{release}}.tgz]({{urlbase}}/tbutil-full-k8s-{{release}}.tgz) | {{ tgzsum "full" }} | POD containing all TbUtil K8S POD features in one. |
{{- end }}

{{- end */}}

{{- if mdExists "*" }}

## MarkDown Documents

| File Name | MD5 Checksum | Notes |
| --------- | ------------ | ----- |
{{- range getMdNames }}
| [{{ . }}](../docs/{{.}}) | {{ mdsum . }} | {{ getMdNote . }} |
{{- end }}
{{- end }}

{{- if pdfExists "*" }}

## PDF Documents

| File Name | MD5 Checksum | Notes |
| --------- | ------------ | ----- |
{{- range getPdfNames }}
| [{{ . }}]({{urlbase}}/{{.}}) | {{ pdfsum . }} | {{ getPdfNote . }} |
{{- end }}
{{- end }}
