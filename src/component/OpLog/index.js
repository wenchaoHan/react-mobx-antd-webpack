/**
 * 查看日志页组件
 * demo 参见
 * Log
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Request from 'BizUtils/Request';
import Search from './search';
import Grid from './grid';

class OpLog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opModule: [],
    };
  }

  componentWillMount() {
    Request.post('/bach/baseinfo/goblin/dict/list/v1', {
      data: { type: this.props.bizType },
    }).then((res) => {
      this.setState({
        opModule: res.data[0].items,
      });
    });
  }
  render() {
    const { bizType, showOperator, showOpDate, entityCode } = this.props;
    return (
      <div>
        <div className="l-bar">
          <div className="left title-large">日志查看</div>
        </div>
        {
          this.state.opModule.length ? <div>
            <Search
              showOperator={showOperator}
              showOpDate={showOpDate}
              opModule={this.state.opModule}
            />
            <Grid
              bizType={bizType}
              entityCode={entityCode}
              opModule={this.state.opModule}
            />
          </div> : null
        }

      </div>
    );
  }
}

OpLog.propTypes = {
  // 业务类型 必传
  bizType: PropTypes.number,
  // 是否显示操作人
  showOperator: PropTypes.bool,
  // 是否显示操作时间
  showOpDate: PropTypes.bool,
  // 业务主键
  entityCode: PropTypes.string,
  // 默认查询操作模块
  // defaultOpModule: PropTypes.oneOfType([PropTypes.object]),
};

export default OpLog;
