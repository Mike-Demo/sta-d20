import { createFileRoute } from "@tanstack/react-router";
import GuideProbability from "@/pages/GuideProbability";

export const Route = createFileRoute("/guide/probability")({
  component: GuideProbability,
});
