import { get, set } from "idb-keyval";
import is from "@sindresorhus/is";
import type { UnwrapRef } from "vue";

export function persistedRef<T>(initialValue: T, storageKey: string) {
  const refToPersist = ref(initialValue);

  watch(
    refToPersist,
    async (val) => {
      try {
        await set(storageKey, JSON.stringify(val));
      } catch (err) {
        console.error("Error persisting ref to Indexed DB", err);
      }
    },
    {
      deep: true,
    }
  );

  onMounted(async () => {
    const storedValue = await get<string>(storageKey);

    if (!is.nullOrUndefined(storedValue)) {
      refToPersist.value = JSON.parse(storedValue) as UnwrapRef<T>;
    }
  });

  return refToPersist;
}
