import { ContentItem } from '@/types';

interface ContentListProps {
  title: string;
  data: ContentItem[];
  variant: 'success' | 'warning';
}

export default function ContentList({ title, data, variant }: ContentListProps) {
  const badgeColor = variant === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-4 tracking-tight">{title}</h3>
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.content_id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 pr-4">{item.title}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap ${badgeColor}`}>
                점수: {item.performance_score}
              </span>
            </div>
            
            <div className="mb-3">
              {item.season_keyword && (
                <span className="inline-block bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-xs font-bold border border-purple-100">
                  📍 시즌 패턴: {item.season_keyword}
                </span>
              )}
            </div>
            
            <div className="flex gap-2 mb-3 text-xs">
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium">{item.platform}</span>
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium">{item.format}</span>
              <span className="text-gray-400 py-0.5">{item.publish_date}</span>
            </div>

            <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700 border border-gray-100 italic">
              <span className="font-semibold not-italic block mb-1 text-xs text-gray-500 uppercase tracking-wider">에디터 노트</span>
              &quot;{item.review_note}&quot;
            </div>
            
            <div className="mt-3 flex gap-4 text-xs text-gray-500 font-medium border-t border-gray-100 pt-3">
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {item.views.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {item.likes.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
