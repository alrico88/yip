import { padStart } from "lodash-es";

export const dayFormat = "YYYYMMDD";

function padDatePart(part: number): string {
  return padStart(part.toString(), 2, "0");
}

export function convertToDateStr(
  day: number,
  month: number,
  year: number
): string {
  return `${year}${padDatePart(month)}${padDatePart(day)}`;
}
