const grpc = require('grpc')

const messages = require('./topology-data_pb')
const services = require('./topology-data_grpc_pb')

const getForceSimulationTopology = (call, callback) => {
  console.log('# reply to: ', call.toString())
  const reply = new messages.GraphReply()
  reply.setGraphType('forceSimulation')
  reply.setJsonName(call.request.getJsonName())
  reply.setJson('{ "hoge": "test" }')
  callback(null, reply)
}

function main() {
  console.log('# start server')
  const server = new grpc.Server()
  server.addService(services.TopologyDataConverterService, {
    getForceSimulationTopology
  })
  server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure())
  server.start()
}

main()
