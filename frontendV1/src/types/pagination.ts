export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/**
 * The API returns either a plain array (unpaginated endpoints) or a DRF
 * paginated object ({ count, next, previous, results }). This helper
 * normalizes either shape into a flat array for consumers that only need
 * the list of items (e.g. dropdown selects).
 */
export function unwrapList<T>(
  data: T[] | PaginatedResponse<T> | undefined | null
): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.results)) return data.results;
  return [];
}
