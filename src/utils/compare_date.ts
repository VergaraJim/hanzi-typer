export function CompareDate(date1: Date, date2: Date) {
  const diffMs = date2.getTime() - date1.getTime(); // Get absolute difference in milliseconds

  let days = 0;
  let hours = 0;
  let minutes = 0;
  let totalSeconds = 0;

  if (diffMs > 0) {
    days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
    hours = Math.floor((diffMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    minutes = Math.floor((diffMs % (60 * 60 * 1000)) / (60 * 1000));
    totalSeconds = Math.floor(diffMs / 1000);
  }

  return { days, hours, minutes, totalSeconds };
}
