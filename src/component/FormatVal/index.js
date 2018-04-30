import React, { Component } from 'react';
import PropTypes from 'prop-types';

class FormatVal extends Component {

  constructor(props) {
    super(props);
    const child = [].concat(props.children).filter(curChild => !!curChild)[0];
    this.childProps = child ? child.props : {};
  }

  handleChange(val, callback) {
    if (callback) callback(val);
    const newValue = this.props.formatVal(val, false, this.childProps);
    this.props.onChange(newValue);
  }

  /* formatVal(value, capture = false) {
    let newValue = value;
    if (value) {
      if (capture) {
        newValue = value;
      } else {
        newValue = value;
      }
    }
    return newValue;
  }*/

  renderChildren(childrens) {
    const child = [].concat(childrens).filter(curChild => !!curChild)[0];
    if (!child) return null;
    const {
      /* eslint-disable no-unused-vars,react/prop-types */
      formatVal,
      children,
      className,
      /* eslint-enable no-unused-vars,react/prop-types */
      ...restProps
    } = this.props;
    const childClassName = child.props.className;
    const childProps = {
      ...child.props,
      ...restProps,
      className: `${className || ''}${childClassName ? ` ${childClassName}` : ''}`,
      onChange: val => this.handleChange(val, this.childProps.onChange),
      value: this.props.formatVal(this.props.value, true, this.childProps),
    };
    const newchild = React.cloneElement(child, childProps);
    return newchild;
  }

  render() {
    return this.renderChildren(this.props.children);
  }
}

FormatVal.propTypes = {
  onChange: PropTypes.func.isRequired,
  /* eslint-disable react/forbid-prop-types */
  value: PropTypes.any,
  /* eslint-enable react/forbid-prop-types */
  children: PropTypes.node,
  formatVal: PropTypes.func,
};

FormatVal.defaultProps = {
  onChange: () => {},
  formatVal: v => v,
  // value: [],
};

export default FormatVal;

