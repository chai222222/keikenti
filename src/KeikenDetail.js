import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';

import { EXPERIENCES_REVERSE } from './constants';

class KeikenDetail extends Component {

  static propTypes = {
    prefNames: PropTypes.object.isRequired,
    prefData: PropTypes.object.isRequired,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return !this.props.prefNames.equals(nextProps.prefNames)
      || !this.props.prefData.equals(nextProps.prefData);
  }

  _createCard(exp, experience) {
    const prefs = this.props.prefNames.filter(name => this.props.prefData.get(name).get('experience') === experience);
    return (
      <Card key={exp.name} style={{ width: "100%" }}>
        <CardHeader title={`${exp.mark} … ${exp.text} (${exp.subtext})`}
          subtitle={ `${experience}点 x ${prefs.size}` }
          avatar={<Avatar backgroundColor={ exp.color }>{exp.mark}</Avatar>} />
        <CardText>
          { prefs.map(name => <span key={name} style={{ marginRight: "10px" }}>{this.props.prefData.get(name).get('local')}</span>) }
        </CardText>
      </Card>
    );
  }

  _createCards() {
    return EXPERIENCES_REVERSE.map((exp, idx) => this._createCard(exp, EXPERIENCES_REVERSE.length - idx - 1));
  }

  render() {
    console.log('#### KeikenDetail render ####')
    return <div>{ this._createCards() }</div>;
  }
}

export default KeikenDetail;
