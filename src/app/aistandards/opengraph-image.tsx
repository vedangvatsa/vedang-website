import { ImageResponse } from 'next/og';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const alt = 'AI Discovery Standards';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
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
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: 'Inter',
          padding: '60px 70px',
          background: '#f8fafc',
          color: '#0f172a',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Left accent bar */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 8,
          height: '100%',
          background: '#4f46e5',
          display: 'flex',
        }} />

        {/* Left side: title + subtitle + url */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, maxWidth: '620px' }}>
          <div style={{
            fontSize: 82,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            color: '#0f172a',
            display: 'flex',
          }}>
            AI Discovery
          </div>
          <div style={{
            fontSize: 82,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            color: '#6366f1',
            display: 'flex',
          }}>
            Standards
          </div>
          <div style={{
            fontSize: 30,
            color: '#64748b',
            lineHeight: 1.4,
            display: 'flex',
            marginTop: 24,
          }}>
            Make your site readable to AI.
          </div>
          <div style={{
            fontSize: 26,
            fontWeight: 700,
            color: '#6366f1',
            display: 'flex',
            marginTop: 40,
          }}>
            github.com/vedangvatsa/aistandards
          </div>
        </div>

        {/* Right side: terminal card */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          width: 440,
          height: 400,
          borderRadius: 16,
          background: '#f1f5f9',
          border: '2px solid #cbd5e1',
          padding: '24px 28px',
        }}>
          {/* Traffic lights */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
            <div style={{ width: 16, height: 16, borderRadius: 8, background: '#ff5f56', display: 'flex' }} />
            <div style={{ width: 16, height: 16, borderRadius: 8, background: '#ffbd2e', display: 'flex' }} />
            <div style={{ width: 16, height: 16, borderRadius: 8, background: '#27c93f', display: 'flex' }} />
          </div>

          {/* Code lines */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ fontSize: 26, color: '#6366f1', display: 'flex' }}>
              $ npx aistandards
            </div>
            <div style={{ fontSize: 26, color: '#16a34a', display: 'flex' }}>
              robots.txt   done
            </div>
            <div style={{ fontSize: 26, color: '#16a34a', display: 'flex' }}>
              llms.txt     done
            </div>
            <div style={{ fontSize: 26, color: '#16a34a', display: 'flex' }}>
              sitemap.xml  done
            </div>
            <div style={{ fontSize: 26, color: '#16a34a', display: 'flex' }}>
              JSON-LD      done
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      ...(interBold && interRegular ? {
        fonts: [
          { name: 'Inter', data: interRegular, weight: 400 as const, style: 'normal' as const },
          { name: 'Inter', data: interBold, weight: 700 as const, style: 'normal' as const }
        ]
      } : {})
    }
  );
}
