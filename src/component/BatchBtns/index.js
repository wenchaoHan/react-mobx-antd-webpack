/**
 * 列表页的操作：
 * demo: bach-erp/web/Demo/Table
 * 仅支持四种操作：'edit', 'copy', 'view', 'del'和自定义，自定义用法与BizComponent/Button一致
 * 传给组件的data会作为onClick回调的参数
 * href和onClick必传一个，表示跳转或触发一个function
 * 跳转可以设置target参数
 * 删除操作有默认的弹窗提示，可以设置noAlert为false过滤弹窗
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'bach-antd';
import Button from 'BizComponent/Button';

const confirm = Modal.confirm;

const typeColor = {
  edit: {
    color: 'green',
    text: '编辑',
  },
  copy: {
    color: 'orange',
    text: '复制',
  },
  view: {
    color: 'blue',
    text: '查看',
  },
  del: {
    color: 'red',
    text: '删除',
  },
};

class BatchBtns extends Component {
  onClick = (item, data) => {
    if (item.type === 'del' && !item.noAlert) {
      confirm({
        title: '确认是否删除',
        onOk: () => { item.onClick(data, item); },
      });
    } else if (item.onClick) {
      item.onClick(data);
    }
  }

  render() {
    const { items, data } = this.props;

    const buttons = [];


    if (items !== undefined && items.length > 0) {
      items.forEach((item, index) => {
        const { render } = item;
        delete item.render;

        const itemData = typeColor[item.type];
        if (itemData) {
          const classNames = [itemData.color || ''];
          if (index > 0) {
            classNames.push('margin-left-middle');
          }
          const button = (
            <Button
              key={item.type}
              {...item}
              type="link"
              target="_blank"
              onClick={() => this.onClick(item, data)}
              className={classNames.join(' ')}
            >
              {itemData.text}
            </Button>
          );

          if (typeof render === 'function') {
            const btn = render(button);
            buttons.push(React.cloneElement(btn, { key: item.type }));
          } else {
            buttons.push(button);
          }
        } else {
          const classNames = [item.className || ''];
          if (index > 0) {
            classNames.push('margin-left-middle');
          }
          const text = item.text;
          const propsItem = { ...item };
          if (text) {
            delete propsItem.text;
          }

          const button = (
            <Button
              key={index}
              data={data}
              {...propsItem}
              className={classNames.join(' ')}
            >
              {text}
            </Button>
          );

          if (typeof render === 'function') {
            buttons.push(render(button));
          } else {
            buttons.push(button);
          }
        }
      });
    }

    return (<div> { buttons } </div>);
  }
}


BatchBtns.propTypes = {
  // 按钮组，内容和Button组件接收的一致
  items: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.oneOf( // eslint-disable-line
      ['edit', 'copy', 'view', 'del', 'link', 'primary', 'danger', 'default']
    ),
  })),
  // 如果有onClick事件，data会作为回调的参数
  data: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.element,
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
  ]),
};

BatchBtns.defaultProps = {
  items: [],
  data: null,
};

export default BatchBtns;
