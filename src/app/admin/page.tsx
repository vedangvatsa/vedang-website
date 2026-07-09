import AdminDashboard from './AdminDashboard';

export const metadata = {
  title: 'Social Media Schedule | Admin',
  alternates: {
    canonical: '/admin',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminDashboard />;
}
