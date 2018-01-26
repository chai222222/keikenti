import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import FontIcon from 'material-ui/FontIcon';

import { EXPERIENCES_REVERSE } from './constants';

const uncheckedIconStyles = {
  width: "30px",
  textAlign: "center",
};
const checkedIconStyles = {
  ...uncheckedIconStyles,
  border: "solid 2px",
  borderRadius: "4px"
};
const pstyle = {
  margin: 10,
  textAlign: 'left',
  paddingBottom: "10px",
};
const dstyle = {
  display: "inline-block",
  textAlign: 'center',
  width: '100px',
};
const rbxstyle = {
  display: 'inline-block',
};
const rbstyle = {
  display: 'inline-block',
  width: "30px",
  marginRight: 5,
};

class KeikenInputOnePanel extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    pref: PropTypes.object.isRequired, // Immutable Map
    onSelect: PropTypes.func.isRequired,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return !this.props.pref.equals(nextProps.pref)
      // || this.props.onSelect !== nextProps.onSelect
      || this.props.name !== nextProps.name;
  }

  render() {
    const { name, pref } = this.props;
    return (
      <Paper key={name} style={{ ...pstyle }} zDepth={1}>
        <div style={{ ...dstyle }} ><span style={{ whiteSpace: "nowrap" }}>{pref.get('local')}</span></div>
        <RadioButtonGroup name={name} style={{ ...rbxstyle }} defaultSelected={pref.get('experience')}
            onChange={(e, v) => this.props.onSelect(name, v)}>
          { EXPERIENCES_REVERSE.map((e, idx) =>
            <RadioButton style={{ ...rbstyle }} key={e.name} value={EXPERIENCES_REVERSE.length - idx - 1}
              checkedIcon={ <FontIcon style={{ ...checkedIconStyles, }}>{ e.mark }</FontIcon> }
              uncheckedIcon={ <FontIcon style={{ ...uncheckedIconStyles }}>{ e.mark }</FontIcon> } /> ) }
        </RadioButtonGroup>
      </Paper>
    );
  }
}

class KeikenInputPanel extends Component {

  static propTypes = {
    prefNames: PropTypes.object.isRequired,
    prefData: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return !this.props.prefNames.equals(nextProps.prefNames)
      // || this.props.onSelect !== nextProps.onSelect
      || !this.props.prefData.equals(nextProps.prefData);
  }

  _createPref(name) {
    const pref = this.props.prefData.get(name);
    return <KeikenInputOnePanel key={name} name={name} pref={pref} onSelect={this.props.onSelect} />
  }

  _createPrefs() {
    return this.props.prefNames.map(p => this._createPref(p))
  }

  render() {
    console.log('#### KeikenInputPanel render ####')
    return (<div>{ this._createPrefs() }</div>);
  }
}

export default KeikenInputPanel;
