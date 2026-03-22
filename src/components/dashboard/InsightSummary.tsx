import { ContentItem } from '@/types';
import { getInsightSummary } from '@/lib/analytics';

interface InsightSummaryProps {
  data: ContentItem[];
  monthName: string;
}

export default function InsightSummary({ data, monthName }: InsightSummaryProps) {
  const insight = getInsightSummary(data, monthName);

  return (
    <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8 mt-8 lg:mt-0">
      <div className="flex items-start gap-4">
        <div className="bg-blue-600 text-white p-2 rounded-lg mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2 tracking-tight">에디토리얼 인사이트: {insight.monthName}</h3>
          <p className="text-gray-700 text-sm leading-relaxed mb-3">
            {insight.text}
          </p>
          <ul className="text-sm text-gray-600 space-y-1 ml-5 list-disc">
            <li><strong>액션 플랜:</strong> {insight.action}</li>
            <li><strong>포커스 점검:</strong> {insight.focus}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
