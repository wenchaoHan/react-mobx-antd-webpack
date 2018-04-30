// 图标组件，用法与ant一致，提供内部icon

import React from 'react';
import PropTypes from 'prop-types';

import style from './index.css';

const ICON_MAP = {
  down: '\ue7a3',
  up: '\ue7a4',
  excel: '\ue7e2',
  csv: '\ue7e3',
};

function Icon(props) {
  return (
    <i className={`${style.icon} ${props.className === null ? '' : props.className}`}>
      {ICON_MAP[props.type]}
    </i>
  );
}

Icon.propTypes = {
  type: PropTypes.string.isRequired, // 图标名字
  className: PropTypes.string, // 自定义样式
};

Icon.defaultProps = {
  type: '',
  className: null,
};

export default Icon;
