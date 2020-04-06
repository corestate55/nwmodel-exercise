/**
 * @file Definition of class to visualize distance diagram.
 */

import DiagramBase from '../common/diagram-base'

/**
 * Distance diagram visualizer.
 * @extends {DiagramBase}
 */
class DistanceDiagramBuilder extends DiagramBase {
  /**
   * @param {number} width - Width of diagram. (SVG canvas)
   * @param {number} height - height of diagram. (SVG canvas)
   */
  constructor(width, height) {
    super()
    // canvas size
    /** @type {number} */
    this.width = width
    /** @type {number} */
    this.height = height
  }

  /**
   * Make all svg elements of dependency network diagram.
   * @param {DistanceTopologyData} topologyData - Topology data.
   * @public
   */
  makeAllDiagramElements(topologyData) {
    this.makeRootSVG('distance-view', '', 'whole-distance-graph')
    this.makeDiagramControlButtons()
  }
}

export default DistanceDiagramBuilder
