export function getNumberOfWeeks(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const year_start = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(
    ((d.getTime() - year_start.getTime()) / 86400000 + 1) / 7,
  );

  return weekNo.toString() + '-' + d.getUTCFullYear().toString();
}
