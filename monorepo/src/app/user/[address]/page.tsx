import { use } from 'react';
import UserClientPage from './UserClientPage';

interface UserPageProps {
  params: Promise<{
    address: string;
  }>;
}

export default function AssetPage({ params }: UserPageProps) {
  const { address } = use(params);
  return <UserClientPage address={address} />;
}
