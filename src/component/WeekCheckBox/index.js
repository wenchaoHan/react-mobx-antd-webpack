import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CheckboxGroupAll from 'BizComponent/CheckboxGroupAll';

class WeekCheckBox extends Component {
  constructor(props) {
    super(props);
    this.weekOpt = [
      { label: '周一', value: 1 },
      { label: '周二', value: 2 },
      { label: '周三', value: 3 },
      { label: '周四', value: 4 },
      { label: '周五', value: 5 },
      { label: '周六', value: 6 },
      { label: '周日', value: 7 },
    ];
  }
    // 日期

  render() {
    const { value = [], view, options } = this.props;
    const newValue = value.slice().sort((a, b) => a - b);
    // 查看状态
    const week = newValue.map((item, idx) =>
      `${this.weekOpt[item - 1].label}${value.length !== idx + 1 ? '、' : ''} `);

    const weekOpt = options !== undefined ? options : this.weekOpt;
    return !view ? <CheckboxGroupAll options={weekOpt} {...this.props} /> : <div>{week}</div>;
  }
}

// 属性参考 CheckboxGroupAll，属性全部透传到了CheckboxGroupAll
WeekCheckBox.propTypes = {
  // 是否为查看编辑状态
  view: PropTypes.bool,
  // 从后端拿到的值
  value: PropTypes.array,
  // 参数
  options: PropTypes.array,
};

export default WeekCheckBox;
