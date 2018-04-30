/**
 * 输入框控件
 * demo: /bach-erp/web/Demo/BaseDemo
 * 组件支持自动trim
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'bach-antd';

class BachInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({ value: nextProps.value });
    }
  }

  handleChange = (e) => {
    let value = e.target.value;
    value = value.trim();
    const newData = {};
    newData[this.context.nameKey] = value;
    this.setState({ value });
    this.context.form.setFieldsValue(newData);
    this.props.onChange(value);
  }

  focus() {
    this.input.focus();
  }

  render() {
    return (
      <Input
        ref={ins => (this.input = ins)}
        {...this.props}
        value={this.state.value}
        onChange={this.handleChange}
      />
    );
  }
}

BachInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

BachInput.contextTypes = {
  form: PropTypes.oneOfType([PropTypes.object]),
  nameKey: PropTypes.string,
  onChange: () => {},
};

export default BachInput;
