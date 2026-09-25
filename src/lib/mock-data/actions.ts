import type { Action } from "@/types";
import { actions as actionData } from "@/lib/mock-data/operations";

export type ActionFilter = "approval" | "running" | "completed" | "rejected";

export function filterActions(
  actions: Action[],
  filter: ActionFilter,
  effectiveStatus?: (action: Action) => Action["status"]
): Action[] {
  const statusFor = effectiveStatus ?? ((action) => action.status);
  const status: Action["status"] =
    filter === "approval"
      ? "WAITING_APPROVAL"
      : filter === "running"
        ? "RUNNING"
        : filter === "completed"
          ? "COMPLETED"
          : "REJECTED";
  return actions.filter((action) => statusFor(action) === status);
}

export function actionForOpportunity(opportunityId: string): Action | null {
  return actionData.find((action) => action.opportunityId === opportunityId) ?? null;
}

export function getActionById(id: string): Action | null {
  return actionData.find((action) => action.id === id) ?? null;
}
