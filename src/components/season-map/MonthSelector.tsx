interface MonthSelectorProps {
  selectedMonth: number;
  onSelectMonth: (month: number) => void;
}

export default function MonthSelector({ selectedMonth, onSelectMonth }: MonthSelectorProps) {
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
      <div className="flex gap-2 min-w-max">
        {months.map((month) => (
          <button
            key={month}
            onClick={() => onSelectMonth(month)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              selectedMonth === month
                ? 'bg-blue-600 text-white'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            {month}월
          </button>
        ))}
      </div>
    </div>
  );
}
