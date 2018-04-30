import { observable, toJS, computed } from 'mobx';


class Store {
 @observable printDataInfo = {
   title: '',
   subTitle: '',
   orderNo: '',
   orderStatus: '',
   baseInfo: [{}],
   data: [{}],
 }
 @computed get printData() {
   return toJS(this.printDataInfo);
 }
}

const store = new Store();

export default store;
