import fs from 'fs';
import path from 'path';
import AdminDashboard from './AdminDashboard';

export const metadata = {
  title: 'Social Media Schedule | Admin',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const scriptsDir = path.join(process.cwd(), 'scripts');
  let files: string[] = [];
  try {
    files = fs.readdirSync(scriptsDir).filter((f) => f.endsWith('-posts.json'));
  } catch (err) {
    console.error('Error reading scripts dir', err);
  }

  const platforms: Record<string, any[]> = {};

  for (const file of files) {
    const platformName = file.replace('-posts.json', '');
    try {
      const data = JSON.parse(fs.readFileSync(path.join(scriptsDir, file), 'utf8'));
      const posts = Array.isArray(data) ? data : data.posts || [];
      platforms[platformName] = posts.map((p: any) => ({
        id: p.id || 'Unknown',
        text: p.text || '', // Removed truncation to allow editing
        posted: !!p.posted,
        scheduleDate: p.scheduleDate || '',
        scheduleTime: p.scheduleTime || '',
        postedAt: p.postedAt || null,
        error: p.error || null,
      }));
    } catch (e) {
      console.error(`Error reading ${file}`, e);
    }
  }

  return <AdminDashboard platforms={platforms} />;
}
