"use client";

import { useMemo, useState } from "react";
import { sortArchiveItems, getArchiveSummary, type ArchiveSortType } from "@/lib/archive";
import { useDataLoad } from '@/hooks/useDataLoad';
import { codebook } from '@/data/codebook';

export default function ArchivePage() {
  const { contentData, isLoading } = useDataLoad();
  
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("");
  const [selectedSeasonKeyword, setSelectedSeasonKeyword] = useState("");

  const [sortType, setSortType] = useState<ArchiveSortType>('latest');

  const quickFilters = ["개강", "관계", "취업", "축제", "기사", "카드뉴스"];

  const filteredContents = useMemo(() => {
    return contentData.filter(item => {
      if (selectedMonth !== "" && item.month.toString() !== selectedMonth) return false;
      if (selectedPlatform !== "" && item.platform !== selectedPlatform) return false;
      if (selectedTopic !== "" && item.topic_main !== selectedTopic) return false;
      if (selectedFormat !== "" && item.format !== selectedFormat) return false;
      if (selectedSeasonKeyword !== "" && item.season_keyword !== selectedSeasonKeyword) return false;
      return true;
    });
  }, [contentData, selectedMonth, selectedPlatform, selectedTopic, selectedFormat, selectedSeasonKeyword]);

  const sortedContents = useMemo(() => {
    return sortArchiveItems(filteredContents, sortType);
  }, [filteredContents, sortType]);

  const summaryText = useMemo(() => {
    return getArchiveSummary(sortedContents, {
      month: selectedMonth === "" ? undefined : selectedMonth,
      platform: selectedPlatform === "" ? undefined : selectedPlatform,
      topic_main: selectedTopic === "" ? undefined : selectedTopic,
      format: selectedFormat === "" ? undefined : selectedFormat,
      season_keyword: selectedSeasonKeyword === "" ? undefined : selectedSeasonKeyword,
    });
  }, [
    sortedContents,
    selectedMonth,
    selectedPlatform,
    selectedTopic,
    selectedFormat,
    selectedSeasonKeyword,
  ]);

  if (isLoading) return <div className="p-10 text-center text-gray-500">데이터 로딩 중...</div>;

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
          <FilterSelect label="월 (Month)" options={months} value={selectedMonth} onChange={setSelectedMonth} />
          <FilterSelect label="플랫폼" options={codebook.platforms} value={selectedPlatform} onChange={setSelectedPlatform} />
          <FilterSelect label="주제 (Topic)" options={codebook.topics} value={selectedTopic} onChange={setSelectedTopic} />
          <FilterSelect label="포맷" options={codebook.formats} value={selectedFormat} onChange={setSelectedFormat} />
          <FilterSelect label="시즌 키워드" options={codebook.seasonKeywords} value={selectedSeasonKeyword} onChange={setSelectedSeasonKeyword} />
        </div>
      </div>

      <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-slate-500">빠른 필터</span>
      
          {quickFilters.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => {
                if (chip === "기사" || chip === "카드뉴스") {
                  setSelectedFormat(chip);
                  return;
                }
      
                if (chip === "개강" || chip === "축제") {
                  setSelectedSeasonKeyword(chip);
                  return;
                }
      
                setSelectedTopic(chip);
              }}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              {chip}
            </button>
          ))}
        </div>
      
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600">{summaryText}</p>
      
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSortType("latest")}
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                sortType === "latest"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              최신순
            </button>
            <button
              type="button"
              onClick={() => setSortType("performance")}
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                sortType === "performance"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              성과 높은 순
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedMonth("");
                setSelectedPlatform("");
                setSelectedTopic("");
                setSelectedFormat("");
                setSelectedSeasonKeyword("");
                setSortType("latest");
              }}
              className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700"
            >
              초기화
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100 max-h-[800px] overflow-y-auto">
          {sortedContents.length === 0 ? (
            <div className="p-12 text-center text-gray-500">조건에 맞는 콘텐츠가 없습니다.</div>
          ) : (
            sortedContents.map(item => (
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
        <option value="">전체</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}
