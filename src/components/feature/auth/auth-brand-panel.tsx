import AuthBackgroundDecoration from "./auth-background-decoration";
import AuthBrandHeader from "./auth-brand-header";
import AuthFeatureList from "./auth-feature-list";

export default function AuthBrandPanel() {
  return (
    <aside
      className="relative hidden w-120 shrink-0 flex-col justify-between
        overflow-hidden bg-linear-to-br from-teal-700 via-teal-600 to-cyan-700
        px-12 py-14 lg:flex"
    >
      <AuthBackgroundDecoration />

      <AuthBrandHeader />

      <div className="relative z-10 space-y-5">
        <div>
          <h2 className="text-3xl font-extrabold leading-tight text-white">
            Your health,
            <br />
            <span className="text-cyan-200">delivered to your door.</span>
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-teal-100/80">
            MedBox connects you with a fully licensed online pharmacy — order
            prescription and over-the-counter medicines with complete peace of
            mind.
          </p>
        </div>

        <AuthFeatureList />
      </div>

      <p className="relative z-10 text-[11px] text-teal-300/60">
        © 2026 MedBox Pharmacy · All rights reserved
      </p>
    </aside>
  );
}
