import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FormatVal from 'BizComponent/FormatVal';
import RangeTimePicker from 'BizComponent/RangeTimePicker';
import DynamicRangePicker from 'BizComponent/DynamicRangePicker';
import { DatePicker, TimePicker } from 'bach-antd';
import moment from 'moment';

const { RangePicker } = DatePicker;

class DateTimePicker extends Component {
  constructor(props) {
    super(props);
    this.formatVal = this.formatVal.bind(this);
    this.formatSingle = this.formatSingle.bind(this);
    this.formatRanges = this.formatRanges.bind(this);
    this.formatCombo = this.formatCombo.bind(this);
    this.formatTime = 'HH:mm:ss';
    this.formatDate = 'YYYY-MM-DD';
  }

  formatVal(pickerType) {
    let formatter;
    if (pickerType === 'TimePicker' || pickerType === 'DatePicker') {
      formatter = this.formatSingle;
    } else if (pickerType === 'RangePicker' || pickerType === 'RangeTimePicker') {
      formatter = this.formatCombo;
    } else if (pickerType === 'DynamicRangePicker') {
      formatter = this.formatRanges;
    }
    return formatter;
  }

  formatRanges(value = [], capture, props) {
    const newVal = value.map(val => val && this.formatCombo(val, capture, props));
    return newVal;
  }

  formatCombo(value, capture, props) {
    const keyMap = this.props.keyMap;
    let newValue = value;
    if (value) {
      if (!capture) {
        if (keyMap !== 'array') {
          newValue = value.reduce((acc, val, idx) => {
            acc[!idx ? keyMap.from : keyMap.to] = this.formatSingle(val, capture, props);
            return acc;
          }, {});
        } else {
          newValue = value.map(val => this.formatSingle(val, capture, props));
        }
      } else {
        newValue = [
          value[keyMap.from || 0] && this.formatSingle(value[keyMap.from || 0], capture, props),
          value[keyMap.to || 1] && this.formatSingle(value[keyMap.to || 1], capture, props),
        ];
      }
    }
    // console.log('value, newValue', capture, value, newValue);
    return newValue;
  }

  formatSingle(value, capture, props) {
    const {
      format,
    } = props;
    let newValue = value;
    if (value) {
      if (!capture) {
        newValue = value.format(format);
      } else {
        newValue = moment(value, format);
      }
    }
    return newValue;
  }

  render() {
    const props = {};
    let childProps = {};
    ({
      onChange: props.onChange,
      pickerType: props.pickerType,
      value: props.value,
      ...childProps
    } = this.props);
    const dynamicFomat = childProps.type !== 'date' ? this.formatTime : this.formatDate;
    const pickerType = this.props.pickerType;
    return (
      <FormatVal
        {...props}
        formatVal={this.formatVal(pickerType)}
      >
        { pickerType === 'TimePicker' && <TimePicker format={this.formatTime} {...childProps} />}
        { pickerType === 'DatePicker' && <DatePicker format={this.formatDate} {...childProps} />}
        { pickerType === 'RangeTimePicker' && <RangeTimePicker format={this.formatTime} {...childProps} />}
        { pickerType === 'RangePicker' && <RangePicker format={this.formatDate} {...childProps} />}
        { pickerType === 'DynamicRangePicker' && <DynamicRangePicker format={dynamicFomat} {...childProps} />}
      </FormatVal>
    );
  }
}

DateTimePicker.propTypes = {
  pickerType: PropTypes.oneOf(['TimePicker', 'DatePicker', 'RangePicker', 'RangeTimePicker', 'DynamicRangePicker']),
  /* eslint-disable react/no-unused-prop-types */
  keyMap: PropTypes.oneOfType([
    PropTypes.oneOf(['array']),
    PropTypes.shape({
      from: PropTypes.string,
      to: PropTypes.string,
    }),
  ]),
  /* eslint-enable react/no-unused-prop-types */
};

DateTimePicker.defaultProps = {
  pickerType: 'TimePicker',
  keyMap: {
    from: 'from',
    to: 'to',
  },
};

export default DateTimePicker;

