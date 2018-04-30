import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import wrapDisplayName, { setDisplayName } from '../getDisplayName';

export default function wrap(BaseComponent) {
  class Wrap extends Component {
    static propTypes = {
      onChange: PropTypes.func,
      children: PropTypes.node,
      /* eslint-disable react/forbid-prop-types */
      // value: PropTypes.any,
      /* eslint-enable react/forbid-prop-types */
    }
    static defaultProps = {
      onChange: () => { },
    }

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
      const {
        children,
      } = this.props;
      const newProps = {
        children: this.replaceChildren(this.props.children),
      };
      return (
        <BaseComponent
          {...this.props}
          {...newProps}
        />
      );
    }
  }

  // if (process.env.NODE_ENV === 'dev') {
  //   return setDisplayName(wrapDisplayName(BaseComponent, 'Wrap'))(
  //     Wrap
  //   );
  // }
  return Wrap;
}

