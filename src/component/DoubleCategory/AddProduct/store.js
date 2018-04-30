import { observable, action } from 'mobx';
import Request from 'BizUtils/Request';

const getParams = () => ({
  productCode: '',
  bigCategory: '',
  middleCategory: '',
  productName: '',
});

class Store {

  @observable isEdit = false;
  @observable idx = 0;
  @observable visible = false;
  @observable params = getParams();

  @action.bound
  init() {
    this.params = getParams();
  }

  @action.bound
  fetchProduct({ productCode, productName }) {
    Request.get('/bach/baseinfo/shop/device/template/query_product_info/v1', {
      data: {
        productCode,
      },
    }).then((json) => {
      if (json.status === 0 && json.data) {
        const data = json.data;
        if (this.params.productCode === productCode) {
          this.params.productCode = productCode;
          this.params.productName = productName;
          this.params.bigCategory = data.firstCategoryName;
          this.params.middleCategory = data.secondCategoryName;
        }
      }
    });
  }
}

export default new Store();
