import { observable, action, toJS, computed } from 'mobx';
import Request from 'BizUtils/Request';


class TableStore {

  @observable loading = false;
  // 控制显示操作
  @observable showModal = false;
  @observable addClassify = false;
  @observable firstLevelList = [];
  @observable secondLevelList = [];
  @observable thirdLevelList = [];
  @observable secondCode = '';
  @observable thirdCode = '';
  @observable level = '';
  @observable version = undefined;
  @observable editValue = {
    categoryCode: '',
    categoryName: '',
    level: '',
    state: 1,
    // parentCode: '',
    id: null,
  };
  @action.bound
  fetchClassifyList(value, success, fail) {
    const param = {};
    let level = 1;
    if (value) {
      level = value.level + 1;
      if (value.categoryCode) {
        param.parentCode = value.parentCode ? value.parentCode : value.categoryCode;
      } else {
        param.level = 1;
      }
    }
    this.loading = true;
    Request
      .get('/bach/baseinfo/product/category/query/v1', { data: param })
      .then((res) => {
        if (res.status >= 0 && res.data) {
          this.loading = false;
          switch (level) {
            case 1 : this.firstLevelList = res.data;
              break;
            case 2 : this.secondLevelList = res.data;
              break;
            case 3 : this.thirdLevelList = res.data;
              break;
            default : this.firstLevelList = res.data;
              break;
          }
          if (success) success();
        } else {
          if (fail) fail();
        }
      });
  }
  @action.bound
  sendSaveData(param, callback) {
    if (this.addClassify) {
      delete param.id;
    }
    if (param.version === undefined && !this.addClassify) {
      param.version = this.version;
    }
    Request
      .post('/bach/baseinfo/product/category/submit/v1', { data: param, successTip: true })
      .then((res) => {
        if (res.status >= 0 && res.data) {
          if (callback)callback(res.data);
        }
      });
  }
  @action.bound
  fetchDetailData(categoryCode) {
    Request
      .get('/bach/baseinfo/product/category/detail/v1', { data: { categoryCode } })
      .then((res) => {
        if (res.status >= 0 && res.data) {
          this.version = res.data.version;
        }
      });
  }

  @action.bound
  deleteListItem(item, callback) {
    item.state = 2;
    this.sendSaveData(item, (data) => {
      if (callback)callback(data);
    });
  }


  @computed get firstLevel() {
    return toJS(this.firstLevelList);
  }
  @computed get secondLevel() {
    return toJS(this.secondLevelList);
  }
  @computed get thirdLevel() {
    return toJS(this.thirdLevelList);
  }
  @computed get edit() {
    return toJS(this.editValue);
  }

}

const store = new TableStore();

export default store;
