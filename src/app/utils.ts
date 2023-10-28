export const getCreatedAt = (value: number|Date): string => {
  let date: Date;
  if (typeof value === 'number') {
    date = new Date(value);
  } else {
    date = value;
  }
  return date.toISOString().substring(0, 10);
};
