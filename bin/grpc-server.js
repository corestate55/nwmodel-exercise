const grpc = require('grpc')
const messages = require('../server/api/grpc/topology-data_pb')
const services = require('../server/api/grpc/topology-data_grpc_pb')

const getDiagramData = (call, callback) => {
  console.log('# reply to: ', call.toString())
  const reply = new messages.GraphReply()
  reply.setGraphType('forceSimulation')
  reply.setJsonName(call.request.getJsonName())
  reply.setJson('{ "hoge": "test" }')
  callback(null, reply)
}

const getAlerts = (call, callback) => {
  const request = call.request
  console.log(`Receive ${request.getNumber()}-logs`)
  const reply = new messages.AlertReply()

  const alerts = [
    [10, 'aaa', 'error', '2020-04-20', 'msg1', 'xx', 'jj'],
    [11, 'bbb', 'warning', '2020-04-20', 'msg2', 'xx', 'jj']
  ]
  reply.setAlertsList(alerts.map(d => new messages.Alert(d)))
  callback(null, reply)
}

function main() {
  console.log('# start server')
  const server = new grpc.Server()
  server.addService(services.TopologyDataService, {
    getDiagramData,
    getAlerts
  })
  server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure())
  server.start()
}

main()
