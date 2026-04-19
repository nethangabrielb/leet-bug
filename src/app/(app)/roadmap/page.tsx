import dynamic from "next/dynamic";

const RoadmapClient = dynamic(() => import("./RoadmapClient"), { ssr: false });

export default function RoadmapPage() {
  return <RoadmapClient />;
}
