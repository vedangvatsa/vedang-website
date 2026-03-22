import { ImageResponse } from 'next/og';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export const runtime = 'nodejs';

export const alt = 'Essay by Vedang Vatsa';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const essaysDirectory = path.join(process.cwd(), 'src', 'content', 'essays');
  const filePath = path.join(essaysDirectory, `${slug}.mdx`);
  
  let title = 'Vedang Vatsa';

  if (fs.existsSync(filePath)) {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);
    title = data.title || title;
  }

  // Load avatar image as base64
  let avatarBase64 = '';
  try {
    const iconData = fs.readFileSync(path.join(process.cwd(), 'public/images/icon.png'));
    avatarBase64 = `data:image/png;base64,${iconData.toString('base64')}`;
  } catch (e) {
    console.error('Failed to load avatar', e);
  }

  // Load fonts
  let interBold, interRegular;
  try {
     interBold = fs.readFileSync(path.join(process.cwd(), 'public/fonts/Inter-Bold.ttf'));
     interRegular = fs.readFileSync(path.join(process.cwd(), 'public/fonts/Inter-Regular.ttf'));
  } catch (e) {
     console.error('Failed to load fonts', e);
  }

    return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#ffffff',
          color: '#111111',
          fontFamily: 'Inter',
          padding: '80px',
        }}
      >
        <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#3b82f6', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'flex' }}>
            VEDA.NG
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              color: '#111111',
              textAlign: 'center',
              display: 'flex',
              maxWidth: '1000px',
            }}
          >
            {title}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
           <div style={{
              display: 'flex',
              width: 120, 
              height: 120, 
              borderRadius: 60,
              overflow: 'hidden',
              backgroundColor: '#f3f4f6',
              border: '4px solid #f3f4f6',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
           }}>
              {avatarBase64 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarBase64} width={120} height={120} style={{ objectFit: 'cover' }} alt="Avatar" />
              ) : (
                <div style={{ fontSize: 40, fontWeight: 700, color: '#9ca3af' }}>VV</div>
              )}
           </div>
           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
             <div style={{ fontSize: 36, fontWeight: 700, color: '#111111', display: 'flex' }}>Vedang Vatsa FRSA</div>
             <div style={{ fontSize: 24, color: '#6b7280', display: 'flex' }}>@vedangvatsa</div>
           </div>
        </div>
      </div>
    ),
    {
      ...size,
      ...(interBold && interRegular ? {
        fonts: [
          {
            name: 'Inter',
            data: interRegular,
            weight: 400,
            style: 'normal',
          },
          {
            name: 'Inter',
            data: interBold,
            weight: 700,
            style: 'normal',
          }
        ]
      } : {})
    }
  );
}
