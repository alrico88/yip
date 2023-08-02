import { range } from "lodash-es";

export function useRange(start: number, end: number, step = 1): number[] {
  return range(start, end + 1, step);
}
