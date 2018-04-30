/**
 *  <FormItem
 *    rules= {rules, initialValue,  exclusive(radios)}
 *    namekey=string //required
 *    layout={labelCol, wrapperCol}, default is 1:2
 *    ...
 *  >
 *  children ...
 *  </FormItem>
 *
 * 允许包裹两个子组件，第一个是 edit 状态下的显示，第二个是 view 状态下的显示
 */
import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'bach-antd';
import log from 'BizUtils/log';
import validator from './validator';
import styles from './index.css';

class FormItem extends Component {

  constructor(props, context) {
    super(props, context);
    this.innerEl = this.innerEl.bind(this);
    this.validatorResult = {};
  }

  getChildContext = () => ({
    nameKey: this.props.nameKey,
  })

  getLayout = () => {
    let defaultLabelCol = {
      xs: { span: 3 },
      sm: { span: 3 },
    };
    let defaultWrapperCol = {
      xs: { span: 21 },
      sm: { span: 21 },
    };

    if (this.context && this.context.type) {
      if (this.context.type === 'search') {
        let { labelCol, wrapperCol } = this.props;
        if (typeof labelCol === 'string') {
          labelCol = {
            className: labelCol || 'w6em',
          };
        }
        if (typeof wrapperCol === 'string') {
          wrapperCol = {
            className: wrapperCol || '',
          };
        }
        return {
          labelCol: labelCol || { className: 'w6em' },
          wrapperCol: wrapperCol || {},
        };
      }
      if (this.context.type === 'modal') {
        defaultLabelCol = {
          xs: { span: 6 },
          sm: { span: 6 },
        };
        defaultWrapperCol = {
          xs: { span: 18 },
          sm: { span: 18 },
        };
      }
    }

    const { layout } = this.props;
    let { labelCol, wrapperCol } = this.props;
    labelCol = (layout && layout.labelCol) || labelCol || defaultLabelCol;
    wrapperCol = (layout && layout.wrapperCol) || wrapperCol || defaultWrapperCol;
    return { labelCol, wrapperCol };
  }

  innerEl(element) {
    const { field = {}, group, label } = this.props;
    const isArray = element && element instanceof Array;
    const store = this.context.store;
    const duplex = this.context.duplex;
    let { nameKey } = this.props;
    let initialValue;
    let viewElement;

    if (isArray) {
      // 证明是一个只提供样式的 Form.Item
      if (group) {
        return <span>{element}</span>;
      }
      const [Edit, View] = element;
      if (this.context.view) {
        viewElement = Children.only(View);
      } else {
        element = Children.only(Edit);
      }
    }

    if (!element || (!element.type && !(element instanceof Array))) {
      throw new Error('请传入正确的 element!');
    }

    if (nameKey) {
      const getFieldDecorator = this.context &&
        this.context.form &&
        this.context.form.getFieldDecorator;

      nameKey = this.context.listNameKey ? `${this.context.listNameKey}[${this.context.listIndex}]${nameKey.trim() ? `.${nameKey}` : ''}` : nameKey;

      // 利用 store 设置 initialValue
      if (store && !Object.prototype.hasOwnProperty.call(field, 'initialValue')) {
        /* eslint-disable no-new-func */
        const getValue = new Function('store', `return store.${nameKey}`);
        try {
          initialValue = getValue(store);
        } catch (e) {
          initialValue = '';
        }

        field.initialValue = initialValue;
      }

      if (this.context.view && viewElement) {
        return React.cloneElement(viewElement, { value: initialValue || field.initialValue || '' });
      }

      if (field.rules) {
        field.rules = validator(label, field.rules);
      }

      // 自动探测子组件是否自行实现了的校验器，如果有onValidateChange属性，刚为其自动补充一个校验规则，无需手写
      if ('onValidateChange' in element.props) {
        const rules = !field.rules ? [] : field.rules.slice();
        rules.push({
          validator: (rule, value, callback) => {
            const { message } = this.validatorResult || {};
            callback(message);
          },
        });
        field.rules = rules;
        element = React.cloneElement(element, {
          onValidateChange: (result = {}) => {
            this.validatorResult = result;
          },
        });
      }

      // if (getFieldDecorator) {
      //   return getFieldDecorator(nameKey, { ...field })(element);
      // }
      if (getFieldDecorator) {
        element = getFieldDecorator(nameKey, { ...field })(element);
        // 给绑定了store，需要双绑的做一下联动bug（initialValue在被用户设过值后就不再生效，不再响应store值的改变）的bugfix
        // -------------start--------------------
        if (store && duplex) {
          element = React.cloneElement(element, {
            ...element.props,
            value: initialValue || field.initialValue,
          });
        }
        // -------------end--------------------
        return element;
      }

      throw new Error('请使用 Form.create 装饰器!');
    }

    if (this.context.view && viewElement) {
      return viewElement;
    }
    return element;
  }

  render() {
    const { children, visible, ...props } = this.props;
    const style = !this.props.button ? {} : { marginBottom: 0 };
    const layout = this.getLayout();
    const required = this.context.view ? false : this.props.required;
    if (!visible) {
      return null;
    }

    return props.label ? (
      <Form.Item labelClass="w6em" {...props} {...layout} required={required}>
        {this.innerEl(children)}
      </Form.Item>
    ) : (
      <Form.Item style={style} {...props} required={required}>
        {this.innerEl(children)}
      </Form.Item>
    );
  }
}

FormItem.propTypes = {
  visible: PropTypes.bool,
  layout: PropTypes.oneOfType([PropTypes.object]),
  nameKey: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  required: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
    PropTypes.object,
  ]).isRequired,
  field: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  group: PropTypes.bool,
  button: PropTypes.bool,
  labelCol: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  wrapperCol: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

FormItem.contextTypes = {
  form: PropTypes.oneOfType([PropTypes.object]),
  view: PropTypes.bool,
  store: PropTypes.object,
  duplex: PropTypes.bool,
  layout: PropTypes.string,
  type: PropTypes.string,
  listNameKey: PropTypes.string,
  listIndex: PropTypes.number,
  listHide: PropTypes.bool,
};

FormItem.childContextTypes = {
  nameKey: PropTypes.string,
};

FormItem.defaultProps = {
  visible: true,
  label: '',
};

/* eslint-disable react/no-multi-comp */
class FormState extends Component {
  static childContextTypes = {
    view: PropTypes.bool,
    type: PropTypes.string,
    store: PropTypes.object,
  };

  static propTypes = {
    view: PropTypes.bool,
    type: PropTypes.string,
    store: PropTypes.object,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.element),
      PropTypes.element,
      PropTypes.object,
    ]),
  };

  constructor(...args) {
    super(...args);
    log.warn('不推荐使用 FormState！请使用新版 Form 和 Form.Create()');
  }

  getChildContext() {
    return {
      view: this.props.view || null,
      type: this.props.type || null,
      store: this.props.store || null,
    };
  }

  getChildElement(type) {
    if (type === true) {
      return <div className="l-form-view">{this.props.children}</div>;
    }
    return <div>{this.props.children}</div>;
  }

  render() {
    return this.props.type === 'search' ?
        (<div className="ant-advanced-search-form-area">{this.props.children}</div>)
      : this.getChildElement(this.props.view);
  }
}

const checkIsObj = value => Object.prototype.toString.call(value) === '[object Object]';

const fmt = (value) => {
  const newVal = checkIsObj(value) ? value.key : value;
  return newVal;
};

const Text = ({ value, format, className = styles.overflow, ...resetProps }) => {
  const newVal = format(value);
  return (
    <span className={className} {...resetProps} >
      {Array.isArray(newVal) ? String(newVal.map(fmt)) : newVal}
    </span>
  );
};

Text.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  value: PropTypes.any,
  /* eslint-enable react/forbid-prop-types */
  className: PropTypes.string,
  format: PropTypes.func,
};
Text.defaultProps = {
  // value: '',
  format: v => v,
};

FormItem.FormState = FormState;
FormItem.Text = Text;

export { FormState, Text };

export default FormItem;
