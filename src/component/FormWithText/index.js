/**
 * 表单项文本组合组件
 * demo 参见
 * Shop/Detail/PickUp
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './style.css';

class FormWithText extends Component {
  render() {
    const { formState, children, className: setClassName } = this.props;
    return (
      <div className={`inline-block ${setClassName}`}>
        {
          children.map((item, index) => {
            let width = 'initial';
            if (formState !== 'view' && item.type.name === 'FormItem') {
              let className = '';
              if (Array.isArray(item.props.children)) {
                className = item.props.children[0].props.className;
              } else {
                className = item.props.children.props.className;
              }
              if (className) {
                width = className.slice(1) / 1;
              }
            }
            return (<div
              key={index}
              className={styles.formWithText}
              style={{
                marginLeft: index ? '2px' : 0,
                width,
              }}
            >{item}</div>);
          })
        }
      </div>
    );
  }
}

FormWithText.propTypes = {
  // 表单状态 view: 查看 其他为编辑态
  formState: PropTypes.string,
  // 自定义子节点
  children: PropTypes.oneOfType([PropTypes.array]),
  // className
  className: PropTypes.string,
};

FormWithText.defaultProps = {
  formState: 'modify',
};

export default FormWithText;
