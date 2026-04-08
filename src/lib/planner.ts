import type { ContentItem, SeasonItem } from "@/types";

export type RecommendationItem = {
  id: string;
  topic: string;
  platform: string;
  format: string;
  reason: string;
  relatedPattern: string;
  timing: "이번 달" | "다음 달";
};

function safeAverage(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function getCurrentMonthNumber() {
  return new Date().getMonth() + 1;
}

export function getNextMonthNumber(month: number) {
  return month === 12 ? 1 : month + 1;
}

export function getSeasonByMonth(seasonData: SeasonItem[], month: number) {
  return seasonData.find((season) => Number(season.month) === Number(month)) || null;
}

export function getTopPerformingTopics(
  contentData: ContentItem[],
  month: number,
  limit = 3
) {
  const monthlyItems = contentData.filter(
    (item) => Number(item.month) === Number(month)
  );

  const topicMap = new Map<
    string,
    { totalScore: number; count: number; avgScore: number }
  >();

  monthlyItems.forEach((item) => {
    const topic = item.topic_main?.trim();
    if (!topic) return;

    const current = topicMap.get(topic) || {
      totalScore: 0,
      count: 0,
      avgScore: 0,
    };

    current.totalScore += Number(item.performance_score || 0);
    current.count += 1;
    current.avgScore = current.totalScore / current.count;

    topicMap.set(topic, current);
  });

  return [...topicMap.entries()]
    .map(([topic, value]) => ({
      topic,
      avgScore: value.avgScore,
      count: value.count,
    }))
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, limit);
}

export function getTopPerformingFormats(
  contentData: ContentItem[],
  month: number,
  limit = 3
) {
  const monthlyItems = contentData.filter(
    (item) => Number(item.month) === Number(month)
  );

  const formatMap = new Map<
    string,
    { totalScore: number; count: number; avgScore: number }
  >();

  monthlyItems.forEach((item) => {
    const format = item.format?.trim();
    if (!format) return;

    const current = formatMap.get(format) || {
      totalScore: 0,
      count: 0,
      avgScore: 0,
    };

    current.totalScore += Number(item.performance_score || 0);
    current.count += 1;
    current.avgScore = current.totalScore / current.count;

    formatMap.set(format, current);
  });

  return [...formatMap.entries()]
    .map(([format, value]) => ({
      format,
      avgScore: value.avgScore,
      count: value.count,
    }))
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, limit);
}

function getBestPlatformForTopic(contentData: ContentItem[], topic: string, month: number) {
  const topicItems = contentData.filter(
    (item) =>
      Number(item.month) === Number(month) &&
      item.topic_main?.trim() === topic
  );

  const homepageItems = topicItems.filter((item) => item.platform === "홈페이지");
  const instagramItems = topicItems.filter((item) => item.platform === "인스타그램");

  const homepageAvg = safeAverage(
    homepageItems.map((item) => Number(item.performance_score || 0))
  );
  const instagramAvg = safeAverage(
    instagramItems.map((item) => Number(item.performance_score || 0))
  );

  return instagramAvg >= homepageAvg ? "인스타그램" : "홈페이지";
}

function getBestFormatForMonth(contentData: ContentItem[], month: number, fallback = "기사") {
  const topFormats = getTopPerformingFormats(contentData, month, 1);
  return topFormats[0]?.format || fallback;
}

function buildRecommendationReason(
  topic: string,
  selectedSeason: SeasonItem,
  topTopics: { topic: string; avgScore: number; count: number }[],
  topFormats: { format: string; avgScore: number; count: number }[],
  timing: "이번 달" | "다음 달"
) {
  const matchingTopTopic = topTopics.find((item) => item.topic === topic);
  const bestFormat = topFormats[0]?.format || "기사";

  if (timing === "이번 달") {
    if (matchingTopTopic) {
      return `${selectedSeason.month}월 시즌 이슈와 맞고, 최근 '${topic}' 주제가 실제 성과에서도 강하게 반응했습니다. '${bestFormat}' 포맷과 함께 우선 검토할 만합니다.`;
    }

    return `${selectedSeason.month}월 시즌 키워드와 직접 연결되는 주제입니다. 현재 시즌성 적합도가 높아 지금 시점에 바로 시도할 가치가 있습니다.`;
  }

  if (matchingTopTopic) {
    return `다음 달 시즌 이슈를 고려하면 지금부터 선기획이 필요한 주제입니다. 최근 '${topic}' 관련 반응도 안정적이라 미리 준비할 이유가 충분합니다.`;
  }

  return `다음 달 시즌 이슈 대비용으로 지금부터 준비가 필요한 주제입니다. 시즌 적합도가 높아 선기획 대상으로 보기 좋습니다.`;
}

function buildRelatedPattern(
  topic: string,
  platform: string,
  format: string,
  month: number
) {
  return `${month}월 기준 '${topic}' 관련 흐름과 '${platform}'의 '${format}' 포맷 반응을 함께 참고한 추천입니다.`;
}

function uniqueArray(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

export function getRecommendationsForMonth(
  contentData: ContentItem[],
  seasonData: SeasonItem[],
  month: number,
  timing: "이번 달" | "다음 달",
  limit = 3
): RecommendationItem[] {
  const season = getSeasonByMonth(seasonData, month);
  if (!season) return [];

  const topTopics = getTopPerformingTopics(contentData, month, 5);
  const topFormats = getTopPerformingFormats(contentData, month, 3);

  const seasonTopics = season.recommended_topics || [];
  const mergedTopics = uniqueArray([
    ...seasonTopics,
    ...topTopics.map((item) => item.topic),
  ]).slice(0, limit);

  return mergedTopics.map((topic, index) => {
    const platform = getBestPlatformForTopic(contentData, topic, month);
    const format =
      platform === "인스타그램"
        ? topFormats.find((item) =>
            ["카드뉴스", "피드", "릴스"].includes(item.format)
          )?.format || "카드뉴스"
        : topFormats.find((item) =>
            ["기사", "인터뷰"].includes(item.format)
          )?.format || getBestFormatForMonth(contentData, month, "기사");

    return {
      id: `${timing}-${month}-${index}-${topic}`,
      topic,
      platform,
      format,
      reason: buildRecommendationReason(topic, season, topTopics, topFormats, timing),
      relatedPattern: buildRelatedPattern(topic, platform, format, month),
      timing,
    };
  });
}

export function getContentGapAreas(
  contentData: ContentItem[],
  seasonData: SeasonItem[],
  month: number,
  limit = 3
) {
  const season = getSeasonByMonth(seasonData, month);
  if (!season) return [];

  const monthlyItems = contentData.filter(
    (item) => Number(item.month) === Number(month)
  );

  const publishedTopics = new Set(monthlyItems.map((item) => item.topic_main).filter(Boolean));

  return (season.recommended_topics || [])
    .filter((topic) => !publishedTopics.has(topic))
    .slice(0, limit);
}
