# TBUtil 1.3g Quick Install Guide.

*Last updated: 28 Apr 2021*

## Installing from downloaded zip file.

Download the correct zip file for your platform from ..

`https://github.com/turbonomic/tbutil/blob/master/releases/v1_3g.md`

Once downloaded, un-zip the file into a directory of your choice. For example (for version 1.3g, Linux)...

```
$ cd $HOME
$ unzip $HOME/Downloads/tbutil-1_3g-linux.zip    (or the location you have copied the zip file to)
```

Now "cd" into the directory that you unzipped into and run the "install.sh" or "install.bat" script from there. For example (on Linux) ...

```
$ cd tbutil-1_3g
$ sh install.sh
```

You will be asked to select the target directory for the intallation.

In Linux and MAC, the directory can be one of:

| Option | Directory | Comment |
| ------ | --------- | --------|
| 1 | $HOME/bin | if tbutil is only to be used by a singe user |
| 2 | /usr/local/bin | if you want all users to be able to access the same copy of the tool (you'll need to have root access to set this up) |
| 3 | /opt/local/bin | on a Turbonomic instance, where you want all users to be able to access the tool (you'll need to have root access to set this up) |
| 4 | Somewhere else | if you want to keep tbutil, tbscript, etc somewhere else |

In Windows, the directory could be:

| Option | Directory | Comment |
| ------ | --------- | --------|
| 1 | %USERPROFILE%\tbutil | if tbutil is only to be used by a singe user |
| 2 | %USERPROFILE%\Desktop\tbutil | if tbutil is only to be used by a singe user (alternative location) |
| 3 | %ProgramFiles%\Turbonomic\tbutil | if you want all users to be able to access the same copy of the tool (you'll need to have administrator access to set this up) |
| 4 | Somewhere else | if you want to keep tbutil, tbscript, etc somewhere else |

If this is a new installation of TButil (rather than being an upgrade of an existing installation) you should configure credentials for your default Turbonomic instance by following the steps in the section "Setting up credentials and testing", below.

## Non-interactive installation.

If you need to install using a script rather than by answering questions interactively, this can be achieved by setting a number of environment variables prior to running install.sh or install.bat. The variables that can be used for this purpose are..

- `TARGET_DIRECTORY_NUMBER` = 1, 2, 3 or 4 (defaults to 4 if `TARGET_DIRECTORY_PATH` is set)
- `TARGET_DIRECTORY_PATH` = full path name (not relevant if number 1, 2 or 3 selected)
- `CREATE_DIRECTORY` = y or n (defaults to 'y' if `TARGET_DIRECTORY_NUMBER` is 4)
- `DELETE_EXISTING` = y or n (defaults to 'y' if `TARGET_DIRECTORY_NUMBER` is 4)

It is normally enough just to set the `TARGET_DIRECTORY_PATH` - this setting drives defaults for the other three variables.

## Read-only MySQL account

If you are going to use tbutil to access the on-instance MySQL databases, you will need a read-only MySQL account which is granted access to "SELECT" and "EXECUTE" actions only.

In Turbonomic V6, a suitable user account called "vmtreader" is defined by default, but in Turbonomic V7 (aka "XL"), you may need to create it using the MySQL command prompt. The following commands can be used to create the user with default password. Note that the "drop user" commands will report a benign error if the user doesn't already exist.

```
drop user vmtreader@localhost;
drop user vmtreader;
drop user vmtreader@`%`;

grant select, execute on *.* to vmtreader identified by password '*0583FB97F4D9E44686C40B98BE674DE8FDDF2602';
grant select, execute on *.* to vmtreader@localhost identified by password '*0583FB97F4D9E44686C40B98BE674DE8FDDF2602';
```

if you want to be able to access the DB remotely via a direct connection to the MariaDB port, then also enter..

```
grant select, execute on *.* to vmtreader@`%` identified by password '*0583FB97F4D9E44686C40B98BE674DE8FDDF2602';
```

You can replace the \`%\` with the name or IP of a specific host if you want to limit access to come only from there.


## Setting up credentials and testing

(refer to the IWO.pdf document instead for information about configuring IWO instance credentials).

Configure credentials. Eg: answer the questions asked by ...

```
tbutil save credentials
```

If you want to access the MySQL database remotely, then you will also need to run..

```
$ tbutil save ssh credentials (not needed if running on the instance itself)
$ tbutil save db credentials
```

Alternatively: to set all credentials at once, run the command..

```
$ tbutil save all credentials
```

You can test these settings by running the command..

```
$ tbutil ping -sql
```

If you are going to use tbutil or tbscript on a Turbonomic V6 instance to run in action scripts then you also need to create credentials for the "tomcat" user..

```
$ su -l tomcat -s /bin/bash
$ tbutil save credentials
$ tbutil ping
$ tbutil save db credentials
$ tbutil ping -sql
$ exit
```

If you are going to access more than one Turbonomic instance there are several options you can use. See README.pdf for all the details.
