import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import EnumSelect from './EnumSelect';
import EnumRadio from './EnumRadio';
import EnumCheckbox from './EnumCheckbox';

import store, { enumsToMap } from './store';

/**
 * 用于自动处理枚举值，demo 参见
 * src/views/Login/Enum
 */

@observer
class Enum extends Component {
  static propTypes = {
    // 枚举唯一标识
    type: PropTypes.string.isRequired,
    // 枚举值可被转换的子元素
    children: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.array,
    ]),
    // 枚举值可被转换的子元素，跟 children 一个效果
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.array,
    ]),
    // 将枚举值转换成汉字时的渲染方法
    renderItem: PropTypes.func,
  };

  static defaultProps = {
    renderItem: (val, idx, isLast) => `${val}${isLast ? '，' : ''}`,
  };

  render() {
    const { type, children, value, renderItem, ...props } = this.props;
    const enumMap = enumsToMap(store.enumMapList.get(type));

    const text = children || value;

    if (enumMap) {
      return (
        <span {...props}>
          {
            enumMap[text] ||
              (Array.isArray(text)
                ? text.map((key, idx) => renderItem(enumMap[key], idx, idx + 1 !== text.length))
                : text)
          }
        </span>
      );
    }

    return <span {...props}>{text}</span>;
  }
}

export default Enum;
export { EnumSelect, EnumRadio, EnumCheckbox };
