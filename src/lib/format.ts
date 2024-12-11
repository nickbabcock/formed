const intFormatter = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatInt(x: number) {
  return intFormatter.format(x);
}
