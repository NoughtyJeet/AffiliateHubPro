import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";
import TechAssistant from "@/components/public/TechAssistant";
import SubscriptionPopup from "@/components/public/SubscriptionPopup";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://affiliatehub-pro.vercel.app'),
  title: "AffiliateHub Pro - Honest Reviews & Best Deals",
  description: "Your trusted source for honest product reviews and the best Amazon deals.",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "AffiliateHub Pro - Honest Reviews & Best Deals",
    description: "Your trusted source for honest product reviews and the best Amazon deals.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AffiliateHub Pro - Honest Reviews & Best Deals",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased min-h-screen flex flex-col transition-colors duration-300`}>
        <ThemeProvider>
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
            <TechAssistant />
            <SubscriptionPopup />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
