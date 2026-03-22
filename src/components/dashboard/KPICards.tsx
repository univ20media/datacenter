import { ContentItem } from '@/types';
import { getKpiSummary } from '@/lib/analytics';

interface KPICardsProps {
  data: ContentItem[];
  prevData?: ContentItem[];
}

export default function KPICards({ data, prevData = [] }: KPICardsProps) {
  const cards = getKpiSummary(data, prevData);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        // Simple heuristic to make the first KPI (Total score or views) pop out,
        // or just apply an icon / better hierarchy
        const isPrimary = index === 1; // e.g. "평균 조회수" or whatever is at index 1
        
        return (
          <div 
            key={index} 
            className={`p-6 rounded-xl border shadow-sm flex flex-col relative overflow-hidden \${
              isPrimary ? 'bg-blue-600 text-white border-blue-700' : 'bg-white border-gray-100'
            }`}
          >
            {isPrimary && (
              <div className="absolute -right-4 -top-4 opacity-10">
                <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 22h20L12 2z" />
                </svg>
              </div>
            )}
            <span className={`text-sm font-semibold mb-3 \${isPrimary ? 'text-blue-100' : 'text-gray-500'}`}>
              {card.label}
            </span>
            <div className="flex items-baseline gap-2 z-10">
              <span className={`text-3xl font-bold tracking-tight \${isPrimary ? 'text-white' : 'text-gray-900'}`}>
                {card.value}
              </span>
            </div>
            <div className="mt-3 z-10">
              <span className={`text-xs font-bold px-2 py-1 rounded-full \${
                isPrimary 
                  ? (card.trend === 'up' ? 'text-blue-900 bg-blue-100' : 'text-red-100 bg-red-500')
                  : (card.trend === 'up' ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50')
              }`}>
                {card.trend === 'up' ? '▲' : '▼'} {card.change} <span className="font-medium opacity-80">(전월 대비)</span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
