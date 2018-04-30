/**
 * 自定义校验的骨架
 * @desc 每个写个动态增删组件的自定义校验都得写一套完整的校验流程，有时漏这漏那的，很容易考虑不全，
 * 所以这里提取出公用的部分，抽成一个高阶函数的方式，让用户只需要专注于写校验的函数即可。
 * 注意：为了让FormItem 自动帮我们处理校验信息message，还需要加上一个默认属性：onValidateChange: () => {},
 * @export {func} validateBone 高阶函数
 * @param {component} BaseComponent 需要包装校验器的组件
 * @returns component 包装了整个校验流程的新组件，只需要在属性validatorFunc中传入处理函数即可
 * @demo
 *
 *  const DynamicConfigOptWithValidateBone = HOC.validateBone(DynamicConfigOpt);
 *
    validateConfigOpt = (value = []) => {
     const result = {
       pass, // pass 表示校验是否通过，
       errItemIndex, // 表示当前校验失败的行号
       message: !pass ? '未通过校验时提示的错误信息' : undefined, // 返回undefined表示校验成功
     };
     return result;
    }
    render() {
      const {
        children,
        ...restProps
      } = this.props;
      return (
        <DynamicConfigOptWithValidateBone
          validatorFunc={this.validateConfigOpt}
          {...restProps}
        />
      );
    }
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import notification from 'BizComponent/Notification';
import isEqual from 'lodash/isEqual';

export default function validateBone(BaseComponent) {
  class ValidateBone extends Component {
    static propTypes = {
      // 在value改变时触发的事件
      onChange: PropTypes.func,
      // 在onChange事件触发时同时触发的一个校验事件，
      // @param: result 为validatorFunc校验函数返回的校验信息对象
      onValidateChange: PropTypes.func,
      // 将value格式化成校验函数期望接收的形式，
      // 因为keyMap会转换value的格式，所以只能让用户手动提供转换函数了
      fmtValue: PropTypes.func,
      // 是否弹出提示框来提示错误信息，默认为false，默认通过formItem获取result.message来校验
      showErrMsg: PropTypes.bool,
      // 校验函数
      validatorFunc: PropTypes.func,
      // skipFirstValidate: PropTypes.bool,
      /* eslint-disable react/forbid-prop-types */
      value: PropTypes.any,
      /* eslint-enable react/forbid-prop-types */
    }
    static defaultProps = {
      fmtValue: v => v,
      // skipFirstValidate: false,
      onValidateChange: () => { },
      validatorFunc: () => { },
      showErrMsg: false,
    }

    constructor(props) {
      super(props);
      // 初始校验，需要生成message，让FormItem识别以阻止非法提交。如初始为空不能提交一样。
      this.validate(props.value, true);
    }

    componentWillReceiveProps(nextProps) {
      // 在初始化之后，有新的value值填充进来时，需要更新校验的结果。否则还是初始校验时的校验结果（如明明有值了还提示“空”，不能提交）
      if (!isEqual(nextProps.value, this.props.value)) {
        this.validate(nextProps.value, true);
      }
    }

    onChange = (value) => {
      this.validate(value);
      this.props.onChange(value);
    }

    validate = (value, skipValidateNext = false) => {
      if (this.prevValidateValue === value) {
        // 判断是不是重复验证
        return;
      }
      this.prevValidateValue = value;
      const {
        fmtValue,
        validatorFunc,
        onValidateChange,
        // fmtValue = v => v,
        // validatorFunc = () => {},
        // onValidateChange = () => {},
      } = this.props;
      // 获取对应的校验函数
      // 取得校验的结果
      const result = validatorFunc(fmtValue(value), this.props);
      const { errItemIndex = -1 } = result || {};
      this.errItemIndex = errItemIndex;
      if (this.props.showErrMsg && !skipValidateNext) {
        this.validateNext(result);
      }
      // 取得校验结果后，触发校验事件
      onValidateChange(result);
      // console.log('result', result);
    }

    validateNext(result = {}) {
      const {
        pass,
        message,
      } = result;
      if (!pass) {
        notification.warning(message, 4);
      }
    }

    render() {
      const newProps = {
        onChange: this.onChange,
        errItemIndex: this.errItemIndex,
      };
      const {
        /* eslint-disable no-unused-vars */
        fmtValue,
        validatorFunc,
        onValidateChange,
        showErrMsg,
        /* eslint-enable no-unused-vars */
        ...restProps
      } = this.props;
      return (
        <BaseComponent {...restProps} {...newProps} />
      );
    }
  }

  // if (process.env.NODE_ENV === 'dev') {
  //   return setDisplayName(wrapDisplayName(BaseComponent, 'ValidateBone'))(
  //     ValidateBone
  //   );
  // }

  return ValidateBone;
}
