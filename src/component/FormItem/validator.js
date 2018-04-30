const message = {
  required: label => `请填写${label}`,
  len: (label, len) => `${label}的长度应为${len}位`,
  min: (label, min) => `${label}的长度不得低于${min}位`,
  max: (label, max) => `${label}的长度不得超过${max}位`,
  mix: (label, min, max) => `${label}的长度不得低于${min}位，不得超过${max}位`,
};

export default (label, rules) => rules.map((v) => {
  const type = typeof v.message;
  if (type === 'string') return v;

  if (type === 'function') {
    v.message = v.message(v);
    return v;
  }

  v.message = [];

  // 用户并没有指定 message
  if (v.required) {
    v.message.push(message.required(label));
  }

  if (v.len) {
    v.message.push(message.len(label, v.len));
  }

  if (v.min && v.max) {
    v.message.push(message.mix(label, v.min, v.max));
  } else {
    if (v.min) {
      v.message.push(message.min(label, v.min));
    }

    if (v.max) {
      v.message.push(message.max(label, v.max));
    }
  }

  v.message = v.message.join('；');
  return v;
});
