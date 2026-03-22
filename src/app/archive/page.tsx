"use client";

import { useState, useMemo } from 'react';
import { contentData } from '@/data/content-data';
import { codebook } from '@/data/codebook';

export default function ArchivePage() {
  const [filters, setFilters] = useState({
    month: "전체",
    platform: "전체",
    topic_main: "전체",
    format: "전체",
    season_keyword: "전체",
  });

  const [sortOrder, setSortOrder] = useState<'최신순' | '성과 높은 순'>('최신순');

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyQuickFilter = (type: string) => {
    if (type === '이번 달') setFilters({ ...filters, month: '3' });
    if (type === '인스타그램 릴스') setFilters({ ...filters, platform: '인스타그램', format: '릴스' });
    if (type === '취업/자기계발') setFilters({ ...filters, topic_main: '취업' });
  };

  const processedData = useMemo(() => {
    const result = contentData.filter(item => {
      if (filters.month !== "전체" && item.month.toString() !== filters.month) return false;
      if (filters.platform !== "전체" && item.platform !== filters.platform) return false;
      if (filters.topic_main !== "전체" && item.topic_main !== filters.topic_main) return false;
      if (filters.format !== "전체" && item.format !== filters.format) return false;
      if (filters.season_keyword !== "전체" && item.season_keyword !== filters.season_keyword) return false;
      return true;
    });

    result.sort((a, b) => {
      if (sortOrder === '성과 높은 순') {
        return b.performance_score - a.performance_score;
      } else {
        return new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime();
      }
    });

    return result;
  }, [filters, sortOrder]);

  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">아카이브</h2>
        <p className="text-gray-500 text-sm mt-1">과거 발행 콘텐츠 검색 및 분석</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-5">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <FilterSelect label="월 (Month)" options={months} value={filters.month} onChange={(v) => handleFilterChange("month", v)} />
          <FilterSelect label="플랫폼" options={codebook.platforms} value={filters.platform} onChange={(v) => handleFilterChange("platform", v)} />
          <FilterSelect label="주제 (Topic)" options={codebook.topics} value={filters.topic_main} onChange={(v) => handleFilterChange("topic_main", v)} />
          <FilterSelect label="포맷" options={codebook.formats} value={filters.format} onChange={(v) => handleFilterChange("format", v)} />
          <FilterSelect label="시즌 키워드" options={codebook.seasonKeywords} value={filters.season_keyword} onChange={(v) => handleFilterChange("season_keyword", v)} />
        </div>
        
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
          <span className="text-xs font-semibold text-gray-500 mr-2">빠른 필터:</span>
          <button onClick={() => applyQuickFilter('이번 달')} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-full transition-colors">이번 달 (3월)</button>
          <button onClick={() => applyQuickFilter('인스타그램 릴스')} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-full transition-colors">인스타그램 릴스</button>
          <button onClick={() => applyQuickFilter('취업/자기계발')} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-full transition-colors">취업 토픽</button>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-4">
            <h3 className="font-semibold text-gray-700">검색 결과 ({processedData.length}건)</h3>
            <div className="flex items-center gap-2">
              <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as '최신순' | '성과 높은 순')}
                className="text-xs border-gray-300 rounded px-2 py-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="최신순">최신순</option>
                <option value="성과 높은 순">성과 높은 순</option>
              </select>
            </div>
          </div>
          <button 
            onClick={() => setFilters({month: "전체", platform: "전체", topic_main: "전체", format: "전체", season_keyword: "전체"})}
            className="text-sm text-gray-500 hover:text-blue-600 underline"
          >
            필터 초기화
          </button>
        </div>
        <div className="divide-y divide-gray-100 max-h-[800px] overflow-y-auto">
          {processedData.length === 0 ? (
            <div className="p-12 text-center text-gray-500">조건에 맞는 콘텐츠가 없습니다.</div>
          ) : (
            processedData.map(item => (
              <div key={item.content_id} className="p-5 hover:bg-gray-50 transition-colors flex flex-col md:flex-row gap-4 justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{item.platform}</span>
                    <span className="text-xs font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">{item.topic_main}</span>
                    <span className="text-xs font-medium text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-100">{item.format}</span>
                    {item.season_keyword && (
                      <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-100">#{item.season_keyword}</span>
                    )}
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 leading-tight mb-1">{item.title}</h4>
                  <div className="text-xs text-gray-500 flex items-center divide-x divide-gray-300">
                    <span className="pr-2">{item.publish_date}</span>
                    <span className="px-2">{item.month}월 발행</span>
                  </div>
                </div>
                <div className="md:w-1/3 flex flex-col justify-center space-y-2 border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-4">
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">성과 등급</span>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                      item.performance_level === "높음" ? "bg-green-100 text-green-800" :
                      item.performance_level === "낮음" ? "bg-red-100 text-red-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {item.performance_level}
                    </span>
                  </div>
                  {item.review_note && (
                    <div className="bg-gray-50 p-2 rounded text-xs text-gray-600 border border-gray-100">
                      <span className="font-semibold text-gray-700 block mb-0.5">리뷰 노트:</span>
                      {item.review_note}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function FilterSelect({ label, options, value, onChange }: { label: string, options: string[], value: string, onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-600">{label}</label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-50 border border-gray-200 text-sm rounded-md px-3 py-2 text-gray-800 focus:ring-blue-500 focus:border-blue-500 outline-none"
      >
        <option value="전체">전체</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}
