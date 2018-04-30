import rbacStore from 'BizComponent/Rbac/store';
import enumStore from 'BizComponent/Enum/store';

const B = window.B || {};
B.uid = () => Math.random().toString(36).slice(2);
B.uuid = () => B.uid() + +new Date() + B.uid();

B.collect = (type, value) => {
  const store = type === 'rbac' ? rbacStore : enumStore;

  if (value instanceof Array) {
    value.forEach(v => store.add(`${v}`));
  } else {
    store.add(`${value}`);
  }
};

window.B = B;

