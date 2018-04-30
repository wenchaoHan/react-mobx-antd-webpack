import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'bach-antd';
import { pageOption } from 'BizConfig/constant.js';
import Request from 'BizUtils/Request';

class Log extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      page: {},
    };
    this.pageNo = 1;
    this.pageSize = 15;
  }

  componentDidMount() {
    this.fetchGridList();
  }

  onShowSizeChange = (curPage, pageSize) => {
    this.pageNo = 1;
    this.pageSize = pageSize;
    this.fetchGridList();
  }

  onChange = (curPage, pageSize) => {
    this.pageNo = curPage;
    this.pageSize = pageSize;
    this.fetchGridList();
  }

  getColumns = () => {
    const columns = [
      {
        title: 'ID',
        dataIndex: 'no',
      },
      {
        title: '文件名称',
        dataIndex: 'opModule',
      },
      {
        title: '操作内容',
        dataIndex: 'opContent',
      },
      {
        title: '操作时间',
        dataIndex: 'opTime',
      },
      {
        title: '操作人',
        dataIndex: 'operator',
      },
      {
        title: '状态',
        dataIndex: 'opStatus',
      },
      {
        title: '下载文件',
        dataIndex: 'downloadUrl',
      },
    ];
    return columns;
  }

  fetchGridList() {
    this.loading = true;
    const param = {
      bizType: this.props.bizType,
      entityCode: this.props.entityCode,
      opModule: this.props.opModule,
      page: {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      },
    };
    Request.post('/bach/baseinfo/goblin/log/operate/v1', { data: param })
    .then((data) => {
      this.loading = false;
      const tempData = data.data.data;
      tempData.forEach((item, index) => {
        item.no = index + 1;
      });
      this.setState({ data: tempData, page: data.data.page });
    });
  }

  render() {
    return (
      <Table
        rowKey="no"
        columns={this.getColumns()}
        loading={this.loading}
        dataSource={this.state.data}
        bordered
        pagination={{
          current: this.pageNo,
          pageSize: this.pageSize,
          total: this.state.page.total,
          onShowSizeChange: this.onShowSizeChange,
          onChange: this.onChange,
          ...pageOption,
        }}
      />
    );
  }
}

Log.propTypes = {
  bizType: PropTypes.string,
  entityCode: PropTypes.string,
  opModule: PropTypes.string,
};

Log.defaultProps = {
  bizType: '',
  entityCode: '',
  opModule: '',
};

export default Log;
