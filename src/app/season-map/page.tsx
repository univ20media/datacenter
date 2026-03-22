"use client";

import { useState } from 'react';
import { seasonMap } from '@/data/season-map';
import SeasonDetails from '@/components/season-map/SeasonDetails';

export default function SeasonMapPage() {
  const [selectedMonth, setSelectedMonth] = useState<number>(3); // Default to March (MVP)

  const currentSeasonData = seasonMap.find(item => item.month === selectedMonth);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">시즌 맵</h2>
        <p className="text-gray-500 text-sm mt-1">연간 주요 이슈 및 트렌드 키워드</p>
      </div>

      {/* Month Selector */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-wrap gap-2">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
          <button
            key={m}
            onClick={() => setSelectedMonth(m)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedMonth === m
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            {m}월
          </button>
        ))}
      </div>

      {/* Season Details */}
      <div className="mt-8">
        <SeasonDetails seasonData={currentSeasonData} month={selectedMonth} />
      </div>
    </div>
  );
}
