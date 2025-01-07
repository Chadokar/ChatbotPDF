/**
 * Generates a random page number between 1 and maxPage
 */
export const getRandomPage = (maxPage: number = 10): number => {
  return Math.floor(Math.random() * maxPage) + 1;
};