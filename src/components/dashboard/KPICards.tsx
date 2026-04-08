import { ContentItem } from '@/types';
import KpiCard from '@/components/dashboard/KpiCard';
import { buildKpiCards } from '@/lib/analytics';

interface KPICardsProps {
  data: ContentItem[];
  prevData?: ContentItem[];
}

export default function KPICards({ data, prevData = [] }: KPICardsProps) {
  const kpiCards = buildKpiCards(data, prevData);

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      {kpiCards.map((card) => (
        <KpiCard
          key={card.key}
          title={card.title}
          description={card.description}
          value={card.value}
          change={card.change}
          suffix={card.suffix}
        />
      ))}
    </div>
  );
}
