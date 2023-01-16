import { DayMood } from "./enums/DayMood";
import { createLinearScale } from "scale-helper-functions";
import color from "color";

export const colorScale = createLinearScale(
  [DayMood.Awful, DayMood.Neutral, DayMood.Great].map(Number),
  ["#E97777", "#FFD56F", "green"]
);

export function getMoodBg(mood: DayMood): string {
  return color(colorScale(Number(mood)) as string)
    .lighten(0.3)
    .rgb()
    .string();
}

export function getGoodContrastColor(bgColor: string): string {
  return color(bgColor).isLight() ? "black" : "white";
}
