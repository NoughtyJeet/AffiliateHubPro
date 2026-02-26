import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AffiliateHub Pro - Honest Reviews & Best Deals",
  description: "Your trusted source for honest product reviews and the best Amazon deals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased min-h-screen flex flex-col`}>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: { borderRadius: '12px', background: '#1f2937', color: '#fff' },
              success: { style: { background: '#065f46', color: '#fff' } },
              error: { style: { background: '#7f1d1d', color: '#fff' } },
            }}
          />
          <Navbar />
          <main className="flex-grow pt-16">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
