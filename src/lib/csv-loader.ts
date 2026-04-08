import Papa from 'papaparse';

/**
 * Utility to reliably fetch and parse CSV files from public directory.
 * Safely handles missing files and parse errors by returning empty arrays.
 */
export async function fetchCsvData<T>(url: string): Promise<T[]> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`[CSV Loader] Missing or inaccessible CSV at ${url}. Status: ${res.status}`);
      return [];
    }
    const text = await res.text();
    
    return new Promise((resolve) => {
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data as T[]);
        },
        error: (error: Error) => {
          console.warn(`[CSV Loader] PapaParse error on ${url}:`, error.message);
          resolve([]);
        }
      });
    });
  } catch (error) {
    console.warn(`[CSV Loader] Network or parsing exception on ${url}:`, error);
    return [];
  }
}
