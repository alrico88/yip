import dayjs from "dayjs";

export const dayFormat = "YYYYMMDD";

export function convertToDateStr(
  day: number,
  month: number,
  year: number
): string {
  return dayjs()
    .set("date", day)
    .set("month", month - 1)
    .set("year", year)
    .format(dayFormat);
}
