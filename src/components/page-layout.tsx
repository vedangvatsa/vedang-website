import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  wide?: boolean;
  /** Vertically center page content between header and footer */
  center?: boolean;
}

export function PageLayout({ children, className = '', wide = false, center = false }: PageLayoutProps) {
  return (
    <div className={`flex min-h-screen flex-col bg-background text-foreground ${className}`}>
      <Header />
      <main id="main" className={`flex-grow ${center ? 'flex' : ''}`}>
        <div
          className={`${wide ? 'w-full mx-auto px-4 md:px-6' : 'content-width'}${
            center ? ' flex flex-1 flex-col items-center justify-center' : ''
          }`}
        >
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
