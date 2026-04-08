import { ContentItem } from '@/types';

interface ArchiveFilterProps {
  filters: {
    month: string;
    platform: string;
    topic: string;
    format: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    month: string;
    platform: string;
    topic: string;
    format: string;
  }>>;
  data: ContentItem[];
}

export default function ArchiveFilter({ filters, setFilters, data }: ArchiveFilterProps) {
  // Extract unique values for filters
  const uniqueMonths = Array.from(new Set(data.map(item => item.month))).sort((a, b) => a - b);
  const uniquePlatforms = Array.from(new Set(data.map(item => item.platform))).sort();
  const uniqueTopics = Array.from(new Set(data.map(item => item.topic_main))).sort();
  const uniqueFormats = Array.from(new Set(data.map(item => item.format))).sort();

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-wrap gap-4 items-end">
      <FilterSelect
        label="Month"
        value={filters.month}
        options={uniqueMonths.map(m => ({ label: `${m}월`, value: m.toString() }))}
        onChange={(v) => handleFilterChange('month', v)}
      />
      <FilterSelect
        label="Platform"
        value={filters.platform}
        options={uniquePlatforms.map(p => ({ label: p, value: p }))}
        onChange={(v) => handleFilterChange('platform', v)}
      />
      <FilterSelect
        label="Main Topic"
        value={filters.topic}
        options={uniqueTopics.map(t => ({ label: t, value: t }))}
        onChange={(v) => handleFilterChange('topic', v)}
      />
      <FilterSelect
        label="Format"
        value={filters.format}
        options={uniqueFormats.map(f => ({ label: f, value: f }))}
        onChange={(v) => handleFilterChange('format', v)}
      />

      <div className="ml-auto">
        <button
          onClick={() => setFilters({ month: '', platform: '', topic: '', format: '' })}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium px-4 py-2"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }: {
  label: string,
  value: string,
  options: { label: string, value: string }[],
  onChange: (val: string) => void
}) {
  return (
    <div className="flex flex-col gap-1.5 w-full sm:w-auto min-w-[140px]">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="form-select w-full rounded-lg border-gray-200 text-sm focus:border-blue-500 focus:ring-blue-500 py-2 pl-3 pr-8 bg-gray-50 cursor-pointer"
      >
        <option value="">All</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
