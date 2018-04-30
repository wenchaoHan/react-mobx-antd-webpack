const validateEmpty = (rule, value, callback) => {
  if ((value === '' || value === undefined || value === null)) { // 判断是否为空
    if (!rule.required) {  // 如果是空并且没有required 就校验通过
      callback();
      return true;
    }
    rule.message = rule.message;
    callback(rule.message);
    return true;
  }
  return false;
};

export const validateNum = (rule, v, callback) => {
  const value = `${v}`;
  if (validateEmpty(rule, v, callback)) {
    return;
  } else if (!(/^[0-9]*$/g).test(value)) { // 判断是否位数字
    rule.message = '请输入数字！';
    callback('请输入数字！');
  } else if (rule.len && value.length !== rule.len) { // 判断数字长度
    rule.message = `请输入${rule.len}位正整数！`;
    callback(`请输入${rule.len}位正整数！！`);
  } else if (rule.max && value.length > rule.max) { // 判断最大长度
    rule.message = `请输入少于${rule.max}位的数字！`;
    callback(`请输入${rule.max}位的数字！`);
  } else if (rule.min && value.length < rule.min) { // 判断最小长度
    rule.message = `请输入大于等于${rule.min}位的数字！`;
    callback(`请输入${rule.min}位的正整数！`);
  } else if (rule.maxV && Number(value) > rule.maxV) { // 判断最大数值
    rule.message = `请输入小于等于${rule.maxV}的数字！`;
    callback(`请输入小于等于${rule.maxV}的数字！`);
  } else if (rule.minV && Number(value) < rule.minV) { // 判断最小数字
    rule.message = `请输入大于等于${rule.minV}的数字！`;
    callback(`请输入大于等于${rule.minV}的数字！`);
  } else { // 验证通过
    callback();
  }
};

export const validatePhone = (rule, value, callback) => {
  if (validateEmpty(rule, value, callback)) {
    return;
  } else if (!(/^1\d{10}$/g).test(value)) {
    rule.message = '请输入正确的电话号码！';
    callback('请输入正确的电话号码！');
  } else {
    callback();
  }
};

export const validateSupplier = (rule, value, callback) => {
  if (validateEmpty(rule, value, callback)) {
    return;
  } else if (!(/^[0-9]*$/g).test(value)) { // 判断是否位数字
    rule.message = '供应商编码必须为正整数！';
    callback('供应商编码必须为正整数！');
  } else if (rule.len && value.length !== rule.len) { // 判断数字长度
    rule.message = `供应商编码必须为${rule.len}位正整数！`;
    callback(`供应商编码必须为${rule.len}位正整数！`);
  } else { // 验证通过
    callback();
  }
};
export const validateMoney = (rule, value, callback) => {
  if (validateEmpty(rule, value, callback)) {
    return;
  } else if
  (!(/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/).test(value)) {
    rule.message = '请输入正确格式的金钱数额！';
    callback('请输入正确格式的金钱数额！');
  } else {
    callback();
  }
};

export const validateEn = (rule, value, callback) => {
  if (validateEmpty(rule, value, callback)) {
    return;
  } else if ((/[\u4e00-\u9fa5]/g).test(value)) {  // 英文
    callback('不可输入中文');
  } else if (rule.min && value.length < rule.min) {  // 英文
    rule.message = `长度最小为${rule.min}，不允许保存！`;
    callback(`长度最小为${rule.min}，不允许保存！`);
  } else if (rule.max && value.length > rule.max) {  // 英文
    rule.message = `长度应小于${rule.max}，不允许保存！`;
    callback(`长度应小于${rule.max}，不允许保存！`);
  } else {
    callback();
  }
};


export const validatePhoneFix = (rule, value, callback) => {
  if (validateEmpty(rule, value, callback)) {
    return;
  } else if (/^0\d{2,3}-?\d{7,8}(-\d{1,6})?$/g.test(value)) {  // 固定电话
    callback();
  } else {
    rule.message = '请按照规则输入01088888888,010-88888888,0955-7777777, 010-67094567-888955';
    callback('请输入正确固定电话！');
  }
};

export const validateLength = (rule, value, callback) => {  // 控制长度提示
  if (validateEmpty(rule, value, callback)) {
    return;
  } else if (rule.max && value.length > rule.max) {
    rule.message = '名称过长，不允许保存';
    callback('名称过长，不允许保存！');
  } else {
    callback();
  }
};

export const validateEmail = (rule, value, callback) => {
  if (validateEmpty(rule, value, callback)) {
    return;
  } else if (/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/g.test(value)) {  // 邮箱
    callback();
  } else {
    rule.message = '请输入邮箱 ！';
    callback('请输入邮箱');
  }
};


export const validateChinese = (rule, value, callback) => {
  if (validateEmpty(rule, value, callback)) {
    return;
  } else if (rule.max && /^[\u4e00-\u9fa5]{1,10}$/g.test(value)) {  // 10位 汉字
    if (value.replace(/[\u4e00-\u9fa5]/g, '01').length <= rule.max) {  // 最大长度  在ruls规定一下最大长度max:
      callback();
    } else {
      rule.message = `请输入${rule.max}位汉字！`;
      callback(`请输入${rule.max}位汉字！`);
    }
  } else {
    rule.message = `请输入${rule.max}位汉字！`;
    callback(`请输入${rule.max}位汉字！`);
  }
};

export const validateTest = (rule, value, callback) => {
  if (validateEmpty(rule, value, callback)) {
    return;
  } else if (rule.max && /^[\u4e00-\u9fa5a-zA-Z]+$/.test(value)) {  // 英文或者中文
    if (value.length && value.replace(/[\u4e00-\u9fa5]/g, '01').length <= rule.max) {  // 200个字符
      callback();
    } else {
      rule.message = `请输入${rule.max}位字符可以包括英文和汉字！`;
      callback(`请输入${rule.max}位字符可以包括英文和汉字！`);
    }
  } else {
    rule.message = `请输入${rule.max}位字符可以包括英文和汉字！`;
    callback(`请输入${rule.max}位字符可以包括英文和汉字！`);
  }
};

export const validateBracket = (rule, value, callback) => {
  if (validateEmpty(rule, value, callback)) {
    return;
  } else if (rule.max && /^[\u4e00-\u9fa5a-zA-Z\\(\\)\\（ \\）]+$/.test(value)) {  // 英文或者中文
    if (value.length && value.replace(/[\u4e00-\u9fa5]/g, '01').length <= rule.max) {  // 200个字符
      callback();
    } else {
      rule.message = `请输入${rule.max}位以下的汉字或字母！`;
      callback(`请输入${rule.max}位以下的汉字或字母！`);
    }
  } else {
    rule.message = `请输入${rule.max}位以下的汉字或字母！`;
    callback(`请输入${rule.max}位以下的汉字或字母！`);
  }
};


export const validateArea = (rule, value, callback) => {
  if (validateEmpty(rule, value, callback)) {
    return;
  } else if (value.length < 3) {
    rule.message = '请选择到区';
    callback('请选择到区');
  } else {
    callback();
  }
};

// 百分数的值 0.00——100.00之间，最多有两位小数
export const validatePercent = (rule, value, callback) => {
  if (validateEmpty(rule, value, callback)) {
    return;
  } else if
  (!(/^((100(\.||\.00)?)|(100(\.||\.0)?)|(0+)|([0-9]\d?(\.||\.\d{1,2})?))$/).test(value)) {
    rule.message = '该数值应在0%-100%之间，最多两位小数！';
    callback('该数值应在0%-100%之间，最多两位小数！');
  } else {
    callback();
  }
};

// 百分数的值 0.00——100.00之间，最多有两位小数
export const validatePriceNumber = (rule, value, callback) => {
  if (validateEmpty(rule, value, callback)) {
    return;
  } else if
  (!(/^([0-9]\d*?(\.||\.\d{1,3})?)$/).test(value)) {
    rule.message = '最多三位小数的数字！';
    callback('最多三位小数的数字！');
  } else {
    callback();
  }
};
