import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  wide?: boolean;
}

export function PageLayout({ children, className = '', wide = false }: PageLayoutProps) {
  return (
    <div className={`flex min-h-screen flex-col bg-background text-foreground ${className}`}>
      <Header />
      <main className="flex-grow">
        <div className={wide ? 'w-full mx-auto px-4 md:px-6' : 'w-full md:w-[61.8%] mx-auto px-4 md:px-6'}>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
