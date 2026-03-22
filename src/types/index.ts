export type ContentItem = {
  content_id: string;
  publish_date: string;
  month: number;
  platform: "홈페이지" | "인스타그램";
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
  views: number;
  likes: number;
  comments: number;
  saves: number;
  shares: number;
  measure_point: "24h" | "72h" | "7d";
  performance_score: number;
  performance_level: "높음" | "보통" | "낮음";
  review_note: string;
};

export type SeasonItem = {
  season_id: string;
  month: number;
  issue_name: string;
  academic_event: string[];
  life_event: string[];
  emotion_keywords: string[];
  concern_keywords: string[];
  behavior_pattern: string[];
  recommended_topics: string[];
  recommended_formats: string[];
  prep_start: string;
  caution_note: string;
  linked_past_topics: string[];
};

export interface Codebook {
  platforms: string[];
  topics: string[];
  formats: string[];
  tones: string[];
  targets: string[];
  seasonKeywords: string[];
  performanceLevels: string[];
}

export type RecommendationItem = {
  id: string;
  topic: string;
  platform: string;
  format: string;
  reason: string;
  relatedPattern: string;
  timing: "이번 달" | "다음 달";
  strength?: "강력 추천" | "시도해볼 만함" | "선기획 권장";
};
