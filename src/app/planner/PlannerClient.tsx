"use client";

import Link from "next/link";
import { useMemo } from "react";
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

export default function PlannerClient() {
  const { contentData, seasonMap: seasonData, isLoading } = useDataLoad();
  const searchParams = useSearchParams();
  const router = useRouter();

  const realCurrentMonth = getCurrentMonthNumber();
  const searchMonth = Number(searchParams.get("month"));
  const focusMonth =
    Number.isFinite(searchMonth) && searchMonth >= 1 && searchMonth <= 12
      ? searchMonth
      : realCurrentMonth;

  const nextMonth = getNextMonthNumber(focusMonth);

  const goToMonth = (month: number) => {
    router.push(`/planner?month=${month}`);
  };

  const getPreviousMonthNumber = (month: number) => {
    return month === 1 ? 12 : month - 1;
  };

  const previousMonth = getPreviousMonthNumber(focusMonth);

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

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            기획 추천
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            이번 달 반응과 다음 달 시즌 이슈를 연결해 다음 아이템을 찾습니다
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => goToMonth(previousMonth)}
            className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            ← 이전 달
          </button>

          <button
            type="button"
            onClick={() => goToMonth(realCurrentMonth)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              focusMonth === realCurrentMonth
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            이번 달
          </button>

          <button
            type="button"
            onClick={() => goToMonth(nextMonth)}
            className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            다음 달 →
          </button>

          <Link
            href="/season-map"
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            시즌 맵으로 돌아가기
          </Link>
        </div>
      </div>

      <div className="rounded-3xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-700">
              현재 {focusMonth}월 기준으로 플래너를 보고 있습니다
            </p>
            <p className="mt-2 text-sm leading-6 text-blue-900">
              {focusSeason
                ? `${focusSeason.issue_name} 시즌을 기준으로 이번 달 추천을 구성했고, ${nextMonth}월 선기획 아이템까지 함께 보여줍니다.`
                : `${focusMonth}월 기준 데이터를 바탕으로 추천을 구성했습니다.`}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm">
              기준 월: {focusMonth}월
            </span>
            <span className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm">
              선기획 월: {nextMonth}월
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-2 text-sm font-semibold text-slate-500">
            빠른 월 선택
          </span>

          {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => (
            <button
              key={month}
              type="button"
              onClick={() => goToMonth(month)}
              className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                focusMonth === month
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {month}월
            </button>
          ))}
        </div>
      </div>

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900">
            {focusMonth}월 추천 기획
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            현재 선택한 시즌 이슈와 최근 성과 패턴을 함께 반영한 추천입니다.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          {currentMonthRecommendations.map((item) => (
            <RecommendationCard
              key={item.id}
              topic={item.topic}
              platform={item.platform}
              format={item.format}
              reason={item.reason}
              relatedPattern={item.relatedPattern}
              timing={item.timing}
              strength="강력 추천"
            />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900">
            {nextMonth}월 선기획 아이템
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            다음 달 시즌 이슈를 고려했을 때 지금부터 준비가 필요한 주제입니다.
          </p>
        </div>

        {nextSeason && (
          <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-700">
              다음 달 핵심 이슈
            </p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              {nextSeason.issue_name}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              준비 시작 시점은 <span className="font-semibold">{nextSeason.prep_start}</span>입니다.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          {nextMonthRecommendations.map((item) => (
            <RecommendationCard
              key={item.id}
              topic={item.topic}
              platform={item.platform}
              format={item.format}
              reason={item.reason}
              relatedPattern={item.relatedPattern}
              timing={item.timing}
              strength="선기획 권장"
            />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900">
            비어 있는 기획 영역
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            이번 달 시즌상 중요하지만 아직 충분히 다뤄지지 않은 주제입니다.
          </p>
        </div>

        {gapAreas.length > 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap gap-3">
              {gapAreas.map((topic) => (
                <span
                  key={topic}
                  className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
                >
                  {topic}
                </span>
              ))}
            </div>

            <div className="mt-5">
              <Link
                href="/archive"
                className="inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                아카이브에서 유사 사례 보기
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
            현재 기준으로는 주요 시즌 주제가 비교적 고르게 다뤄지고 있습니다.
          </div>
        )}
      </section>
    </div>
  );
}
