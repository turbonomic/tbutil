# SMTP Plugin for TBUtil

*Last updated: 25 Aug 2021*

---

TbUtil plugin for sending messages using the SMTP protocol.

Note: this plugin performs no DKIM/DMARK or SPF verification of the sent email. You could consider using the free "dkimproxy" if that is an issue.

## Usage

```
var p = plugin("smtp-plugin");
p.send(config);

// or..

p.send(config, client);
```

Where `config` is an object that contains the follow fields..

| Field name | Description |
| ---------- | ----------- |
| authType   | The type of authentication to use. Valid values are "none", "plain" (default if password is specified) or "cramMd5" (default if secret is specified). |
| bcc        | An array of strings containing blind-carbon-copy recipient email addresses. |
| cc         | An array of strings containing carbon-copy recipient email addresses. |
| enableSsl  | Boolean: should an SSL-encrypted connection to the server be used? |
| enableTls  | Boolean: should a TLS-encrypted connection to the server be used? |
| from       | The email address of the sender of the email. |
| headers    | A JS object containing additional headers for the email. This must be a string-to-string map. The following headers should NOT be specified here because they are populated using other fields.. `to`, `cc`, `bcc`, `subject`, `from`, `date`, `mime-version`, `content-type`, `x-sent-using`. |
| host       | If authType is "plain", then this is the name of the host. |
| identity   | If authType is "plain", then this is the optional identity string. |
| parts      | An array of email content objects. See below. |
| password   | If authType is "plain", then this is the password. |
| secret     | If authType is "cramMd5", then this is the authentication secret. |
| server     | The SMTP server and port (delimited by a colon) to connect to. |
| subject    | The subject for the email. |
| to         | An array of strings containing recipient email addresses. |
| user       | If authType is "plain" or "cramMd5", then this is the user name. |

If any of the `to`, `cc` or `bcc` fields only need to contain a single address, then they an be specified as a simple string instead of an array.

The `authType` field determines which of the authentication fields are relevant as follows..

| Auth type | Relevant fields |
| --------- | --------------- |
| none      | none. |
| plain     | identity, user, password, host |
| cramMd5   | user, secret. |

The `parts` field is an array of sub-objects, each of which contains the following fields.

| Field name    | Description |
| ------------- | ----------- |
| content       | A string containing the message block content. |
| contentBase64 | A string containing the base64 encoded message block content. |
| contentFile   | The name of a local file to read the message block content from. |
| delete        | Boolean: if contentFile is specified, should the file be deleted after it has been read? Default is false. |
| encoding      | The content encoding type to use. Can be "base64" or "quoted-printable". It defaults to "quoted-printable" for "text/plain" and "text/html" mimeTypes, otherwise the default is "base64". |
| fileName      | The optional file name to be placed in the Content-Disposition field of the mime headers. If specfied, the dispoistion will be "attachment". |
| mimeType      | The mime type specification - to be placed in the Content-Type field of the mime headers. |

Note 1: only one of `content`, `contentBase64` or `contentFile` should be specified.

Note 2: "`delete`" is only relevant if "`contentFile`" is specified. If an error is thrown while reading any of the content files, then none of the files later in the list will be deleted.

Note 3: The sent mail will have the header "X-Sent-Using" with a value that indicates the tbutil version and GIT commit tag. For example:

```
X-Sent-Using: tbutil 1.2c; 8fd2f0cc194742276da731e639acddde104263f3
```

Note 4: If the "`client`" argument is specified to the "`send`" function then the following configuration parameters are taken from Turbonomic's SMTP configuration. If the fields exist in the config structure, they will take precendence over those taken from Turbonomic.

- user
- password
- server (including port)
- from
- enableSsl
- enableTls
- authType will be set to "basic" if password is populated.

## Example

Here's an example of sending an email with a small plain-text message and a couple of attachments (neither of which should be deleted after sending).

```
var p = plugin("smtp-plugin");

var email = {
	// Message headers
	to: "Mickey Mouse <mickey.mouse@example-doamin-name.com>",
	cc: [ "pluto@the-dog-house.com" ],
	subject: "Checking that this works",

	// Message content
	parts: [
		{
			mimeType: "text/plain",
			encoding: "quoted-printable",
			content: "Here is a picture of me and that document I mentioned."
		},
		{
			mimeType: "image/png",
			encoding: "base64",
			contentFile: getenv("HOME")+"/images/me.png",
			fileName: "pic-of-me.png",
			delete: false
		},
		{
			mimeType: "application/pdf",
			encoding: "base64",
			contentFile: getenv("HOME")+"/Documents/latest-design.pdf",
			fileName: "latest-design.pdf",
			delete: false
		}
	]
};

p.send(email, client);
```
