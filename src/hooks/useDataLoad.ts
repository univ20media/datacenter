import { useState, useEffect } from 'react';
import { getContentData, getSeasonData } from '@/lib/data-source';
import { ContentItem, SeasonItem } from '@/types';

export function useDataLoad() {
  const [contentData, setContentData] = useState<ContentItem[]>([]);
  const [seasonMap, setSeasonMap] = useState<SeasonItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([getContentData(), getSeasonData()]).then(([c, s]) => {
      setContentData(c);
      setSeasonMap(s);
      setIsLoading(false);
    });
  }, []);

  return { contentData, seasonMap, isLoading };
}
