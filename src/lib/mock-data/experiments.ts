import type { Experiment } from "@/types";
import { experiments as experimentData } from "@/lib/mock-data/operations";

export const experimentSlugs: Record<string, string> = {
  exp_bundle: "bundle",
  exp_discount: "discount-10",
  exp_slot: "express-counter",
  exp_yarn: "yarn-price-drop",
};

export function experimentSlug(id: string): string {
  return experimentSlugs[id] ?? id.toLowerCase();
}

export function experimentHref(id: string): string {
  return `/experiments/${experimentSlug(id)}`;
}

export function findExperimentBySlug(slug: string): Experiment | null {
  return experimentData.find((experiment) => experimentSlug(experiment.id) === slug) ?? null;
}

export function filterExperiments(status?: Experiment["status"]): Experiment[] {
  if (!status) return [...experimentData];
  return experimentData.filter((experiment) => experiment.status === status);
}
