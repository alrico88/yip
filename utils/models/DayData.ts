import { DayMood } from "../enums/DayMood";

export class DayData {
  public date: string;
  public mood: DayMood;
  public comment?: string;

  constructor(date: string, mood: DayMood, comment?: string) {
    this.date = date;
    this.mood = mood;
    this.comment = comment;
  }
}
