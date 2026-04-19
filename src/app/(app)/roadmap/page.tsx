import { getProblems } from "@/actions/getProblems";
import RoadmapClient from "./RoadmapClient";

export default async function RoadmapPage() {
  const problems = await getProblems();

  return (
      <RoadmapClient problems={problems} />
  );
}
