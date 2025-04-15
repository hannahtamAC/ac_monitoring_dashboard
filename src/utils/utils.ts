export function generateUniqueKey(prefix = "key"): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function objectToQueryParams(
  params: Record<string, string | number | boolean>
): string {
  const filteredParams: Record<string, string> = {};

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      filteredParams[key] = String(value);
    }
  }
  const searchParams = new URLSearchParams(
    filteredParams as Record<string, string>
  );
  return searchParams.toString();
}
