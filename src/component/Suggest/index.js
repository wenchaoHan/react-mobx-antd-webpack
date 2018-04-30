/**
 * 模糊搜索自动完成组件，(支持了labelInValue属性，可以通过formState来显示label了，之前拿不到label)
 * demo 参见
 * Product/SpecialRule/Detail/index.js
 * 这样把dataSource暴露了出来，也可以方便地value对应的label
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'bach-antd';
import throttle from 'lodash/throttle';
import Request from 'BizUtils/Request';
import log from 'BizUtils/log';

const Option = Select.Option;
const shadowDiff = (objA, objB) => Object.keys(objA).some((key) => {
  if (key !== 'data-__meta') {
    return objA[key] !== objB[key];
  }
  return false;
});

class Suggest extends Component {
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.genOpt = this.genOpt.bind(this);
    this.formatVal = this.formatVal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.formatDataSource = this.formatDataSource.bind(this);
    this.handleSearch = throttle(this.handleSearch.bind(this), props.delay, {
      leading: true,
      trailing: true,
    });
    let dataSource = props.dataSource ||
      [].concat(props.defaultDataSource)
        .map(val => this.formatVal(val, false, false))
        .filter(item => item !== undefined);
    dataSource = this.formatDataSource(dataSource);
    this.state = {
      dataSource: this.genOpt(dataSource),
      value: props.defaultValue || props.value,
    };
    this.configProps = {
      select: {},
      autoComplete: {
        showSearch: true,
        mode: 'combobox',
        // 设了mode为'combobox',后defaultActiveFirstOption不生效了，所有不用再配置该属性为false了
        // defaultActiveFirstOption: true,
        filterOption: false,
        optionFilterProp: 'children',
        optionLabelProp: 'children',
        onSearch: this.handleSearch,
      },
      autoSelect: {
        optionFilterProp: 'children',
        showSearch: true,
        filterOption: false,
        onSearch: this.handleSearch,
      },
      filter: {
        optionFilterProp: 'children',
        showSearch: true,
      },
      multiple: {
        mode: 'multiple',
        filterOption: false,
        onSearch: this.handleSearch,
        labelInValue: true,
      },
      multipleSelect: {
        mode: 'multiple',
        optionFilterProp: 'children',
        optionLabelProp: 'children',
      },
    };
  }

  componentDidMount() {
    if (this.props.type === 'select' && this.props.reqUrl) {
      this.handleSearch();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.dataSource && nextProps.dataSource !== this.props.dataSource) {
      const dataSource = this.formatDataSource(nextProps.dataSource);
      this.setState({
        dataSource: this.genOpt(dataSource),
      });
    }
    // 默认显示的值
    if(this.props.component=='Cascader'){
      let value=nextProps.dataSource[0];
      nextProps.dataSource.map(v=>{
        if(nextProps.value == v){
          value = nextProps.value;
          this.setState({ value });
          return;
        }
        this.setState({ value });
      })
    }else{
      if (this.props.value !== nextProps.value) {
        this.setState({
          value: nextProps.value,
        });
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const propsDiff = shadowDiff(this.props, nextProps);
    const stateDiff = shadowDiff(this.state, nextState);

    return propsDiff || stateDiff;
  }

  formatDataSource(dataSource = []) {
    const val = dataSource.filter(item => item)[0];
    if (val) {
      if (this.checkIsObj(val)) {
        if (val.key === undefined && val.value === undefined) {
          return this.props.filter(dataSource);
        }
      }
    }
    return dataSource;
  }

  genOpt(value) {
    if (Array.isArray(value)) {
      return value.map(val => this.genOpt(val)).filter(val => val !== undefined);
    }
    const hasValue = this.hasValue(value);
    if (!hasValue) return undefined;
    const isObj = this.checkIsObj(value);
    let curValue = value;
    if (isObj) {
      curValue = value.key !== undefined ? value.key : value.value;
    }
    const val = {
      key: String(curValue),
      label: String(isObj ? value.label : value),
    };
    return <Option key={val.key}>{val.label}</Option>;
  }

  checkIsObj(value) {
    return Object.prototype.toString.call(value) === '[object Object]';
  }

  hasValue(value) {
    const isObj = this.checkIsObj(value);
    if (isObj) {
      if ((value.key === undefined && value.value === undefined) && Object.keys(value).length > 0) {
        if (!this.props.defaultDataSource) {
          log.warn('key(value)不能为空，请注意格式为key(value) label', value);
        }
      }
      return (value.key !== undefined && value.key !== '') || (value.value !== undefined && value.value !== '');
    }
    return value !== undefined;
  }

  // 格式化输入输出数据，响应labelInValue的配置
  formatVal(value, reverse = false, pure = true) {
    let newVal = value;
    // 如果多选时，传进来的值不是数组，则concat一下
    if (pure && ['multiple', 'multipleSelect'].indexOf(this.props.type) !== -1) {
      if (!Array.isArray(value)) {
        newVal = [].concat(value).filter(item => item);
      }
    }
    if (Array.isArray(newVal)) {
      return newVal.map(val => this.formatSingle(val, reverse));
    }
    return this.formatSingle(newVal, reverse);
  }

  formatSingle(value, reverse) {
    const { labelInValue } = this.props;
    let newValue = value;
    if (this.checkIsObj(labelInValue)) {
      const {
        key = 'key',
        label = 'label',
      } = labelInValue || {};
      newValue = !reverse ? {
        // 为了支持以value格式传defaultDataSource
        key: value[key] || value.key || value.value,
        label: value[label] || value.label,
      } : {
        [key]: value.key,
        [label]: value.label,
      };
    }
    // fix 对象为无效对象时，不显示placeholder的问题，手动将之转化成undefined
    if (!reverse && this.checkIsObj(value)) {
      if (!Object.keys(value).some(key => value[key] !== '' && value[key] !== undefined)) {
        newValue = undefined;
      }
    }
    return newValue;
  }

  handleChange(value) {
    if (!('value' in this.props)) {
      this.setState({ value });
    }
    this.props.onChange(value);
  }

  handleSearch(value) {
    const { reqUrl, sealReqData, filter, method, type } = this.props;
    if (type !== 'select' && (value === undefined || value === '')) return;
    if (reqUrl === undefined) return;

    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;

    let handler = sealReqData;

    if (typeof sealReqData === 'string') {
      handler = v => ({ [sealReqData]: v });
    }

    const param = handler(value) || {};
    Request[method](reqUrl, {
      data: {
        limit: 10,
        ...param,
      },
    }).then((res) => {
      if (fetchId !== this.lastFetchId) { // for fetch callback order
        return;
      }
      const dataSource = filter(res.data);
      // 如果用户没有传dataSource属性，则内置更新
      if (this.props.dataSource) {
        this.props.onDataSourceChange(dataSource, res.data);
      } else {
        this.setState({
          dataSource: this.genOpt(dataSource),
        });
      }
    }).catch(err => log.warn('handleSearch', err));
  }

  render() {
    const {
      value,
    } = this.state;
    const newValue = this.formatVal(value);
    const configProps = this.configProps[this.props.type] || {};
    const { labelInValue } = this.props;
    return (
      <Select
        dropdownMatchSelectWidth={false}
        allowClear
        {...configProps}
        {...this.props}
        labelInValue={!!(labelInValue !== undefined ? labelInValue : configProps.labelInValue)}
        onChange={this.handleChange}
        value={newValue !== '' ? newValue : undefined}
      >
        {this.state.dataSource}
      </Select>
    );
  }
}

Suggest.propTypes = {
  // 模糊搜索查询接口
  reqUrl: PropTypes.string,
  // 请求接口延时
  delay: PropTypes.number,
  // 封装请求参数方法
  sealReqData: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
  ]),
  onChange: PropTypes.func,
  // 过滤调整查询接口返回值数据格式 要求方法返回 [{value, label}, ...]格式
  filter: PropTypes.func,
  /* eslint-disable react/no-unused-prop-types */
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.shape({
      key: PropTypes.any,
      label: PropTypes.string,
    }),
    PropTypes.array,
  ]),
  /* eslint-disable react/forbid-prop-types */
  defaultValue: PropTypes.any,
  // 如需要传初始默认选项列表，可以传defaultDataSource属性，该属性只生效一次，即不支持异步多次更新。如需支持异步更新，请用dataSource属性
  // 该属性支持以value的格式或者dataSource的格式传入，可以为数组和对象形式（单条数据）
  defaultDataSource: PropTypes.any,
  /* eslint-enable react/forbid-prop-types */
  /* eslint-disable react/no-unused-prop-types */
  // 选项列表数据源，如需要将选项列表暴露给外部，可以传dataSource属性，但此时需要提供onDataSourceChange函数，用于更新dataSource的值。
  // 默认可以不传dataSource属性，此时由组件内部自动更新。一旦传了该属性，需要手动更新。
  // bugfix: 如果要使用该属性，必须保证初始值不能为undefined，否则会出现该属性不受控的情况，可以默认传[]。
  dataSource: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.shape({
      key: PropTypes.any,
      label: PropTypes.string,
    }),
    PropTypes.shape({
      value: PropTypes.any,
      label: PropTypes.string,
    }),
  ])),
  /* eslint-enable react/no-unused-prop-types */
  // 源数据变化回调，如果传了dataSource属性（this.state.dataSource），
  // 则必须传该函数来控制属性dataSource的更新(dataSource => this.setState({ dataSource }));
  onDataSourceChange: PropTypes.func,
  // 设置value的格式为对象，可通过配置key, label属性来设置返回的value的键值，
  // 如labelInValue = {key: 'key1', label: 'label1'} : {key, label} => {key1, label1}
  labelInValue: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      key: PropTypes.string,
      label: PropTypes.string,
    }),
  ]),
  // 如需要保证保存的值是一个合法的下拉选项的中的值，可以传type为'autoSelect'，
  // 如果需要返回的值中既有value，又有label，用于“编辑/查看”和“保存”之间的切换，可以开启labelInValue属性，
  // 返回一个{key, label}格式的value（传入value的格式也须为对象的形式）,支持通过labelInValue传一个对象来重新映射key, label。
  type: PropTypes.oneOf([
    /* suggest 类型 --------- */
    // suggest 自动补全，默认类别，同autoComplete差不多，value可以是自己输入的（选项中没有的）
    'autoComplete',
    // suggest 自动补全，选择的value只能是选项列表中的一个
    'autoSelect',
    // suggest 支持多选，注意，为支持多选强制开启了labelInValue属性，
    'multiple',

    /* select 类型--------- */
    // select 支持多选
    'multipleSelect',
    // select 支持过滤
    'filter',
    // 普通的select，可以使用dataSource来传一个数据，比自己生成了个jsx的option列表要方便一点，
    // 但语义有点混淆，别人一看还以为是suggest，结果type是select
    'select',
  ]),
  method: PropTypes.oneOf(['get', 'post']),
};

Suggest.defaultProps = {
  defaultDataSource: [],
  onDataSourceChange: () => {},
  onChange: () => {},
  // dataSource: [],
  delay: 800,
  size: 'default',
  placeholder: '请输入',
  onSelect: () => {},
  sealReqData: value => ({ name: value }),
  filter: v => v,
  type: 'autoComplete',
  method: 'get',
};

export default Suggest;
