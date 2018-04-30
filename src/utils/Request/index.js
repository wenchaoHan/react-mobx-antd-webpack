import 'worm-fetch';
// import jsonp from 'fetch-jsonp';
import notification from 'BizComponent/Notification';
// import { rbacSource } from 'BizConfig/constant';
import { rbacSource, appSource } from 'BizConfig/constant';
import { stringify } from 'query-string';
import Cookie from 'js-cookie';
import serialize from './serialize';

/**
 * Request.get(url, {
 *  data: '参数'
 *  mock: true/false
 *  showError: false
 * })
 * Request.post(url)
 *
**/

// 决定全局是否启用 mock 数据
const MOCK = false;
// const MOCK = window.WE_NEED_MOCK;
if (MOCK) {
  Cookie.set('project_id_cookie', '33cSsOPqX', { path: '/' });
}

const MOCK_HEADERS = MOCK ? {
  'Mock-Request': 'bingo',
} : {};

const HEADERS = {
  get: {
    rbac_source: rbacSource,
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    ...MOCK_HEADERS,
  },
  post: {
    rbac_source: rbacSource,
    'Content-Type': 'application/json; charset=UTF-8',
    ...MOCK_HEADERS,
  },
  put: {
    rbac_source: rbacSource,
    'Content-Type': 'application/json; charset=UTF-8',
    ...MOCK_HEADERS,
  },
  delete: {
    rbac_source: rbacSource,
    'Content-Type': 'application/json; charset=UTF-8',
    ...MOCK_HEADERS,
  },
};

const getGenerateID = () => `x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
const errPromise = {
  then() {
    return errPromise;
  },
  catch() {
    return errPromise;
  },
};
// 记录进行中的请求
const fetchingMap = {};

function newFetch(url, param, showError, uniqueData, onlyOnce) {
  // const uri = MOCK ? `${url}` : url;
  const uri = MOCK ? `/${appSource}${url}` : url;
  param.credentials = 'same-origin';

  if (onlyOnce && fetchingMap[uniqueData]) {
    return errPromise;
  }
  fetchingMap[uniqueData] = true;
  console.log("发起请求？\n",uri,"\n",param);
  return fetch(uri, param)
  .then((response) => {
    delete fetchingMap[uniqueData];
    if (response.status >= 200 && response.status < 300) {
      if (!window.SHOP_CODE) {
        window.SHOP_CODE = response.headers.get('shopCode') || '';
      }
      console.log(" 83 \n",response);
      return response;
    }
    throw new Error(`${response.status} ${response.statusText}`);
  })
  .then(response => response.json())
  .then((data) => {
    if (data.status !== 0) {
      const error = new Error(data.msg || data.message || '请求异常');
      error.response = data;
      throw error;
    } else {
      if (param.successTip) {
        notification.success(typeof param.successTip === 'string' ? param.successTip : '操作成功', 1.5);
      }
      return data;
    }
  })
  .catch((error) => {
    if (fetchingMap[uniqueData]) {
      delete fetchingMap[uniqueData];
    }
    if (showError) {
      notification.error(error.message, 5);
    }
    throw error;
  });
}

function get(url, param = {}, withUUID) {
  const {
    // 是否显示默认错误提示
    showError = true,
    // 超时时间
    timeout = 10000,
    // 成功提示
    successTip = false,
    onlyOnce = true,
  } = param;

  let { data = {} } = param;  // 传参对象

  const headers = { ...HEADERS.get, ...param.headers };
  const newParam = { method: 'GET', headers, timeout, successTip };

  // 拼接请求参数
  if (data) {
    const urlParam = encodeURIComponent(serialize(data)).replace(/%26/g, '&').replace(/%3D/g, '=');
    url += `${url.indexOf('?') > -1 ? '&' : '?'}${urlParam}`;
  }

  const uniqueData = url;

  // 添加时间戳
  url += `${url.indexOf('?') > -1 ? '&' : '?'}_time=${new Date() - 0}`;

  // 添加UUID
  if (withUUID) {
    if (typeof withUUID === 'boolean') {
      data.uuid = getGenerateID();
    } else if (typeof withUUID === 'function') {
      data = withUUID(data, getGenerateID());
    }
  }

  return newFetch(url, newParam, showError, uniqueData, onlyOnce);
}

function post(url, param = {}, withUUID) {
  const {
    // 是否显示默认错误提示
    showError = true,
    // 超时时间
    timeout = 10000,
    // 成功提示
    successTip = false,
    form = false,
    onlyOnce = true,
  } = param;

  let { data = {} } = param;  // 传参对象

  const headers = { ...HEADERS.post, ...param.headers };
  if (form) {
    headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
  }

  const uniqueData = `${url}${form ? stringify(data) : (JSON.stringify(data) || {})}`;

  // 添加UUID
  if (withUUID) {
    if (typeof withUUID === 'boolean') {
      data.uuid = getGenerateID();
    } else if (typeof withUUID === 'function') {
      data = withUUID(data, getGenerateID());
    }
  }

  return newFetch(url, {
    method: 'POST',
    headers,
    timeout,
    body: form ? stringify(data) : (JSON.stringify(data) || {}),
    //   body: form ? stringify(data) : data || {},
    successTip,
  }, showError, uniqueData, onlyOnce);
}

function fileUpload(url, param = {}, withUUID){
  const {
    // 是否显示默认错误提示
    showError = true,
    // 超时时间
    timeout = 10000,
    // 成功提示
    successTip = false,
    form = false,
    onlyOnce = false,
  } = param;

  let { data = {} } = param;  // 传参对象

  const uniqueData = `${url}${form ? stringify(data) : (JSON.stringify(data) || {})}`;

  if (withUUID) {
    if (typeof withUUID === 'boolean') {
      data.uuid = getGenerateID();
    } else if (typeof withUUID === 'function') {
      data = withUUID(data, getGenerateID());
    }
  }
  return newFetch(url, {
    method: 'POST',
    timeout,
    body: data,
    successTip,
  }, showError, uniqueData, onlyOnce);
}

function DELETE(url, param = {}, withUUID) {
  const {
    // 是否显示默认错误提示
    showError = true,
    // 超时时间
    timeout = 10000,
    // 成功提示
    successTip = false,
    form = false,
    onlyOnce = true,
  } = param;

  let { data = {} } = param;  // 传参对象

  const headers = { ...HEADERS.post, ...param.headers };
  if (form) {
    headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
  }

  const uniqueData = `${url}${form ? stringify(data) : (JSON.stringify(data) || {})}`;

  // 添加UUID
  if (withUUID) {
    if (typeof withUUID === 'boolean') {
      data.uuid = getGenerateID();
    } else if (typeof withUUID === 'function') {
      data = withUUID(data, getGenerateID());
    }
  }

  return newFetch(url, {
    method: 'DELETE',
    headers,
    timeout,
    body: form ? stringify(data) : (JSON.stringify(data) || {}),
    successTip,
  }, showError, uniqueData, onlyOnce);
}

function put(url, param = {}, withUUID) {
  const {
    // 是否显示默认错误提示
    showError = true,
    // 超时时间
    timeout = 10000,
    // 成功提示
    successTip = false,
    form = false,
    onlyOnce = true,
  } = param;

  let { data = {} } = param;  // 传参对象

  const headers = { ...HEADERS.post, ...param.headers };
  if (form) {
    headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
  }

  const uniqueData = `${url}${form ? stringify(data) : (JSON.stringify(data) || {})}`;

  // 添加UUID
  if (withUUID) {
    if (typeof withUUID === 'boolean') {
      data.uuid = getGenerateID();
    } else if (typeof withUUID === 'function') {
      data = withUUID(data, getGenerateID());
    }
  }

  return newFetch(url, {
    method: 'PUT',
    headers,
    timeout,
    body: form ? stringify(data) : (JSON.stringify(data) || {}),
    successTip,
  }, showError, uniqueData, onlyOnce);
}

function downloadFile(url, param = {}, withUUID) {


  let { data = {} } = param;  // 传参对象

  const headers = { ...HEADERS.post, ...param.headers };

  // 添加UUID
  if (withUUID) {
    if (typeof withUUID === 'boolean') {
      data.uuid = getGenerateID();
    } else if (typeof withUUID === 'function') {
      data = withUUID(data, getGenerateID());
    }
  }
  const uri = MOCK ? `/${appSource}${url}` : url;
  param.credentials = 'same-origin';

  return fetch(uri, param)
    .then((data) => {
     return data;
    })
    .catch((error) => {
      throw error;
    });
}
const Request = {
  get,
  post,
  put,
  DELETE,
  fileUpload,
  downloadFile,
};

export default Request;

const checkIsObj = value => Object.prototype.toString.call(value) === '[object Object]';

export const changeNullIntoUndefined = (value) => {
  if (Array.isArray(value)) {
    return value.map(item => changeNullIntoUndefined(item));
  } else if (checkIsObj(value)) {
    Object.keys(value).forEach((key) => {
      if (value[key] === null) {
        value[key] = undefined;
      } else {
        value[key] = changeNullIntoUndefined(value[key]);
      }
    });
  } else if (value === null) {
    value = undefined;
  }
  return value;
};
