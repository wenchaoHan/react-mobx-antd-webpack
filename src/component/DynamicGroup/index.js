/**
 * 自动动态增删组件
 * desc: 只需要将想要实现增删的组件作为children内嵌到DynamicGroup中即可享有动态增删功能
 * demo: src/component/DynamicRangePicker
 * @class DynamicGroup
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'BizComponent/Button';
import { Col, Icon, Row } from 'bach-antd';
import styles from './index.css';

class DynamicGroup extends Component {

  constructor(props) {
    super(props);
    this.handleLenChange = this.handleLenChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    const {
      value = [props.defaultItemValue],
    } = props;
    let initValue = value;
    if (value.length <= 0) {
      initValue = [props.defaultItemValue];
    }
    this.state = {
      value: initValue,
    };
    this.initValue = initValue;
  }

  componentWillReceiveProps(nextProps) {
    const { value } = this.props;
    if (nextProps.value !== value) {
      let newValue = nextProps.value || this.initValue;
      if (!newValue.length) {
        newValue = this.initValue;
      }
      this.setState({
        value: newValue,
      });
    }
  }

  genArr(len) {
    const arr = [];
    for (let i = 0; i < len; i += 1) {
      arr[i] = i;
    }
    return arr;
  }

  checkIsObj(value) {
    return Object.prototype.toString.call(value) === '[object Object]';
  }

  handleChange(val, idx, callback) {
    const newValue = [].concat(this.state.value);
    newValue[idx] = val;
    if (callback) callback(val);
    this.props.onChange(newValue);
  }

  handleLenChange(add = true, idx) {
    const newValue = [].concat(this.state.value);
    if (add) {
      newValue.push(this.props.defaultItemValue);
    } else {
      newValue.splice(idx, 1);
    }
    this.props.onChange(newValue);
  }

  genRowClass = (idx) => {
    let className = '';
    const { errItemIndex } = this.props;
    if (errItemIndex !== -1) {
      className = (errItemIndex !== idx + 1 && ' no-error-color') || '';
    }
    return className;
  }

  renderChildren(childrens) {
    const child = [].concat(childrens)[0];
    if (!child) return null;
    const {
      rowClassName,
      defaultItemValue,
      /* eslint-disable no-unused-vars,react/prop-types */
      rowWrapClass,
      showAdd,
      children,
      addBtnText,
      btnPlusClass,
      showDelBtn,
      errItemIndex,
      /* eslint-enable no-unused-vars,react/prop-types */
      ...restProps
    } = this.props;
    delete restProps['data-__meta'];
    const {
      value = [],
    } = this.state;
    const len = value.length || 1;
    const newChildren = this.genArr(len).map((idx) => {
      const childClassName = child.props.className;
      const rowClass = rowClassName(idx, idx === len, errItemIndex) || '';
      const childProps = {
        ...child.props,
        ...restProps,
        onChange: val => this.handleChange(val, idx, child.props.onChange),
        value: value[idx] || defaultItemValue,
        className: `inline-block${childClassName ? ` ${childClassName}` : ''}`,
        index: idx,
        errItemIndex,
      };
      const cloneChild = React.cloneElement(child, childProps);
      const rowClassPrefix = `margin-bottom-middle${this.genRowClass(idx)}`;
      return (<div key={idx} className={`${rowClassPrefix}${rowWrapClass ? ` ${rowWrapClass}` : ''}${rowClass ? ` ${rowClass}` : ''}`}>
        {cloneChild}
        {!this.props.view && len > 1 && <Col span={2} className={styles.subBtn}>
          {len > 1 &&
            <Button
              type={'link'}
              className={`red ${styles.btnSubStyle}`}
              onClick={() => this.handleLenChange(false, idx)}
            >
              <Icon type={'minus'} />删除
            </Button>
          }
        </Col>}
      </div>);
    });
    return newChildren;
  }

  render() {
    return (<div className={this.props.className}>
      {this.renderChildren(this.props.children)}
      {!this.props.view && this.props.showAdd && <Row key={'add'}>
        <Col className={`styles.btnPlusStyle ${this.props.btnPlusClass}`}>
          <Button
            type={'link'}
            className={'blue'}
            onClick={() => this.handleLenChange(true)}
            data={'add'}
          ><Icon type={'plus'} />{this.props.addBtnText}</Button>
        </Col>
      </Row>}
    </div>);
  }
}

DynamicGroup.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.array,
  children: PropTypes.node,
  /* eslint-disable react/forbid-prop-types */
  // 每新增一条的默认值
  defaultItemValue: PropTypes.any,
  /* eslint-enable react/forbid-prop-types */
  // 容器的class
  className: PropTypes.string,
  // 每一条item的className rowClassName(idx, idx === len)
  rowClassName: PropTypes.func,
  // 每个行的最外层容器的类名
  rowWrapClass: PropTypes.string,
  // 是否展示添加按钮
  showAdd: PropTypes.bool,
  // 自定义添加按钮的文字
  addBtnText: PropTypes.string,
  // 添加按钮的类名
  btnPlusClass: PropTypes.string,
  // 是否展示添加、删除按钮组
  view: PropTypes.bool,
  // 校验错误的行号，从1开始
  errItemIndex: PropTypes.number,
};

DynamicGroup.defaultProps = {
  onChange: () => {},
  rowClassName: () => {},
  showAdd: true,
  addBtnText: '添加',
  view: false,
  errItemIndex: -1,
  // value: [],
  // defaultItemValue: [],
};

export default DynamicGroup;
