import { ShieldCheck } from "lucide-react";

export default function AuthBrandHeader() {
  return (
    <div className="relative z-10 flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
        <ShieldCheck className="h-6 w-6 text-white" />
      </div>

      <div>
        <p className="text-lg font-bold leading-none text-white">MedBox</p>
        <p className="text-xs text-teal-200">Licensed &amp; Trusted</p>
      </div>
    </div>
  );
}
