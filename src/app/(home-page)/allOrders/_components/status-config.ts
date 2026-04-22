import { Clock, CheckCircle2, XCircle } from "lucide-react";
import type { OrderStatus } from "@/lib/types/order";
import type { ComponentType } from "react";
import type { BadgeProps } from "@/components/ui/badge";

// Use exact Badge variant type
type BadgeVariant = BadgeProps["variant"];

type StatusConfig = {
  variant: BadgeVariant;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

export const STATUS_MAP: Record<OrderStatus, StatusConfig> = {
  pending: {
    variant: "warning",
    label: "Pending",
    icon: Clock,
  },
  confirmed: {
    variant: "info",
    label: "Confirmed",
    icon: CheckCircle2,
  },
  ready: {
    variant: "success",
    label: "Ready",
    icon: CheckCircle2,
  },
  cancelled: {
    variant: "destructive",
    label: "Cancelled",
    icon: XCircle,
  },
};
