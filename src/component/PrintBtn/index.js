import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'BizComponent/Button';
import router from 'BizUtils/router';

class PrintBtn extends Component {
  handleClick = (data) => {
    router.open('/Print', () => data);
  }

  render() {
    const { reqUrl, reqData, columns, showTable, method, tableSize, ...props } = this.props;
    const data = { reqUrl, reqData, columns, showTable, method, tableSize };
    return (
      <Button {...props} onClick={() => this.handleClick(data)} />
    );
  }

}
PrintBtn.propTypes = {
  // 请求路径
  reqUrl: PropTypes.string,
  // 请求参数
  reqData: PropTypes.oneOfType([PropTypes.object]),
  // 打印表格列名
  columns: PropTypes.oneOfType([PropTypes.array]),
  // 是否展示右上角table
  showTable: PropTypes.bool,
  // 请求方式
  method: PropTypes.string,
  // 表格的size 默认default
  tableSize: PropTypes.string,
};
export default PrintBtn;
