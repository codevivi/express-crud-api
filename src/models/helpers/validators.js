export const validateString = (value, minLen = null, maxLen = null) => {
  if (typeof value !== "string") {
    return { errMsg: `value must be a string` };
  }
  value = value.trim().trimStart();
  if (minLen !== null) {
    if (value.length < minLen) {
      return { errMsg: `value length must be at least ${minLen} characters length` };
    }
  }
  if (maxLen !== null) {
    if (value.length > maxLen) {
      return { errMsg: `value length must be no more than ${maxLen} characters length` };
    }
  }
  return { string: value };
};

export const validateNumber = (value, min = null, max = null) => {
  if (typeof value !== "number") {
    value = Number(value);
    if (typeof value !== "number" || isNaN(value)) {
      return { errMsg: "value must be a number or convertible" };
    }
  }
  if (min !== null) {
    if (value < min) {
      return { errMsg: `value must be at least ${min}` };
    }
  }
  if (max !== null) {
    if (value > max) {
      return { errMsg: `value, must be no more than ${max}` };
    }
  }
  return { number: value };
};
