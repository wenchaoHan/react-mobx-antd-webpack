/**
 * 动态增减表单组件
 * demo 参见
 * Shop/Detail/ExtraForm
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'bach-antd';
import Button from 'BizComponent/Button';

class DFormItem extends Component {
  componentWillMount() {
    const formList = this.context.form.getFieldValue(this.context.nameKey);
    this.state = {
      formList,
    };
  }

  handleChange = (index) => {
    const { baseItem, onChange } = this.props;
    const formList = this.context.form.getFieldValue(this.context.nameKey);

    const newData = {};
    if (index === 'add') { // 添加
      formList.push(baseItem);
    } else {  // 删除
      formList.splice(index, 1);
    }
    this.setState({
      formList,
    });
    newData[this.context.nameKey] = formList;
    this.context.form.setFieldsValue(newData);
    onChange(formList);
  }

  render() {
    const { renderer, required, maxLength, addText, delText } = this.props;
    const { formList } = this.state;
    const formListLenght = (formList || []).length;
    return (
      <div className="dynamic-wrapper">
        {
          formList.length > 0 &&
          <div className="margin-bottom-small">
            {
              formList.map((item, index) =>
                (<div key={index} >
                  <FormItemWrapper
                    nameKey={this.context.nameKey}
                    index={index}
                  >
                    {renderer(item, index)}
                    <div className="inline-block margin-left-middle" style={{ verticalAlign: 'top' }}>
                      {
                        required === true && formListLenght <= 1 ? null : <Button
                          type="link"
                          className="red"
                          onClick={this.handleChange}
                          data={index}
                        ><Icon type="minus" />{delText}</Button>
                      }
                    </div>
                  </FormItemWrapper>
                </div>))
            }
          </div>
        }
        <div style={{ display: formListLenght < maxLength ? 'block' : 'none' }} >
          <Button
            type="link"
            className="blue"
            onClick={this.handleChange}
            data={'add'}
          ><Icon type="plus" />{addText}</Button>
        </div>
      </div>
    );
  }
}

/* eslint-disable react/no-multi-comp */
class FormItemWrapper extends Component {
  static propTypes = {
    nameKey: PropTypes.string,
    index: PropTypes.number,
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array]),
  };

  static childContextTypes = {
    listNameKey: PropTypes.string,
    listIndex: PropTypes.number,
  };

  getChildContext = () => {
    const { nameKey, index } = this.props;
    return {
      listNameKey: nameKey,
      listIndex: index,
    };
  }
  render() {
    const { children, index } = this.props;
    return (
      <div
        style={{
          marginTop: index ? 10 : 0,
          height: 35,
        }}
      >
        {children}
      </div>
    );
  }
}

DFormItem.propTypes = {
  // 新增数据数据结构
  baseItem: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array]),
  // 自定义表单结构 方法返回 ReactNode
  renderer: PropTypes.func,
  // 是否显示必选标志
  required: PropTypes.bool,
  // onChane 回调
  onChange: PropTypes.func,
  // 最大长度
  maxLength: PropTypes.number,
  // 增加文本 默认'添加'
  addText: PropTypes.string,
  // 减少文本 默认'删除'
  delText: PropTypes.string,
};

DFormItem.defaultProps = {
  required: true,
  maxLength: 5,
  addText: '添加',
  delText: '删除',
};

DFormItem.contextTypes = {
  form: PropTypes.oneOfType([PropTypes.object]),
  nameKey: PropTypes.string,
};

export default DFormItem;
