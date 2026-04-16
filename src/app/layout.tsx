// layout.tsx
// Root layout - wraps the entire app with Redux Provider and global components

import type { Metadata } from "next";
import { Toaster } from "sonner";
import ReduxProvider from "@/components/providers/ReduxProvider";
import AuthProvider from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shipping System",
  description: "Shipping management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
<html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <ReduxProvider>
            <AuthProvider>
              {children}
              <Toaster position="top-center" richColors />
            </AuthProvider>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
