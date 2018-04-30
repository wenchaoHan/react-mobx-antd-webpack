import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Rbac from 'BizComponent/Rbac';
import { toJS } from 'mobx';
import { Form as AntForm, Button } from 'bach-antd';
import FormItem from 'BizComponent/FormItem';
import log from 'BizUtils/log';
/**
 * 全自动 Form 组件，使用方式请参考：
 *
 * - src/views/Supplier/ExpenseEdit
 * - src/views/Supplier/CompanyList
 * - src/views/Supplier/CompanyList
 */

/* eslint-disable no-new-func */
const getter = nameKey => new Function('store', `return store.${nameKey}`);
const setter = nameKey => new Function('store', 'value', `return store.${nameKey} = value`);

class Form extends Component {
  static propTypes = {
    /* 查看状态下的编辑方法 */
    onEdit: PropTypes.func,
    /* 提交按钮方法，search 状态下的查询，其他状态下的保存，自动 preventDefault */
    onSubmit: PropTypes.func,
    /* 取消方法 */
    onCancel: PropTypes.func,
    /* 编辑按钮文本 */
    editText: PropTypes.string,
    /* 提交按钮文本 */
    submitText: PropTypes.string,
    /* 取消按钮文本 */
    cancelText: PropTypes.string,
    /* 用于是否显示编辑相关的按钮 */
    noEdit: PropTypes.bool,
    /* 用于是否显示提交相关的按钮 */
    noSubmit: PropTypes.bool,
    /* 用于是否显示取消相关的按钮 */
    noCancel: PropTypes.bool,
    /* 当前是否查看状态 */
    view: PropTypes.bool,
    /* 用于显示初始值的 store */
    store: PropTypes.oneOfType([PropTypes.object]),
    /* 是否使用双绑机制 */
    duplex: PropTypes.bool,
    /* 用于控制显示样式的类型 modal/search */
    type: PropTypes.string,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.element),
      PropTypes.element,
      PropTypes.object,
    ]),
    /* 自定义底部 footer */
    footer: PropTypes.element,
    /* 可指定表单按钮组的formItem的额外属性 */
    formItemProps: PropTypes.oneOfType([PropTypes.object]),
    /* 控制提交按钮的loading状态 */
    btnLoading: PropTypes.bool,
    /* 禁止敲enter回车键触发提交 */
    preventEnterSubmit: PropTypes.bool,
    /* 查找按钮组容器的className */
    searchWrapClass: PropTypes.string,
    /* 查找按钮组容器的className */
    rbac: PropTypes.shape({
      submit: PropTypes.instanceOf(Rbac),
      edit: PropTypes.instanceOf(Rbac),
      cancel: PropTypes.instanceOf(Rbac),
    }),
  };

  static defaultProps = {
    view: false,
    onSubmit: () => {},
    onCancel: () => {},
    onEdit: () => {},
    editText: '编辑',
    submitText: '提交',
    cancelText: '取消',
    noEdit: false,
    noSubmit: false,
    noCancel: false,
    duplex: false,
    formItemProps: {},
    rbac: {},
  };

  static childContextTypes = {
    view: PropTypes.bool,
    type: PropTypes.string,
    store: PropTypes.object,
    duplex: PropTypes.bool,
  };

  constructor(props, context) {
    super(props, context);

    this.onSubmit = this.onSubmit.bind(this);
    this.preventEnterSubmit = this.preventEnterSubmit.bind(this);
  }

  getChildContext() {
    return {
      view: this.props.view,
      type: this.props.type,
      store: this.props.store,
      duplex: this.props.duplex,
    };
  }

  onSubmit(e) {
    const { onSubmit } = this.props;
    e.preventDefault();
    if (!this.disableEnterSubmit) {
      onSubmit(e);
    }
  }

  getFooter() {
    const {
      type, view, rbac, footer,
      onEdit, noEdit, onCancel, noSubmit, noCancel, editText, submitText, cancelText,
      formItemProps, btnLoading, searchWrapClass,
    } = this.props;

    if (footer !== undefined) return footer;
    if (type === 'modal') return null;

    if (type === 'search') {
      const submitButton = (
        <Button
          size="default"
          htmlType="submit"
          onClick={this.onSubmit}
          loading={btnLoading}
        >查询</Button>
      );

      const cancelButton = (
        noCancel ? null : (<Button
          size="default"
          type="danger"
          className="margin-left-middle"
          onClick={onCancel}
        >清空</Button>)
      );

      const submit = rbac.submit ?
        React.cloneElement(rbac.submit, { children: submitButton }) :
        submitButton;

      const cancel = rbac.cancel ?
        React.cloneElement(rbac.cancel, { children: cancelButton }) :
        cancelButton;

      return (
        <div className={searchWrapClass !== undefined ? searchWrapClass : 'form-search-btns'}>
          {submit}{cancel}
        </div>
      );
    }

    const editButton = (
      <FormItem
        label=" "
        colon={false}
        {...formItemProps}
      >
        <Button
          onClick={onEdit}
          type="primary"
        >{editText}</Button>
      </FormItem>
    );

    const submitButton = (
      noSubmit ? null : (<Button
        type="primary"
        htmlType="submit"
        onClick={this.onSubmit}
        loading={btnLoading}
      >{submitText}</Button>)
    );

    const cancelButton = (
      noCancel ? null : (<Button
        className="margin-left-middle"
        type="danger"
        onClick={onCancel}
      >{cancelText}</Button>)
    );

    const edit = rbac.edit ?
      React.cloneElement(rbac.edit, { children: editButton }) :
      editButton;

    const submit = rbac.submit ?
      React.cloneElement(rbac.submit, { children: submitButton }) :
      submitButton;

    const cancel = rbac.cancel ?
      React.cloneElement(rbac.cancel, { children: cancelButton }) :
      cancelButton;

    return view ? (!noEdit && edit) : (
      <FormItem
        label=" "
        colon={false}
        group
        {...formItemProps}
      >
        {submit}
        {cancel}
      </FormItem>
    );
  }

  preventEnterSubmit(evt) {
    this.disableEnterSubmit = evt.keyCode === 13;
  }

  render() {
    const {
      type,
      children,
      /* eslint-disable no-unused-vars */
      rbac,
      onEdit,
      onSubmit,
      onCancel,
      editText,
      submitText,
      cancelText,
      noEdit,
      noSubmit,
      noCancel,
      store,
      duplex,
      footer,
      view,
      formItemProps,
      btnLoading,
      searchWrapClass,
      preventEnterSubmit,
      /* eslint-enable no-unused-vars */
      ...props
    } = this.props;

    const searchStyle = 'ant-advanced-search-form form-search';
    const viewStyle = 'l-form-view';

    if (type === 'search') {
      props.layout = 'inline';
      props.className = props.className ?
        `${searchStyle} ${props.className}` :
        searchStyle;
    } else if (view) {
      props.className = props.className ?
        `${viewStyle} ${props.className}` :
        viewStyle;
    }

    return (
      <AntForm onKeyDown={preventEnterSubmit ? this.preventEnterSubmit : undefined} {...props}>
        <div className="ant-advanced-search-form-area">
          {children}
          {this.getFooter()}
        </div>
      </AntForm>
    );
  }
}

Form.create = (option = {}, mixins) => {
  const {
    store,
    observer = true,
    duplex,
    onFieldsChange,
    mapPropsToFields,
    ...options
  } = option;

  const createOptions = { ...options, onFieldsChange, mapPropsToFields };

  if (!onFieldsChange && observer && typeof store === 'function') {
    createOptions.onFieldsChange = (props, changedFields) => {
      Object.keys(changedFields).forEach((key) => {
        try {
          const { value } = getter(key)(changedFields);
          const setValue = setter(key);
          // TODO: new Function
          setValue(store(), value);
        } catch (e) {
          log(e);
        }
      });
    };
  }

  if (!mapPropsToFields && duplex && observer && typeof store === 'function') {
    createOptions.mapPropsToFields = (props) => {
      const data = toJS(props.store);

      if (data) {
        Object.keys(data).forEach((key) => {
          data[key] = { value: data[key] };
        });

        return data;
      }
      throw new Error('使用 duplex，必须在父层元素上设置名为 store 的 props！');
    };
  }

  return WrappedComponent => AntForm.create(createOptions, mixins)(WrappedComponent);
};

export default Form;
