/**
 * 基于ant的notification
 * 增加了 placement 为 top 的情况
 * demo:utils里的request
 *
 * 事例
 *    Notification.noticeClose('操作完成，正在关闭页面...') // 提示《操作完成，正在关闭页面...》，2秒后关闭页面
 *    Notification.noticeClose('操作完成，正在关闭页面...', 5) // 提示《操作完成，正在关闭页面...》，5秒后关闭页面
 *    Notification.noticeGoto('新建通知成功', '/Notice/List') // 提示《新建通知成功》，2秒后跳转到 /Notice/List 通知列表页
 *    // 提示《新建通知成功》,5秒后跳转到 /Notice/List?id=1 通知详情页
 *    Notification.noticeGoto('编辑通知成功', '/Notice/Detail', {id: 1})
 */

import React from 'react';
// import Notification from 'rc-notification';
import { notification } from 'antd';
import router from 'BizUtils/router';

const prefixCls = 'bach-ant-notification';
const messageMap = {
  info: '帮助信息',
  success: '已成功！',
  error: '出错了！',
  warning: '请注意！',
};
let notificationInstance;

function getNotificationInstance() {
  if (notificationInstance) {
    return notificationInstance;
  }
  notificationInstance = Notification.newInstance({
    transitionName: 'move-up',
    prefixCls,
    className: `${prefixCls}-topRight`,
    style: {
      left: '50%',
      top: 0,
      bottom: 'auto',
      wordBreak: 'break-word',
    },
  });
  return notificationInstance;
}

/* Problem */
// function notice_(type, content, duration = null, config = {}) {
//   getNotificationInstance().notice({
//     content: (
//       <Alert message={messageMap[type]} description={content} type={type} showIcon />
//     ),
//     duration,
//     onClose: config.onClose || null,
//     closable: config.closable || true,
//     key: config.key,
//   });
// }

function notice(type,content,duration = null,config = {}) {
    notification[type]({
        message: messageMap[type],
        description: content,
        duration:duration
    });
};

export default {
  info(content, duration = 3.5, config) {
    notice('info', content, duration, config);
  },
  success(content, duration = 3.5, config) {
    notice('success', content, duration, config);
  },
  error(content, duration = 3.5, config) {
    notice('error', content, duration, config);
  },
  warning(content, duration = 3.5, config) {
    notice('warning', content, duration, config);
  },
  noticeClose(content, duration = 2) { // 少用点...
    if (typeof duration !== 'number') {
      throw new TypeError('duration 只能是 number 类型');
    }
    notice('success', content, duration);
    setTimeout(router.close, duration * 1000);
  },
  noticeGoto(content, ...args) {
    let duration = 2;
    if (typeof args[0] === 'number') {
      duration = args.shift();
    }
    notice('success', content, duration);
    setTimeout(() => router.goto(...args), duration * 1000);
  },
};
