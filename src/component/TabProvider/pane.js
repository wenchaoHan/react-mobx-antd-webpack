import React, { Component } from 'react';
import PropTypes from 'prop-types';


class TabPane extends Component {
  render() {
    const { children, route, show } = this.props;
    const defaultKey = (this.context && this.context.contextActiveKey);
    if (!show || (this.context.destory && defaultKey !== route)) {
      return null;
    }
    const display = defaultKey === route ? '' : 'none';
    return (
      <div
        style={{ display }}
      >{ typeof children === 'string' ? <div>{children}</div> : children}</div>
    );
  }
}

TabPane.propTypes = {
  route: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.object,
    PropTypes.string,
  ]),
  show: PropTypes.bool,
};

TabPane.contextTypes = {
  contextActiveKey: PropTypes.string,
  destory: PropTypes.bool,
};

TabPane.defaultProps = {
  children: null,
  route: '',
  show: true,
};

export default TabPane;
