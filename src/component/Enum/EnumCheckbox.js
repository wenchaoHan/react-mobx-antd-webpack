import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CheckboxGroupAll from 'BizComponent/CheckboxGroupAll';
import { observer } from 'mobx-react';
import store from './store';

/**
 * 用于自动处理枚举值，生成一个多选框组，Login 参见：
 * src/views/Login/Enum
 */

@observer
class EnumCheckbox extends Component {
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
  };

  render() {
    const {
      type, showAllText, optionFilter,
      disableFilter, value, ...props
     } = this.props;
    let map = store.enumMapList.get(type) || [];

    map = [].concat(map);

    // 进行过滤
    if (typeof optionFilter === 'function') {
      map = map.filter(optionFilter);
    }

    const options = map.map((item, i) => {
      const disabled = disableFilter(item, i);
      return {
        label: item.name,
        value: item.value == null ? item.value : `${item.value}`,
        disabled,
      };
    });

    if (props.value != null && Array.isArray(props.value)) {
      props.value = props.value.map(v => (v == null ? v : `${v}`));
    }

    if (Object.prototype.hasOwnProperty.call(this.props, 'showAll')) {
      return (
        <CheckboxGroupAll
          {...props}
          value={value}
          options={options}
          useCheckAll
          labelAll={showAllText}
        />
      );
    }
    return (
      <CheckboxGroupAll
        {...props}
        value={value}
        useCheckAll={false}
        options={options}
      />
    );
  }
}

export default EnumCheckbox;
