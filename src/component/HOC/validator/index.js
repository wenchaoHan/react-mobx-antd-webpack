import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import cloneDeep from 'lodash/cloneDeep';
import validateBone from '../validateBone';
// import wrapDisplayName, { setDisplayName } from '../getDisplayName';

/**
 * 校验器高阶组件函数
 *
 * @desc 给组件包装一个校验器，用以一些较复杂的组件的自定义校验，
 * 接收一个组件，返回一个包装了校验器的新组件
 *
 * @export {func} Validator
 * @param {Component} BaseComponent 接收的源组件
 * @returns Component 返回一个在源组件中增加了校验器功能的新组件
 * @demo
 *  1、参见底部注释
 *  2、/bach-erp/src/views/Promotion/Coupon/New/CouponComponent/index.js
 */

export default function validator(BaseComponent) {
  const BaseComponentWithValidateBone = validateBone(BaseComponent);
  class Validator extends Component {
    static propTypes = {
      /*
      // 在onChange事件触发时同时触发的一个校验事件，
      // @param: result 为validatorFunc校验函数返回的校验信息对象
      onValidateChange: PropTypes.func,
      // 将value格式化成校验函数期望接收的形式，
      // 因为keyMap会转换value的格式，所以只能让用户手动提供转换函数了
      fmtValue: PropTypes.func,
      // 是否弹出提示框来提示错误信息，默认为false，默认通过formItem获取result.message来校验
      showErrMsg: PropTypes.bool,
      // 在组件链中透传下去的value值
      value: PropTypes.any, */
      // 用以获取适配的校验函数
      validatorType: PropTypes.oneOf(['dynamicRangeTime']).isRequired,
      children: PropTypes.node,
      onValidateChange: PropTypes.func,
      // 在value改变时触发的事件
      onChange: PropTypes.func,
    }
    static defaultProps = {
      onChange: () => { },
      onValidateChange: () => { },
      // fmtValue: v => v,
      // showErrMsg: false,
    }

    constructor(props) {
      super(props);
      this.fmt = 'HH:mm:ss';
      this.genValMap = this.genValMap.bind(this);
      // this.validateRangeTime = this.validateRangeTime.bind(this);
      this.validateDynamicRangeTime = this.validateDynamicRangeTime.bind(this);
      this.validatorMap = {
        // 如果要增加其它校验，在这里添加一个map（一个type和其对应的校验函数）即可
        dynamicRangeTime: this.validateDynamicRangeTime,
      };
    }

    // ---------------------------- dynamicRangeTime start ----------------------------

    // => 结束时间 > 开始时间
    compareTimeAsc(start, end) {
      return start && end && moment(end, this.fmt).isAfter(moment(start, this.fmt));
    }

    genValMap(value) {
      const newVal = cloneDeep(value);
      const indexMap = [...'0'.repeat(value.length)].reduce((acc, cur, idx) => {
        acc[idx] = idx;
        return acc;
      }, {});
      for (let i = 0; i < newVal.length - 1; i += 1) {
        for (let j = i + 1; j < newVal.length; j += 1) {
          if (newVal[i][0] && newVal[j][0] && newVal[i][0] !== newVal[j][0]
            && !this.compareTimeAsc(newVal[i][0], newVal[j][0])) {
            const tempIdx = indexMap[j];
            indexMap[j] = indexMap[i];
            indexMap[i] = tempIdx;
            const temp = newVal[j];
            newVal[j] = newVal[i];
            newVal[i] = temp;
          }
        }
      }
      return {
        newVal,
        indexMap,
      };
    }

    validateDynamicRangeTime(value = []) {
      const {
        newVal,
        indexMap,
      } = this.genValMap(value);
      let errItemIdx = -1;
      const endIsBeforeStart = !newVal.some((item, index) => {
        const isErr = !this.compareTimeAsc(item[0], item[1]);
        if (isErr) {
          errItemIdx = index;
        }
        return isErr;
      });
      let pass = endIsBeforeStart;
      let hasBreak = false;
      if (pass) {
        pass = !!newVal.reduce((prev, cur, idx) => {
          const isPass = prev && this.compareTimeAsc(prev[1], cur[0]) && cur;
          if (!isPass && !hasBreak) {
            hasBreak = true;
            errItemIdx = idx;
          }
          return isPass;
        });
      }
      const errIndex = errItemIdx === -1 ? -1 : indexMap[errItemIdx] + 1;
      const result = {
        pass,
        errItemIndex: errIndex,
        message: !pass ? `第${errIndex}行时间有误，${!endIsBeforeStart ? '开始时间不能小于结束时间' : '时间段之间不能交叉'}` : undefined,
      };
      // 默认返回一个result对象，格式可以变，但建议大家用类似的格式，方便多人维护
      // console.log('result', newVal, indexMap, result, 'endIsBeforeStart', endIsBeforeStart);
      return result;
    }

    // ---------------------------- dynamicRangeTime end ----------------------------

    render() {
      const {
        /* eslint-disable no-unused-vars */
        children,
        validatorType,
        /* eslint-enable no-unused-vars */
        ...restProps
      } = this.props;
      return (
        <BaseComponentWithValidateBone
          validatorFunc={this.validatorMap[validatorType]}
          {...restProps}
        />
      );
    }
  }

  // if (process.env.NODE_ENV === 'dev') {
  //   return setDisplayName(wrapDisplayName(BaseComponent, 'Validator'))(
  //     Validator
  //   );
  // }
  return Validator;
}

/*
  @demo 校验器使用demo
  注意，下面代码中用“//”注释掉的代码是随着FormItem支持组件自行实现校验而不需要再写的，FormItem已经帮你写了
  FormItem现在支持了自动探测是否有onValidateChange函数，
  有则为其加上了个校验规则，即在rules数组里面push一条自定义校验的规则,

import DateTimePicker from 'BizComponent/DateTimePicker';
import HOC from 'BizComponent/HOC';

const DateTimePickerWithValidator = HOC.validator(DateTimePicker);

  ...
  // ------------------ 无需再写 start ------------------
  // handleValidateChange = (result) => {
  //   this.timeValidatorResult = result;
  // }
  // checkRangePickerTime = (rule, value, callback) => {
  //   const { message } = this.timeValidatorResult || {};
  //   callback(message);
  // }
  // ------------------ 无需再写 end ------------------

  // 随keyMap而变，默认key为from, to，
  fmtValue = (value = []) => value.map(item => [item.lower, item.upper]);
  render() {
    return (
      ...
      <FormItem
        nameKey="dayTimeRanges"
        label="适用每日时间段"
        // field={{ rules: [{ validator: this.checkRangePickerTime }] }} // 无需再写
      >
        <DateTimePickerWithValidator
          pickerType={'DynamicRangePicker'}
          validatorType={'dynamicRangeTime'}
          fmtValue={this.fmtValue}
          keyMap={{ from: 'lower', to: 'upper' }}
          // onValidateChange={this.handleValidateChange} // 无需再写
        />
      </FormItem>
      ...
    );
  }
  */
