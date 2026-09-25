"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Action, Notification } from "@/types";

export type ActionDecision = "APPROVED" | "REJECTED";

interface AppState {
  /** merchant decisions on actions: actionId → decision */
  decisions: Record<string, ActionDecision>;
  /** action ids the merchant has approved; drives "RUNNING" everywhere */
  running: string[];
  completed: string[];
  rejected: string[];
  readNotifications: string[];
  copilotOpen: boolean;
  lastActionAt: number | null;

  decide: (actionId: string, decision: ActionDecision) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  setCopilotOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      decisions: {},
      running: [],
      completed: [],
      rejected: [],
      readNotifications: [],
      copilotOpen: false,
      lastActionAt: null,

      decide: (actionId, decision) =>
        set((s) => {
          const decisions = { ...s.decisions, [actionId]: decision };
          const running = decision === "APPROVED"
            ? [...s.running.filter((id) => id !== actionId), actionId]
            : s.running.filter((id) => id !== actionId);
          const rejected = decision === "REJECTED"
            ? [...s.rejected.filter((id) => id !== actionId), actionId]
            : s.rejected.filter((id) => id !== actionId);
          return {
            decisions,
            running,
            rejected,
            lastActionAt: Date.now(),
          };
        }),

      markNotificationRead: (id) =>
        set((s) => ({
          readNotifications: s.readNotifications.includes(id)
            ? s.readNotifications
            : [...s.readNotifications, id],
        })),

      markAllNotificationsRead: () =>
        set(() => ({ readNotifications: ["__all__"] })),

      setCopilotOpen: (open) => set({ copilotOpen: open }),
      reset: () =>
        set({
          decisions: {},
          running: [],
          completed: [],
          rejected: [],
          readNotifications: [],
          lastActionAt: null,
        }),
    }),
    {
      name: "hisaab-app-state",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

/** Effective status of an action, combining mock data + merchant decisions */
export function effectiveStatus(action: Action, state: AppState) {
  if (state.decisions[action.id] === "APPROVED") return "RUNNING";
  if (state.decisions[action.id] === "REJECTED") return "REJECTED";
  return action.status;
}

export function selectNeedsApproval(actions: Action[], state: AppState): Action[] {
  return actions.filter((a) => effectiveStatus(a, state) === "WAITING_APPROVAL");
}

export function selectRunning(actions: Action[], state: AppState): Action[] {
  return actions.filter((a) => effectiveStatus(a, state) === "RUNNING");
}

export function selectCompleted(actions: Action[], state: AppState): Action[] {
  return actions.filter((a) => effectiveStatus(a, state) === "COMPLETED");
}

export function selectRejected(actions: Action[], state: AppState): Action[] {
  return actions.filter((a) => effectiveStatus(a, state) === "REJECTED");
}
