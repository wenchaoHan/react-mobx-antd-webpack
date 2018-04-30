import { urlPrefix } from 'BizConfig/constant';
// import Cookie from 'js-cookie';

// 不值得单建文件的小函数放在这

// 过滤请求参数中无效字段
export const filterEmptyParam = (param, filter = ['']) => Object.keys(param).reduce((acc, key) => {
  const value = param[key];
  if (value !== undefined) {
    if (typeof filter === 'function') {
      if (filter(value, key)) {
        acc[key] = value;
      }
    } else {
      if ([].concat(filter).indexOf(value) === -1) {
        acc[key] = value;
      }
    }
  }
  return acc;
}, {});

const encode = encodeURIComponent;
export const genSearchUrl = (param) => {
  const query = Object.keys(param).map(key => `${encode(key)}=${encode(param[key])}`).join('&');
  return query ? `?${query}` : '';
};

const reBizType = new RegExp(`${urlPrefix}/[^/]+/Entry/([^/]+)/`);

export const getBizType = () => {
  const href = window.location.href;
  const bizType = window.BIZ_TYPE;
  const match = href.match(reBizType);

  if (match && match[1] && match[1] === bizType) {
    return bizType;
  }
  return null;
};

export const getShopCode = () => {
  const shopCode = window.SHOP_CODE;
  if (shopCode) {
    return shopCode;
  }
  return null;
};

export default {
  filterEmptyParam,
  genSearchUrl,
  getBizType,
};

