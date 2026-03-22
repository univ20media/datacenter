import { ContentItem } from '@/types';
import { getFormatPerformance } from '@/lib/analytics';

interface FormatPerformanceProps {
  data: ContentItem[];
}

export default function FormatPerformance({ data }: FormatPerformanceProps) {
  const formats = getFormatPerformance(data);

  const maxViews = Math.max(...formats.map(f => f[1].views), 1);

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-900 mb-6 tracking-tight">포맷별 효율성</h3>
      <div className="flex-1 flex flex-col justify-end space-y-4">
        {formats.map(([name, stats]) => {
          const percentage = (stats.views / maxViews) * 100;
          return (
            <div key={name} className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-50">
                    {name}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-gray-600">
                    {Math.round((stats.views / data.reduce((sum, item) => sum + item.views, 0)) * 100)}% 비율
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-indigo-50">
                <div 
                  style={{ width: `${percentage}%` }} 
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 transition-all duration-1000"
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
