/**
 * 时间选择控件
 * demo: /bach-erp/web/Demo/BaseDemo
 * 组件支持返回string值 无需手动从moment对象转string
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DatePicker, TimePicker } from 'bach-antd';
import moment from 'moment';

const RangePicker = DatePicker.RangePicker;
const formatDate = 'YYYY-MM-DD';
const formatTime = 'HH:mm:ss';

class Picker extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  componentWillMount() {
    this.setValue(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setValue(nextProps);
    }
  }

  setValue = (props) => {
    const { type, value } = props;
    let newValue = null;
    if (type === 'date') {
      newValue = value ? moment(value) : undefined;
    } else if (type === 'time') {
      newValue = value ? moment(value, 'HH:mm:ss') : undefined;
    } else if (type === 'range') {
      newValue = value && value.length && value[0] ? value.map(item => moment(item)) : undefined;
    }
    this.setState({ value: newValue });
  }

  getEle = () => {
    const { type } = this.props;
    const { value } = this.state;
    if (type === 'date') {
      return <DatePicker {...this.props} value={value} onChange={this.handleChange} />;
    } else if (type === 'time') {
      return <TimePicker {...this.props} value={value} onChange={this.handleChange} />;
    } else if (type === 'range') {
      return <RangePicker {...this.props} value={value} onChange={this.handleChange} />;
    } return null;
  }

  handleChange = (value) => {
    const { type, showTime } = this.props;
    let newValue = null;
    let format = null;
    if (type === 'date') {
      format = showTime ? `${formatDate} ${formatTime}` : formatDate;
      newValue = value.format(format);
      this.setState({ value });
    } else if (type === 'time') {
      newValue = value.format(formatTime);
      this.setState({ value });
    } else if (type === 'range') {
      format = showTime ? `${formatDate} ${formatTime}` : formatDate;
      newValue = value.map(item => item.format(format));
      this.setState({ value });
    }
    this.props.onChange(newValue);
  }

  render() {
    return (
      this.getEle()
    );
  }
}

Picker.propTypes = {
  // 类型：date: DatePicker time: TimePicker range: RangePicker
  type: PropTypes.string,
  // 属性值
  value: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string,
  ]),
  // onChange回调
  onChange: PropTypes.func,
  // 是否可以选择时间
  showTime: PropTypes.bool,
};

Picker.defaultProps = {
  type: '',
  showTime: false,
  onChange: () => {},
};

Picker.contextTypes = {
  form: PropTypes.oneOfType([PropTypes.object]),
  nameKey: PropTypes.string,
  onChange: () => {},
};

export default Picker;
