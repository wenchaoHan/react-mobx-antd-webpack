/**
 * 前往查看日志页按钮组件
 * demo 参见
 * GlobalConfig/
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'bach-antd';
import Button from 'BizComponent/Button';
import { stringify } from 'BizUtils/url';

class GoToLogPage extends Component {
  onClick = () => {
    const { bizType, showOperator, showOpDate, entityCode, onClick } = this.props;
    const url = stringify({
      pathname: 'Log',
      search: {
        bizType,
        showOperator,
        showOpDate,
        entityCode,
      },
    });
    if (onClick) {
      onClick();
    } else {
      window.open(url);
    }
  }

  render() {
    return (
      <div className="right blue">
        <Button
          target="_blank"
          type="link"
          onClick={this.onClick}
        >查看日志<Icon type="right" /></Button>
      </div>
    );
  }
}

GoToLogPage.propTypes = {
  // 业务类型 必传
  bizType: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  // 是否显示操作人
  showOperator: PropTypes.bool,
  // 是否显示操作时间
  showOpDate: PropTypes.bool,
  // 业务主键
  entityCode: PropTypes.string,
  // 点击回调
  onClick: PropTypes.func,
};

export default GoToLogPage;
