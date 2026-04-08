import { normalizeContentRows, normalizeSeasonRows } from "@/lib/normalize";
import { fetchCsvData } from "./csv-loader";
import type { RawContentRow, RawSeasonRow } from "@/types/spreadsheet";

// Load content_data.csv and parse it
export async function getContentData() {
  const rawContentRows = await fetchCsvData<RawContentRow>('/data/content_data.csv');
  return normalizeContentRows(rawContentRows);
}

// Load season_map.csv and parse it
export async function getSeasonData() {
  const rawSeasonRows = await fetchCsvData<RawSeasonRow>('/data/season_map.csv');
  return normalizeSeasonRows(rawSeasonRows);
}
