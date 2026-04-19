import {
  getActiveRepetitions,
  getClearedRepetitions,
} from "@/actions/manageRepetition";
import { getAllProblemsWithPatterns } from "@/actions/getProblems";
import SpacedRepetitionClient from "./SpacedRepetitionClient";

export default async function SpacedRepetitionPage() {
  const [active, cleared, problems] = await Promise.all([
    getActiveRepetitions(),
    getClearedRepetitions(),
    getAllProblemsWithPatterns(),
  ]);

  return (
      <SpacedRepetitionClient
        active={active}
        cleared={cleared}
        problems={problems}
      />
  );
}
