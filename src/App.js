import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Map from './Map';

import { EXPERIENCES } from './constants';

// geo2topo output
import japanMap from './japan_geo2topo.json';

class App extends Component {

  constructor() {
    super();
    const dummy = Array.from(Array(japanMap.objects['-'].geometries.length))
      .map(d => Math.floor(Math.random() * EXPERIENCES.length) + '').join('');
    this.state = this._createState(dummy);
  }

  _createState(prefStateStr = '', name = '', title = '') {
    const st = {
      prefNames: null, // 北海道～沖縄までのID順の配列
      name, // your name
      title, // title
      prefData: { // nameをキーにした状態Map
      }
    };
    st.prefNames = japanMap.objects['-'].geometries
      .sort((a, b) => b.properties.iso_3166_2.substr(2) - a.properties.iso_3166_2.substr(2) ) // 'ID-xx' の xx の数値でソート
      .map((pref, idx) => {
        const name = pref.properties.name;
        st.prefData[name] = {
          id: pref.properties.iso_3166_2,
          local: pref.properties.name_local,
          experience: this._extractExperience(prefStateStr, idx)
        };
        return name;
      });
    return st;
  }

  _extractExperience(prefStateStr, idx) {
    const plen = prefStateStr.length;
    const e = idx < plen ? prefStateStr.substr(idx, 1) : '0';
    return (e - 0) % EXPERIENCES.length;
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Map width="1300" height="960" scale="2000" mapState={{...this.state}} />
      </div>
    );
  }
}

export default App;
