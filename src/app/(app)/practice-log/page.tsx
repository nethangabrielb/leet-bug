import { getPracticeLogs, getAllProblemsWithPatterns } from "@/actions/getProblems";
import PracticeLogClient from "./PracticeLogClient";

export default async function PracticeLogPage() {
  const [logs, problems] = await Promise.all([
    getPracticeLogs(),
    getAllProblemsWithPatterns(),
  ]);

  return (
      <PracticeLogClient logs={logs} problems={problems} />
  );
}
