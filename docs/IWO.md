# TBUtil 2.0f IWO Instance Credentials

*Last updated: 3 Jun 2021*

Refer to section 1 of `QUICK-INSTALL.pdf` for information on installing `tbutil`. Once complete, you can then configure the credentials for your IWO instance following the notes below.

## Collect the required information.

### IWO URL.

You will need the URL for the IWO instance, including the protocol (https), host name and port number (if not 433).

### IWO Token.

You will need to obtain the access tolen (consisting of the ClientId and ClientSecret strings). The steps for obtaining these values are described below. You should only do this once otherwise you will create duplicate entries in IWO.

1. Log in to your IWO instance using an account with administration rights.
2. Open the browser developer's console window.
    - In **Chrome**, you do this by clicking on the three-dot icon at the top right hand corner of the window and selecting "More Tools" then "Developer Tools" (or pressing control-shift-I). Then ensure that the "console" tab is selected in the newly open window.
    - In **FireFox** you do this by clicking on the three-bar "hamburger" icon at the top right hand corner of the window and selecting "Web Developer" then "Web Developer Tools" (or pressing control-shift-I). Then ensure that the "console" tab is selected in the newly open window.
3. Cut and paste the following two commands into the console window..
```
b = {ClientName:"TbutilApp", ClientType:"confidential", Description:"App for TbUtil client id and secret"};
await fetch('/api/v1/iam/AppRegistrations',{method:"POST", body:JSON.stringify(b)}).then(r => r.json());
```
4. When the second of these commands returns, open the displayed object and cut-and-paste the ClientId and ClientSecret fields into a text file against the keywords "ClientId:" and "ClientSecret:" (see the example below). You can now use this file in the steps that follow.

Example text file contents:

```
ClientId: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
ClientSecret: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Run the configuration tool.

Once you have these strings to hand, run the `save iwo credentials` command, passing it the name of the configuration block you wish to create in the `.tbutilrc` file. The name is traditionally a short lower case string consisting of letters, numbers and stops. If you use the name `default` then these will be the default credentials for `tbutil` and `tbscript`.

The command line you should run is..

```
tbutil @block_name save iwo credentials
```

Where "block_name" should be replaced by the name you wish to use. For example..

```
tbutil @default save iwo credentials
```

The script will ask you to enter the IWO URL and name of the token file and perform some basic validation of your inputs. It will then create or update the `.tbutilrc` file to include the specified block.

## Example of running the script.

```
$ tbutil @iwo2 save iwo credentials

====================================================
Configuring IWO credentials for @iwo2
====================================================

Enter the Base URL at which IWO can be reached.

To be valid, this must...
- Start with 'http://' or 'https://'
- Followed by a resolvable host name or IP address.
- Optionally followed by a colon and a port number.
- End with a '/' character.

For example: https://iwo-service.mydomain.xyz:1443/

IWO URL: https://intersight.com/

Now we need the ClientId and ClientSecret to use when authenticating. You can either enter these strings
by hand or give the name of a file that contains them. In the latter case, the file should contain two
lines looking like this example:

    ClientId: 70ac044458fae00e7766fe4dd47554af219eb622fa5b703fdd4820952f17b110-ad6a806415c66bcee39c6572
    ClientSecret: 7abbd885b7a6dcaf02f8591c042df27a

Which approach do you wish to take?
 1: Enter the strings by hand,
 2: Import a file in the above format that contains the strings.

Enter 1 or 2: 2

File name: account.txt

```

Now check that the credentials you have entered work properly by running the command..

```
tbutil @block_name ping
```

(replacing the text "block_name" with the name you used when setting the credentials).

## Example configuration.

Here is an example of a configuration block called `@iwo2` added to `.tbutilrc` by the example above...

```
"iwo2": {
    "HookScript": "@/iwo_login.js",
    "HookScriptArgs": {
        "ClientID": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "ClientSecret": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    },
    "Host": "my-iwo-domain.com",
    "Path": "/wo/api/v3",
    "Port": "443",
    "Protocol": "https"
}
```
