export function shortenTitle(title: string, maxNumber: number) {
  if (title.length > maxNumber) {
    return title.slice(0, maxNumber - 3) + "...";
  }
  return title;
}
