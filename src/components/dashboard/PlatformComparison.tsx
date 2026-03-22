import { ContentItem } from '@/types';
import { getPlatformPerformance } from '@/lib/analytics';

interface PlatformComparisonProps {
  data: ContentItem[];
}

export default function PlatformComparison({ data }: PlatformComparisonProps) {
  const platforms = getPlatformPerformance(data);

  const maxViews = Math.max(...platforms.map(p => p[1].views));

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm col-span-1">
      <h3 className="text-lg font-bold text-gray-900 mb-4 tracking-tight">플랫폼별 성과 (조회수)</h3>
      <div className="space-y-4">
        {platforms.map(([name, stats]) => {
          const widthPercent = maxViews > 0 ? (stats.views / maxViews) * 100 : 0;
          return (
            <div key={name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">{name}</span>
                <span className="text-gray-500 font-medium">
                  {stats.views.toLocaleString()} <span className="text-gray-400 text-xs font-normal">({stats.contents}건)</span>
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${widthPercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
