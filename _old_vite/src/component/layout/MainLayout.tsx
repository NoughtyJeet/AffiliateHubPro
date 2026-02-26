import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { AdBanner } from '../ads/AdBanner';

interface MainLayoutProps {
  children: ReactNode;
  showAds?: boolean;
}

export function MainLayout({ children, showAds = true }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {showAds && (
        <div className="mt-16">
          <AdBanner placement="homepage_top" className="bg-gray-50" />
        </div>
      )}
      {!showAds && <div className="h-16" />}
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
