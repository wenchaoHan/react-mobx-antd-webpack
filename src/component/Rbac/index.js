import React, { Component } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';

import store from './store.js';

@observer
class Rbac extends Component {
  static propTypes = {
    uri: PropTypes.string.isRequired,
    children: PropTypes.element,
    holder: PropTypes.node,
  };

  static defaultProps = {
    holder: null,
  };

  componentWillMount() {
    store.add(this.props.uri);
  }

  render() {
    const { uri, holder } = this.props;
    const holderElement = !React.isValidElement(holder) ? <span>{holder}</span> : holder;
    return store.authed.get(uri) ? this.props.children : holderElement;
  }
}

Rbac.store = store;

export default Rbac;
