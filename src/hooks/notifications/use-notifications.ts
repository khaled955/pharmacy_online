"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { NotificationRow } from "@/lib/services/notifications/get-notifications";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const NOTIFICATIONS_KEYS = {
  ALL: ["notifications"] as const,
} as const;

// ─── Fetch helpers ────────────────────────────────────────────────────────────

async function fetchNotifications(): Promise<NotificationRow[]> {
  const res = await fetch("/api/notifications");
  if (!res.ok) return [];
  return res.json();
}

async function patchNotification(body: { id?: string; all?: boolean }): Promise<void> {
  await fetch("/api/notifications", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// ─── useNotifications ─────────────────────────────────────────────────────────

export function useNotifications() {
  return useQuery<NotificationRow[]>({
    queryKey: NOTIFICATIONS_KEYS.ALL,
    queryFn: fetchNotifications,
    refetchInterval: 30_000,
    staleTime: 10_000,
  });
}

// ─── useMarkNotificationRead ─────────────────────────────────────────────────

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => patchNotification({ id }),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_KEYS.ALL });
      const previous = queryClient.getQueryData<NotificationRow[]>(NOTIFICATIONS_KEYS.ALL);

      queryClient.setQueryData<NotificationRow[]>(NOTIFICATIONS_KEYS.ALL, (old = []) =>
        old.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
      );

      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(NOTIFICATIONS_KEYS.ALL, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEYS.ALL });
    },
  });
}

// ─── useMarkAllNotificationsRead ─────────────────────────────────────────────

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => patchNotification({ all: true }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_KEYS.ALL });
      const previous = queryClient.getQueryData<NotificationRow[]>(NOTIFICATIONS_KEYS.ALL);

      queryClient.setQueryData<NotificationRow[]>(NOTIFICATIONS_KEYS.ALL, (old = []) =>
        old.map((n) => ({ ...n, is_read: true })),
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(NOTIFICATIONS_KEYS.ALL, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEYS.ALL });
    },
  });
}
