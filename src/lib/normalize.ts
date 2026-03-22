import { ContentItem, SeasonItem } from '../types';

export type RawContentRow = {
  content_id: string;
  publish_date: string;
  month: string;
  platform: string;
  title: string;
  url: string;
  editor: string;
  topic_main: string;
  topic_sub: string;
  season_keyword: string;
  target: string;
  format: string;
  tone: string;
  cta_type: string;
  publish_time: string;
  views: string;
  likes: string;
  comments: string;
  saves: string;
  shares: string;
  measure_point: string;
  performance_score: string;
  performance_level: string;
  review_note: string;
};

export type RawSeasonRow = {
  season_id: string;
  month: string;
  issue_name: string;
  academic_event: string;      // Comma separated
  life_event: string;          // Comma separated
  emotion_keywords: string;    // Comma separated
  concern_keywords: string;     // Comma separated
  behavior_pattern: string;    // Comma separated
  recommended_topics: string;  // Comma separated
  recommended_formats: string; // Comma separated
  prep_start: string;
  caution_note: string;
  linked_past_topics: string;  // Comma separated
};

/**
 * Normalizes raw structured data from Google Sheets into strict ContentItem types.
 */
export function normalizeContentData(rawRows: RawContentRow[]): ContentItem[] {
  return rawRows.map(row => ({
    content_id: row.content_id,
    publish_date: row.publish_date,
    month: Number(row.month),
    platform: row.platform as "홈페이지" | "인스타그램",
    title: row.title,
    url: row.url,
    editor: row.editor,
    topic_main: row.topic_main,
    topic_sub: row.topic_sub,
    season_keyword: row.season_keyword,
    target: row.target,
    format: row.format,
    tone: row.tone,
    cta_type: row.cta_type,
    publish_time: row.publish_time,
    views: Number(row.views || 0),
    likes: Number(row.likes || 0),
    comments: Number(row.comments || 0),
    saves: Number(row.saves || 0),
    shares: Number(row.shares || 0),
    measure_point: row.measure_point as "24h" | "72h" | "7d",
    performance_score: Number(row.performance_score || 0),
    performance_level: row.performance_level as "높음" | "보통" | "낮음",
    review_note: row.review_note || "",
  }));
}

function splitCommaList(val: string): string[] {
  if (!val) return [];
  return val.split(',').map(s => s.trim()).filter(Boolean);
}

/**
 * Normalizes raw structured data from Google Sheets into strict SeasonItem types.
 */
export function normalizeSeasonMap(rawRows: RawSeasonRow[]): SeasonItem[] {
  return rawRows.map(row => ({
    season_id: row.season_id,
    month: Number(row.month),
    issue_name: row.issue_name,
    academic_event: splitCommaList(row.academic_event),
    life_event: splitCommaList(row.life_event),
    emotion_keywords: splitCommaList(row.emotion_keywords),
    concern_keywords: splitCommaList(row.concern_keywords),
    behavior_pattern: splitCommaList(row.behavior_pattern),
    recommended_topics: splitCommaList(row.recommended_topics),
    recommended_formats: splitCommaList(row.recommended_formats),
    prep_start: row.prep_start,
    caution_note: row.caution_note,
    linked_past_topics: splitCommaList(row.linked_past_topics),
  }));
}
