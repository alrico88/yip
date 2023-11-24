import dayjs from "dayjs";

export function usePixelsTable() {
  const dataStore = useDataStore();

  const { year, selectedDate, indexedDateMoods } = storeToRefs(dataStore);

  const parsedSelectedDate = computed(() => {
    const date = dataStore.selectedDate;

    if (date) {
      const parsed = dayjs(date);

      return {
        day: parsed.date(),
        month: parsed.month() + 1,
      };
    } else {
      return null;
    }
  });

  function getMonthName(month: number): string {
    return dayjs().set("month", month).format("MMM");
  }

  return {
    year,
    selectedDate,
    indexedDateMoods,
    parsedSelectedDate,
    getMonthName,
  };
}
