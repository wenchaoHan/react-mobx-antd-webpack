const t = 'window_opener_register_fun';

export const register = (fun, callback) => {
  let random = Math.random().toString(36);
  random = random.substr(2, random.length - 2);
  window.B[t + random] = fun;
  window.B[t] = random;
  if (callback) {
    callback(random);
  }
};

export const trigger = (funName, ...args) => {
  let callback = () => { };
  if (window.opener) {
    if (funName) {
      if (window.opener.B && typeof window.opener.B[t + funName] === 'function') {
        callback = window.opener.B[t + funName];
      }
    } else {
      if (window.opener.B && window.opener.B[t]) {
        funName = window.opener.B[t];
        callback = window.opener.B[t + funName];
      }
    }
  }
  return callback(...args);
};

export const reload = () => {
  if (window.opener) {
    window.opener.location.reload();
  }
};
