import { keyv } from "../redis/client";
import { decryptString } from "~~/utils/encryption";

export default defineEventHandler(async (event) => {
  const { id } = getQuery(event);

  const storedData = await keyv.get(id as string);

  if (storedData) {
    return {
      success: true,
      data: decryptString(storedData),
    };
  } else {
    return {
      success: false,
    };
  }
});
