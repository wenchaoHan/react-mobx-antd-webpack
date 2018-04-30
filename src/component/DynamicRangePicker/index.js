import React, { Component } from 'react';
import DynamicGroup from 'BizComponent/DynamicGroup';
import RangeTimePicker from 'BizComponent/RangeTimePicker';
import { DatePicker } from 'bach-antd';
import moment from 'moment';
import PropTypes from 'prop-types';

const { RangePicker } = DatePicker;

class DynamicRangePicker extends Component {

  constructor(props) {
    super(props);
    this.style = {
      marginBottom: 16,
    };
    this.formatTime = 'HH:mm:ss';
    this.formatDate = 'YYYY-MM-DD';
    const isTime = props.type === 'time';
    this.format = props.format || (isTime ? this.formatTime : this.formatDate);
    this.defaultTime = [
      moment('00:00:00', this.format),
      moment('23:59:59', this.format),
    ];
    this.defaultDate = [
      moment(),
      moment().add(1, 'months'),
    ];
    this.defaultItemValue = isTime ? this.defaultTime : this.defaultDate;
  }

  render() {
    const props = {};
    ({
      value: props.value = [],
      defaultItemValue: props.defaultItemValue = this.defaultItemValue,
    } = this.props);
    return (
      <DynamicGroup
        {...this.props}
        {...props}
      >
        {
          this.props.type === 'time'
            ? <RangeTimePicker
              format={this.format}
            />
            : <RangePicker
              style={this.style}
              format={this.format}
            />
        }
      </DynamicGroup>
    );
  }
}

// 相关属性请参考DynamicGroup 和 RangeTimePicker
DynamicRangePicker.propTypes = {
  type: PropTypes.oneOf(['time', 'date']),
  format: PropTypes.string,
  /* eslint-disable react/no-unused-prop-types */
  defaultItemValue: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
  /* eslint-enable react/no-unused-prop-types */
};

DynamicRangePicker.defaultProps = {
  type: 'time',
};

export default DynamicRangePicker;
