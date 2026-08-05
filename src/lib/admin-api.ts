/**
 * Shared fetch helper for Admin Dashboard pages talking to the API
 * routes built in Phase 3H. Centralizes JSON handling and error
 * normalization so each admin page's data-fetching code stays short.
 *
 * Every call site follows the same pattern: try the live API first;
 * on any failure (network error, empty DB before seeding/migration,
 * non-2xx response) fall back to the bundled `src/data/*.ts` content
 * so the Admin Dashboard is never left blank — this is what makes the
 * migration from static content to the database a zero-downtime
 * transition rather than a hard cutover.
 */
export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error ?? `Request to ${url} failed with ${response.status}`);
  }

  return response.json();
}

/**
 * Fetches from the API and falls back to a provided default on any
 * failure — the core of the "live data, graceful fallback" pattern
 * described above. Logs the failure reason for debugging without
 * surfacing it to the admin user (the fallback content is a perfectly
 * usable result, not an error state).
 */
export async function fetchWithFallback<T>(url: string, fallback: T): Promise<T> {
  try {
    const data = await apiFetch<T>(url);
    // An empty array is a valid "DB not seeded yet" response — treat
    // it the same as a failure so the admin still sees usable content.
    if (Array.isArray(data) && data.length === 0 && Array.isArray(fallback) && fallback.length > 0) {
      return fallback;
    }
    return data;
  } catch (error) {
    console.warn(`Falling back to bundled content for ${url}:`, error);
    return fallback;
  }
}
