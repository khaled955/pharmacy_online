import { AUTH_FEATURES } from "@/lib/constants/auth";

export default function AuthFeatureList() {
  return (
    <ul className="space-y-3.5">
      {AUTH_FEATURES.map(({ icon: Icon, title, desc }) => (
        <li key={title} className="flex items-start gap-3">
          <span
            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center
              rounded-lg bg-white/15"
          >
            <Icon className="h-4 w-4 text-white" />
          </span>

          <div>
            <p className="text-sm font-semibold text-white">{title}</p>
            <p className="text-xs text-teal-200/80">{desc}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
