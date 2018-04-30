import { observable, action, toJS } from 'mobx';
import Request from 'BizUtils/Request';
import log from 'BizUtils/log';

const ensure = (array, item) => {
  if (array.indexOf(item) === -1) {
    array.push(item);
  }
  return array;
};

export const enumsToMap = (enums = []) => enums.reduce((p, n) => {
  p[n.value] = n.name; return p;
}, {});

export const changeShowAll = (map, showAll, allText = '全部') => {
  // if (!showAll) return map;

  let index = -1;
  const len = map.length;

  for (let i = 0; i < len; i += 1) {
    if (map[i].value === showAll) {
      index = i;
      break;
    }
  }

  if (index === -1) {
    map.unshift({
      value: showAll,
      name: allText,
    });
    return map;
  } else if (index !== 0) {
    const allData = map.splice(index, 1);
    return allData.concat(map);
  }

  return map;
};

class Store {
  enumMapList = observable.map({},{deep:false});

  enumList = [];

  @action.bound
  add(type) {
    if (typeof type === 'string') {
      ensure(this.enumList, type);
    } else {
      throw new TypeError('enum.add 必须传入字符串');
    }
  }

  @action.bound
  fetch() {
    if (this.enumList.length) {
      Request
      .post('/bach/baseinfo/goblin/dict/list/v1', {
        data: {
          type: this.enumList,
        },
      })
      .then((data) => {
        if (data && data.data && data.status >= 0 && data.data.length) {
          data.data.forEach((v) => {
            this.enumMapList.set(v.type, v.items);
          });
        } else {
          log('枚举接口返回格式不正确，请检查：');
          log(data);
        }
      });
    }
  }

  @action.bound
  getEnumMap() {
    return toJS(this.enumMapList);
  }
}

const store = new Store();

export default store;
