import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Wrap extends Component {

  handleChange = (value, onChange) => {
    if (onChange) {
      onChange(value);
    }
    this.props.onChange(value);
  }

  replaceChildren = (childs) => {
    const childList = [].concat(childs).filter(curChild => !!curChild);
    return childList.map((child, idx) => {
      const children = child.props && child.props.children;
      if (children && typeof child.type !== 'function') {
        return React.cloneElement(child, {
          children: this.replaceChildren(children),
          key: idx,
        });
        // child.props.children = this.replaceChildren(children);
      }
      if (typeof child.type === 'function') {
        const {
        /* eslint-disable no-unused-vars */
          children: newChildren,
        /* eslint-disable no-unused-vars */
          ...restProps
        } = this.props;
        return React.cloneElement(child, Object.assign({}, child.props, restProps, {
          onChange: val => this.handleChange(val, child.props ? child.props.onChange : undefined),
          key: idx,
        }));
      }
      return child;
    });
  }

  render() {
    return (
      <div className={'inline-block'} >
        {this.replaceChildren(this.props.children)}
      </div>
    );
  }
}

Wrap.propTypes = {
  onChange: PropTypes.func,
  children: PropTypes.node,
};

Wrap.defaultProps = {
  onChange: () => { },
};

export default Wrap;

// export { default as Wrap } from './wrap';

