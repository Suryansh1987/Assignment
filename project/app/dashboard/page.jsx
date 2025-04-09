// app/dashboard/page.js

import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth';
import dynamic from 'next/dynamic';

const DashboardClient = dynamic(() => import('/components/DashboardClient'), { ssr: false });

export default async function DashboardPage() {
  const user = await getUser();

  if (!user) {
    redirect('/signin');
  }

  return <DashboardClient />;
}
