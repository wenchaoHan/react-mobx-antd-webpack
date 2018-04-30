import { observable, action, toJS } from 'mobx';

const getParams = () => ({
  leftTitle: '分类',
  rightTitle: '商品名称',
  leftBtnText: '添加分类',
  rightBtnText: '添加商品',
  selectIdx: 0,
  leftList: [],
});

class Store {
  constructor(params) {
    this.resetData(params);
  }

  @observable params = getParams();

  @action.bound
  init() {
    this.params = getParams();
  }

  @action.bound
  resetData(params) {
    const {
      leftList,
      selectIdx = 0,
    } = params;
    const selectList = (leftList[selectIdx] || {}).productInfoList || [];
    this.params = {
      ...toJS(this.params),
      ...params,
      selectIdx,
      selectList,
    };
  }

}

export default Store;
