import { use } from 'react';
import AssetClientPage from './AssetPageClient';

interface AssetPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function AssetPage({ params }: AssetPageProps) {
  const { id } = use(params);
  return <AssetClientPage id={id} />;
}
