"use client";

import { useState, useMemo } from 'react';
import KPICards from '@/components/dashboard/KPICards';
import PlatformComparison from '@/components/dashboard/PlatformComparison';
import InsightSummary from '@/components/dashboard/InsightSummary';
import TopicPerformance from '@/components/dashboard/TopicPerformance';
import FormatPerformance from '@/components/dashboard/FormatPerformance';
import ContentList from '@/components/dashboard/ContentList';
import { contentData } from '@/data/content-data';
import { seasonMap } from '@/data/season-map';
import { 
  getPreviousMonthContents,
  getTopContents,
  getLowContents
} from '@/lib/analytics';
import { getNextMonthRecommendations } from '@/lib/planner';

export default function Dashboard() {
  const [period, setPeriod] = useState<"이번 달" | "최근 30일" | "최근 90일">("이번 달");

  const filteredData = useMemo(() => {
    // For local mock data, let's assume today is March 22, 2026
    const today = new Date('2026-03-22').getTime();
    
    return contentData.filter(item => {
      const pubDate = new Date(item.publish_date).getTime();
      const diffDays = (today - pubDate) / (1000 * 3600 * 24);

      if (period === "이번 달") return item.month === 3;
      if (period === "최근 30일") return diffDays >= 0 && diffDays <= 30;
      if (period === "최근 90일") return diffDays >= 0 && diffDays <= 90;
      return true;
    });
  }, [period]);

  const prevPeriodData = useMemo(() => {
    // Simplified comparison vs absolute previous month for now
    return getPreviousMonthContents(contentData, 3); 
  }, []);

  const topPerformers = getTopContents(filteredData, 3);
  const lowPerformers = getLowContents(filteredData, 3);
  
  // Next planning hint based on the filtered data and next month's season context
  const nextHint = getNextMonthRecommendations(seasonMap, filteredData, 3)[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">대시보드</h2>
          <p className="text-gray-500 text-sm mt-1">콘텐츠 성과 및 핵심 지표 요약</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
          {(["이번 달", "최근 30일", "최근 90일"] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors \${
                period === p 
                  ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <KPICards data={filteredData} prevData={prevPeriodData} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <InsightSummary data={filteredData} monthName={period} />
        </div>
        
        {/* Next Planning Hint Block */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-100 shadow-sm flex flex-col justify-center">
          <h3 className="text-sm font-bold text-indigo-800 mb-2 flex items-center gap-2">
            💡 다음 기획 힌트
          </h3>
          {nextHint ? (
            <div className="space-y-3">
              <p className="text-xl font-bold text-gray-900 leading-tight">
                {nextHint.topic}
              </p>
              <div className="flex gap-2">
                <span className="text-xs font-semibold px-2 py-1 bg-white text-gray-700 rounded border border-gray-200">
                  {nextHint.platform}
                </span>
                <span className="text-xs font-semibold px-2 py-1 bg-white text-gray-700 rounded border border-gray-200">
                  {nextHint.format}
                </span>
              </div>
              <p className="text-xs text-gray-600 bg-white/60 p-2 rounded line-clamp-2">
                {nextHint.reason}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">다음 달 힌트 준비 중...</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PlatformComparison data={filteredData} />
        <TopicPerformance data={filteredData} />
        <FormatPerformance data={filteredData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <ContentList title="🔥 우수 성과 콘텐츠" data={topPerformers} variant="success" />
        <ContentList title="⚠️ 개선 필요 콘텐츠" data={lowPerformers} variant="warning" />
      </div>
    </div>
  );
}
