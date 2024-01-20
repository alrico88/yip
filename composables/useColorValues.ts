export function useColorValues() {
  const colorMode = useColorMode();

  const tableClass = computed(() => {
    const isLight = colorMode.value === "light";

    return {
      head: isLight ? "bg-light" : "bg-dark",
      body: isLight ? "bg-light" : "bg-dark",
    };
  });

  return {
    tableClass,
  };
}
