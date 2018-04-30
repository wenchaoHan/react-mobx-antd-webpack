import { Modal, Input } from 'bach-antd';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Form from 'BizComponent/Form';
import FormItem from 'BizComponent/FormItem';
import { observer } from 'mobx-react';
import { validateCategoryName } from 'BizConfig/rules';

import store from './store.js';

export const AddCategoryStore = store;

@Form.create()
@observer
class AddCategory extends Component {
  static propTypes = {
    form: PropTypes.object,
    onOk: PropTypes.func,
  };

  static defaultProps = {
    onOk: () => {},
  };

  handleOk = () => {
    this.props.form.validateFields((err, values) => {
      this.props.onOk(values);
      this.props.form.resetFields();
      store.init();
      store.visible = false;
    });
  }

  handleCancel = () => {
    this.props.form.resetFields();
    store.init();
    store.visible = false;
  }

  render() {
    return (
      <Modal
        title="添加分类"
        visible={store.visible}
        okText="保存"
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Form type="modal" store={store.params}>
          <FormItem
            label="分类名称"
            nameKey="name"
            field={{
              rules: [{
                required: true,
                validator: validateCategoryName,
                initialValue: store.params.name,
              }],
            }}
          >
            <Input placeholder="请输入" className="w240" />
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default AddCategory;
