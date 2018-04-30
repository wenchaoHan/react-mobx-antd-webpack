import { observable, action, computed } from 'mobx';
import log from '../log';

const initPageOpt = {
  curPage: 1,
  pageSize: 15,
  totalSize: 0,
};

class GridStore {
  searchData = {};
  reqTableData = {};

  @observable page = {
    curPage: 1,
    pageSize: 15,
    totalSize: 0,
  };
  @observable tableList = [];
  @observable tableLoading = false;
  @observable editRowIndex = -1;

  @computed get pagination() {
    return {
      current: this.page.curPage,
      pageSize: this.page.pageSize,
      total: this.page.totalSize,
      onShowSizeChange: this.onShowSizeChange,
      onChange: this.onPageChange,
      pageSizeOptions: ['15', '30', '50', '100'],
      defaultPageSize: 15,
    };
  }

  constructor(noPage, responseFilter, errorFilter) {
    if (typeof this.fetchTableData !== 'function') {
      throw new Error('使用 GridStore 必须声明 fetchTableData 方法');
    }

    this.hasPage = !noPage;
    this.responseFilter = responseFilter;
    this.errorFilter = errorFilter;
  }

  filterSearchData(values) {
    return values;
  }

  setPageData(page) {
    this.page = page;
  }

  setSearchData(values) {
    this.searchData = this.filterSearchData(values);
  }

  setReqTableData(resetPage) {
    this.reqTableData = { ...this.searchData };

    if (this.hasPage) {
      if (resetPage) {
        this.reqTableData.page = {
          pageNo: 1,
          pageSize: this.page.pageSize,
        };
      } else {
        this.reqTableData.page = {
          pageNo: this.page.curPage,
          pageSize: this.page.pageSize,
        };
      }
    }
  }

  handleResponse = (res) => {
    if (typeof this.responseFilter === 'function') {
      res = this.responseFilter(res) || res;
    }
    this.editRowIndex = -1;
    if (this.hasPage) {
      if (res.data.data instanceof Array) {
        this.tableList = res.data.data;
        this.page = res.data.page || {};
        if (this.page.curPage > res.data.page.totalPage && this.page.curPage !== 1) {
          this.page.curPage = res.data.page.totalPage;
          this.reload();
        }
      } else {
        log.warn('分页接口数据返回格式有误，res.data.data 不是数组格式');
        log(res);
      }
    } else {
      if (res.data instanceof Array) {
        this.tableList = res.data;
        this.page = {};
      } else {
        log.warn('接口数据返回格式有误，res.data 不是数组格式');
        log(res);
      }
    }
    this.tableLoading = false;
    return res;
  }

  handleError = (e) => {
    if (typeof this.errorFilter === 'function') {
      this.errorFilter(e);
    }
    this.tableLoading = false;
    log(e);
  }

  /**
   * 对外暴露的发起请求的必备方法
   *
   * @param {Object} values 发送后端请求必备的参数
   */
  @action.bound
  submitSearch(values) {
    this.tableLoading = true;
    this.setSearchData(values);
    this.setReqTableData(true);
    return this
      .fetchTableData(this.reqTableData)
      .then(this.handleResponse)
      .catch(this.handleError);
  }

  @action.bound
  load(values) {
    return this.submitSearch(values);
  }

  /**
   * 用现存的 searchData 重新请求
   */
  @action.bound
  reload() {
    this.tableLoading = true;
    this.setReqTableData();
    this
      .fetchTableData(this.reqTableData)
      .then(this.handleResponse)
      .catch(this.handleError);
  }

  @action.bound
  clear() {
    this.setPageData(Object.assign({}, initPageOpt));
    this.setSearchData({});
    this.setReqTableData(true);
    this.tableLoading = false;
    this.tableList = [];
  }

  @action.bound
  onShowSizeChange(curPage, pageSize) {
    this.tableLoading = true;
    const page = {
      curPage,
      pageSize,
      totalSize: this.page.totalSize,
    };
    this.setPageData(page);
    this.setReqTableData(true);
    this
      .fetchTableData(this.reqTableData)
      .then(this.handleResponse)
      .catch(this.handleError);
  }

  @action.bound
  onPageChange(curPage) {
    this.tableLoading = true;
    const page = {
      curPage,
      pageSize: this.page.pageSize,
      totalSize: this.page.totalSize,
    };
    this.setPageData(page);
    this.setReqTableData();
    this
      .fetchTableData(this.reqTableData)
      .then(this.handleResponse)
      .catch(this.handleError);
  }
}

export default GridStore;
