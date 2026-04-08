"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useDataLoad } from "@/hooks/useDataLoad";
import {
  getCurrentMonthNumber,
  getNextMonthNumber,
  getSeasonByMonth,
  getPrepStatus,
  getLinkedPastContents,
  getUpcomingPreparationCard,
} from "@/lib/season";

function SectionCard({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-500">{title}</h3>

      {items.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {items.map((item) => (
            <span
              key={`${title}-${item}`}
              className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700"
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-400">표시할 데이터가 없습니다.</p>
      )}
    </div>
  );
}

function LinkedContentCard({
  title,
  platform,
  topic,
  format,
  performanceLevel,
  reviewNote,
}: {
  title: string;
  platform: string;
  topic: string;
  format: string;
  performanceLevel: string;
  reviewNote: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-slate-500">{platform}</p>
          <h4 className="mt-1 text-lg font-bold leading-7 text-slate-900">
            {title}
          </h4>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          {performanceLevel}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-md bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
          {topic}
        </span>
        <span className="rounded-md bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
          {format}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-600">{reviewNote}</p>
    </div>
  );
}

export default function SeasonMapPage() {
  const { seasonMap, contentData, isLoading } = useDataLoad();
  const router = useRouter();

  const currentMonth = getCurrentMonthNumber();
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);

  const selectedSeason = useMemo(() => {
    return getSeasonByMonth(seasonMap, selectedMonth);
  }, [seasonMap, selectedMonth]);

  const prepStatus = useMemo(() => {
    return getPrepStatus(selectedMonth, currentMonth);
  }, [selectedMonth, currentMonth]);

  const linkedPastContents = useMemo(() => {
    return getLinkedPastContents(contentData, selectedSeason, 4);
  }, [contentData, selectedSeason]);

  const upcomingPreparation = useMemo(() => {
    return getUpcomingPreparationCard(seasonMap, selectedMonth);
  }, [seasonMap, selectedMonth]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            시즌 맵
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            월별 대학생 이슈와 감정선을 바탕으로 기획 힌트를 찾는 공간
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
          데이터를 불러오는 중입니다...
        </div>
      </div>
    );
  }

  if (!selectedSeason) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            시즌 맵
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            월별 대학생 이슈와 감정선을 바탕으로 기획 힌트를 찾는 공간
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
          선택한 월의 시즌 데이터를 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          시즌 맵
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          월별 대학생 이슈와 감정선을 바탕으로 기획 힌트를 찾는 공간
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedMonth(currentMonth)}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              이번 달 보기
            </button>
            <button
              type="button"
              onClick={() => setSelectedMonth(getNextMonthNumber(currentMonth))}
              className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              다음 달 보기
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => (
              <button
                key={month}
                type="button"
                onClick={() => setSelectedMonth(month)}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                  selectedMonth === month
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {month}월
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">
              {selectedSeason.month}월 시즌 테마
            </p>
            <h2 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
              {selectedSeason.issue_name}
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
              {prepStatus.description}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <span
              className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${prepStatus.className}`}
            >
              {prepStatus.label}
            </span>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                준비 시작 시점
              </p>
              <p className="mt-2 text-lg font-bold text-slate-900">
                {selectedSeason.prep_start}
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push(`/planner?month=${selectedMonth}`)}
              className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              이 월 기준으로 플래너 보기
            </button>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-700">주의할 접근</p>
          <p className="mt-2 text-sm leading-6 text-amber-800">
            {selectedSeason.caution_note}
          </p>
        </div>
      </div>

      {upcomingPreparation && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                지금 준비해야 할 다음 달 포인트
              </p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                {upcomingPreparation.month}월 · {upcomingPreparation.issueName}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                다음 달 시즌에 대비해 <span className="font-semibold text-slate-900">{upcomingPreparation.prepStart}</span>부터 준비가
                필요한 주제입니다.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 xl:w-[320px]">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                주의 포인트
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                {upcomingPreparation.cautionNote}
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2">
            <SectionCard title="다음 달 추천 주제" items={upcomingPreparation.topics} />
            <SectionCard title="다음 달 추천 포맷" items={upcomingPreparation.formats} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <SectionCard title="학사 이벤트" items={selectedSeason.academic_event || []} />
        <SectionCard title="생활 이벤트" items={selectedSeason.life_event || []} />
        <SectionCard title="감정 키워드" items={selectedSeason.emotion_keywords || []} />
        <SectionCard title="고민 키워드" items={selectedSeason.concern_keywords || []} />
        <SectionCard title="행동 패턴" items={selectedSeason.behavior_pattern || []} />
        <SectionCard title="추천 주제" items={selectedSeason.recommended_topics || []} />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <SectionCard
          title="추천 포맷"
          items={selectedSeason.recommended_formats || []}
        />
        <SectionCard
          title="과거 성과 연결 키워드"
          items={selectedSeason.linked_past_topics || []}
        />
      </div>

      <section className="space-y-4">
        <div>
          <h3 className="text-2xl font-bold tracking-tight text-slate-900">
            참고할 과거 콘텐츠
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            현재 시즌과 연결된 키워드 기준으로 성과가 좋았던 콘텐츠를 우선 보여줍니다.
          </p>
        </div>

        {linkedPastContents.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {linkedPastContents.map((item) => (
              <LinkedContentCard
                key={item.content_id}
                title={item.title}
                platform={item.platform}
                topic={item.topic_main}
                format={item.format}
                performanceLevel={item.performance_level}
                reviewNote={item.review_note || "회고 메모가 없습니다."}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
            현재 시즌과 연결된 과거 콘텐츠가 아직 충분하지 않습니다.
          </div>
        )}
      </section>
    </div>
  );
}
