import { Toaster } from "sonner";
import ReactQueryProvider from "./components/tanstack-query.provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      {children}
      <Toaster position="top-right" />
    </ReactQueryProvider>
  );
}
