/**
 * @file Definition of node for distance graph.
 */

import ForceSimulationNode from '../force-simulation/node'

/**
 * @typedef {DistanceNode} DistanceNodeData
 */
/**
 * Node of distance graph.
 */
class DistanceNode extends ForceSimulationNode {
  /**
   * @param {ForceSimulationNodeData} nodeData - Node data.
   */
  constructor(nodeData) {
    super(nodeData)

    /** @type {FamilyRelation} */
    this.family = nodeData.family || {}
    /** @type {NeighborRelation} */
    this.neighbor = nodeData.neighbor || {}
  }

  /**
   * Pick layer name from path.
   * @returns {string} - Layer name.
   */
  layerPath() {
    return this.path.split('__').shift()
  }

  /**
   * Check node has relation with target.
   * @returns {boolean} True if this node has family or neighbor relation.
   */
  hasTargetRelation() {
    return Boolean(
      Object.keys(this.family).length || Object.keys(this.neighbor).length
    )
  }
}

export default DistanceNode
