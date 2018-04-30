import { action, toJS, computed } from 'mobx';
import Request from 'BizUtils/Request';


class TableStore {


  @action.bound
  sendData(value, success, fail) {
    const param = {
      categoryUserSeqs: [],
    };
    if (value) {
      value.forEach((item) => {
        param.categoryUserSeqs.push({
          categoryCode: item.categoryCode,
          displaySeq: item.displaySeq,
        });
      });
    }
    Request
      .post('/bach/baseinfo/product/category/user/seq/update/v1', { data: param })
      .then((res) => {
        if (res.status >= 0 && res.data) {
          if (success) success();
        } else {
          if (fail) fail();
        }
      });
  }

  @computed get edit() {
    return toJS(this.editValue);
  }

}

const store = new TableStore();

export default store;
