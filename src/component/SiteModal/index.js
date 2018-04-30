/**
 * 景区选择弹窗：
 * demo: /bach-erp/web/Product/Product/List/
 */

import React, { Component } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Modal, Tag, Select, Button} from 'bach-antd';
// import Enum from 'BizComponent/Enum';
// import Button from 'BizComponent/Button';
import store from './store';
const Option = Select.Option;
// import { Modal, Button } from 'antd';

@observer
class Unit extends React.Component {

    handleOk = () => {
        store.onBtnOk();
        this.props.onSelectSiteEvent(store.selectedSite);
    };

    handleCancel = () => {
        store.onBtnOk();
    };

    handleChange = (value) => {
        store.onSelectSite(value);
    };

    genSites = () =>{
        let sites = {};
        sites.set('gubei','古北水镇');
        sites.set('wuzhen','乌镇');
        sites.set('wujiangcun','乌江村');
        sites.set('other','其他');

        return sites;
    };

    render() {
        return (
            <div>
              <Modal
                  title="景区选择框"
                  visible={store.visibleUnit}
                  onCancel={this.handleCancel}
                  footer={null}
              >
                <p>请选择景区，默认古北水镇..</p>
                  <Select defaultValue="gubei" style={{ width: 160 }} onChange={this.handleChange}>
                      <Option value="gubei">古北水镇</Option>
                      <Option value="wuzhen">乌镇</Option>
                      <Option value="wujiangcun">乌江村</Option>
                      <Option value="">其他</Option>
                  </Select>
                  <br />
                  <Button onClick={this.handleOk}>确定</Button>
              </Modal>
            </div>
        );
    }
}

export default Unit;

