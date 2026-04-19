export const isCacheValid = (cachedAt: number | null) => {
  if (!cachedAt) return false;

  const FIVE_MIN = 5 * 60 * 1000;

  return Date.now() - cachedAt < FIVE_MIN;
};
