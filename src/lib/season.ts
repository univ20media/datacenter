import { ContentItem, SeasonItem } from "@/types";

export function getCurrentMonthNumber() {
  return new Date().getMonth() + 1;
}

export function getNextMonthNumber(month: number) {
  return month === 12 ? 1 : month + 1;
}

export function getSeasonByMonth(seasons: SeasonItem[], month: number) {
  return seasons.find((season) => Number(season.month) === Number(month)) || null;
}

export function getPrepStatus(selectedMonth: number, currentMonth?: number) {
  const baseMonth = currentMonth ?? getCurrentMonthNumber();

  if (selectedMonth === baseMonth) {
    return {
      label: "지금 실행 시점",
      description: "현재 월 기준으로 바로 기획/발행 판단에 활용할 수 있는 시즌입니다.",
      className: "bg-emerald-50 text-emerald-700",
    };
  }

  if (selectedMonth === getNextMonthNumber(baseMonth)) {
    return {
      label: "지금부터 선기획 권장",
      description: "다음 달 시즌 이슈에 대비해 지금부터 소재 수집과 기획이 필요한 시점입니다.",
      className: "bg-amber-50 text-amber-700",
    };
  }

  if (selectedMonth > baseMonth || (baseMonth === 12 && selectedMonth === 1)) {
    return {
      label: "미리 참고 가능",
      description: "다가올 시즌 참고용입니다. 아이디어 아카이빙에 활용하기 좋습니다.",
      className: "bg-sky-50 text-sky-700",
    };
  }

  return {
    label: "지난 시즌 참고",
    description: "이전 시즌의 반응과 패턴을 회고용으로 참고할 수 있습니다.",
    className: "bg-slate-100 text-slate-700",
  };
}

function includesKeyword(source: string, keywords: string[]) {
  const normalized = source.trim().toLowerCase();
  return keywords.some((keyword) => normalized.includes(keyword.trim().toLowerCase()));
}

export function getLinkedPastContents(
  contentData: ContentItem[],
  season: SeasonItem | null,
  limit = 4
) {
  if (!season) return [];

  const linkedTopics = [
    ...(season.linked_past_topics || []),
    ...(season.recommended_topics || []),
    ...(season.concern_keywords || []),
  ].filter(Boolean);

  const matched = contentData.filter((item) => {
    const searchable = [
      item.topic_main,
      item.topic_sub,
      item.season_keyword,
      item.title,
      item.review_note,
    ]
      .filter(Boolean)
      .join(" ");

    return includesKeyword(searchable, linkedTopics);
  });

  return [...matched]
    .sort(
      (a, b) =>
        Number(b.performance_score || 0) - Number(a.performance_score || 0)
    )
    .slice(0, limit);
}

export function getUpcomingPreparationCard(
  seasons: SeasonItem[],
  selectedMonth: number
) {
  const nextMonth = getNextMonthNumber(selectedMonth);
  const nextSeason = getSeasonByMonth(seasons, nextMonth);

  if (!nextSeason) return null;

  return {
    month: nextSeason.month,
    issueName: nextSeason.issue_name,
    prepStart: nextSeason.prep_start,
    topics: nextSeason.recommended_topics || [],
    formats: nextSeason.recommended_formats || [],
    cautionNote: nextSeason.caution_note,
  };
}
