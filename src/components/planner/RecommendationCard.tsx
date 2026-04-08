import React from "react";

type RecommendationStrength = "강력 추천" | "시도해볼 만함" | "선기획 권장";

type RecommendationCardProps = {
  topic: string;
  platform: string;
  format: string;
  reason: string;
  relatedPattern: string;
  timing: "이번 달" | "다음 달";
  strength?: RecommendationStrength;
};

function getStrengthLabel(
  timing: "이번 달" | "다음 달",
  strength?: RecommendationStrength
): RecommendationStrength {
  if (strength) return strength;
  if (timing === "다음 달") return "선기획 권장";
  return "강력 추천";
}

function getStrengthStyle(label: RecommendationStrength) {
  if (label === "강력 추천") {
    return "bg-emerald-50 text-emerald-700";
  }

  if (label === "선기획 권장") {
    return "bg-amber-50 text-amber-700";
  }

  return "bg-slate-100 text-slate-700";
}

export default function RecommendationCard({
  topic,
  platform,
  format,
  reason,
  relatedPattern,
  timing,
  strength,
}: RecommendationCardProps) {
  const strengthLabel = getStrengthLabel(timing, strength);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-500">{timing} 추천</p>
          <h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            {topic}
          </h3>
        </div>

        <span
          className={`inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${getStrengthStyle(
            strengthLabel
          )}`}
        >
          {strengthLabel}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-md bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
          {platform}
        </span>
        <span className="rounded-md bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
          {format}
        </span>
      </div>

      <div className="mt-5 space-y-3">
        <div>
          <p className="text-sm font-semibold text-slate-500">추천 이유</p>
          <p className="mt-1 text-sm leading-6 text-slate-700">{reason}</p>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-500">참고 패턴</p>
          <p className="mt-1 text-sm leading-6 text-slate-700">
            {relatedPattern}
          </p>
        </div>
      </div>
    </div>
  );
}
