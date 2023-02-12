import { randomUUID } from "uncrypto";
import { keyv } from "../redis/client";
import { convertToMilliseconds, Unit } from "espera";
import { encryptString } from "~~/utils/encryption";

export default defineEventHandler(async (event) => {
  const { data } = await readBody<{ data: string }>(event);
  const id = randomUUID();

  await keyv.set(id, encryptString(data), convertToMilliseconds(1, Unit.days));

  return {
    success: true,
    data: id,
  };
});
