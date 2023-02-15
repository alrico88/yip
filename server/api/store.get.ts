import { dataStore } from "~~/utils/storage";

export default defineEventHandler(async (event) => {
  const { id } = getQuery(event);
  const storedData = await dataStore.get(id as string);

  if (storedData) {
    return {
      success: true,
      data: storedData,
    };
  } else {
    return {
      success: false,
    };
  }
});
