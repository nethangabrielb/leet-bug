import { getDashboardStats } from "@/actions/getDashboardStats";
import AppLayout from "@/components/AppLayout";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <AppLayout>
      <DashboardClient stats={stats} />
    </AppLayout>
  );
}
