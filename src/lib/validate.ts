import type { RawContentRow, RawSeasonRow } from "@/types/spreadsheet";

export function validateContentRow(row: RawContentRow): string[] {
  const errors: string[] = [];

  if (!row.content_id) errors.push("content_id 누락");
  if (!row.publish_date) errors.push("publish_date 누락");
  if (!row.platform) errors.push("platform 누락");
  if (!row.title) errors.push("title 누락");
  if (!row.topic_main) errors.push("topic_main 누락");
  if (!row.format) errors.push("format 누락");

  return errors;
}

export function validateSeasonRow(row: RawSeasonRow): string[] {
  const errors: string[] = [];

  if (!row.season_id) errors.push("season_id 누락");
  if (!row.month) errors.push("month 누락");
  if (!row.issue_name) errors.push("issue_name 누락");

  return errors;
}
