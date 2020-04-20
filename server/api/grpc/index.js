import GRPCIntegrator from './integrator'
const messages = require('./topology-data_pb')

const getDiagramData = async (call, callback) => {
  const request = call.request
  const reply = new messages.GraphReply()
  const grpcApi = new GRPCIntegrator('static')

  reply.setGraphType(request.getGraphType())
  reply.setJsonName(request.getJsonName())
  reply.setJson(await grpcApi.getGraphData(request))
  callback(null, reply)
}

module.exports = getDiagramData
