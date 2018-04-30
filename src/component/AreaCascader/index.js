/**
 * 省市区选择组件
 * demo 参见
 * Shop/Index
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Cascader } from 'bach-antd';
import Request from 'BizUtils/Request';

class AreaCascader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
    };
  }

  componentWillMount() {
    Request.post('/bach/baseinfo/goblin/city/queryChildLevel', {
      data: {
        regionCode: 0,
        level: 0,
      },
    }).then((res) => {
      const options = res.data.map(item => ({
        value: item.regionCode,
        label: item.province,
        isLeaf: false,
        level: item.level,
      }));
      this.setState({
        options,
      });
    });
  }

  onChange = (value, selectedOptions) => {
    const data = selectedOptions.map(item => ({
      code: item.value,
      text: item.label,
    }));
    this.props.onChange(data);
  }

  loadData = (selectedOptions) => {
    const targetLevel = selectedOptions.length - 1;
    const targetOption = selectedOptions[targetLevel];
    targetOption.loading = true;
    Request.post('/bach/baseinfo/goblin/city/queryChildLevel', {
      data: {
        regionCode: targetOption.value,
        level: targetOption.level / 1,
      },
    }).then((res) => {
      targetOption.loading = false;
      targetOption.children = res.data.map((item) => {
        const { level } = item;
        let label = '';
        switch (level) {
          case 1: label = item.province; break;
          case 2: label = item.city; break;
          case 3: label = item.district; break;
          default: label = item.city;
        }

        return {
          value: item.regionCode,
          label,
          level,
          isLeaf: level === 3,
        };
      });
      this.setState({
        options: [...this.state.options],
      });
    });
  }

  renderer = (label) => {
    const { value } = this.props;
    if (value !== undefined && value[0] !== undefined) {
      if (value[0].code !== undefined) {
        label = value.map(item => item.text);
      }
      return label.join(' / ');
    } return '';
  }

  render() {
    const { value } = this.props;
    return (
      <Cascader
        className="w200"
        {...this.props}
        options={this.state.options}
        loadData={this.loadData}
        onChange={this.onChange}
        changeOnSelect
        placeholder={value === undefined ? '请输入' : ''}
        displayRender={this.renderer}
      />
    );
  }
}

AreaCascader.propTypes = {
  // 组件默认值 具体数据格式参照 ant Cascader
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.string]),
  // onChange 回调
  onChange: PropTypes.func,
};

AreaCascader.defaultProps = {
  size: 'default',
};

export default AreaCascader;
