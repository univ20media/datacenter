import { ContentItem } from '../types';

export function getCurrentMonthContents(data: ContentItem[], targetMonth: number): ContentItem[] {
  return data.filter(item => item.month === targetMonth);
}

export function getPreviousMonthContents(data: ContentItem[], targetMonth: number): ContentItem[] {
  let prevMonth = targetMonth - 1;
  if (prevMonth < 1) prevMonth = 12;
  return data.filter(item => item.month === prevMonth);
}

export function getKpiSummary(currentData: ContentItem[], previousData: ContentItem[]) {
  const currentTotal = currentData.length;
  const currentViews = currentTotal > 0 ? currentData.reduce((sum, item) => sum + item.views, 0) / currentTotal : 0;
  const currentLikes = currentTotal > 0 ? currentData.reduce((sum, item) => sum + item.likes, 0) / currentTotal : 0;
  const currentScore = currentTotal > 0 ? currentData.reduce((sum, item) => sum + item.performance_score, 0) / currentTotal : 0;

  const prevTotal = previousData.length;
  const prevViews = prevTotal > 0 ? previousData.reduce((sum, item) => sum + item.views, 0) / prevTotal : 0;
  const prevLikes = prevTotal > 0 ? previousData.reduce((sum, item) => sum + item.likes, 0) / prevTotal : 0;
  const prevScore = prevTotal > 0 ? previousData.reduce((sum, item) => sum + item.performance_score, 0) / prevTotal : 0;

  const calculateChange = (curr: number, prev: number) => {
    if (prev === 0) return '+0%';
    const change = ((curr - prev) / prev) * 100;
    return change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
  };

  const calculateTrend = (curr: number, prev: number) => curr >= prev ? 'up' : 'down';

  return [
    {
      label: '전체 콘텐츠',
      value: currentTotal,
      change: calculateChange(currentTotal, prevTotal),
      trend: calculateTrend(currentTotal, prevTotal) as 'up' | 'down',
    },
    {
      label: '평균 조회수',
      value: Math.round(currentViews).toLocaleString(),
      change: calculateChange(currentViews, prevViews),
      trend: calculateTrend(currentViews, prevViews) as 'up' | 'down',
    },
    {
      label: '평균 좋아요',
      value: Math.round(currentLikes).toLocaleString(),
      change: calculateChange(currentLikes, prevLikes),
      trend: calculateTrend(currentLikes, prevLikes) as 'up' | 'down',
    },
    {
      label: '평균 성과 점수',
      value: Math.round(currentScore),
      change: calculateChange(currentScore, prevScore),
      trend: calculateTrend(currentScore, prevScore) as 'up' | 'down',
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
