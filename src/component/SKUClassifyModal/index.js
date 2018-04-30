/**
 * 选择门店：
 * demo: /bach-erp/web/Product/Product/List/
 * 后台分类选择
 */

import React, { Component } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Modal, Input, Icon } from 'bach-antd';
import SKUClassify from 'BizComponent/SKUClassify';
import store from './store';
import styles from './index.css';

const NOOP = () => {};

const getCategoryCode = (categories) => {
  if (categories && categories.length > 0) {
    return categories[categories.length - 1].categoryCode;
  }
  return '';
};

@observer
class ClassifyModal extends Component {
  constructor(props) {
    super(props);
    this.categories = props.value || [null, null, null];
    this.checkCategoryCode = '';
  }

  componentWillMount() {
    const { value } = this.props;
    if (value) {
      if (typeof value !== 'string') {
        store.categories = value || [];
        this.categories = value || [null, null, null];
        const code = getCategoryCode(value);
        if (this.checkCategoryCode !== code) {
          this.checkCategoryCode = code;
          this.props.onChange(code);
        }
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { value } = nextProps;
    if (value) {
      if (typeof value !== 'string') {
        store.categories = value || [];
        this.categories = value || [null, null, null];
        const code = getCategoryCode(value);
        if (this.checkCategoryCode !== code) {
          this.checkCategoryCode = code;
          this.props.onChange(code);
        }
      }
    } else {
      store.categories = [];
      this.categories = [null, null, null];
    }
  }

  // 选择分类
  setCategoryCode = (data) => {
    const level = data.level !== undefined ? data.level - 1 : null;
    if (level !== null) {
      this.categories[level] = data;
      this.categories.forEach((item, index) => {
        if (index > level) {
          this.categories[index] = null;
        }
      });
    }
  }

  // 点击确定
  handleOk =() => {
    const categories = this.categories.filter(item => item !== null);
    store.categories = categories.concat([]);
    if (categories.length > 0) {
      const categoryCode = categories[categories.length - 1].categoryCode;
      this.checkCategoryCode = categoryCode;
      this.props.onChange(categoryCode);
    } else {
      this.checkCategoryCode = '';
      this.props.onChange('');
    }
    store.hideClassify();
  }

  showClassify = () => {
    if (!this.props.disabled) {
      store.showClassify();
    }
  }

  render() {
    const { className, size, disabled } = this.props;
    const { visible, hideClassify, selected, getCategories } = store;
    return (
      <div>
        <Input
          onClick={this.showClassify}
          onFocus={e => e.target.blur()}
          suffix={<Icon
            type="down"
            className="ant-select-arrow"
            onClick={this.showClassify}
          />}
          value={selected}
          className={`${styles.classifyinput} ${className !== null ? className : 'w100'}`}
          placeholder="请选择分类"
          size={size !== undefined ? size : 'default'}
          disabled={disabled}
        />
        <Modal
          title="选择分类"
          width={1000}
          maskClosable={false}
          visible={visible}
          onOk={this.handleOk}
          onCancel={hideClassify}
        >
          <SKUClassify
            height="400px"
            operate={false}
            initialValue={getCategories}
            getFinalData={this.setCategoryCode}
          />
        </Modal>
      </div>
    );
  }
}

ClassifyModal.propTypes = {
  // 样式
  className: PropTypes.string,
  // 弹窗点击确定时触发
  onChange: PropTypes.func,
  // 输入框大小
  size: PropTypes.string,
  // 值
  value: PropTypes.arrayOf(PropTypes.object),
  // 是否可编辑
  disabled: PropTypes.bool,
};

ClassifyModal.defaultTypes = {
  onChange: NOOP,
  className: null,
  value: [],
  disabled: false,
};

export default ClassifyModal;
