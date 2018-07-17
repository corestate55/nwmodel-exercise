'use strict'

import * as d3 from 'd3'
import {GraphVisualizer} from './visualizer'

function drawLegend () {
  var legend = d3 // .select(document.body)
    .select('body')
    .append('div')
    .attr('id', 'legend')
    .append('svg')
    .attr('width', 500)
    .attr('height', 60)

  var styles = [
    { 'class': 'normal', 'label': '' },
    { 'class': 'selectedchildren', 'label': 'child' },
    { 'class': 'selected', 'label': 'click' },
    { 'class': 'selectedparents', 'label': 'parent' }
  ]
  var objSize = 40
  var dp = 10

  function circleX (d, i) {
    return (dp + objSize) * (1 + styles.length + i)
  }

  legend.selectAll('rect')
    .data(styles)
    .enter()
    .append('rect')
    .attr('width', objSize)
    .attr('height', objSize)
    .attr('x', (d, i) => dp + (dp + objSize) * i)
    .attr('y', dp)
    .attr('rx', objSize / 8)
    .attr('ry', objSize / 8)
    .attr('class', d => d.class)
  legend.selectAll('circle')
    .data(styles)
    .enter()
    .append('circle')
    .attr('r', objSize / 4)
    .attr('cx', circleX)
    .attr('cy', objSize / 2)
    .attr('class', d => d.class)
  legend.selectAll('text')
    .data(styles)
    .enter()
    .append('text')
    .attr('x', circleX)
    .attr('y', objSize + dp)
    .text(d => d.label)
}

// Entry point
drawLegend()
d3.json('http://localhost:8080/model/target.json', (error, topoData) => {
  if (error) {
    throw error
  }
  var visualizer = new GraphVisualizer(topoData)
  // for debug
  console.log('topology : ', visualizer.topoModel)
  console.log('graphs   : ', visualizer.graphs)
  // draw
  visualizer.drawGraphs()
})
