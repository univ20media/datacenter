import { ContentItem, SeasonItem, RecommendationItem } from '../types';
import { getTopicPerformance, getFormatPerformance } from './analytics';

export function getCurrentMonthSeason(seasonMap: SeasonItem[], month: number): SeasonItem | null {
  return seasonMap.find((s) => s.month === month) || null;
}

export function getNextMonthSeason(seasonMap: SeasonItem[], month: number): SeasonItem | null {
  const nextMonth = month === 12 ? 1 : month + 1;
  return seasonMap.find((s) => s.month === nextMonth) || null;
}

export function getTopPerformingTopics(data: ContentItem[], count: number = 2) {
  const topics = getTopicPerformance(data);
  return topics.slice(0, count).map(t => t[0]);
}

export function getTopPerformingFormats(data: ContentItem[], count: number = 2) {
  const formats = getFormatPerformance(data);
  return formats.slice(0, count).map(f => f[0]);
}

export function getContentGapAreas(data: ContentItem[], allTopics: string[]) {
  const coveredTopics = new Set(data.map(d => d.topic_main));
  return allTopics.filter(t => !coveredTopics.has(t));
}

/// Simple, transparent, deterministic rule-based logic
export function getCurrentMonthRecommendations(
  seasonMap: SeasonItem[],
  contentData: ContentItem[],
  month: number
): RecommendationItem[] {
  const season = getCurrentMonthSeason(seasonMap, month);
  if (!season) return [];

  const topTopics = getTopPerformingTopics(contentData);
  const topFormats = getTopPerformingFormats(contentData);

  const recommendations: RecommendationItem[] = [];

  // Rule 1: Combine Season Map Recommended Topic with Top Format
  if (season.recommended_topics.length > 0 && topFormats.length > 0) {
    recommendations.push({
      id: `cur-rec-1`,
      topic: season.recommended_topics[0],
      platform: '인스타그램',
      format: topFormats[0],
      reason: `시즌 맵 추천 토픽('${season.recommended_topics[0]}')과 현재 가장 성과가 좋은 포맷('${topFormats[0]}')의 결합입니다.`,
      relatedPattern: season.behavior_pattern.length > 0 ? season.behavior_pattern[0] : '트렌드 지속',
      timing: "이번 달",
      strength: "강력 추천"
    });
  }

  // Rule 2: Combine Top Performing Topic from existing data with Season recommended Format
  if (topTopics.length > 0 && season.recommended_formats.length > 0) {
    recommendations.push({
      id: `cur-rec-2`,
      topic: topTopics[0],
      platform: '홈페이지',
      format: season.recommended_formats[0],
      reason: `현재 독자 반응이 가장 뜨거운 토픽('${topTopics[0]}')을 타겟팅한 시즌 추천 포맷('${season.recommended_formats[0]}')입니다.`,
      relatedPattern: season.behavior_pattern.length > 1 ? season.behavior_pattern[1] : '관심사 확대',
      timing: "이번 달",
      strength: "시도해볼 만함"
    });
  }

  // Rule 3: Past success / Linked topics
  if (season.linked_past_topics.length > 0) {
    recommendations.push({
      id: `cur-rec-3`,
      topic: season.linked_past_topics[0],
      platform: '홈페이지',
      format: '기사',
      reason: `과거 성공적이었던 연관 토픽('${season.linked_past_topics[0]}')을 심도있게 다루는 기사 형태의 접근이 필요합니다.`,
      relatedPattern: '과거 데이터 기반 재활용',
      timing: "이번 달",
      strength: "시도해볼 만함"
    });
  }

  return recommendations;
}

export function getNextMonthRecommendations(
  seasonMap: SeasonItem[],
  contentData: ContentItem[],
  month: number
): RecommendationItem[] {
  const nextSeason = getNextMonthSeason(seasonMap, month);
  if (!nextSeason) return [];

  // Use current month data to predict what should act as a bridge
  const topTopics = getTopPerformingTopics(contentData);

  const recommendations: RecommendationItem[] = [];

  if (nextSeason.recommended_topics.length > 0) {
    recommendations.push({
      id: `nxt-rec-1`,
      topic: nextSeason.recommended_topics[0],
      platform: '인스타그램',
      format: nextSeason.recommended_formats[0] || '카드뉴스',
      reason: `다음 달 핵심 이슈('${nextSeason.issue_name}') 대비를 위한 선제적 콘텐츠 발행이 필요합니다.`,
      relatedPattern: nextSeason.behavior_pattern.length > 0 ? nextSeason.behavior_pattern[0] : '이슈 선점',
      timing: "다음 달",
      strength: "선기획 권장"
    });
  }

  if (topTopics.length > 0 && nextSeason.recommended_topics.length > 1) {
    recommendations.push({
      id: `nxt-rec-2`,
      topic: nextSeason.recommended_topics[1],
      platform: '인스타그램',
      format: '릴스', // arbitrary format selection from rules
      reason: `현재 트렌드에서 이어지는 다음 달 타겟 관심사('${nextSeason.recommended_topics[1]}') 공략 콘텐츠입니다.`,
      relatedPattern: '트렌드 연결',
      timing: "다음 달",
      strength: "시도해볼 만함"
    });
  }

  if (nextSeason.prep_start) {
    recommendations.push({
      id: `nxt-rec-3`,
      topic: '시즌 준비 가이드',
      platform: '홈페이지',
      format: '기사',
      reason: `다음 달 시즌 준비('${nextSeason.prep_start}' 시작)를 위한 실용적인 가이드 콘텐츠 시점입니다.`,
      relatedPattern: '사전 준비',
      timing: "다음 달",
      strength: "선기획 권장"
    });
  }

  return recommendations;
}
