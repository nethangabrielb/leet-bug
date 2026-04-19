import dynamic from "next/dynamic";

const SpacedRepetitionClient = dynamic(() => import("./SpacedRepetitionClient"), { ssr: false });

export default function SpacedRepetitionPage() {
  return <SpacedRepetitionClient />;
}
