import {
  Clock,
  CheckCircle2,
  RefreshCw,
  Truck,
  XCircle,
} from "lucide-react";
import type { OrderStatus } from "@/lib/types/order";

export const STATUS_MAP: Record<
  OrderStatus,
  {
    variant: "success" | "warning" | "info" | "destructive" | "muted";
    label: string;
    icon: React.ElementType;
  }
> = {
  pending:    { variant: "warning",     label: "Pending",    icon: Clock },
  confirmed:  { variant: "info",        label: "Confirmed",  icon: CheckCircle2 },
  processing: { variant: "info",        label: "Processing", icon: RefreshCw },
  shipped:    { variant: "warning",     label: "Shipped",    icon: Truck },
  delivered:  { variant: "success",     label: "Delivered",  icon: CheckCircle2 },
  cancelled:  { variant: "destructive", label: "Cancelled",  icon: XCircle },
  refunded:   { variant: "muted",       label: "Refunded",   icon: RefreshCw },
};
