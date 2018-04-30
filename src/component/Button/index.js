/**
 * 列表页的操作：
 * demo: /bach-erp/web/Demo/BaseDemo
 * 跳转可以设置target参数
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'bach-antd';

class Btn extends Component {

  constructor(props) {
    super(props);
    this.getClassName = this.getClassName.bind(this);
  }

  onClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const { data, onClick } = this.props;
    if (data !== undefined) {
      onClick(data);
    } else {
      onClick();
    }
  }

  getClassName() {
    const classNames = [];
    if (this.props.type === 'primary') {
      classNames.push('ant-btn-primary');
    } else if (this.props.type === 'danger') {
      classNames.push('ant-btn-danger');
    }
    if (this.props.size === 'small') {
      classNames.push('ant-btn-sm');
    } else if (this.props.size === 'large') {
      classNames.push('ant-btn-lg');
    }
    return classNames.join(' ');
  }

  getButton = (props, children) => {
    const propsItem = props;
    if (propsItem.href) {
      delete propsItem.href;
    }
    if (propsItem.htmlType === 'submit') {
      return <Button {...propsItem}>{children}</Button>;
    }
    return <Button {...propsItem} onClick={this.onClick}>{children}</Button>;
  }

  getLinkButton = (props, children, hasHref) => {
    if (props.disabled === true) {
      return (<span className={`${props.className} grey`}>{children}</span>);
    }
    if (hasHref === true) {
      return (<a {...this.props} >{children}</a>);
    }
    /* eslint-disable no-script-url */
    return (<a href="javascript: void(0);" className={props.className} onClick={this.onClick} >{children}</a>);
  }

  getButtonLink = (props, children) => {
    if (props.disabled === true) {
      return (<Button {...props} disabled>{children}</Button>);
    }
    return (<a {...this.props} className={`ant-btn ${this.getClassName()} ${props.className}`}>{children}</a>);
  }

  execLinkButton =() => {
    const { type, href, children } = this.props;
    if (type === 'link') {
      if (href !== undefined && href !== '') {
        return this.getLinkButton(this.props, children, true);
      }
      return this.getLinkButton(this.props, children, false);
    }
    if (href !== undefined && href !== '') {
      return this.getButtonLink(this.props, children);
    }
    return this.getButton(this.props, children);
  }

  render() {
    return this.execLinkButton();
  }
}

Btn.propTypes = {
  // 类型：包含ant里Button的类型，增加里“link”，为文字链形式的按钮
  type: PropTypes.string,
  // 如果点击直接调整一个页面则配置次参数
  href: PropTypes.string,
  // 大小，和ant提供的一致
  size: PropTypes.string,
  // 自定义样式
  /* eslint-disable react/no-unused-prop-types */
  className: PropTypes.string,
  // 数据，会作为点击事件的回调参数
  data: PropTypes.any, // eslint-disable-line 
  // 点击事件
  onClick: PropTypes.func,
  // 子节点
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.element,
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
  ]),
  // 是否有效
  /* eslint-disable react/no-unused-prop-types */
  disabled: PropTypes.bool,
};

Btn.defaultProps = {
  type: '',
  href: '',
  size: 'default',
  className: '',
  children: '',
  data: '',
  disabled: false,
  onClick: () => {},
};

export default Btn;
