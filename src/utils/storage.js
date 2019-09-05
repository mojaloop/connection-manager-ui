const setItem = (key, value) => {
  const stringified = JSON.stringify(value);
  if (value !== undefined) {
    localStorage.setItem(key, stringified);
  } else {
    localStorage.removeItem(key);
  }
};

const getItem = key => {
  let parsed;
  try {
    parsed = JSON.parse(localStorage.getItem(key));
  } catch (e) {}
  return parsed;
};
const removeItem = key => localStorage.removeItem(key);
export { setItem, getItem, removeItem };
