import { getProblems } from "@/actions/getProblems";
import AppLayout from "@/components/AppLayout";
import RoadmapClient from "./RoadmapClient";

export default async function RoadmapPage() {
  const problems = await getProblems();

  return (
    <AppLayout>
      <RoadmapClient problems={problems} />
    </AppLayout>
  );
}
