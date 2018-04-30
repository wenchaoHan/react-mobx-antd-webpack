import React, { Component } from 'react';
import PropTypes from 'prop-types';

export { default as Wrap } from './wrap';

class Wrapper extends Component {

  renderChildren(children) {
    const {
      /* eslint-disable no-unused-vars */
      renderBefore,
      renderAfter,
      /* eslint-disable no-unused-vars */
      ...childProps
    } = this.props;
    const child = [].concat(children).filter(curChild => !!curChild)[0];
    if (!child) return null;
    const newchild = React.cloneElement(child, childProps);
    return newchild;
  }

  render() {
    const {
      children,
      renderBefore,
      renderAfter,
    } = this.props;
    return (
      <div>
        {renderBefore()}
        {this.renderChildren(children)}
        {renderAfter()}
      </div>
    );
  }
}

Wrapper.propTypes = {
  renderBefore: PropTypes.func,
  renderAfter: PropTypes.func,
  children: PropTypes.node,
};

Wrapper.defaultProps = {
  renderBefore: () => {},
  renderAfter: () => {},
};

export default Wrapper;
