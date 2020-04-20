// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var topology$data_pb = require('./topology-data_pb.js');

function serialize_netoviz_GraphReply(arg) {
  if (!(arg instanceof topology$data_pb.GraphReply)) {
    throw new Error('Expected argument of type netoviz.GraphReply');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_netoviz_GraphReply(buffer_arg) {
  return topology$data_pb.GraphReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_netoviz_GraphRequest(arg) {
  if (!(arg instanceof topology$data_pb.GraphRequest)) {
    throw new Error('Expected argument of type netoviz.GraphRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_netoviz_GraphRequest(buffer_arg) {
  return topology$data_pb.GraphRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


var TopologyDataConverterService = exports.TopologyDataConverterService = {
  getForceSimulationTopology: {
    path: '/netoviz.TopologyDataConverter/GetForceSimulationTopology',
    requestStream: false,
    responseStream: false,
    requestType: topology$data_pb.GraphRequest,
    responseType: topology$data_pb.GraphReply,
    requestSerialize: serialize_netoviz_GraphRequest,
    requestDeserialize: deserialize_netoviz_GraphRequest,
    responseSerialize: serialize_netoviz_GraphReply,
    responseDeserialize: deserialize_netoviz_GraphReply,
  },
};

exports.TopologyDataConverterClient = grpc.makeGenericClientConstructor(TopologyDataConverterService);
