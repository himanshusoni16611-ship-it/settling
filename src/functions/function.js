const propercase = (name) => {
  if (typeof name !== 'string' || name.length === 0) {
    return name;
  }
  return name.charAt(0).toUpperCase() + name.slice(1);
};
export default propercase;
