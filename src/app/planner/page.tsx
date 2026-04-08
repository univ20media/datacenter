"use client";

import Link from "next/link";
import { Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDataLoad } from "@/hooks/useDataLoad";
import RecommendationCard from "@/components/planner/RecommendationCard";
import {
  getCurrentMonthNumber,
  getNextMonthNumber,
  getRecommendationsForMonth,
  getContentGapAreas,
  getSeasonByMonth,
} from "@/lib/planner";

function PlannerFallback() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          기획 추천
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          이번 달 반응과 다음 달 시즌 이슈를 연결해 다음 아이템을 찾습니다
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        데이터를 불러오는 중입니다...
      </div>
    </div>
  );
}

function PlannerContent() {
  const { contentData, seasonMap: seasonData, isLoading } = useDataLoad();
  const searchParams = useSearchParams();
  const router = useRouter();

  const realCurrentMonth = getCurrentMonthNumber();
  const searchMonth = Number(searchParams.get("month"));
  const focusMonth =
    Number.isFinite(searchMonth) && searchMonth >= 1 && searchMonth <= 12
      ? searchMonth
      : realCurrentMonth;

  const goToMonth = (month: number) => {
    router.push(`/planner?month=${month}`);
  };

  const getPreviousMonthNumber = (month: number) => {
    return month === 1 ? 12 : month - 1;
  };

  const previousMonth = getPreviousMonthNumber(focusMonth);
  const nextMonth = getNextMonthNumber(focusMonth);

  const focusSeason = useMemo(() => {
    return getSeasonByMonth(seasonData, focusMonth);
  }, [seasonData, focusMonth]);

  const nextSeason = useMemo(() => {
    return getSeasonByMonth(seasonData, nextMonth);
  }, [seasonData, nextMonth]);

  const currentMonthRecommendations = useMemo(() => {
    return getRecommendationsForMonth(
      contentData,
      seasonData,
      focusMonth,
      "이번 달",
      3
    );
  }, [contentData, seasonData, focusMonth]);

  const nextMonthRecommendations = useMemo(() => {
    return getRecommendationsForMonth(
      contentData,
      seasonData,
      nextMonth,
      "다음 달",
      3
    );
  }, [contentData, seasonData, nextMonth]);

  const gapAreas = useMemo(() => {
    return getContentGapAreas(contentData, seasonData, focusMonth, 3);
  }, [contentData, seasonData, focusMonth]);

  if (isLoading) {
    return <PlannerFallback />;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      {/* 기존 return JSX 그대로 */}
    </div>
  );
}

export default function PlannerPage() {
  return (
    <Suspense fallback={<PlannerFallback />}>
      <PlannerContent />
    </Suspense>
  );
}