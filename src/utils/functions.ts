export function formatDateManual(date: Date) {
  const monthNames = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  const month = monthNames[date.getMonth()];
  const day = String(date.getDate()).padStart(2, "0");

  return month + " " + day;
}
