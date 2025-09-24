import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthProvider } from "@/components/auth/auth-provider";
import { DashboardNavigationProvider } from "@/contexts/dashboard-navigation-context";
import "./globals.css";
import { Toaster } from "sonner";
import Header from "@/components/landing/header/Header";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Ventas-Autos",
  description: "Compra tu auto de forma rápida y segura",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.className} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthProvider>
              <DashboardNavigationProvider>
                <div className="min-h-screen dark:bg-neutral-900 bg-gray-50">
                  <Header />

                  {/* Main Content */}
                  <main className="flex-1">{children}</main>
                </div>
                <Toaster richColors />
              </DashboardNavigationProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
