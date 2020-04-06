import { event } from 'd3-selection'
import { zoom } from 'd3-zoom'
import DistanceDiagramBuilder from './builder'

class DistanceDiagramOperator extends DistanceDiagramBuilder {
  _setInitialZoom() {
    const layout = this.topologyData.layout
    const maxDiR = layout[layout.length - 1].r
    const zoomRatio = Math.min(this.width, this.height) / (2 * maxDiR)
    this.zoom.scaleTo(this.rootSVGSelection, zoomRatio)
    this.zoom.translateTo(this.rootSVGSelection, 0, 0, [
      this.width / 2,
      this.height / 2
    ])
  }

  _setSVGZoom() {
    this.zoom = zoom().on('zoom', () =>
      this.rootSVGGroupSelection.attr('transform', event.transform)
    )
    this.rootSVGSelection.call(this.zoom)
    this._setInitialZoom()
  }

  setAllDiagramElementHandler(topologyData) {
    if (Object.keys(topologyData.layout).length < 1) {
      return
    }
    this.topologyData = topologyData
    this._setSVGZoom()
  }
}

export default DistanceDiagramOperator
