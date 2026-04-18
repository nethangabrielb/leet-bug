import { getPracticeLogs, getAllProblemsWithPatterns } from "@/actions/getProblems";
import AppLayout from "@/components/AppLayout";
import PracticeLogClient from "./PracticeLogClient";

export default async function PracticeLogPage() {
  const [logs, problems] = await Promise.all([
    getPracticeLogs(),
    getAllProblemsWithPatterns(),
  ]);

  return (
    <AppLayout>
      <PracticeLogClient logs={logs} problems={problems} />
    </AppLayout>
  );
}
