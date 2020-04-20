/**
 * @file netoviz server definition
 */

const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const grpc = require('grpc')

const config = require('../nuxt.config.js')
const restApiRouter = require('./rest-api')
const messages = require('./graph-api/grpc/topology-data_pb')
const services = require('./graph-api/grpc/topology-data_grpc_pb')

// Import and Set Nuxt.js options
config.dev = process.env.NODE_ENV !== 'production'

// Init Nuxt.js
const nuxt = new Nuxt(config)
const host = nuxt.options.server.host
const httpPort = nuxt.options.server.port
const grpcPort = 50051

/** HTTP server */
async function startHTTPServer() {
  const app = express()
  app.use('/api', restApiRouter) // set route for REST API

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(httpPort, host)
  consola.ready({
    message: `HTTP Server listening on http://${host}:${httpPort}`,
    badge: true
  })
}

const getForceSimulationTopology = (call, callback) => {
  console.log('# reply to: ', call.toString())
  const reply = new messages.GraphReply()
  reply.setGraphType('forceSimulation')
  reply.setJsonName(call.request.getJsonName())
  reply.setJson('{ "hoge": "test" }')
  callback(null, reply)
}

/** gRPC server */
function startGRPCServer() {
  const server = new grpc.Server()
  server.addService(services.TopologyDataConverterService, {
    getForceSimulationTopology
  })
  server.bind(`${host}:${grpcPort}`, grpc.ServerCredentials.createInsecure())
  server.start()
  consola.ready({
    message: `gRPC Server listening on http://${host}:${grpcPort}`,
    badge: true
  })
}

// Run server.
startHTTPServer()
startGRPCServer()
