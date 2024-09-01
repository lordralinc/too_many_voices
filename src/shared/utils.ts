export function getRandomInt(min: number, max: number): number {
  return Math.round(Math.random() * (max - min) + min);
}

export function getPlural(count: number, words: string[]): string {
  const cases = [2, 0, 1, 1, 1, 2];

  return words[
    count % 100 > 4 && count % 100 < 20 ? 2 : cases[Math.min(count % 10, 5)]
  ];
}
