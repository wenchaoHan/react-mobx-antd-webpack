import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Breadcrumb } from 'antd';
import store from '../store.js';

const Item = Breadcrumb.Item;

@observer
class Crumb extends Component {
  getCrumbItem(crumb) {
    const len = crumb.length - 1;

    return crumb.map((item, index) => {
      const inner = (index < len) && index !== 0 ?
        <a href={item.path}>{item.name}</a> :
        item.name;

      return <Item key={`key${index}`}>{inner}</Item>;
    });
  }

  render() {
    const crumb = toJS(store.trace);
    return (crumb && crumb.length) ? (
      <Breadcrumb separator=">">
        {this.getCrumbItem(crumb)}
      </Breadcrumb>
    ) : <Breadcrumb />;
  }
}

Crumb.propTypes = {
  crumb: PropTypes.arrayOf(PropTypes.object),
};

export default Crumb;
