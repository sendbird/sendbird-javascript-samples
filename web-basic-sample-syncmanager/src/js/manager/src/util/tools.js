
export const deepEqual = (x, y) => {
  const tx = typeof x, ty = typeof y;
  return (x && y && tx === 'object' && tx === ty && !(x instanceof Date))
    ? (Object.keys(x).length === Object.keys(y).length && Object.keys(x).every(key => deepEqual(x[key], y[key])))
    : x instanceof Date ? x.getTime() === y.getTime() : ((tx === 'function' && ty === 'function') ? true : (x === y));
};
export const createId = () => {
  let d = new Date().getTime();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
};