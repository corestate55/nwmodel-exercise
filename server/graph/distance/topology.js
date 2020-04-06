/**
 * @file Definition of distance graph
 */

import markNeighborWithTarget from '../common/neighbor-maker'
import markFamilyWithTarget from '../common/family-maker'
import DistanceNode from './node'
import DistanceLink from './link'

/**
 * Distance graph.
 */
class DistanceTopology {
  /**
   * @param {DistanceGraphQuery} graphQuery - Graph query parameters.
   */
  constructor(graphQuery) {
    const networks = graphQuery.topologyData
    /** @type {Array<DistanceNode>} */
    this.nodes = this._correctArrays(networks, 'nodes').map(
      d => new DistanceNode(d)
    )
    /** @type {Array<DistanceLink>} */
    this.links = this._correctArrays(networks, 'links').map(
      d => new DistanceLink(d)
    )

    // constants
    /**
     * Radius of node circle.
     * @const
     * @type {number}
     */
    this.nodeRadius = 20 // pt
    /**
     * Radius of distance circle
     * @const
     * @type {number}
     */
    this.distanceCircleInterval = 50 // pt

    const target = graphQuery.target
    const layer = graphQuery.layer
    markFamilyWithTarget(this.nodes, target, layer)
    markNeighborWithTarget(this.nodes, this.links, target, layer)
  }

  /**
   * Correct nodes/links from each network(layer).
   * @param {ForceSimulationTopologyData} networks - Networks.
   * @param {string} attribute - nodes or links
   * @returns {Array<ForceSimulationNodeData>|Array<ForceSimulationLinkData>} Collected array.
   * @private
   */
  _correctArrays(networks, attribute) {
    return networks
      .map(nw => nw[attribute])
      .reduce((sum, arr) => sum.concat(arr), [])
  }

  _distanceCircleRadius(distanceBefore, theta) {
    const diR = distanceBefore + this.distanceCircleInterval
    return diR * Math.sin(theta / 2) < this.nodeRadius
      ? this.nodeRadius / Math.sin(theta / 2)
      : diR
  }

  /**
   * Make layout for distance diagram.
   * @returns {Array<DistanceNodeLayoutData>}
   * @private
   */
  _makeNodeLayout() {
    const nodes = this.nodes.filter(d => d.hasTargetRelation())
    const maxDistance = Math.max(...nodes.map(d => d.distance()))
    const distanceTable = []

    for (let di = 0; di <= maxDistance; di++) {
      const diNodes = nodes.filter(d => d.distance() === di)
      const count = diNodes.length
      const theta = (2 * Math.PI) / count
      const diR =
        di > 0 ? this._distanceCircleRadius(distanceTable[di - 1].r, theta) : 0
      /**
       * @typedef {Object} DistanceNodeLayoutData
       * @prop {number} dIndex - Distance index.
       * @prop {number} r - Radius of distance circle.
       * @prop {DistanceNode} nodes - Nodes at the distance
       */
      distanceTable.push({ dIndex: di, nodes: diNodes, r: diR })

      diNodes.forEach((d, i) => {
        d.di = i
        d.r = this.nodeRadius
        d.cx = diR * Math.cos(theta * i)
        d.cy = diR * Math.sin(theta * i)
      })
    }
    return distanceTable
  }

  /**
   * Convert to dependency graph data.
   * @returns {DistanceTopologyData}
   * @public
   */
  toData() {
    /**
     * @typedef {Object} DistanceTopologyData
     * @prop {Array<DistanceNodeLayoutData>} layout - Distance-Nodes table
     * @prop {Array<DistanceLink>} links - Links (TODO: filtering by layer)
     */
    // (TODO: Temporary data, pre-visualize)
    return {
      layout: this._makeNodeLayout(),
      links: this.links.filter(d => d.isTypeTpTp())
    }
  }
}

export default DistanceTopology
