import { SeasonItem } from '@/types';

interface SeasonDetailsProps {
  seasonData: SeasonItem | undefined;
  month: number;
}

export default function SeasonDetails({ seasonData, month }: SeasonDetailsProps) {
  if (!seasonData) {
    return (
      <div className="bg-white p-12 rounded-xl border border-gray-100 shadow-sm text-center">
        <div className="text-gray-400 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No Data Available</h3>
        <p className="text-sm text-gray-500">Season mapping data for month {month} is not available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-900 text-white p-8 rounded-xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
          <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 22h20L12 2z" />
          </svg>
        </div>
        <div className="relative z-10">
          <span className="bg-blue-800 text-blue-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
            {month}월 핵심 이슈
          </span>
          <h2 className="text-3xl font-bold mb-2 tracking-tight">{seasonData.issue_name}</h2>
          <ul className="text-blue-200 mt-2 max-w-2xl list-disc list-inside space-y-1">
            {seasonData.behavior_pattern.map((pattern, idx) => (
              <li key={idx}>{pattern}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <KPISection title="학사 및 생활 이벤트">
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">학사 일정</h4>
              <div className="flex flex-wrap gap-2">
                {seasonData.academic_event.map((e, i) => (
                  <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-sm font-medium border border-blue-100">{e}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">생활 패턴</h4>
              <div className="flex flex-wrap gap-2">
                {seasonData.life_event.map((e, i) => (
                  <span key={i} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-md text-sm font-medium border border-indigo-100">{e}</span>
                ))}
              </div>
            </div>
          </div>
        </KPISection>

        <KPISection title="타겟 마인드셋">
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">감정 키워드</h4>
              <div className="flex flex-wrap gap-2">
                {seasonData.emotion_keywords.map((e, i) => (
                  <span key={i} className="bg-pink-50 text-pink-700 px-3 py-1 rounded-md text-sm font-medium border border-pink-100">#{e}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">고민 키워드</h4>
              <div className="flex flex-wrap gap-2">
                {seasonData.concern_keywords.map((e, i) => (
                  <span key={i} className="bg-orange-50 text-orange-700 px-3 py-1 rounded-md text-sm font-medium border border-orange-100">#{e}</span>
                ))}
              </div>
            </div>
          </div>
        </KPISection>

        <KPISection title="콘텐츠 전략">
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">추천 토픽</h4>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {seasonData.recommended_topics.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">추천 포맷</h4>
              <div className="flex flex-wrap gap-2">
                {seasonData.recommended_formats.map((f, i) => (
                  <span key={i} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">{f}</span>
                ))}
              </div>
            </div>
          </div>
        </KPISection>

        <div className="space-y-6 flex flex-col">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex-1">
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              에디터 주의사항
            </h3>
            <p className="text-sm text-gray-700 bg-red-50 p-4 rounded-lg border border-red-100">
              {seasonData.caution_note}
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase">준비 시작 시기</h4>
              <span className="text-lg font-bold text-gray-900">{seasonData.prep_start}</span>
            </div>
            <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPISection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100 flex items-center gap-2 tracking-tight">
        {title}
      </h3>
      {children}
    </div>
  );
}
