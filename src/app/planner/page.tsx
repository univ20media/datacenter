"use client";

import { useState } from 'react';
import { getCurrentMonthRecommendations, getNextMonthRecommendations } from '@/lib/planner';
import { contentData } from '@/data/content-data';
import { seasonMap } from '@/data/season-map';
import { RecommendationItem } from '@/types';

export default function PlannerPage() {
  const [baseMonth, setBaseMonth] = useState<number>(3); // Default to March (MVP)

  const currentMonthRecs = getCurrentMonthRecommendations(seasonMap, contentData, baseMonth).slice(0, 3);
  const nextMonthRecs = getNextMonthRecommendations(seasonMap, contentData, baseMonth).slice(0, 3);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">콘텐츠 기획 플래너</h2>
          <p className="text-gray-500 text-sm mt-1">데이터 기반 맞춤형 기획안 추천</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 font-medium">기준 월 설정:</label>
          <select 
            value={baseMonth} 
            onChange={(e) => setBaseMonth(Number(e.target.value))}
            className="border-gray-300 rounded-md text-sm border px-2 py-1 bg-white focus:ring-blue-500 focus:border-blue-500"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <option key={m} value={m}>{m}월</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-8 mt-6">
        <RecommendationSection 
          title={`이번 달 (${baseMonth}월) 집중 기획 토픽`}
          description="현재 시점의 트렌드와 독자 반응을 결합한 추천안입니다."
          recommendations={currentMonthRecs}
          badgeColor="bg-blue-100 text-blue-800"
        />

        <RecommendationSection 
          title={`다음 달 (${baseMonth === 12 ? 1 : baseMonth + 1}월) 선제적 기획 토픽`}
          description="다가오는 시즌 핵심 이슈를 반영한 우선 준비 제안입니다."
          recommendations={nextMonthRecs}
          badgeColor="bg-purple-100 text-purple-800"
        />
      </div>
    </div>
  );
}

function RecommendationSection({ title, description, recommendations, badgeColor }: { title: string, description: string, recommendations: RecommendationItem[], badgeColor: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="border-b border-gray-100 p-6 bg-gray-50/50">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.length > 0 ? (
          recommendations.map((rec) => (
            <RecommendationCard key={rec.id} item={rec} badgeColor={badgeColor} />
          ))
        ) : (
          <div className="col-span-3 text-center py-12 text-gray-500 text-sm">추천 데이터가 부족합니다.</div>
        )}
      </div>
    </div>
  );
}

function RecommendationCard({ item, badgeColor }: { item: RecommendationItem, badgeColor: string }) {
  const getStrengthColor = (s?: string) => {
    if (s === '강력 추천') return 'bg-red-50 text-red-700 border-red-200';
    if (s === '시도해볼 만함') return 'bg-orange-50 text-orange-700 border-orange-200';
    if (s === '선기획 권장') return 'bg-green-50 text-green-700 border-green-200';
    return 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <div className="border border-gray-200 rounded-xl hover:shadow-md transition-shadow bg-white flex flex-col h-full overflow-hidden relative">
      <div className={`h-1.5 w-full ${badgeColor.split(' ')[0]}`}></div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${badgeColor}`}>
            {item.timing} 추천
          </span>
          {item.strength && (
            <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold border ${getStrengthColor(item.strength)}`}>
              추천 강도: {item.strength}
            </span>
          )}
        </div>
        
        <div className="mb-4">
          <span className="text-xs text-gray-500 font-semibold block mb-1">추천 주제</span>
          <h4 className="text-lg font-bold text-gray-900 leading-tight">{item.topic}</h4>
        </div>
        
        <div className="flex gap-2 mb-5">
          <span className="text-xs font-semibold px-2 py-1 bg-gray-50 text-gray-700 rounded border border-gray-200">
            <span className="text-gray-400 mr-1">추천 플랫폼</span> {item.platform}
          </span>
          <span className="text-xs font-semibold px-2 py-1 bg-gray-50 text-gray-700 rounded border border-gray-200">
            <span className="text-gray-400 mr-1">추천 포맷</span> {item.format}
          </span>
        </div>

        <div className="space-y-4 flex-1 flex flex-col justify-end">
          <div className="bg-blue-50/40 p-3.5 rounded-lg border border-blue-100/60">
            <span className="block text-[11px] font-bold text-blue-700 mb-1.5">추천 이유</span>
            <p className="text-sm text-gray-800 leading-relaxed">{item.reason}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">참고 패턴</span>
            <span className="text-xs font-medium text-gray-700">{item.relatedPattern}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
