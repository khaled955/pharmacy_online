import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import ReactQueryProvider from "./components/tanstack-query.provider";
import NextAuthProvider from "./components/next-auth.provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <NextAuthProvider>
        <ReactQueryProvider>
          {children}
          <Toaster position="top-right" />
        </ReactQueryProvider>
      </NextAuthProvider>
    </ThemeProvider>
  );
}
