import { ImageResponse } from 'next/og';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

export const alt = 'Vedang Vatsa';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  
  let avatarBase64 = '';
  try {
    const iconData = fs.readFileSync(path.join(process.cwd(), 'public/images/icon.png'));
    avatarBase64 = `data:image/png;base64,${iconData.toString('base64')}`;
  } catch (e) {
    console.error('Failed to load avatar', e);
  }

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
          justifyContent: 'center',
          backgroundColor: '#ffffff',
          color: '#111111',
          fontFamily: 'Inter',
          padding: '80px',
        }}
      >
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          justifyContent: 'center',
          gap: 40
        }}>
           <div style={{
              display: 'flex',
              width: 320, 
              height: 320, 
              borderRadius: 160,
              overflow: 'hidden',
              backgroundColor: '#f3f4f6',
              border: '8px solid #f3f4f6',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
           }}>
              {avatarBase64 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarBase64} width={320} height={320} style={{ objectFit: 'cover' }} alt="Avatar" />
              ) : (
                <div style={{ fontSize: 96, fontWeight: 700, color: '#9ca3af' }}>VV</div>
              )}
           </div>
           
           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
             <div style={{ fontSize: 100, fontWeight: 700, color: '#111111', letterSpacing: '-0.02em', display: 'flex' }}>
               Vedang Vatsa FRSA
             </div>
             <div style={{ fontSize: 48, color: '#6b7280', textAlign: 'center', fontWeight: 400, display: 'flex' }}>
               @vedangvatsa
             </div>
           </div>
        </div>
      </div>
    ),
    {
      ...size,
      ...(interBold && interRegular ? {
        fonts: [
          { name: 'Inter', data: interRegular, weight: 400, style: 'normal' },
          { name: 'Inter', data: interBold, weight: 700, style: 'normal' }
        ]
      } : {})
    }
  );
}
