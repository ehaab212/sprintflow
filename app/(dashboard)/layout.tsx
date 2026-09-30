import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { getCurrentUser } from '@/lib/auth/session';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <Sidebar user={user} />
      <div className="flex flex-col sm:pl-64">
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

