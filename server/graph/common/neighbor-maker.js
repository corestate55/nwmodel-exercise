/**
 * @file Definition of neighbor-maker.
 */

import RelationMakerBase from './relation-maker-base'

/**
 * Relationship of neighbor.
 */
class NeighborRelation {
  /**
   * @param {number} degree - Degree.
   */
  constructor(degree) {
    /** @type {number} */
    this.degree = degree
  }

  /**
   * Convert to string.
   * @returns {string}
   */
  toString() {
    return `{ degree: ${this.degree} }`
  }
}

/**
 * Make neighbor relation attribute for recursive structures (nodes)
 */
class NeighborMaker extends RelationMakerBase {
  /**
   * @param {Array<FSNode>} nodes - nodes
   * @param {Array<ForceSimulationLink>} links - links
   */
  constructor(nodes, links) {
    super(nodes)
    /**
     * Links (each in multiple layers)
     * @type {Array<ForceSimulationLink>}
     */
    this.links = links
  }

  /**
   * Mark neighbor relation of target node.
   * @param {string} targetNodeName - Name of target node/term-point.
   * @param {string} targetNodeLayer - Name of layer that contains the target.
   * @returns {boolean} True if found target and marked neighbors of it.
   */
  markNeighborWithTarget(targetNodeName, targetNodeLayer) {
    // TODO: when targetNodeName is termpoint?
    const targetNode = targetNodeLayer
      ? this.findTargetNodeByPath([targetNodeLayer, targetNodeName].join('__'))
      : this.findTargetNodeByName(targetNodeName)

    if (!targetNode) {
      return false
    }
    const targetLinks = this._findAllTpTpLinksInLayerOf(targetNode)
    // check
    // console.log(targetLinks.map(d => d.path))
    // console.log(`total links: ${targetLinks.length}`)

    targetNode.neighbor = new NeighborRelation(0)
    this._markNeighbor(targetNode, targetLinks, 1)

    return true
  }

  /**
   * Pick layer name from path.
   * @param {string} path - Path string.
   * @returns {string} - Layer name.
   * @private
   */
  _layerPath(path) {
    return path.split('__').shift()
  }

  /**
   * Find all tp-tp type links in specified layer.
   * @param {FSNode} targetNode - Target node.
   * @returns {Array<ForceSimulationLink>} - Links.
   * @private
   */
  _findAllTpTpLinksInLayerOf(targetNode) {
    const layer = this._layerPath(targetNode.path)
    return this.links.filter(
      d => d.type === 'tp-tp' && this._layerPath(d.path) === layer
    )
  }

  /**
   * Mark neighbor-relation recursively.
   * @param {FSNode} srcNode - Origin.
   * @param {Array<ForceSimulationLink>} wholeLinks - Links to check.
   * @param {number} degree - Degree of neighbors.
   * @private
   */
  _markNeighbor(srcNode, wholeLinks, degree) {
    this.consoleDebug(
      degree,
      '_markNeighbor',
      `src=${srcNode.path}, wl.len=${wholeLinks.length}`
    )
    if (wholeLinks.length === 0) {
      return
    }

    const targetLinks = this._findAllLinksWithOrigin(wholeLinks, srcNode)
    const nextSrcNodes = []
    this.consoleDebug(
      degree,
      '_markNeighbor',
      `targetLinks: ${targetLinks.map(d => d.path)}`
    )
    for (const targetLink of targetLinks) {
      const dstNode = this._findNodeByPath(
        this._linkEndNodePath(targetLink.targetPath)
      )
      if (dstNode.neighbor && dstNode.neighbor.degree <= degree) {
        this.consoleDebug(
          degree,
          '_markNeighbor',
          `pass dst=${dstNode.path}, degree=${dstNode.neighbor.degree}`
        )
        continue
      }
      this.consoleDebug(
        degree,
        '_markNeighbor',
        `mark ${dstNode.path}.heighbor = ${degree}`
      )
      dstNode.neighbor = new NeighborRelation(degree)
      nextSrcNodes.push(dstNode)
    }

    const leftLinks = this._findAllLinksWithoutOrigin(wholeLinks, srcNode)
    this.consoleDebug(
      degree,
      '_markNeighbor',
      `nextSrcNodes=${nextSrcNodes.map(d => d.path)}`
    )
    degree += 1
    for (const nextSrcNode of nextSrcNodes) {
      this.consoleDebug(
        degree - 1,
        '_markNeighbor',
        `goto next src=${nextSrcNode.path}`
      )
      this._markNeighbor(nextSrcNode, leftLinks, degree)
    }
  }

  /**
   * Pick node path which has specified link end (source/target term-point).
   * @param {string} linkEndPath - Path of link end term-point.
   * @returns {string} Node path.
   * @private
   */
  _linkEndNodePath(linkEndPath) {
    return linkEndPath
      .split('__')
      .slice(0, 2)
      .join('__')
  }

  /**
   * Find node by path.
   * @param {string} path - Node path.
   * @returns {FSNode} Found node.
   * @private
   */
  _findNodeByPath(path) {
    return this.nodes.find(d => d.path === path)
  }

  /**
   * Find all links that is not connected with target.
   * @param {Array<ForceSimulationLink>} links - Population of links.
   * @param {FSNode} target - Target node.
   * @returns {Array<ForceSimulationLink>} - Links.
   * @private
   */
  _findAllLinksWithoutOrigin(links, target) {
    return links.filter(
      d =>
        this._linkEndNodePath(d.sourcePath) !== target.path &&
        this._linkEndNodePath(d.targetPath) !== target.path
    )
  }

  /**
   * Found all links that is connected with target.
   * @param {Array<ForceSimulationLink>} links - Population of links.
   * @param {FSNode} target - Target node.
   * @returns {Array<ForceSimulationLink>} - Links.
   * @private
   */
  _findAllLinksWithOrigin(links, target) {
    return links.filter(
      d => this._linkEndNodePath(d.sourcePath) === target.path
    )
  }
}

/**
 * Function to mark neighbor relations.
 * @param {Array<FSNode>} nodes - Nodes.
 * @param {Array<ForceSimulationLink>} links - Links.
 * @param {string} targetNodeName - Name of target node.
 * @param {string} [targetNodeLayer] - Layer of target node.
 * @returns {boolean} True if found target and marked other nodes.
 */
const markNeighborWithTarget = (
  nodes,
  links,
  targetNodeName,
  targetNodeLayer
) => {
  const neighborMaker = new NeighborMaker(nodes, links)
  return neighborMaker.markNeighborWithTarget(targetNodeName, targetNodeLayer)
}

export default markNeighborWithTarget
