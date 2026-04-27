import AuthBackgroundDecoration from "./auth-background-decoration";
import AuthBodyText from "./auth-body-text";
import AuthBrandHeader from "./auth-brand-header";
import AuthFeatureList from "./auth-feature-list";
import AuthReservedRights from "./auth-reserved-rights";

export default function AuthBrandPanel() {
  return (
    // main container
    <aside
      className="relative hidden w-120 shrink-0 flex-col justify-between
        overflow-hidden bg-linear-to-br from-teal-700 via-teal-600 to-cyan-700
        px-12 py-14 lg:flex"
    >
      <AuthBackgroundDecoration />

      <AuthBrandHeader />

      <AuthBodyText />

      <AuthFeatureList />
      <AuthReservedRights />
    </aside>
  );
}
