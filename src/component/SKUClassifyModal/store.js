import { observable, action, toJS, computed, autorun } from 'mobx';

class BaseDetail {
  @observable visible = false;
  @observable categories = [];
  @observable selected = undefined;

  constructor() {
    autorun(() => {
      const categories = this.getCategories;
      if (categories.length) {
        this.selected = categories.map((item) => {
          if (item !== null) {
            return item.categoryName;
          }
          return '';
        }).filter(item => item !== '').join('/');
      } else {
        this.selected = undefined;
      }
    });
  }

  // 显示分类弹窗
  @action.bound
  showClassify() {
    this.visible = true;
  }

  // 隐藏分类弹窗
  @action.bound
  hideClassify() {
    this.visible = false;
  }

  @computed get getCategories() {
    return toJS(this.categories);
  }
}

export default new BaseDetail();
