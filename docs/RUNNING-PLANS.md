# Running plans with tbutil 1.1n or later.

Author: Chris Lowth
Last update: 22nd May 2019

---

This document is written for people who are comfortable using the "Plan" feature of Turbonomic 6.2 or later, using the Turbonomic web UI.

The Turbonomic REST API provides the mechanisms needed to configure and run plans, and extract and analyse their results. You can program against these using `tbscript` or any other programming language that supports REST APIs.

This document however focusses on using "tbutil" and "tbscript" and does not discuss the actual API calls made under the hood.

The `tbutil` tool has a set of built in subcommands to make plans very easy to work with.

But let's start with a couple of concepts..

## Scenarios and Markets.

In Turbonomic, the configuration of a plan is held in a "scenario" object instance. You can view and manage these using the following `tbutil` commands..

| Command | Description |
| ------- | ----------- |
| `tbutil list scenarios -l` | to list the existing scenarios, excluding "hidden" ones |
| `tbutil list all scenarios -l` | to list all the existing scenarios |
| `tbutil delete scenario {uuid}` | to delete a scenario who's UUID is given as an argument |
| `tbutil export scenario {uuid}` | to dump the plan configuration in a format that can be imported using the "import" command |
| `tbutil import scenario [options] {filename}` | to import and optionally run a plan |

When the plan is run the results are available in the associated copy of the live market. You can view and manage these using..

| Command | Description |
| ------- | ----------- |
| `tbutil list markets -l` | list the existing markets |
| `tbutil delete market {uuid}` | delete a specified market |
| `tbutil stats [options] {uuid}` | view the statistics for a market |

## Creating and running a plan

`tbutil` provides a tool that allows you to create a scenario (a plan configuration), execute it and display the results.

The suggested steps to use this tool are as follows..

1. Create a plan, run it and export it's configuration..
    1. Create and run the plan in UI, giving it a name that makes it easy to identifiy.
    1. Make sure that the plan runs and the results are what you expect.
    1. Use the `list scenarios` command to see all the existing scenarios and determine the UUID of the one you have just created.
     `tbutil list scenarios -l`
    1. Export the scenario configration as a json file using the command:
      `tbutil export scenario {uuid} > {filename}.json`
1. Modify the scenario configuration (edit it using `vi` or something similar).
1. Import and run it using the command..
   `tbutil import scenario -stats {filename}.json`

The final command creates the plan, executes it, waits for it to finish, collects the resulting statistics from the plan market, displays them and finally cleans up (deletes the scenario and market).

A typical scenario export file looks like this..

```json
{
    "configChanges": {
        "automationSettingList": [
            {
                "displayName": "resize",
                "uuid": "resize",
                "value": "false"
            },
            {
                "displayName": "Provision",
                "entityType": "PhysicalMachine",
                "uuid": "provisionPM",
                "value": "false"
            },
            {
                "displayName": "Suspend",
                "entityType": "PhysicalMachine",
                "uuid": "suspendPM",
                "value": "false"
            }
        ]
    },
    "displayName": "My headroom plan",
    "loadChanges": {
        "maxUtilizationList": [
            {
                "maxPercentage": 90,
                "projectionDay": 0,
                "target": {
                    "className": "Group",
                    "displayName": "PMs_HawthorneSales\\Turbonomic SE Lab"
                }
            }
        ],
        "utilizationList": [
            {
                "percentage": 10,
                "projectionDay": 0,
                "target": {
                    "className": "Market",
                    "displayName": "Market"
                }
            }
        ]
    },
    "projectionDays": [
        0
    ],
    "scope": [
        {
            "className": "Market",
            "displayName": "Market"
        }
    ],
    "timebasedTopologyChanges": {},
    "topologyChanges": {
        "addList": [
            {
                "count": 1000,
                "projectionDays": [
                    0
                ],
                "target": {
                    "className": "VirtualMachineProfile",
                    "displayName": "AVG:PMs_HawthorneSales\\Turbonomic SE Lab for last 10 days"
                }
            }
        ]
    },
    "type": "CUSTOM"
}
```

A typical output looks like..

```
Name                     Capacity        Before       Value        Units     Relation
-----------------------  --------------  -----------  -----------  --------  --------
costPrice                             -         0.00         0.00  $/h       -       
costPrice:COMPUTE                     -         0.00         0.00  $/h       -       
costPrice:IP                          -         0.00         0.00  $/h       -       
costPrice:LICENSE                     -         0.00         0.00  $/h       -       
costPrice:RI_COMPUTE                  -         0.00         0.00  $/h       -       
costPrice:SPOT_COMPUTE                -         0.00         0.00  $/h       -       
costPrice:STORAGE                     -         0.00         0.00  $/h       -       
CPU                          1075960.00      1941.53      3084.49  MHz       sold    
IOThroughput               384736000.00      3013.83      4419.20  Kbit/sec  sold    
Mem                       3388725250.00  22906666.00  33397754.00  KB        sold    
NetThroughput              138544000.00     24490.36     25895.73  Kbit/sec  sold    
numClusters                           -         6.00         6.00  -         -       
numContainers                         -         0.00         0.00  -         -       
numContainersPerHost                  -         0.00         0.00  -         -       
numContainersPerStorage               -         0.00         0.00  -         -       
numDBs                                -         3.00         3.00  -         -       
numDBSs                               -         3.00         3.00  -         -       
numHosts                              -        90.00        90.00  -         -       
numStorages                           -       263.00       271.00  -         -       
numTargets                            -         0.00         0.00  -         -       
numUnplaced                           -            -          767  -         -       
numVDCs                               -        40.00        40.00  -         -       
numVMs                                -       602.00      1602.00  -         -       
numVMsPerHost                         -         6.68        17.79  -         -       
numVMsPerStorage                      -         2.28         5.91  -         -       
numVolumes                            -        32.00        32.00  -         -       
numWorkloads                          -         0.00         0.00  -         -       
priceIndex                            -         2.73       914.20  -         -       
RICouponCoverage                 264.00         0.00         0.00  RICoupon  -       
RICouponUtilization              204.00         0.00         0.00  RICoupon  -       
riDiscount                            -         0.00         0.00  $/h       -       
savings:cpuReduction                  -            -         0.00  -         -       
savings:memReduction                  -            -         0.00  -         -       
savings:savingsAmount                 -            -         0.00  -         -       
StorageAccess                 320000.00         0.00         1.51  IOPS      sold    
StorageAccess                  80000.00         0.00         0.00  IOPS      bought  
StorageAmount               46968336.00     57075.73     75755.68  MB        sold    
StorageProvisioned          93923704.00    207995.06    196270.52  MB        sold    
VCPU                      6011845600.00   6953925.00   2618560.20  MHz       sold    
VMem                     19203309600.00   7475162.50   2814836.80  KB        sold    
VStorage                  6123033600.00   3005945.80   1753637.80  MB        sold    
```

## Running bulk plans

You might want to run a plan against all the clusters in your instance. One nice and easy way to do this is to leverage the power of "tbscript".

The tbutil release `examples` folder contains a script called `run-plan-per-cluster.js` which shows how it can be done. The example shows a demo "head room" style of plan which attempts to stuff 1000 new VMs into the cluster. You can then get an idea of the head room by subtracting the "numUnplaced" output figure from 1000 to give you the number of template VMs that were added by the plan.

The script has a function `getPlanConfig()` which returns the Javascript object that holds the scenario configuration for a cluster who's name is provided as the argument. The main body of this function is a slightly editted version of the output of `tbutil export scenario` for an identical plan, created using the UI. It has been editted to allow the cluster name to be patched in to the relevant places.

The main script then uses the API to collect the known clusters, sort them into alphabetical order and call the `tbutil import scenario` command for each one. The code uses a "trick" of the `import scenario` which allows the action JSON document to be supplied as the argument in place of a file name.

The main code (not showing the `getPlanConfig()` function) looks like this...

```javascript
// Get the known clusters and sort by displayname.
var clusters = client.getInstances("Cluster");
clusters.sort(function(a, b) {
    if (a.displayName.toLowerCase() < b.displayName.toLowerCase()) { return -1; }
    if (a.displayName.toLowerCase() > b.displayName.toLowerCase()) { return 1; }
    return 0;
});

// Loop round the sorted clusters and run the "import scenario" command against each one using
// the plan configuration specific to the cluster concerned.
var exitStatus = 0;
clusters.forEach(function(cluster) {
    var plan = getPlanConfig(cluster.displayName);
    println("*************************************************************************");
    println("* "+cluster.displayName);
    println("*************************************************************************");
    var rtn = client.tbutil("import scenario", false, [ "-stats", JSON.stringify(plan) ]);
    if (rtn.status > exitStatus) {
        exitStatus = rtn.status;
    }
    println("");
});

return exitStatus;
```

The output of running this script follows the format of the example output shown earlier, but repeated for each known cluster.

You can use this script as the basis of writing your own bulk plan execution script.

If you want to parse the output of the plan to access and manipulate specific values, you can change the loop logic to something like the example below. This prints the cluster name and the number of placed VMs for each cluster. To do this, it instructs "import scenario" to pass the results back as a JSON document (using the `-json-stats` option) and pass the output text back to the calling script rather than print it (the value 'true' as the 2nd parameter to client.tbutil enables this feature). The script then parses the JSON text into an object using `JSON.parse()` from which the required value can be collected and printed.

```javascript
clusters.forEach(function(cluster) {
    var plan = getPlanConfig(cluster.displayName);
    var rtn = client.tbutil("import scenario", true, [ "-json-stats", JSON.stringify(plan) ]);
    var results = JSON.parse(rtn.out);
    printf("%s: %d\n", cluster.displayName, 1000 - results.numUnplaced.value);
});
````
