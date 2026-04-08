import { ContentItem } from '../types';

export function getCurrentMonthContents(data: ContentItem[], targetMonth: number): ContentItem[] {
  return data.filter(item => item.month === targetMonth);
}

export function getPreviousMonthContents(data: ContentItem[], targetMonth: number): ContentItem[] {
  let prevMonth = targetMonth - 1;
  if (prevMonth < 1) prevMonth = 12;
  return data.filter(item => item.month === prevMonth);
}

export type KpiCardData = {
  key: string;
  title: string;
  description: string;
  value: number;
  change: number;
  suffix?: string;
};

function safeAverage(numbers: number[]) {
  if (numbers.length === 0) return 0;
  return Math.round(numbers.reduce((sum, n) => sum + n, 0) / numbers.length);
}

function safeChange(current: number, previous: number) {
  if (!Number.isFinite(current)) return 0;
  if (!Number.isFinite(previous) || previous === 0) return 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

export function buildKpiCards(
  currentItems: ContentItem[],
  previousItems: ContentItem[]
): KpiCardData[] {
  const currentTotalCount = currentItems.length;
  const previousTotalCount = previousItems.length;

  const currentAvgViews = safeAverage(
    currentItems.map((item) => Number(item.views || 0))
  );
  const previousAvgViews = safeAverage(
    previousItems.map((item) => Number(item.views || 0))
  );

  const currentAvgLikes = safeAverage(
    currentItems
      .filter((item) => item.platform === "인스타그램")
      .map((item) => Number(item.likes || 0))
  );
  const previousAvgLikes = safeAverage(
    previousItems
      .filter((item) => item.platform === "인스타그램")
      .map((item) => Number(item.likes || 0))
  );

  const currentAvgScore = safeAverage(
    currentItems.map((item) => Number(item.performance_score || 0))
  );
  const previousAvgScore = safeAverage(
    previousItems.map((item) => Number(item.performance_score || 0))
  );

  return [
    {
      key: "totalCount",
      title: "이번 달 발행 수",
      description: "이번 기간 발행된 전체 콘텐츠 수",
      value: currentTotalCount,
      change: safeChange(currentTotalCount, previousTotalCount),
    },
    {
      key: "avgViews",
      title: "평균 조회수",
      description: "이번 기간 콘텐츠 기준 평균 조회수",
      value: currentAvgViews,
      change: safeChange(currentAvgViews, previousAvgViews),
    },
    {
      key: "avgLikes",
      title: "평균 좋아요",
      description: "인스타그램 콘텐츠 기준 평균 좋아요 수",
      value: currentAvgLikes,
      change: safeChange(currentAvgLikes, previousAvgLikes),
    },
    {
      key: "avgScore",
      title: "평균 성과 점수",
      description: "내부 가중치 기준 평균 성과 점수",
      value: currentAvgScore,
      change: safeChange(currentAvgScore, previousAvgScore),
    },
  ];
}

export function getPlatformPerformance(data: ContentItem[]): [string, { contents: number; views: number }][] {
  const stats = data.reduce((acc, curr) => {
    if (!acc[curr.platform]) acc[curr.platform] = { contents: 0, views: 0 };
    acc[curr.platform].contents += 1;
    acc[curr.platform].views += curr.views;
    return acc;
  }, {} as Record<string, { contents: number; views: number }>);

  return Object.entries(stats).sort((a, b) => b[1].views - a[1].views);
}

export function getTopicPerformance(data: ContentItem[]): [string, { contents: number; views: number; score: number }][] {
  const stats = data.reduce((acc, curr) => {
    if (!acc[curr.topic_main]) acc[curr.topic_main] = { contents: 0, views: 0, score: 0 };
    acc[curr.topic_main].contents += 1;
    acc[curr.topic_main].views += curr.views;
    acc[curr.topic_main].score += curr.performance_score;
    return acc;
  }, {} as Record<string, { contents: number; views: number; score: number }>);

  return Object.entries(stats).sort((a, b) => b[1].views - a[1].views);
}

export function getFormatPerformance(data: ContentItem[]): [string, { contents: number; views: number }][] {
  const stats = data.reduce((acc, curr) => {
    if (!acc[curr.format]) acc[curr.format] = { contents: 0, views: 0 };
    acc[curr.format].contents += 1;
    acc[curr.format].views += curr.views;
    return acc;
  }, {} as Record<string, { contents: number; views: number }>);

  return Object.entries(stats).sort((a, b) => b[1].views - a[1].views);
}

export function getTopContents(data: ContentItem[], count: number = 3) {
  return [...data].sort((a, b) => b.performance_score - a.performance_score).slice(0, count);
}

export function getLowContents(data: ContentItem[], count: number = 3) {
  return [...data].sort((a, b) => a.performance_score - b.performance_score).slice(0, count);
}

export function getInsightSummary(data: ContentItem[], monthName: string) {
  if (data.length === 0) {
    return {
      monthName,
      text: "데이터가 충분하지 않아 분석할 수 없습니다.",
      action: "새로운 콘텐츠를 발행하고 성과를 수집해주세요.",
      focus: "타겟 오디언스에 맞는 채널을 먼저 활성화하세요."
    };
  }

  const topics = getTopicPerformance(data);
  const formats = getFormatPerformance(data);
  const platforms = getPlatformPerformance(data);
  
  const topTopic = topics.length > 0 ? topics[0][0] : '데이터 없음';
  const topFormat = formats.length > 0 ? formats[0][0] : '데이터 없음';
  const topPlatform = platforms.length > 0 ? platforms[0][0] : '데이터 없음';

  const totalSaves = data.reduce((sum, item) => sum + item.saves, 0);
  const totalShares = data.reduce((sum, item) => sum + item.shares, 0);
  const engagementType = totalSaves > totalShares ? '저장(북마크)' : '공유(확산)';

  const insightText = `발행된 콘텐츠 중 '${topTopic}' 주제가 가장 반응이 뜨겁습니다. 특히 '${topPlatform}'의 '${topFormat}' 포맷에서 ${engagementType} 액션이 활발하게 일어나며 독자들의 높은 관여도를 만들어내고 있습니다.`;
  
  return {
    monthName,
    text: insightText,
    action: `다음 달 기획 시 '${topTopic}' 분야의 '${topFormat}' 제작 비중을 15% 이상 늘려 반응률을 극대화하세요.`,
    focus: `단순 조회수보다 ${engagementType} 전환이 높은 콘텐츠 패턴을 팀 내부에 공유하여 표준화하세요.`
  };
}
