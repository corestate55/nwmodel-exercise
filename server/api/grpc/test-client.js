const grpc = require('grpc')

const messages = require('./topology-data_pb')
const services = require('./topology-data_grpc_pb')

function main() {
  console.log('# start client')
  const client = new services.TopologyDataClient(
    'localhost:50051',
    grpc.credentials.createInsecure()
  )
  const request = new messages.GraphRequest()
  request.setGraphType('forceSimulation')
  request.setJsonName('target3b.json')

  console.log('# send request: ', request.toString())
  client.getDiagramData(request, (error, response) => {
    if (error) {
      console.warn('ERROR : ', error.message())
      return
    }
    console.log('# Receive response:')
    console.log('## Graph type: ', response.getGraphType())
    console.log('## Json name: ', response.getJsonName())
    console.log('## Json data: ', response.getJson())
  })
}

main()
