# Kafka plugin for TBUtil

*Last updated: 5 Aug 2021*

---

A tbutil/tbscript plugin for reading Google "Protocol buffer" format messages from Turbonomic's Kafka bus.


## Connecting

```
var K = plugin("kafka-plugin");

var config = {
	"bootstrap.servers": "localhost",
	"group.id":          "myGroup",
	"auto.offset.reset": "largest"
};

var kafka = K.connect(config);
```

The `config` passed to the `connect` function is used by the plugin to create a new Kafka consumer object. See the following pages for details..

* https://docs.confluent.io/platform/current/clients/confluent-kafka-go/index.html#NewConsumer
* https://github.com/edenhill/librdkafka/blob/master/CONFIGURATION.md


## Load proto-buf descriptor

```
kafka.loadPbDescriptor();
```

This function loads the JSON description of the expected protoBuf messages. If no argument is provided to the call (as in the example above), then the file `kafka-plugin.pb.json` is loaded from the same directory as the plugin itself.

If a file name is supplied, then that file will be loaded instead. If the filename starts with "%/" then it will be loaded from the directory where the plugin lives.

Note: a descriptor MUST be loaded before you make any calls to `readMessage`.

The `kafka-plugin.pb.json` descriptor file that forms part of the release is built from the Protocol Buffer description files use to build Turbonomic itself. The file is built against a specific Turbonomic release but the plugin is designed to maximize the likelyhood that it can run (with the descriptor) against later releases, provided that...
* The later releases do not change the index numbers or types of any fields that form part of the messages being processed.
* Any new fields do not re-use the index numbers of existing fields (ideally: are appended to the list).


## Subscribe

```
var topics = [
	"turbonomic.action-plans",
	"turbonomic.tp-live-topologies"
];

kafka.subscribe(topics);
```

## ReadMessage

```
var mesg = kafka.readMessage([dump_flag]);
```

The returned message has the following top-level fields..

| Name | Description |
| ---- | ----------- |
| key | |
| partition | The message topic partition. See https://docs.confluent.io/platform/current/clients/confluent-kafka-go/index.html#TopicPartition |
| headers | |
| timeStampType | |
| timeStamp | |
| rawValueLength | |
| value | The unmarshalled message contents. The structure varies according to the topic type. |

## Disconnect

## Seek

```
kafka.seek(topic, partition, offset)

```

## Pry

```
var info = kafka.pry()

```

## QueryWatermarkOffset

```
var info = kafka.queryWatermakOffset(topic, partition)

```

The returned `info` is a JS object with two fields: `high` and `low`.
