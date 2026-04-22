"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import { Bell, Package, RefreshCw, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/hooks/notifications/use-notifications";
import type { NotificationRow } from "@/lib/services/notifications/get-notifications";

// ─── Time format ──────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ─── Single notification item ─────────────────────────────────────────────────

type ItemProps = {
  notification: NotificationRow;
  onRead: (id: string) => void;
};

function NotificationItem({ notification, onRead }: ItemProps) {
  return (
    <button
      type="button"
      onClick={() => !notification.is_read && onRead(notification.id)}
      className={cn(
        "w-full text-start px-4 py-3.5 transition-colors duration-150",
        "border-b border-border last:border-0",
        "hover:bg-muted/50",
        !notification.is_read && "bg-primary/5",
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
            notification.is_read
              ? "bg-muted text-muted-foreground"
              : "bg-primary/10 text-primary",
          )}
        >
          <Package className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p
              className={cn(
                "text-sm leading-tight",
                notification.is_read
                  ? "font-medium text-muted-foreground"
                  : "font-semibold text-foreground",
              )}
            >
              {notification.title}
            </p>
            {!notification.is_read && (
              <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
            )}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
            {notification.message}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground/70">
            {timeAgo(notification.created_at)}
          </p>
        </div>
      </div>
    </button>
  );
}

// ─── Bell ─────────────────────────────────────────────────────────────────────

export function NotificationsBell() {
  // State
  const [open, setOpen] = useState(false);

  // Ref
  const containerRef = useRef<HTMLDivElement>(null);

  // Hooks
  const { data: notifications = [], isLoading, refetch } = useNotifications();
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: markAll, isPending: markingAll } = useMarkAllNotificationsRead();

  // Variables
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // Functions
  const handleMarkAll = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (unreadCount > 0) markAll();
    },
    [markAll, unreadCount],
  );

  // Effects
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      {/* Bell trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        className={cn(
          "relative flex h-9 w-9 items-center justify-center rounded-xl",
          "text-muted-foreground transition-colors duration-150",
          "hover:bg-muted hover:text-foreground",
          open && "bg-muted text-foreground",
        )}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span
            className={cn(
              "absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center",
              "rounded-full bg-primary px-1 text-[10px] font-bold text-white",
            )}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className={cn(
            "absolute end-0 top-11 z-50",
            "w-80 overflow-hidden rounded-2xl",
            "border border-border bg-card shadow-lg",
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
              {unreadCount > 0 && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => refetch()}
                aria-label="Refresh notifications"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAll}
                  disabled={markingAll}
                  aria-label="Mark all as read"
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <Bell className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <NotificationItem key={n.id} notification={n} onRead={markRead} />
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-border px-4 py-2.5 text-center">
              <p className="text-[11px] text-muted-foreground">
                Showing {notifications.length} latest notifications • Auto-refreshes every 30s
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
