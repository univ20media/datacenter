import { ContentItem } from "@/types";

export type ArchiveSortType = "latest" | "performance";

export type ArchiveFilters = {
  month?: string;
  platform?: string;
  topic_main?: string;
  format?: string;
  season_keyword?: string;
};

export function sortArchiveItems(
  items: ContentItem[],
  sortType: ArchiveSortType
) {
  const copied = [...items];

  if (sortType === "performance") {
    return copied.sort(
      (a, b) =>
        Number(b.performance_score || 0) - Number(a.performance_score || 0)
    );
  }

  return copied.sort((a, b) => {
    const aTime = new Date(a.publish_date).getTime();
    const bTime = new Date(b.publish_date).getTime();
    return bTime - aTime;
  });
}

export function getArchiveSummary(
  items: ContentItem[],
  filters: ArchiveFilters
) {
  const activeFilters = [
    filters.month,
    filters.platform,
    filters.topic_main,
    filters.format,
    filters.season_keyword,
  ].filter(Boolean);

  if (items.length === 0) {
    return "조건에 맞는 콘텐츠가 없습니다.";
  }

  if (activeFilters.length === 0) {
    return `전체 콘텐츠 ${items.length}건이 검색되었습니다.`;
  }

  return `현재 조건으로 ${items.length}건의 콘텐츠가 검색되었습니다.`;
}
