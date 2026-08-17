export const toDateInputValue = (iso: string | null | undefined): string => {
  if (!iso) {
    return "";
  }

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset = date.getTimezoneOffset();

  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10);
};
