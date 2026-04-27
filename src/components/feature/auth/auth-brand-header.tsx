import { ShieldCheck } from "lucide-react";

export default function AuthBrandHeader() {
  return (
    <div className="relative z-10 flex items-center gap-3">
      {/* left-check icon */}
      <div className="flex size-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
        <ShieldCheck className="size-6 text-white" />
      </div>
      {/* right-text */}
      <div>
        <p className="text-lg font-bold leading-none text-white">MedBox</p>
        <p className="text-xs text-teal-200">Licensed &amp; Trusted</p>
      </div>
    </div>
  );
}
