import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Radio } from 'bach-antd';
import { observer } from 'mobx-react';
import store, { changeShowAll } from './store';

const RadioGroup = Radio.Group;

/**
 * 用于自动处理枚举值，生成一个单选组，Login 参见：
 * src/views/Login/Enum
 */

@observer
class EnumRadio extends Component {
  static propTypes = {
    // 枚举唯一标识
    type: PropTypes.string.isRequired,
    // 是否显示一个『全部』选项，并设置全部的 value
    showAll: PropTypes.string,
    // 过滤下拉框的内容，支持显示部分枚举
    optionFilter: PropTypes.func,
    // 过滤下拉框的内容，支持部分枚举 disable
    disableFilter: PropTypes.func,
    // 设置『全部』选项的 label
    showAllText: PropTypes.string,
    // 数值
    /* eslint-disable react/forbid-prop-types */
    value: PropTypes.any,
  };

  static defaultProps = {
    optionFilter: () => true,
    disableFilter: () => false,
    valueType: 'string',
  };

  render() {
    const {
      type, showAll, showAllText, optionFilter,
      disableFilter, ...props
    } = this.props;
    let map = store.enumMapList.get(type) || [];

    map = [].concat(map);

    // 进行过滤
    if (typeof optionFilter === 'function') {
      map = map.filter(optionFilter);
    }

    if (Object.prototype.hasOwnProperty.call(this.props, 'showAll')) {
      map = changeShowAll(map, showAll, showAllText);
    }

    const options = map.map((item, i) => {
      const disabled = disableFilter(item, i);

      return {
        label: item.name,
        value: item.value == null ? item.value : `${item.value}`,
        disabled,
      };
    });

    props.value = props.value == null ? props.value : `${props.value}`;

    return (
      <RadioGroup {...props} options={options} />
    );
  }
}

export default EnumRadio;
