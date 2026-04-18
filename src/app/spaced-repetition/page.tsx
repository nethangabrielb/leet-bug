import {
  getActiveRepetitions,
  getClearedRepetitions,
} from "@/actions/manageRepetition";
import { getAllProblemsWithPatterns } from "@/actions/getProblems";
import AppLayout from "@/components/AppLayout";
import SpacedRepetitionClient from "./SpacedRepetitionClient";

export default async function SpacedRepetitionPage() {
  const [active, cleared, problems] = await Promise.all([
    getActiveRepetitions(),
    getClearedRepetitions(),
    getAllProblemsWithPatterns(),
  ]);

  return (
    <AppLayout>
      <SpacedRepetitionClient
        active={active}
        cleared={cleared}
        problems={problems}
      />
    </AppLayout>
  );
}
