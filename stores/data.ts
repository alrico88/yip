import { DayMood } from "~~/utils/enums/DayMood";
import { DayData } from "~/utils/models/DayData";
import { remove } from "lodash-es";

export const useDataStore = defineStore(
  "dataStore",
  () => {
    const {
      count: year,
      inc: increaseYear,
      dec: decreaseYear,
    } = useCounter(new Date().getFullYear());

    const increaseDisabled = computed(
      () => year.value === new Date().getFullYear()
    );

    const daysMoods = ref<DayData[]>([]);

    const selectedDate = ref<null | string>(null);

    function changeSelectedDate(
      day: number,
      month: number,
      year: number
    ): void {
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

    function setDayMood(date: string, mood: DayMood): void {
      removeDayMood(date);

      daysMoods.value.push(new DayData(date, mood));
    }

    const indexedDateMoods = computed(() => {
      return daysMoods.value.reduce((acc, item) => {
        acc.set(item.date, item.mood);

        return acc;
      }, new Map<string, DayMood>());
    });

    return {
      daysMoods,
      selectedDate,
      changeSelectedDate,
      removeDayMood,
      setDayMood,
      indexedDateMoods,
      year,
      increaseYear,
      increaseDisabled,
      decreaseYear,
    };
  },
  {
    persist: true,
  }
);
