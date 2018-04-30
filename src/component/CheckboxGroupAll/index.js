/**
 * 在CheckboxGroup组件的基础上支持了全选
 * demo 参见
 * Promotion/ActDetail/index.js
 */

import { Checkbox } from 'bach-antd';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './index.css';

const CheckboxGroup = Checkbox.Group;

export default class CheckboxGroupAll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: this.formatedOpt(props.options),
    };
    this.onCheckAllChange = this.onCheckAllChange.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  componentWillMount(){
    if(this.props.selectValue!='' && this.props.selectValue!=undefined){
      this.setState({
        options: this.formatedJson(this.props.options,this.props.selectValue),
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.options !== nextProps.options) {
      this.setState({
        options: this.formatedOpt(nextProps.options),
      });
    }
    if(nextProps.selectValue!='' && nextProps.selectValue!=undefined){
      if(this.props.selectValue !== nextProps.selectValue){
        this.props.form.setFieldsValue({[this.props.id]:[]});
        this.setState({
          options: this.formatedJson(nextProps.options,nextProps.selectValue),
        });
      }
    }
  }

  onChange(checkedList) {
    this.props.onChange(checkedList);
  }

  onCheckAllChange(evt) {
    const checked = evt.target.checked;
    let options = [];
    if (checked) {
      options = this.state.options.map((item) => {
        const isNum = typeof item === 'number';
        return isNum ? String(item) : item.value || item;
      });
    }
    this.onChange(options);
  }

  formatedJson=(options,value)=>{
    let copyOption=[];
    let optionObj = JSON.parse(options.replace(/'/g, '"'));
    for(let item in optionObj){
      if(item == value){
        optionObj[item].map(v=>{
          copyOption.push(v);
        })
      }
    }
    return copyOption
  }
  formatedOpt(options) {
    let copyOption = options;
    if(!Array.isArray(options)){
      copyOption=[];
      let optionObj = JSON.parse(options.replace(/'/g, '"'));
      for(let item in optionObj){
        optionObj[item].map(v=>{
          copyOption.push(v);
        })
      }
    }
    return copyOption.map((item) => {
      const isNum = typeof item === 'number';
      return isNum ? String(item) : item;
    });
  }

  render() {
    const {
      labelAll,
      allInline,
      defaultValue,
      className,
      wrapperClassName,
      checkboxWrapClassName,
      useCheckAll,
      value = [],
    } = this.props;
    const options = this.state.options;
    return (useCheckAll ?
      <div className={wrapperClassName}>
        <div className={checkboxWrapClassName}>
          <Checkbox
            className={allInline ? styles.inline : ''}
            indeterminate={value.length > 0}
            onChange={this.onCheckAllChange}
            checked={options.length === value.length && options.length > 0}
          >
            {labelAll}
          </Checkbox>
          <CheckboxGroup
            className={`${allInline ? `${styles.inline} ` : ''}${className}`}
            options={options}
            defaultValue={defaultValue}
            value={value}
            onChange={this.onChange}
          />
        </div>
        {this.props.children}
      </div>
      :
      <CheckboxGroup
        className={className}
        options={options}
        value={value}
        defaultValue={defaultValue}
        onChange={this.onChange}
        children={this.props.children}
      />
    );
  }
}

CheckboxGroupAll.propTypes = {
  // 全选按钮的label
  labelAll: PropTypes.string,
  // 全选按钮是否独占一行，默认为inline，不独占一行
  allInline: PropTypes.bool,
  // 值改变时触发的回调函数
  onChange: PropTypes.func,
  // 当前值
  value: PropTypes.array,
  // 选项序列，同CheckboxGroup，支持string object 数组
  /* eslint-disable react/no-unused-prop-types */
  /* options: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ])), */
  /* eslint-enable react/no-unused-prop-types */
  // CheckboxGroup 的 类名
  className: PropTypes.string,
  // 最外层的 类名
  wrapperClassName: PropTypes.string,
  // CheckboxGroupAll 的 类名
  checkboxWrapClassName: PropTypes.string,
  // children 元素
  children: PropTypes.node,
  // 是否使用全部按钮
  useCheckAll: PropTypes.bool,
  // 初始值
  defaultValue: PropTypes.array,
};

CheckboxGroupAll.defaultProps = {
  onChange: () => {},
  options: [],
  // 与外面设置的默认值冲突了，故去掉
  // value: [],
  allInline: true,
  labelAll: '全选',
  useCheckAll: true,
};
