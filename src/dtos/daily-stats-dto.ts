import { DailyStats, Stats } from "../types";

class DailyStatsDto {
  private days: DailyStats = {};

  constructor() {
    this.#load();
  }

  #load() {
    this.days = JSON.parse(localStorage.getItem("dailyStats") || "{}");
  }

  #save() {
    localStorage.setItem("dailyStats", JSON.stringify(this.days));
  }

  addLearned() {
    this.#load();
    let day: Stats = this.days[new Date().toDateString()];
    if (!day) {
      day = {
        learned: 0,
        reviewed: 0,
      };
    }
    day.learned += 1;
    this.days[new Date().toDateString()] = day;
    this.#save();
  }

  addReviewed() {
    this.#load();
    let day: Stats = this.days[new Date().toDateString()];
    if (!day) {
      day = {
        learned: 0,
        reviewed: 0,
      };
    }
    day.reviewed += 1;
    this.days[new Date().toDateString()] = day;
    this.#save();
  }

  getData() {
    this.#load();
    return this.days;
  }
}

export const dailyStatsDto = new DailyStatsDto();
