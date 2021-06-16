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
| [tbutil-{{reltag}}-linux.zip]({{urlbase}}/tbutil-{{reltag}}-linux.zip) | {{ zipsum "linux" }} | Download for x86_64 Linux |
| [tbutil-{{reltag}}-mac.zip]({{urlbase}}/tbutil-{{reltag}}-mac.zip) | {{ zipsum "mac" }} | Download for MAC (64 bit) |
| [tbutil-{{reltag}}-windows.zip]({{urlbase}}/tbutil-{{reltag}}-windows.zip) | {{ zipsum "windows" }} | Download for Windows (64 bit) |

{{- end }}

## Downloads for K8S POD installation

Please refer to [K8S/INSTALL.md](../docs/K8S/INSTALL.md) for information on downloading and installing a TBUtil POD into a V8 system.

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


## Open-source Licenses

TBUtil is built in the GO language from opensource components. Tbutil and the majority of its componets are licensed with the [Apache License V2.0 (Jan 2004)](../licenses/git.turbonomic.com/cs/turbo-util/LICENSE), but some use different licenses.

The component license files and source code (where the license mandates that it is provided) can be browsed [here](../licenses).
