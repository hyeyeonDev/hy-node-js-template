export const currentTimestamp = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());
};

export const withoutSeconds = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());
};

export const withoutTime = () => {
  const now = new Date();
  return now.toISOString().replace(/T.*/, '');
};
