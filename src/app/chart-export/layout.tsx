import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chart export (internal)',
  robots: { index: false, follow: false },
};

export default function ChartExportLayout({ children }: { children: React.ReactNode }) {
  return children;
}