"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/tailwind-merge";

export type ChartPoint = {
  label: string;
  value: number;
};

type BarChartProps = {
  data: ChartPoint[];
  barClass?: string;
};

function BarChart({ data, barClass = "bg-primary" }: BarChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-44 items-center justify-center text-sm text-muted-foreground">
        No data yet
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const labelStep = data.length > 10 ? Math.ceil(data.length / 6) : 1;

  return (
    <div className="space-y-2">
      <div className="flex h-44 items-end gap-0.5">
        {data.map((d, i) => {
          const pct = (d.value / maxValue) * 100;
          return (
            <div
              key={i}
              className="group relative flex flex-1 cursor-default flex-col items-center justify-end"
            >
              {/* Hover tooltip */}
              <div
                className={cn(
                  "pointer-events-none absolute bottom-full z-10 mb-2 hidden",
                  "rounded-xl border border-border bg-card px-2.5 py-1.5 shadow-card",
                  "text-xs group-hover:block",
                  "whitespace-nowrap",
                )}
              >
                <div className="font-extrabold text-foreground">
                  ${d.value.toFixed(2)}
                </div>
                <div className="text-muted-foreground">{d.label}</div>
              </div>
              {/* Bar */}
              <div
                className={cn(
                  "w-full rounded-t-sm transition-all duration-300",
                  barClass,
                  "opacity-70 group-hover:opacity-100",
                )}
                style={{ height: `${Math.max(pct, 1)}%` }}
              />
            </div>
          );
        })}
      </div>

      {/* X-axis labels */}
      <div className="flex">
        {data.map((d, i) => (
          <div key={i} className="flex-1 text-center">
            <span
              className={cn(
                "text-[9px] text-muted-foreground",
                i % labelStep !== 0 && i !== data.length - 1 && "invisible",
              )}
            >
              {d.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

type RevenueChartProps = {
  title: string;
  data: ChartPoint[];
  isLoading?: boolean;
  barClass?: string;
  totalLabel?: string;
};

export function RevenueChart({
  title,
  data,
  isLoading,
  barClass,
  totalLabel = "Total",
}: RevenueChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {title}
          </CardTitle>
          {!isLoading && (
            <div className="text-end">
              <div className="text-xl font-extrabold text-foreground">
                ${total.toFixed(2)}
              </div>
              <div className="text-[10px] text-muted-foreground">{totalLabel}</div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-44 w-full rounded-xl" />
        ) : (
          <BarChart data={data} barClass={barClass} />
        )}
      </CardContent>
    </Card>
  );
}
