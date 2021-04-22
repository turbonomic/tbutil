# TButil 1.3g - Building from source

*Last updated: 5 Jan 2021*

## How to build "tbutil" from source.

(Most people wont need to do this)

The build process must be run on a Linux system (I use Ubuntu 18.04.1 TLS running in VM under VitualBox in a Windows 10 laptop), and it will generate the full set of Linux, MAC and Windows 64-bit binaries.

If you do not have a 64bit Ubuntu system to hand for the build, you can build using a docker container. The steps for this are listed in the "Building using docker" section, below.

Development and testing have been performed with GO 1.10.2.

## Building on Ubuntu 18.04.1 TLS

There are four (optionally: five) steps to follow to build "tbutil" under Ubuntu (use the Docker approach on other platforms).

1: Install golang into your development Linux platform.

For Ubuntu: this is done by running the command..

```
sudo apt install golang
```

Other platforms will have other commands to do this job.

2: Set up the environment

```
$ export GOPATH=$HOME/gopath
$ mkdir $GOPATH
```

3: Download the source and dependencies

```
$ GIT_TERMINAL_PROMPT=1 go get -d -v git.turbonomic.com/cs/turbo-util
```

You'll need a username and password for the git repo, which you may be asked to enter twice.

4: Compile and install

```
$ cd $GOPATH/src/git.turbonomic.com/cs/turbo-util
$ make
```

This will install a number of files in the $GOPATH/bin. To install on a different platform, all you need to do is copy "tbutil" (for Linux), "darwin/tbutil" (for MAC) or "windows/tbutil.exe" (for Windows) into a directory on the path. On Linux and MAC, you should then soft-link "tbutil" to "tbscript".

Then: copy all the files who's names start with "plugin-" from the same folder as the platform's "tbutil" binary into the same target directory as you copied the binary into.

You may also find "jpath" (or "jpath.exe" useful). See the presentation for details about this tool.

The "jwalk" (or "jwalk.exe") program is almost certainly not needed - it is the precursor to "jpath".

5: Build the "otto" binary (optional)

If you want to be able to run the raw "otto" binary (without the tbscript enhancments)..

```
$ cd $GOPATH/src/git.turbonomic.com/cs/turbo-util
$ make otto
```

This will install "otto" and "otto.exe" into $GOPATH/bin, $OTTO/bin/darwin and $OTTO/bin/windows.

## Building PDF versions of documentation files.

If you want to create QUICK-INSTALL.pdf and README.pdf files, the process is as follows..

1: Install NodeJS (if not already installed)

Under Ubuntu, the command is..
```
sudo apt-get install nodejs npm libfontconfig
```

2: Install the "markdown-pdf" module

```
sudo npm install -g markdown-pdf
```

3: Build the PDFs

```
make docs
```

## Building using docker

If you want to build on Windows or Darwin or some flavours of Linux, you'll need to use a Ubuntu docker container. The steps are simple (once you have a running docker installation on your system)...

### Quick way..

Download "Dockerfile" and "build.sh" from the turbo-util GIT repository and place them in an otherwise empty directory. Then "cd" to that directory and follow the steps shown in the comments at the top of the Dockerfile.

### Collecting the binaries

Now (if those steps ran without error), the compiled binaries for all three supported platforms are in $GPATH/bin in the docker container.

You can export these to your local file system as follows...

```
$ exit   (to exit and stop the container)
```

From the local system ...

```
$ docker ps -a
   (note the container ID in the first column)
$ docker cp CONTAINER_ID_HERE:/root/gopath/bin TARGET_DIRECTORY_PATH_HERE
```
