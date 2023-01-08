import { DayMood } from "../enums/DayMood";

export class DayData {
  public date: string;
  public mood: DayMood;

  constructor(date: string, mood: DayMood) {
    this.date = date;
    this.mood = mood;
  }
}
