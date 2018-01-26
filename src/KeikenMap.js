import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as topojson from 'topojson-client';
import * as d3 from 'd3';

// geo2topo output
import mapJson from './japan_geo2topo.json';
import { EXPERIENCES } from './constants';

class KeikenMap extends Component {

  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    scale: PropTypes.number.isRequired,
    prefData: PropTypes.object.isRequired,
  };

  constructor() {
    super();
    this.state = { };
  }

  componentWillReceiveProps(nextProps) {
    const diffPrefs = [ ...nextProps.prefData
      .filter((v, name) => this.props.prefData.get(name).get('experience') !== v.get('experience'))
      .keys() ];
    this.setState({ updated: diffPrefs });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.width !== nextProps.width
      || this.props.height !== nextProps.height
      || this.props.scale !== nextProps.scale
      || !this.props.prefData.equals(nextProps.prefData);
  }

  componentDidMount() {
    this._drawKeikenMap()
  }

  componentDidUpdate() {
    this._updateKeikenMap()
  }

  _updateKeikenMap() {
    if (this.state.updated === undefined) return;

    // update
    if (this.state.updated.length) { // 経験値の修正
      const svg = d3.select(this.node);
      this.state.updated.forEach((name) => {
        svg.select(`#${name}`).attr("style", d => this._name2Style(name))
      });
    } else { // windows size修正
      this._drawKeikenMap();
    }
  }

  _drawKeikenMap() {
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

    const svg = d3.select(this.node);
    // clear
    svg.selectAll('rect').remove();
    svg.selectAll('path').remove();
    // draw
    svg.append('rect') // うーみ
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', w)
      .attr('height', h)
      .attr('style', 'fill: #3987c9;');
    svg.attr('height', h) // にっぽん
      .attr('width', w)
      .selectAll("path")
      .data(geoJp.features)
      .enter()
      .append("path")
        .attr("id", d => d.properties.name)
        .attr("style", d => this._name2Style(d.properties.name))
        .attr("d", path);
  }

  _name2Style(name) {
    return `fill: ${EXPERIENCES[this.props.prefData.get(name).get('experience')].color};`;
  }

  render() {
    console.log('#### KeikenMap render ####')
    return <svg ref={node => this.node = node} />
  }
}

export default KeikenMap;
