export function shortenTitle(title: string, maxNumber: number): string {
  if (title.length > maxNumber) {
    return title.slice(0, maxNumber - 3) + "...";
  }
  return title;
}

export function roundNumber(number: number): number {
  return Math.round((number + Number.EPSILON) * 100) / 100;
}
