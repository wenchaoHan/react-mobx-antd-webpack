/**
 * 在TimePicker组件的基础上支持了范围全选，由两个TimePicker构成
 * demo 参见
 * Promotion/ActDetail/index.js
 */

import { TimePicker } from 'bach-antd';
import React, {
  Component,
} from 'react';
import PropTypes from 'prop-types';
import styles from './index.css';

export default class RangeTimePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endOpen: false,
    };
    this.onStartChange = this.onStartChange.bind(this);
    this.onEndChange = this.onEndChange.bind(this);
    this.handleStartOpenChange = this.handleStartOpenChange.bind(this);
    this.handleEndOpenChange = this.handleEndOpenChange.bind(this);
    this.isObj = !Array.isArray(props.value || []);
  }

  onStartChange(startValue) {
    const {
      value = [],
    } = this.props;
    const newValue = this.isObj ? {
      from: startValue,
      to: value.to,
    } : [startValue, value[1]];
    if (!this.isSameValue(newValue)) {
      if (this.props.onChange) this.props.onChange(newValue);
    }
  }

  onEndChange(endValue) {
    const {
      value = [],
    } = this.props;
    const newValue = this.isObj ? {
      from: value.from,
      to: endValue,
    } : [value[0], endValue];
    if (!this.isSameValue(newValue)) {
      if (this.props.onChange) this.props.onChange(newValue);
    }
  }

  isSameValue(newValue) {
    if (!this.isObj) {
      const {
        value = [],
      } = this.props;
      if (value.length <= 0) return false;
      return !newValue.some((val, idx) => val !== value[idx]);
    }
    const {
      value = {},
    } = this.props;
    return !Object.keys(value).some(key => value[key] !== newValue[key]);
  }

  handleStartOpenChange(open) {
    if (!open) {
      this.setState({ endOpen: true });
    }
  }

  handleEndOpenChange(open) {
    this.setState({ endOpen: open });
  }

  render() {
    const { endOpen } = this.state;
    const {
      placeholder,
      value = [],
    } = this.props;
    return (
      <div className={this.props.className}>
        <TimePicker
          showTime
          format={this.props.format}
          value={value[0] || value.from}
          placeholder={placeholder[0]}
          onChange={this.onStartChange}
          onOpenChange={this.handleStartOpenChange}
        />
        <span className={styles.gap}> - </span>
        <TimePicker
          showTime
          format={this.props.format}
          value={value[1] || value.to}
          placeholder={placeholder[1]}
          onChange={this.onEndChange}
          open={endOpen}
          onOpenChange={this.handleEndOpenChange}
        />
        {this.props.children}
      </div>
    );
  }
}

RangeTimePicker.propTypes = {
  onChange: PropTypes.func,
  // 日期格式
  format: PropTypes.string,
  // value 支持传数组和对象
  /* eslint-disable react/no-unused-prop-types */
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.shape({
    from: PropTypes.any, // moment
    to: PropTypes.any, // moment
  })]),
  /* eslint-disable react/no-unused-prop-types */
  // 两者的placeholder数组
  placeholder: PropTypes.array,
  // 最外层容器的类名
  className: PropTypes.string,
  children: PropTypes.node,
};

RangeTimePicker.defaultProps = {
  onChange: () => {},
  format: 'HH:mm:ss',
  // value: [null, null],
  // value: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
  placeholder: ['开始时间', '结束时间'],
};
