import { ContentItem } from '@/types';
import { getTopicPerformance } from '@/lib/analytics';

interface TopicPerformanceProps {
  data: ContentItem[];
}

export default function TopicPerformance({ data }: TopicPerformanceProps) {
  const topics = getTopicPerformance(data);

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-full">
      <h3 className="text-lg font-bold text-gray-900 mb-4 tracking-tight">토픽별 성과</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="border-b border-gray-100 uppercase text-xs text-gray-500 font-semibold bg-gray-50/50">
            <tr>
              <th className="px-4 py-3 rounded-tl-lg">메인 토픽</th>
              <th className="px-4 py-3 text-right">발행 건수</th>
              <th className="px-4 py-3 text-right">총 조회수</th>
              <th className="px-4 py-3 text-right rounded-tr-lg">평균 점수</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {topics.map(([name, stats]) => (
              <tr key={name} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">{name}</td>
                <td className="px-4 py-3 text-right text-gray-600">{stats.contents}</td>
                <td className="px-4 py-3 text-right text-gray-900 font-medium">{stats.views.toLocaleString()}</td>
                <td className="px-4 py-3 text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    (stats.score / stats.contents) >= 80 ? 'bg-green-100 text-green-700' :
                    (stats.score / stats.contents) >= 60 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {Math.round(stats.score / stats.contents)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
