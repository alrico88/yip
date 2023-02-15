import { dataStore } from "~~/utils/storage";

export default defineEventHandler(async (event) => {
  const { data } = await readBody<{ data: string }>(event);
  const id = await dataStore.save(data);

  return {
    success: true,
    data: id,
  };
});
