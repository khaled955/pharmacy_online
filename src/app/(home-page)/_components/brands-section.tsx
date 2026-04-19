import { cn } from "@/lib/utils/tailwind-merge";

/* Static brand data — ready for dynamic props */
const brands = [
  { id: "gsk",      label: "GSK" },
  { id: "panadol",  label: "Panadol" },
  { id: "sanofi",   label: "Sanofi" },
  { id: "bioderma", label: "Bioderma" },
  { id: "mustela",  label: "Mustela" },
  { id: "centrum",  label: "Centrum" },
  { id: "bayer",    label: "Bayer" },
  { id: "voltaren", label: "Voltaren" },
];

export default function BrandsSection() {
  return (
    <section className="border-y border-border bg-card/60 py-6">
      <div className="section-container">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Featured Brands
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {brands.map(({ id, label }) => (
            <div
              key={id}
              className={cn(
                "flex h-11 min-w-24 items-center justify-center rounded-xl",
                "border border-border bg-card px-4",
                "text-sm font-bold text-muted-foreground",
                "transition-all duration-150",
                "hover:border-primary/30 hover:text-primary hover:shadow-sm",
                "cursor-pointer",
              )}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
