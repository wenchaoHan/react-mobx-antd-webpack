/**
 * 序列化对象
 */

// 对象类型键值对
const TYPES = [{}, [], 0, '', null, undefined, false].reduce((pre, next) => {
  const key = Object.prototype.toString.call(next);
  const type = key.split(' ')[1].slice(0, -1).toLowerCase();
  return {
    ...pre,
    [key]: type,
  };
}, {});

// 判断参数类型返回：['object', 'array', 'string', 'number', 'boolean', 'null', 'undefined'] 之一
const theTypeOf = param => TYPES[Object.prototype.toString.call(param)];

/**
 * 序列化参数对象
 * serialize({
 *  key1: 'value1',
 *  key2: 'value2'
 * })   => key1=value1&key2=value2
 *
 * serialize({
 *  key1: 'value1',
 *  key2: 'value2'
 * }, keyOut)   => keyOut.key1=value1&keyOut.key2=value2
 *
 * serialize({
 *  key1: {
 *    keyIn1: 'valueIn1',
 *    keyIn2: 'valueIn2',
 *  },
 *  key2: 'value2'
 * })   => key1.keyIn1=valueIn1&key1.keyIn2=valueIn2&key2=value2
 *
 * serialize({
 *  key1: 'value1',
 *  key2: [1, 2],
 * })   => key1=value1&key2[]=1&key2[]=2
 *
 * serialize(value, key) => key=value
*/
const serialize = (param, key) => {
  const query = [];
  switch (theTypeOf(param)) {
    case 'object':
      Object.keys(param).forEach((item) => {
        if (param[item] !== undefined) {
          query.push(serialize(param[item], `${key ? `${key}.` : ''}${item}`));
        }
      });
      break;
    case 'array':
      query.push(param.map(item => `${key || item}=${item}`).join('&'));
      break;
    default:
      query.push(`${key || param}=${param}`);
  }
  return query.join('&');
};

export default serialize;
