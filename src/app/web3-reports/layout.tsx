import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Web3 Reports & Research Data Archive | Vedang Vatsa',
  description: 'A comprehensive, searchable database of 18,000+ Web3 reports, white papers, institutional research, and regulatory frameworks published since 2023.',
};

export default function Web3ReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
