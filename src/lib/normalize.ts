import type { ContentItem, SeasonItem } from "@/types";
import type { RawContentRow, RawSeasonRow } from "@/types/spreadsheet";

function safeString(value: unknown, fallback = ""): string {
  if (value === null || value === undefined) return fallback;
  return String(value).trim();
}

export function parseNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;

  const normalized = safeString(value).replace(/,/g, "");
  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : fallback;
}

export function parseMonth(value: unknown, fallback = 1): number {
  const parsed = parseNumber(value, fallback);
  if (parsed < 1 || parsed > 12) return fallback;
  return parsed;
}

export function parseStringArray(value: unknown): string[] {
  const raw = safeString(value);
  if (!raw) return [];

  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizePerformanceLevel(value: unknown): "높음" | "보통" | "낮음" {
  const normalized = safeString(value);

  if (normalized === "높음" || normalized === "보통" || normalized === "낮음") {
    return normalized;
  }

  return "보통";
}

function normalizeMeasurePoint(value: unknown): "24h" | "72h" | "7d" {
  const normalized = safeString(value);

  if (normalized === "24h" || normalized === "72h" || normalized === "7d") {
    return normalized;
  }

  return "24h";
}

export function normalizeContentRow(row: RawContentRow): ContentItem {
  return {
    content_id: safeString(row.content_id),
    publish_date: safeString(row.publish_date),
    month: parseMonth(row.month),
    platform: safeString(row.platform) as "홈페이지" | "인스타그램",
    title: safeString(row.title),
    url: safeString(row.url, "#"),
    editor: safeString(row.editor),
    topic_main: safeString(row.topic_main),
    topic_sub: safeString(row.topic_sub),
    season_keyword: safeString(row.season_keyword),
    target: safeString(row.target),
    format: safeString(row.format),
    tone: safeString(row.tone),
    cta_type: safeString(row.cta_type),
    publish_time: safeString(row.publish_time),
    views: parseNumber(row.views),
    likes: parseNumber(row.likes),
    comments: parseNumber(row.comments),
    saves: parseNumber(row.saves),
    shares: parseNumber(row.shares),
    measure_point: normalizeMeasurePoint(row.measure_point),
    performance_score: parseNumber(row.performance_score),
    performance_level: normalizePerformanceLevel(row.performance_level),
    review_note: safeString(row.review_note),
  };
}

export function normalizeSeasonRow(row: RawSeasonRow): SeasonItem {
  return {
    season_id: safeString(row.season_id),
    month: parseMonth(row.month),
    issue_name: safeString(row.issue_name),
    academic_event: parseStringArray(row.academic_event),
    life_event: parseStringArray(row.life_event),
    emotion_keywords: parseStringArray(row.emotion_keywords),
    concern_keywords: parseStringArray(row.concern_keywords),
    behavior_pattern: parseStringArray(row.behavior_pattern),
    recommended_topics: parseStringArray(row.recommended_topics),
    recommended_formats: parseStringArray(row.recommended_formats),
    prep_start: safeString(row.prep_start),
    caution_note: safeString(row.caution_note),
    linked_past_topics: parseStringArray(row.linked_past_topics),
  };
}

export function normalizeContentRows(rows: RawContentRow[]): ContentItem[] {
  return rows.map(normalizeContentRow);
}

export function normalizeSeasonRows(rows: RawSeasonRow[]): SeasonItem[] {
  return rows.map(normalizeSeasonRow);
}
