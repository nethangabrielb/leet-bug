import PracticeLogClient from "./PracticeLogClient";
import ClientOnly from "@/components/ClientOnly";

export default function PracticeLogPage() {
  return (
    <ClientOnly>
      <PracticeLogClient />
    </ClientOnly>
  );
}
