import SpacedRepetitionClient from "./SpacedRepetitionClient";
import ClientOnly from "@/components/ClientOnly";

export default function SpacedRepetitionPage() {
  return (
    <ClientOnly>
      <SpacedRepetitionClient />
    </ClientOnly>
  );
}
