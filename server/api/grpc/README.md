# gRPC memo

## Tools

```
sudo npm install -g --unsafe-perm grpc-tools
```

## Environment

```
hagiwara@dev01:~/nwmodel/netoviz$ node --version
v10.15.2
hagiwara@dev01:~/nwmodel/netoviz$ npm --version
6.14.4
hagiwara@dev01:~/nwmodel/netoviz$ grpc_tools_node_protoc --version
libprotoc 3.6.1
hagiwara@dev01:~/nwmodel/netoviz$ 
```

## Compile

```
hagiwara@dev01:~/nwmodel/netoviz/server/graph-api/grpc$ grpc_tools_node_protoc --js_out=import_style=commonjs,binary:./ --grpc_out=./ topology-data.proto 
hagiwara@dev01:~/nwmodel/netoviz/server/graph-api/grpc$
```

## Run test-server/client

Server
```
hagiwara@dev01:~/nwmodel/netoviz/server/graph-api/grpc$ node test-server.js 
```

Client
```
hagiwara@dev01:~/nwmodel/netoviz/server/graph-api/grpc$ node test-client.js 
# start client
# send request:  hoge.json
# Receive response:
## Graph type:  forceSimulation
## Json name:  hoge.json
## Json data:  { "hoge": "test" }
hagiwara@dev01:~/nwmodel/netoviz/server/graph-api/grpc$ 
```
