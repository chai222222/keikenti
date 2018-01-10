import React, { Component } from 'react';
import * as topojson from 'topojson-client';
import * as d3 from 'd3';

// geo2topo output
import mapJson from './japan_geo2topo.json';

class Map extends Component {

  componentDidMount() {
    this.drawMap()
  }

  componentDidUpdate() {
    this.drawMap()
  }

  drawMap() {

    var w = 1300;
    var h = 960;
    // 地図の投影図法を設定する．
    var projection = d3.geoMercator()
        .center([136, 35.5])
        .scale(2000)
        .translate([w / 2, h / 2]);

    // GeoJSONからpath要素を作る．
    var path = d3.geoPath()
        .projection(projection);

    const jpn = mapJson;
    const geoJp = topojson.feature(jpn, jpn.objects['-']);
    console.log(geoJp);
    const svg = d3.select(this.node);
    svg.attr('height', h)
      .attr('width', w)
      .selectAll("path")
      .data(geoJp.features)
      .enter()
      .append("path")
      .attr("class", d => d.properties.region ? `region ${d.properties.region.toLowerCase()}` : 'region')
      .attr("d", path);
  }

  render() {
    return (
      <svg ref={node => this.node = node}>
      </svg>
    );
  }
}

export default Map;
