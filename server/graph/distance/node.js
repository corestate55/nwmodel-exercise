/**
 * @file Definition of node for distance graph.
 */

import ForceSimulationNode from '../force-simulation/node'

/**
 * @typedef {DistanceNode} DistanceNodeData
 * @extends {ForceSimulationNode}
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

    /**
     * X position of node circle center.
     * @type {number}
     */
    this.cx = 0
    /**
     * Y position of node circle center.
     * @type {number}
     */
    this.cy = 0
    /**
     * Radius of node circle.
     * @type {number}
     */
    this.r = 0
    /**
     * Index in same distance circle nodes.
     * @type {number}
     */
    this.di = -1
  }

  /**
   * Pick layer name from path.
   * @returns {string} - Layer name.
   * @public
   */
  layerPath() {
    return this.path.split('__').shift()
  }

  /**
   * Check existence of object-type attribute.
   * @param {string} key - Attribute name to check ('family' or 'neighbor')
   * @returns {boolean} - True if exists.
   * @private
   */
  _exists(key) {
    return Boolean(Object.keys(this[key]).length)
  }

  /**
   * Check node has relation with target.
   * @returns {boolean} True if this node has family or neighbor relation.
   * @public
   */
  hasTargetRelation() {
    return Boolean(this._exists('family') || this._exists('neighbor'))
  }

  /**
   * Distance of this node from target.
   * @returns {number} Distance (>= 0).
   * @public
   */
  distance() {
    return (
      (this._exists('family') && this.family.degree) ||
      (this._exists('neighbor') && this.neighbor.degree)
    )
    // TODO: if family and neighbor are empty object? or each has value?
  }
}

export default DistanceNode
