/**
 * 门店、自提、全局配置时间弹窗组件
 * demo 参见
 * Shop/Detail/Time
 * Shop/Detail/PickUp
 * Shop/Detail/Delivery
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form } from 'bach-antd';
import FormItem from 'BizComponent/FormItem';
import FormWithText from 'BizComponent/FormWithText';
import Picker from 'BizComponent/Picker';
import WeekCheckBox from 'BizComponent/WeekCheckBox';
import DFormItem from 'BizComponent/DFormItem';

@Form.create()
class TimeEditModal extends Component {
  constructor(props) {
    super(props);
    this.formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
  }

  getDEle = () => {
    const { title, rowData } = this.props;
    if (rowData.serviceTimeList) {
      if (title === '预订开放时间') {
        return (<FormItem
          nameKey="serviceTimeList"
          label="送达时间"
          layout={this.formLayout}
          field={{
            initialValue: rowData.serviceTimeList,
          }}
        >
          <DFormItem
            baseItem={'00:00:00'}
            renderer={this.renderServiceTimeRow}
          />
        </FormItem>);
      }
      return null;
    }
    return (<FormItem
      nameKey="timeRangeList"
      label="作用时间"
      layout={this.formLayout}
      field={{
        initialValue: rowData.timeRangeList,
      }}
    >
      <DFormItem
        baseItem={{
          from: '00:00:00',
          to: '23:59:59',
        }}
        renderer={this.renderEffectTimeRow}
      />
    </FormItem>);
  }

  handleConfirm = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.timeRangeList = values.timeRangeList || [];
        this.props.onOk(values);
      }
    });
  }

  renderEffectTimeRow = data => <FormWithText>
    <FormItem
      nameKey="from"
      field={{
        rules: [{ required: true, message: '请选择作用时间!' }],
        initialValue: data.from,
      }}
    >
      <Picker type="time" className="w160" />
    </FormItem>
    <span>--</span>
    <FormItem
      nameKey="to"
      field={{
        rules: [{ required: true, message: '请选择作用时间!' }],
        initialValue: data.to,
      }}
    >
      <Picker type="time" className="w160" />
    </FormItem>
  </FormWithText>

  renderServiceTimeRow = data => (<div className="inline-block">
    <FormItem
      nameKey="serviceTime"
      field={{
        rules: [{ required: true, message: '请选择送达时间!' }],
        initialValue: data.serviceTime,
      }}
    >
      <Picker type="time" />
    </FormItem>
  </div>)

  render() {
    const { visible, title, rowData, onCancel } = this.props;
    return (
      <Modal
        visible={visible}
        title={title}
        onOk={this.handleConfirm}
        onCancel={onCancel}
        width={620}
      >
        <Form>
          <FormItem
            nameKey="effectDate"
            label="作用日期"
            field={{
              rules: [{ required: true, message: '请选择作用日期' }],
              initialValue: rowData.fromDate ? [rowData.fromDate, rowData.toDate] : undefined,
            }}
            layout={this.formLayout}
          >
            <Picker type="range" />
          </FormItem>

          <FormItem
            nameKey="weekDay"
            label="作用周期"
            layout={this.formLayout}
            field={{
              rules: [{ required: true, message: '请选择作用周期' }],
              initialValue: rowData.weekDay,
            }}
          >
            <WeekCheckBox />
          </FormItem>

          { this.getDEle() }
        </Form>
      </Modal>);
  }
}

TimeEditModal.propTypes = {
  // 是否可见
  visible: PropTypes.bool,
  // 弹窗标题
  title: PropTypes.string,
  // 表单
  form: PropTypes.oneOfType([PropTypes.object]),
  // 弹窗数据
  rowData: PropTypes.oneOfType([PropTypes.object]),
  // 确认回调
  onOk: PropTypes.func,
  // 取消回调
  onCancel: PropTypes.func,
};

export default TimeEditModal;
