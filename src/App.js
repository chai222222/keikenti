import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import TextField from 'material-ui/TextField';
import AutoComplete from 'material-ui/AutoComplete';
import Immutable from 'immutable';
import EventListener from 'react-event-listener';
import { Card, CardHeader, CardText } from 'material-ui/Card';

import KeikenMap from './KeikenMap';
import KeikenDetail from './KeikenDetail';
import KeikenInputPanel from './KeikenInputPanel';

import { EXPERIENCES, TITLES } from './constants';

// geo2topo output
import japanKeikenMap from './japan_geo2topo.json';

class App extends Component {

  constructor() {
    super();
    this.state = {
      data: Immutable.fromJS(this._createStateFromQuery()),
      width: 1300,
      detailExpanded: true,
      inputExpanded: false,
    };
  }

  componentDidMount() {
    this._updateWidth();
  }

  componentDidUpdate() {
    this._updateWidth();
  }

  _updateWidth() {
    if (this.state.width !== this.titleDiv.offsetWidth) {
      this.setState({ width: this.titleDiv.offsetWidth});
    }
  }

  _createStateFromQuery() {
    const pat = /^(MAP|NAM|CAT)$/;
    const param = window.location.search.substr(1).split('&')
      .map(kv => kv.split('=', 2))
      .filter(kvArr => kvArr.length === 2 && pat.test(kvArr[0]))
      .reduce((acc, cur) => (acc[cur[0]] = decodeURI(cur[1]), acc), {}); // eslint-disable-line no-sequences
    return this._createState(param.MAP || '', param.NAM || '', param.CAT || '');
  }

  _createQuery(data = this.state.data) {
    return Immutable.Map({
      MAP: data.get('prefNames').map(name => data.get('prefData').get(name).get('experience') + '').join(''),
      NAM: data.get('name'),
      CAT: data.get('title'),
    }).map((v, k) => `${k}=${encodeURI(v)}`).join('&');
  }

  _createState(prefStateStr = '', name = '', title = '') {
    let total = 0;
    const st = {
      prefNames: null, // 北海道～沖縄までのID順の配列
      name, // your name
      title, // title
      total, // total score
      prefData: { // nameをキーにした状態KeikenMap
        // id: "ID_xx",
        // local: "青森県",
        // experience: 0-5,
      }
    };
    st.prefNames = japanKeikenMap.objects['-'].geometries
      .sort((a, b) => b.properties.iso_3166_2.substr(2) - a.properties.iso_3166_2.substr(2) ) // 'ID-xx' の xx の数値でソート
      .map((pref, idx) => {
        const name = pref.properties.name;
        const exp = this._extractExperience(prefStateStr, idx);
        st.prefData[name] = {
          id: pref.properties.iso_3166_2,
          local: pref.properties.name_local,
          experience: exp,
        };
        total += exp;
        return name;
      });
    st.total = total;
    return st;
  }

  _extractExperience(prefStateStr, idx) {
    let c;
    return idx < prefStateStr.length && !isNaN(c = prefStateStr.substr(idx, 1)) ? ((c - 0) % EXPERIENCES.length) : 0; // eslint-disable-line no-cond-assign
  }

  _changeExperience(name, experience) {
    const before = this.state.data.getIn(['prefData', name, 'experience'])
    const data = this.state.data.updateIn(['prefData', name, 'experience'], () => experience) // 新経県値
                                .updateIn(['total'], (total) => total + experience - before); // トータル更新
    this._setData(data);
  }

  _setData(data) {
    this.setState({ data });
    const url = window.location.href;
    const result = /.*\/([^?]*)(\?.*)$/.exec(url);
    if (result) {
      window.history.replaceState('', '', `${result[1]}?${this._createQuery(data)}`);
    } else {
      window.history.replaceState('', '', `?${this._createQuery(data)}`);
    }
  }

  render() {
    const data = this.state.data;
    const title = data.get('title');
    const total = data.get('total');
    const name = data.get('name');
    const prefData = data.get('prefData');
    const prefNames = data.get('prefNames');
    const w = this.state.width;
    const h = Math.floor(960 * w / 1300);
    const s = Math.floor(2000 * w / 1300);
    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <div>
          <div ref={titleDiv => {this.titleDiv = titleDiv}} style={{ width: "100%" }}>
            <span style={{ float: "right" }}>{`経県値：${total}点`} </span>
            <span>{`『${name}』さんの経県値＆経県マップ【${title}】`} </span>
            <EventListener target="window" onResize={() => this._updateWidth()} />
          </div>
          <KeikenMap width={w} height={h} scale={s} prefData={prefData} />
          <Card expanded={this.state.detailExpanded} onExpandChange={ (detailExpanded) => { console.log(detailExpanded); this.setState({ detailExpanded }); } }>
            <CardHeader title="詳細" showExpandableButton={true} actAsExpander={true} />
            <CardText expandable={true}>
              <KeikenDetail prefNames={prefNames} prefData={prefData} />
            </CardText>
          </Card>
          <Card expanded={this.state.inputExpanded} onExpandChange={ (inputExpanded) => { console.log(inputExpanded); this.setState({ inputExpanded }); } }>
            <CardHeader title="編集" showExpandableButton={true} actAsExpander={true} />
            <CardText expandable={true}>
              <TextField floatingLabelText="ニックネーム" value={ name }
                onChange={ (ev, t) => { this._setData(data.updateIn(['name'], () => t)); } } />
              <AutoComplete floatingLabelText="タイトル" searchText={ title } filter={AutoComplete.noFilter} openOnFocus={true} dataSource={ TITLES }
                onUpdateInput={ (t) => { this._setData(data.updateIn(['title'], () => t)); } } />
              <KeikenInputPanel prefNames={prefNames} prefData={prefData}
                onSelect={ (name, e) => this._changeExperience(name, e) } />
            </CardText>
          </Card>

        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
