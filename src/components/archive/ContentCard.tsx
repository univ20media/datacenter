import { ContentItem } from '@/types';

export default function ContentCard({ item }: { item: ContentItem }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full overflow-hidden group">
      <div className="p-5 flex-1 flex flex-col relative">
        <div className="flex justify-between items-start mb-3 gap-2">
          <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide">
            {item.platform}
          </span>
          <span className="text-gray-400 text-xs font-medium whitespace-nowrap pt-1">{item.publish_date}</span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
            {item.title}
          </a>
        </h3>
        
        <div className="flex flex-wrap gap-1.5 mb-4 mt-auto">
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">#{item.topic_main}</span>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">#{item.format}</span>
        </div>
        
        <div className="bg-gray-50 -mx-5 px-5 py-3 border-y border-gray-100 text-xs text-gray-600 grid grid-cols-4 gap-2 text-center">
          <div><div className="font-bold text-gray-900">{item.views >= 1000 ? (item.views/1000).toFixed(1)+'k' : item.views}</div><div className="text-[10px] uppercase tracking-wider">Views</div></div>
          <div><div className="font-bold text-gray-900">{item.likes >= 1000 ? (item.likes/1000).toFixed(1)+'k' : item.likes}</div><div className="text-[10px] uppercase tracking-wider">Likes</div></div>
          <div><div className="font-bold text-gray-900">{item.saves >= 1000 ? (item.saves/1000).toFixed(1)+'k' : item.saves}</div><div className="text-[10px] uppercase tracking-wider">Saves</div></div>
          <div><div className="font-bold text-gray-900">{item.performance_score}</div><div className="text-[10px] uppercase tracking-wider text-blue-600">Score</div></div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-t border-blue-100 text-sm">
        <p className="text-gray-700 italic flex gap-2">
          <span className="opacity-50 font-serif text-lg leading-none">&quot;</span>
          <span className="line-clamp-2">{item.review_note}</span>
        </p>
      </div>
    </div>
  );
}
