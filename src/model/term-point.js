'use strict'

const TopoBaseContainer = require('./topo-base')
const GraphNode = require('../graph/graph-node')
const GraphLink = require('../graph/graph-link')

class SupportingTermPoint {
  constructor (data) {
    this.networkRef = data['network-ref']
    this.nodeRef = data['node-ref']
    this.tpRef = data['tp-ref']
    this.refPath = [this.networkRef, this.nodeRef, this.tpRef].join('/')
  }
}

module.exports = class TermPoint extends TopoBaseContainer {
  constructor (data, nodePath, nodeId, tpNum) {
    super(data)
    this.name = data['tp-id'] // name string
    this.id = nodeId + tpNum
    this.parentPath = nodePath
    this.path = [this.parentPath, this.name].join('/')
    this.attribute = {} // for extension
    this.constructSupportingTermPoints(data)
  }

  constructSupportingTermPoints (data) {
    this.supportingTermPoints = []
    const stpKey = 'supporting-termination-point' // alias
    if (data[stpKey]) {
      this.supportingTermPoints = data[stpKey].map(
        d => new SupportingTermPoint(d)
      )
    }
  }

  makeChildren () {
    const children = this.supportingTermPoints.map(stp => stp.refPath)
    children.unshift(this.parentPath)
    return children
  }

  graphNode () {
    return new GraphNode({
      'type': 'tp',
      'name': this.name,
      'id': this.id,
      'path': this.path,
      'children': this.makeChildren(),
      'attribute': this.attribute,
      'diffState': this.diffState
    })
  }

  graphLink () {
    const pathList = this.parentPath.split('/')
    const nodeName = pathList.pop()
    const linkName = [nodeName, this.name].join(',')
    return new GraphLink({
      'type': 'node-tp',
      'sourcePath': this.parentPath,
      'targetPath': this.path,
      'name': linkName,
      'path': [pathList, linkName].join('/'),
      'attribute': {}, // Notice (Link attribute does not implemented yet)
      'diffState': this.diffState
    })
  }
}