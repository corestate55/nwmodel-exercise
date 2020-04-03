/**
 * @file Data converter for distance graph.
 */

import markFamilyWithTarget from '../common/family-maker'
import markNeighborWithTarget from '../common/neighbor-maker'

/**
 * Distance graph.
 */
class DistanceTopology {
  /**
   * @param {DistanceGraphQuery} graphQuery - Graph query parameters.
   */
  constructor(graphQuery) {
    const networks = graphQuery.topologyData
    /** @type {Array<ForceSimulationNode>} */
    this.nodes = this._correctArrays(networks, 'nodes')
    /** @type {Array<ForceSimulationLink>} */
    this.links = this._correctArrays(networks, 'links')

    const target = graphQuery.target
    const layer = graphQuery.layer
    markFamilyWithTarget(this.nodes, target, layer)
    markNeighborWithTarget(this.nodes, this.links, target, layer)
  }

  /**
   * Correct nodes/links from each network(layer).
   * @param {ForceSimulationTopologyData} networks - Networks.
   * @param {string} attribute - nodes or links
   * @returns {Array<ForceSimulationNode>|Array<ForceSimulationLink>} Collected array.
   * @private
   */
  _correctArrays(networks, attribute) {
    return networks
      .map(nw => nw[attribute])
      .reduce((sum, arr) => sum.concat(arr), [])
  }

  /**
   * Convert to dependency graph data.
   * @returns {DistanceTopologyData}
   */
  toData() {
    /**
     * @typedef {Object} DistanceTopologyData
     * @prop {Array<ForceSimulationNode>} nodes - Nodes that has family/neighbor relation of target.
     * @prop {Array<ForceSimulationLink>} links - Links (TODO: filtering by layer)
     */
    // (TODO: Temporary data, pre-visualize)
    return {
      nodes: this.nodes.filter(d => d.family || d.neighbor),
      links: this.links.filter(d => d.type === 'tp-tp')
    }
  }
}

const toDistanceTopologyData = graphQuery => {
  const distanceTopology = new DistanceTopology(graphQuery)
  return distanceTopology.toData()
}

export default toDistanceTopologyData
