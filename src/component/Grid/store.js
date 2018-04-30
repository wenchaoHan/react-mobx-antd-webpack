import { action, toJS, computed } from 'mobx';
import Notification from 'BizComponent/Notification';
import Request from 'BizUtils/Request';
import GridStore from 'BizUtils/GridStore';

class Store extends GridStore {
  constructor(noPage, url, method = 'post', responseFilter, errorFilter) {
    super(noPage, responseFilter, errorFilter);
    this.url = url;
    this.method = method;
    this.columns = [];
  }

  fetchTableData(data) {
    // 查询公司列表
    return Request[this.method](this.url, { data });
  }

  @computed get list() {
    return toJS(this.tableList);
  }

  valueChange(key, value) {
    this.rowData[key] = value;
  }

  validateEmpty(value) {
    if (value === '' || value == null || value === undefined) {
      return '请输入';
    }
    return true;
  }

  @action.bound
  editRow(index) {
    this.rowData = Object.assign({}, this.list[index]);
    this.editRowIndex = index;
  }

  @action.bound
  saveRow(callback) {
    let error = false;
    this.columns.filter(column => column.editRender !== undefined).forEach((column) => {
      if (column.validator) {
        const message = column.validator(this.rowData[column.dataIndex], this.rowData);
        if (typeof message === 'string') {
          Notification.error(message, 3);
          error = true;
        }
      }
    });
    if (!error) {
      callback(this.rowData);
    }
  }

  @action.bound
  cancelRow() {
    this.editRowIndex = -1;
  }

}

export default Store;
