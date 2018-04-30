import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'bach-antd';
import { observer } from 'mobx-react';
import store, { changeShowAll } from './store';

const { Option } = Select;

/**
 * 用于自动处理枚举值，生成一个选择框，Login 参见：
 * src/views/Login/Enum
 */

@observer
class EnumSelect extends Component {
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
    // 强制转换字符串
    string: PropTypes.bool,
  };

  static defaultProps = {
    optionFilter: () => true,
    disableFilter: () => false,
    string: true,
  };

  render() {
    const {
      type, showAll, showAllText, optionFilter,
      disableFilter, string, ...props
    } = this.props;
    let map = store.enumMapList.get(type) || [];

    map = [].concat(map);

    // 进行过滤
    if (typeof optionFilter === 'function') {
      map = map.filter(optionFilter);
    }

    if (showAll !== undefined) {
    // if (Object.prototype.hasOwnProperty.call(this.props, 'showAll')) {
      map = changeShowAll(map, showAll, showAllText);
    }

    if (string && 'value' in props) {
      // value为undefined的时候placeholder才有效
      props.value = (props.value === '' || props.value == null || props.value === undefined)
       ? undefined : `${props.value}`;
    }

    return (
      <Select allowClear placeholder="请选择" {...props}>
        {map.map((item, i) =>
          (<Option
            value={item.value == null ? item.value : `${item.value}`}
            key={item.value}
            disabled={disableFilter(item, i)}
          >
            {item.name}
          </Option>)
        )}
      </Select>
    );
  }
}

export default EnumSelect;
