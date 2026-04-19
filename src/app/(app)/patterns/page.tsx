import PatternsClient from "./PatternsClient";
import ClientOnly from "@/components/ClientOnly";

export default function PatternsPage() {
  return (
    <ClientOnly>
      <PatternsClient />
    </ClientOnly>
  );
}
