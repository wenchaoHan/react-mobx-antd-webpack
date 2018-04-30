import { Modal, Input } from 'bach-antd';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Form from 'BizComponent/Form';
import FormItem from 'BizComponent/FormItem';
import { observer } from 'mobx-react';
import Suggest from 'BizComponent/Suggest';

import store from './store.js';

export const AddProductStore = store;

@Form.create()
@observer
class AddProduct extends Component {
  static propTypes = {
    form: PropTypes.object,
    onOk: PropTypes.func,
  };

  static defaultProps = {
    onOk: () => {},
  };

  onSelectSkuCode = (productCode) => {
    store.init();
    store.params.productCode = productCode;
    store.fetchProduct({ productCode, productName: this.suggestArr[productCode].skuSaleName });
  }

  handleOk = () => {
    this.props.form.validateFields((err, values) => {
      this.props.onOk(values);
      this.handleCancel();
    });
  }

  handleCancel = () => {
    this.props.form.resetFields();
    store.init();
    store.visible = false;
  }

  filterSuggest = (arr) => {
    this.suggestArr = {};
    return arr.map((item) => {
      this.suggestArr[item.skuCode] = item;
      return {
        label: item.skuCode,
        key: item.skuCode,
      };
    });
  }

  render() {
    return (
      <Modal
        title="添加商品"
        visible={store.visible}
        okText="保存"
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Form type="modal" store={store.params}>
          <FormItem
            label="商品编码"
            nameKey="productCode"
            field={{
              rules: [{
                required: true,
                initialValue: store.params.productCode,
              }],
            }}
          >
            <Suggest
              size="default"
              className="w160"
              placeholder="请输入商品编码"
              reqUrl="/bach/baseinfo/product/sku/suggestion/v1"
              filter={this.filterSuggest}
              type={'autoSelect'}
              onChange={this.onSelectSkuCode}
              sealReqData={skuCode => ({ skuCode })}
              autocomplete="off"
            />
          </FormItem>
          <FormItem
            label="大分类"
            nameKey="bigCategory"
            field={{
              rules: [{
                initialValue: store.params.bigCategory,
              }],
            }}
          >
            <Input disabled className="w240" />
          </FormItem>
          <FormItem
            label="中分类"
            nameKey="middleCategory"
            field={{
              rules: [{
                initialValue: store.params.middleCategory,
              }],
            }}
          >
            <Input disabled className="w240" />
          </FormItem>
          <FormItem
            label="商品名称"
            nameKey="productName"
            field={{
              rules: [{
                required: true,
                initialValue: store.params.productName,
              }],
            }}
          >
            <Input disabled className="w240" />
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default AddProduct;
