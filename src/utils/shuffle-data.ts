export function shuffleData(array: number[]): number[] {
  return array.sort(() => Math.random() - 0.5);
}
