import DashboardClient from "./DashboardClient";
import ClientOnly from "@/components/ClientOnly";

export default function DashboardPage() {
  return (
    <ClientOnly>
      <DashboardClient />
    </ClientOnly>
  );
}
