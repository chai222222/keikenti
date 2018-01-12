import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as topojson from 'topojson-client';
import * as d3 from 'd3';

// geo2topo output
import mapJson from './japan_geo2topo.json';
import { EXPERIENCES } from './constants';

class Map extends Component {

  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    scale: PropTypes.number.isRequired,
    mapState: PropTypes.object.isRequired,
  }; 
  componentDidMount() {
    this.drawMap()
  }

  componentDidUpdate() {
    this.drawMap()
  }

  drawMap() {

    const w = this.props.width;
    const h = this.props.height;

    const jpn = mapJson;
    const geoJp = topojson.feature(jpn, jpn.objects['-']);

    const center = d3.geoCentroid(geoJp);

    // 地図の投影図法を設定する．
    var projection = d3.geoMercator()
        .center(center)
        .scale(this.props.scale)
        .translate([w / 2, h / 2]);

    // GeoJSONからpath要素を作る．
    var path = d3.geoPath().projection(projection);

    console.log(geoJp);
    const svg = d3.select(this.node);
    svg.append('rect') // うーみ
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', w)
      .attr('height', h)
      .attr('style', 'fill: #3987c9;');
    svg.attr('height', h)
      .attr('width', w)
      .selectAll("path")
      .data(geoJp.features)
      .enter()
      .append("path")
        .attr("class", d => this._name2Class(d.properties.name))
        .attr("d", path);
  }

  _name2Class(name) {
    console.log(this.props.mapState.prefData[name].experience);
    return EXPERIENCES[this.props.mapState.prefData[name].experience].name;
  }

  render() {
    return <svg ref={node => this.node = node} />
  }
}

export default Map;
