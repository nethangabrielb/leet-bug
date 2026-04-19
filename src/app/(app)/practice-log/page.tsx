import dynamic from "next/dynamic";

const PracticeLogClient = dynamic(() => import("./PracticeLogClient"), { ssr: false });

export default function PracticeLogPage() {
  return <PracticeLogClient />;
}
