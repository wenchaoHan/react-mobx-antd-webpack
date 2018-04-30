/**
 * 全自动表格渲染组件，满足表格渲染的基础需求，业务代码可以彻底摆脱
 * store、分页、loading 的困扰，
 * demo 参见
 * src/views/Supplier/BaseInfo
 * src/views/Supplier/ShopBatch
 * src/views/Supplier/CompanyList
 */

import React, { Component } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Table } from 'bach-antd';
import Button from 'BizComponent/Button';
import log from 'BizUtils/log';

import Store from './store';

const gridStore = {};

@observer
class Grid extends Component {
  static propTypes = {
    // 隐藏分页有关显示与控制，默认带分页
    noPage: PropTypes.bool,
    // 阻止初次渲染时请求数据
    skipFirstSubmit: PropTypes.bool,
    // 初始搜索数据
    search: PropTypes.oneOfType([PropTypes.object]),
    // 接口 url 地址
    url: PropTypes.string.isRequired,
    // 唯一标识，用于获取 table 的 store 实例
    name: PropTypes.string.isRequired,
    // 请求数据过滤
    requestFilter: PropTypes.func,
    // 响应数据过滤
    responseFilter: PropTypes.func,
    // 错误处理
    errorFilter: PropTypes.func,
    // 编辑行回调
    onSaveRow: PropTypes.func,
    // 请求方式
    method: PropTypes.oneOf(['post', 'get']),
    // 表格列设置
    columns: PropTypes.arrayOf(PropTypes.object),
  };

  static defaultProps = {
    noPage: false,
    requestFilter: v => v,
    responseFilter: v => v,
    onSaveRow: v => v,
    search: {},
  };

  constructor(props) {
    super(props);
    const {
      name,
      noPage,
      search,
      url,
      skipFirstSubmit,
      requestFilter,
      method,
      responseFilter,
      errorFilter,
    } = this.props;
    this.scrollOpt = { x: true };
    this.store = new Store(noPage, url, method, responseFilter, errorFilter);
    this.store.filterSearchData = requestFilter;

    if (!skipFirstSubmit) {
      this.store.submitSearch(search);
    }

    if (gridStore[name]) {
      log.warn(`已存在名为 ${name} 的 GridStore！`);
    }
    gridStore[name] = this.store;
  }

  componentWillUnmount() {
    const { name } = this.props;
    gridStore[name] = null;
  }

  processColumns(onSaveRow) {
    const { columns = [] } = this.props;
    if (this.store.editRowIndex >= 0) {
      columns.forEach((column) => {
        if (!column.processed) {
          if (column.dataIndex === 'operation' && column.editRender === undefined) {
            column.editRender = () => <span>
              <Button key="save" type="link" className="blue" data={onSaveRow} onClick={this.store.saveRow}>保存</Button>
              <Button key="cancel" type="link" className="red margin-left-small" onClick={this.store.cancelRow}>取消</Button>
            </span>;
          }
          column.userRender = column.render;
          const editRender = (text, record) => {
            const cell = column.editRender(text, record);
            const { ...props } = cell.props;
            return (<cell.type
              {...props}
              onChange={(info) => {
                const value = info && info.target ? info.target.value : info;
                this.store.valueChange(column.dataIndex, value);
              }}
            />);
          };
          column.render = (...args) => {
            if (args[2] === this.store.editRowIndex && column.editRender) {
              return editRender(...args);
            }
            return column.userRender ? column.userRender(...args) : args[0];
          };
          column.processed = true;
        }
      });
    }
  }

  render() {
    const {
      noPage,
      search,
      url,
      name,
      requestFilter,
      responseFilter,
      onSaveRow,
      ...props
    } = this.props;

    if (search || url || name || requestFilter || responseFilter) {
      // 为了不把他们添加到 Table 上
    }

    this.processColumns(onSaveRow);

    return (
      <Table
        loading={this.store.tableLoading}
        dataSource={this.store.list}
        pagination={noPage ? false : this.store.pagination}
        scroll={this.scrollOpt}
        {...props}
      />
    );
  }
}

export default Grid;

export const storeMap = gridStore;
