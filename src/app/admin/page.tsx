import AdminDashboard from './AdminDashboard';

export const metadata = {
  title: 'Social Media Schedule | Admin',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminDashboard />;
}
