import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Form, Input, Select } from 'bach-antd';
import FormItem from 'BizComponent/FormItem';
import Button from 'BizComponent/Button';
import Picker from 'BizComponent/Picker';
import { storeMap } from 'BizComponent/Grid';

const { FormState } = FormItem;
const Option = Select.Option;

@Form.create()
@observer
class Search extends Component {

  constructor(props) {
    super(props);
    // const { defaultOpModule } = props;
    // this.state = {
    //   opModule: defaultOpModule ? <Option
    //     value={defaultOpModule.value}
    //   >{defaultOpModule.label}</Option> : [],
    // };
    const { opModule } = props;
    this.state = {
      opModule: opModule.map(item => (<Option
        key={item.value}
      >{item.name}</Option>)),
    };
  }

  // componentWillReceiveProps(nextProps) {
  //   if (this.props.opModule.length !== nextProps.opModule.length) {
  //     const newOpModule = nextProps.opModule.map(item => (<Option
  //       key={item.value}
  //       value={item.value}
  //     >{item.name}</Option>));
  //     this.setState({
  //       opModule: newOpModule,
  //     });
  //   }
  // }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, value) => {
      if (storeMap.logList) {
        storeMap.logList.submitSearch(value);
      }
    });
  }

  handleReset = () => {
    this.props.form.resetFields();
  }

  render() {
    const { opModule, showOperator, showOpDate } = this.props;
    const showSearch = showOperator || showOpDate || opModule.length > 1;
    return (
      <div className="search-wrapper">
        {
          showSearch ? <Form layout="inline" className="ant-advanced-search-form form-search" >
            <FormState type="search">
              {
                showOperator ? <FormItem
                  nameKey="operator"
                  label="操作人"
                  labelCol="w5em"
                >
                  <Input placeholder="请输入" />
                </FormItem> : null
              }

              {
                showOpDate ? <FormItem
                  nameKey="opDate"
                  label="操作日期"
                  labelCol="w7em"
                >
                  <Picker type="range" />
                </FormItem> : null
              }
              {
                opModule.length > 1 ? <FormItem
                  nameKey="opModule"
                  label="操作模块"
                  labelCol="w9em"
                  field={{
                    initialValue: opModule[0].value,
                  }}
                >
                  <Select
                    className="w160"
                    size="default"
                    placeholder="请选择"
                  >
                    {this.state.opModule}
                  </Select>
                </FormItem> : null
              }

              <div className="form-search-btns">
                <Button
                  size="default"
                  htmlType="submit"
                  onClick={this.handleSubmit}
                >查询</Button>
                <Button
                  size="default"
                  type="danger"
                  htmlType="submit"
                  onClick={this.handleReset}
                  className="margin-left-middle"
                >清空</Button>
              </div>
            </FormState>
          </Form> : null
        }
      </div>);
  }
}

Search.propTypes = {
  form: PropTypes.oneOfType([PropTypes.object]),
  opModule: PropTypes.oneOfType([PropTypes.array]),
  // defaultOpModule: PropTypes.oneOfType([PropTypes.object]),
  showOperator: PropTypes.bool,
  showOpDate: PropTypes.bool,
};

export default Search;
