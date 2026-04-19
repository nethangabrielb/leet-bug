import RoadmapClient from "./RoadmapClient";
import ClientOnly from "@/components/ClientOnly";

export default function RoadmapPage() {
  return (
    <ClientOnly>
      <RoadmapClient />
    </ClientOnly>
  );
}
