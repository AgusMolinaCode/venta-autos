import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthProvider } from "@/components/auth/auth-provider";
import { UserMenu } from "@/components/auth/user-menu";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Improve font loading performance
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap", // Improve font loading performance
  preload: false, // Only preload primary font
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthProvider>
              <div className="min-h-screen bg-gray-50">
                {/* Header with Authentication */}
                <header className="bg-white shadow-sm border-b">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">Ventas-Autos</h1>
                        <p className="text-sm text-gray-600">Compra tu auto de forma rápida y segura</p>
                      </div>
                      <UserMenu />
                    </div>
                  </div>
                </header>

                {/* Main Content */}
                <main>
                  {children}
                </main>
              </div>
              <Toaster richColors />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
