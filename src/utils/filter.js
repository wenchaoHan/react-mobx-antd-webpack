import React from 'react';
// 业务常用filter函数
const WEEK_MAP = ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日'];
const filter = {};

 // boolean类型
filter.boolean = (data) => {
  if (data === true) {
    return '是';
  }
  if (data === false) {
    return '否';
  }
  return '';
};

// 是否开启类型
filter.open = (data) => {
  if (data === true) {
    return '开启';
  }
  if (data === false) {
    return '关闭';
  }
  return '';
};

filter.week = (data) => {
  if (data && data.length && data.length <= 7) {
    return data.map(item => WEEK_MAP[item]).join(',');
  }
  return '';
};

 // number带单位
filter.numberUnit = (data) => {
  if (data) {
    if (data.number !== undefined) {
      if (data.unit !== undefined) {
        return `${data.number}${data.unit}`;
      }
      return `${data.number}`;
    }
    return '';
  }
  return '';
};

// 是否鲜食
filter.fresh = (fresh) => {
  if (fresh === true) {
    return '鲜食';
  }
  if (fresh === false) {
    return '非鲜食';
  }
  return '';
};

// 后台分类
filter.categories = (category) => {
  if (category && category.length) {
    return category.map(item => item.categoryName).join('/');
  }
  return '';
};

// 产地
filter.productionPlace = (data) => {
  if (data && data.province) {
    return `${data.province}${data.city}${data.district}`;
  }
  return '';
};

// 中转属性
filter.transfer = (data) => {
  if (data === true) {
    return '在库';
  }
  if (data === false) {
    return '越库';
  }
  return '';
};

// 供应商
filter.purchasePlans = (data) => {
  const supplierMap = {};
  const supplier = [];
  if (data && data.length) {
    data.forEach((item) => {
      if (item.supplier && !supplierMap[item.supplier.supplierName]) {
        supplier.push(<div>{item.supplier.supplierName}</div>);
        supplierMap[item.supplier.supplierName] = true;
      }
    });
  }
  return supplier;
};

// 价格
filter.price = (data) => {
  if (data && data.amount) {
    return `${data.amount}`;
  }
  return '';
};

// 是否校验两份起售
filter.numberLimit = (data) => {
  if (data === 2 || data === '2') {
    return '是';
  }
  return '否';
};

export default filter;
