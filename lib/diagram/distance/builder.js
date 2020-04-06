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
    /** @const {number} */
    this.fontSize = 10
  }

  _makeNodeCircles(nodes) {
    this.rootSVGGroupSelection
      .selectAll('circle.node')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('class', d => this.classStringFrom(d, 'dist node'))
      .attr('id', d => d.path)
      .attr('cx', d => d.cx)
      .attr('cy', d => d.cy)
      .attr('r', d => d.r)
  }

  _makeNodeLabels(nodes) {
    this.rootSVGGroupSelection
      .selectAll('text.node')
      .data(nodes)
      .enter()
      .append('text')
      .attr('class', d => this.classStringFrom(d, 'dist node'))
      .attr('id', d => `${d.path}-label`)
      .attr('x', d => d.cx)
      .attr('y', d => d.cy)
      .attr('font-size', this.fontSize)
      .text(d => d.path)
  }

  _makeDistanceCircles(layout) {
    this.rootSVGGroupSelection
      .selectAll('circle.concentric')
      .data(layout)
      .enter()
      .append('circle')
      .attr('id', d => `dist-circle-${d.dIndex}`)
      .attr('class', d => this.classStringFrom(d, 'dist concentric'))
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', d => d.r)
  }

  /**
   * Make all svg elements of dependency network diagram.
   * @param {DistanceTopologyData} topologyData - Topology data.
   * @public
   */
  makeAllDiagramElements(topologyData) {
    this.makeRootSVG('distance-view', '', 'whole-distance-graph')
    this.makeDiagramControlButtons()

    this._makeDistanceCircles(topologyData.layout) // before at node (as background)
    const nodes = topologyData.layout.reduce(
      (sum, ld) => sum.concat(ld.nodes),
      []
    )
    console.log('nodes : ', nodes)
    this._makeNodeCircles(nodes)
    this._makeNodeLabels(nodes)
  }
}

export default DistanceDiagramBuilder
