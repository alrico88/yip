import { DayMood } from "~~/utils/enums/DayMood";
import { DayData } from "~/utils/models/DayData";
import { remove } from "lodash-es";
import { FastArraySearcher } from "arr-helper-functions";
import is from "@sindresorhus/is";
import { persistedRef } from "~/composables/persistedRef";

export const useDataStore = defineStore("dataStore", () => {
  const {
    count: year,
    inc: increaseYear,
    dec: decreaseYear,
  } = useCounter(new Date().getFullYear());

  const increaseDisabled = computed(
    () => year.value === new Date().getFullYear()
  );

  const daysMoods = persistedRef<DayData[]>([], "daysMoods");

  const selectedDate = ref<null | string>(null);

  function changeSelectedDate(day: number, month: number, year: number): void {
    const asStr = convertToDateStr(day, month, year);

    if (selectedDate.value === asStr) {
      selectedDate.value = null;
    } else {
      selectedDate.value = asStr;
    }
  }

  function removeDayMood(date: string) {
    remove(daysMoods.value, (d) => d.date === date);
  }

  const indexedDateMoods = computed(() => {
    return new FastArraySearcher(daysMoods.value, "date", (d) => {
      return {
        mood: d.mood,
        comment: d.comment,
      };
    });
  });

  const selectedDateData = computed<null | DayData>(() => {
    if (is.nullOrUndefined(selectedDate.value)) {
      return null;
    }

    return indexedDateMoods.value.find(selectedDate.value);
  });

  function setDayMood(date: string, mood: DayMood): void {
    const currentData: null | {
      mood: DayMood;
      comment?: string;
    } = indexedDateMoods.value.find(date);

    if (currentData) {
      removeDayMood(date);
    }

    daysMoods.value.push(new DayData(date, mood, currentData?.comment));
  }

  function setDayComment(date: string, comment: string) {
    const currentData: null | {
      mood: DayMood;
      comment?: string;
    } = indexedDateMoods.value.find(date);

    if (currentData) {
      removeDayMood(date);
    }

    daysMoods.value.push(
      new DayData(date, currentData?.mood ?? DayMood.Neutral, comment)
    );
  }

  function runMigrationToIndexedDB() {
    try {
      const storedData = localStorage.getItem("dataStore");
      if (storedData) {
        console.debug("Migrating to IndexedDB-backed storage");
        const parsed = JSON.parse(storedData);
        daysMoods.value = parsed.daysMoods;

        localStorage.removeItem("dataStore");
      }
    } catch (err) {
      console.error("Error performing migration", err);
    }
  }

  onMounted(runMigrationToIndexedDB);

  return {
    daysMoods,
    selectedDate,
    changeSelectedDate,
    removeDayMood,
    setDayMood,
    setDayComment,
    indexedDateMoods,
    selectedDateData,
    year,
    increaseYear,
    increaseDisabled,
    decreaseYear,
  };
});
