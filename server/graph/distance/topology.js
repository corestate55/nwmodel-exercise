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
    this.distanceCircleInterval = this.nodeRadius * 2.5 // min: *2

    const target = graphQuery.target
    const layer = graphQuery.layer
    markFamilyWithTarget(this.nodes, target, layer) // it marks tp-type node.
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

  _distanceCircleRadius(dIndex, distanceTable, count) {
    if (dIndex === 0) {
      return 0
    }

    const distanceBefore = distanceTable[dIndex - 1].r
    const diR = distanceBefore + this.distanceCircleInterval
    if (count <= 2) {
      return diR // when 1 or 2 nodes
    }

    const theta = (2 * Math.PI) / count
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
    const nodes = this.nodes.filter(
      // markFamily marked tp-type node. filter it.
      d => d.hasTargetRelation() && d.isTypeNode()
    )
    const maxDistance = Math.max(...nodes.map(d => d.distance()))
    const distanceTable = []
    const round = value => {
      const k = 1000
      return Math.floor(value * k) / k
    }

    for (let di = 0; di <= maxDistance; di++) {
      const diNodes = nodes.filter(d => d.distance() === di)
      const count = diNodes.length
      const diR = this._distanceCircleRadius(di, distanceTable, count)
      /**
       * @typedef {Object} DistanceNodeLayoutData
       * @prop {number} dIndex - Distance index.
       * @prop {number} r - Radius of distance circle.
       * @prop {DistanceNode} nodes - Nodes at the distance
       */
      distanceTable.push({ dIndex: di, nodes: diNodes, r: diR })

      diNodes.forEach((d, i) => {
        d.di = i
        d.r = round(this.nodeRadius)
        const theta = (2 * Math.PI) / count
        const angle = theta * i - Math.PI / 2 // start on Y axis
        d.cx = round(diR * Math.cos(angle))
        d.cy = round(diR * Math.sin(angle))
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
