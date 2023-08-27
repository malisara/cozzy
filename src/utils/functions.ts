export function shortenTitle(title: string, maxNumber: number): string {
  if (title.length > maxNumber) {
    return title.slice(0, maxNumber - 3) + "...";
  }
  return title;
}
