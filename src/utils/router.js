/**
 * 地址、参数相关工具
 *    parse([url = window.location.search], option) 参数解析
 *    stringify(param, option) 构建参数
 *    reload() 刷新页面
 *    assign(url) // 仅用于 hash 修改
 *    close() 关闭页面 // 不可保证 100% 啊...
 *    buildUrl(pathname, param, hash) 构建地址
 *    forward() // history.forward
 *    back() // history.back
 *    goto(pathname, param, hash) 跳转地址
 *    form, // 标准 form post 提交数据，一般用于 get 下载参数过长
 *    callback(...args) 回调父页面 router.open 的 callback 函数
 *    open(pathname, param, hash, callback) 打开地址
 *
 * 通知提示后操作，见 Notification.xxxx
 *    noticeClose(content, [duration]) 通知提示后关闭页面 // 不可保证 100% 啊...
 *    noticeGoto(content, [duration,] pathname, param, hash) 通知提示后跳转地址
 *
 * 示例
 *    // location.href = 'http://bachman.wormpex.com/bach-xx/web/Shop/Detail?state=view';
 *    import router from '$utils/router';
 *    router.parse(); // {state: view}
 *    router.stringify({a, 1, b: 'b'}); // a=1&b=b 等同于 queryString.stringify
 *    router.reload(); // 刷新页面
 *    router.close(); // 关闭页面
 *    // 非页面地址
 *    router.buildUrl('/scm/supplier/api/export/v1'); // http://bachman.wormpex.com/scm/supplier/api/export/v1
 *    // 外部地址
 *    router.buildUrl('https://www.baidu.com'); // https://www.baidu.com
 *    // 页面地址，构建 A 标签 href 属性
 *    router.buildUrl('/Shop/List'); // http://bachman.wormpex.com/bach-xx/web/Shop/List
 *    router.buildUrl('/Shop/List'); // http://bachman.wormpex.com/bach-xx/web/Shop/List
 *    router.buildUrl('/Shop/List', {id: 1, ids: [1,2]}); // http://bachman.wormpex.com/bach-xx/web/Shop/List?id=1&ids=1&ids=2
 *    router.buildUrl('/Shop/List', {id:1}, 'hash'); // http://bachman.wormpex.com/bach-xx/web/Shop/List?id=1#hash
 *    router.buildUrl('/Shop/List', '', 'hash'); // http://bachman.wormpex.com/bach-xx/web/Shop/List#hash
 *    router.goto(pathname, param, hash); // 当前页面跳转到 buildUrl 后的地址
 *    router.open(pathname, param, hash); // 新页面打开 buildUrl 后的地址
 */

import qs from 'query-string';
import { urlPrefix as BASE_PATH } from 'BizConfig/constant';

const global = window;
const location = global.location;

function error(msg) {
  if (process.env.NODE_ENV === 'dev') {
    global.alert(msg);
  }
  throw new Error(msg);
}

export function parse(url = location.search, option) {
  if (typeof url === 'object') {
    option = url;
    url = location.search;
  }
  const param = qs.parse(url, option);
  delete param.router_callback_id; // 清除注入的参数
  return param;
}

export function stringify(param, option) {
  return qs.stringify(param, option);
}

export function assign(url) {
  location.assign(url);
}

export function reload() {
  location.reload(true);
}

export function close() {
  global.close();
}

function checkPathname(pathname) { // // 开头用于链接地址自适应 http 和 https
  const match = /^((https?:)?\/)?\//.exec(pathname);
  if (!match) {
    error('pathname 必须以 / // http:// https:// 开头');
  }
  if (match[0] === '/' && pathname.slice(-1) === '/') {
    error('pathname 不需要以 / 结尾');
  }
  if (pathname.slice(0, BASE_PATH.length) === BASE_PATH) {
    error(`pathname 不需要 ${BASE_PATH} 前缀`);
  }
}

// 链接地址构建，可用于 A 标签 href 属性
export function buildUrl(pathname, param, hash) {
  checkPathname(pathname);
  const firstChar = pathname.slice(1, 2);
  if (firstChar.toUpperCase() === firstChar) { // 项目内页面地址，自动补全基路径
    pathname = `${BASE_PATH}${pathname}`;
  }
  param = qs.stringify(param);
  return `${pathname}${param ? `?${param}` : param}${hash ? `#${hash}` : ''}`;
}

export function callback(...args) {
  const callbackId = qs.parse(location.search).router_callback_id;
  if (!callbackId) {
    error('只有使用 router.open 打开的页面才能使用 router.callback');
  }
  if (!global.opener) {
    error('页面已失效，请重新打开！');
  }
  const fn = global.opener.B[callbackId];
  if (typeof fn !== 'function') {
    error('页面已失效，请重新打开！'); // 父页面刷新导致丢失callback
  }
  return fn(...args);
}

export function forward() {
  global.history.forward();
}

export function back() {
  global.history.back();
}

// TODO 加个错误结果显示吧，要支持 target 配置吗
export function download(pathname, param, method = 'post') {
  const containerId = 'router_container_id';
  const formId = 'router_form_id';
  const iframeId = 'router_iframe';
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    container.style.height = '0px';
    container.style.overflow = 'hidden';
    document.body.appendChild(container);
  }
  container.innerHTML = `
    <form target="${iframeId}" id="${formId}" action="${pathname}" method="${method}"></form>
    <iframe name="${iframeId}"></iframe>
  `;
  const $form = document.getElementById(formId);
  function field(name, value = '') {
    const input = document.createElement('input');
    input.name = name;
    input.value = value;
    $form.appendChild(input);
  }
  Object.keys(param).forEach((key) => {
    const value = param[key];
    if (Array.isArray(value)) {
      value.forEach(val => field(key, val));
    } else {
      field(key, value);
    }
  });
  $form.submit(); // TODO 加个错误结果显示吧
}


export function goto(pathname, param, hash) {
  location.href = buildUrl(pathname, param, hash);
}

function processCallback(args) {
  const fn = args[args.length - 1];
  if (typeof fn === 'function') {
    args.pop();
    const param = args[1] = args[1] || {};
    const uuid = param.router_callback_id = window.B.uuid();
    window.B[uuid] = fn;
  }
}

export function open(...args) { // (pathname, [param, [hash, ]] callback])
  processCallback(args);
  global.open(buildUrl(...args));
}

export function openBlank() {
  const win = global.open('', '_blank');
  return {
    goto(...args) { // (pathname, [param, [hash, ]] callback])
      processCallback(args);
      win.location.href = buildUrl(...args);
    },
    close() {
      win.close();
    },
  };
}

// 好似我以为用不到，慎用，要使用时提前周知一把先
export function filterParam(param, filters = ['']) {
  const ret = {};
  filters.push(undefined);
  Object.keys(param).forEach((key) => {
    const value = param[key];
    if (filters.indexOf(value) < 0) {
      ret[key] = value;
    }
  });
  return ret;
}

export default {
  parse,
  stringify,
  reload,
  close,
  buildUrl,
  callback,
  forward,
  back,
  download, // 标准 form post 提交数据，一般用于 get 下载参数过长
  goto,
  open,
  openBlank,
  filterParam,
};
