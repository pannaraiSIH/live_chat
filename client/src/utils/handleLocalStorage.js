export default function handleLocalStorage(verb, keys) {
  const result = {};
  Object.keys(keys).forEach((key) => {
    if (verb === "get") {
      const value = localStorage.getItem(key);
      result[key] = value;
    } else if (verb === "set") {
      localStorage.setItem(key, keys[key]);
    }
  });
  return result;
}
