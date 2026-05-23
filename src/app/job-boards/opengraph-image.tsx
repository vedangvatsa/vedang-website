import { ImageResponse } from 'next/og';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

export const alt = 'Job Board Comparison Dashboard';
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
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#09090B', // Zinc-950 elegant deep dark mode
          color: '#FFFFFF',
          fontFamily: 'Inter',
          padding: '80px 100px',
          position: 'relative',
        }}
      >
        {/* Subtle decorative glowing background light source */}
        <div
          style={{
            position: 'absolute',
            top: -200,
            right: -200,
            width: 600,
            height: 600,
            borderRadius: 300,
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(0, 0, 0, 0) 70%)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -200,
            left: -200,
            width: 600,
            height: 600,
            borderRadius: 300,
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(0, 0, 0, 0) 70%)',
            display: 'flex',
          }}
        />

        {/* Top Section: Branding & Tags */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: '#6366F1', // Brand violet/indigo accent
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                display: 'flex',
              }}
            >
              DATABASE AUDIT & ANALYTICS
            </span>
          </div>

          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              marginTop: 8,
              display: 'flex',
            }}
          >
            Job Board Comparison
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 400,
              color: '#A1A1AA', // Zinc-400
              marginTop: 4,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span style={{ display: 'flex' }}>Hashtag Web3</span>
            <span style={{ color: '#F43F5E', fontWeight: 600, marginLeft: 8, marginRight: 8, display: 'flex' }}>vs</span>
            <span style={{ display: 'flex' }}>CV in Bio</span>
          </div>
        </div>

        {/* Middle Section: Key Metrics */}
        <div style={{ display: 'flex', gap: 32, marginTop: 40 }}>
          {/* Metric 1 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '24px 40px',
              flex: 1,
            }}
          >
            <span style={{ fontSize: 44, fontWeight: 700, color: '#10B981', letterSpacing: '-0.02em' }}>
              48,000+
            </span>
            <span style={{ fontSize: 14, color: '#71717A', marginTop: 4, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Active Listings
            </span>
          </div>

          {/* Metric 2 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '24px 40px',
              flex: 1,
            }}
          >
            <span style={{ fontSize: 44, fontWeight: 700, color: '#6366F1', letterSpacing: '-0.02em' }}>
              2,200+
            </span>
            <span style={{ fontSize: 14, color: '#71717A', marginTop: 4, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Hiring Companies
            </span>
          </div>

          {/* Metric 3 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '24px 40px',
              flex: 1,
            }}
          >
            <span style={{ fontSize: 44, fontWeight: 700, color: '#F59E0B', letterSpacing: '-0.02em' }}>
              97,000+
            </span>
            <span style={{ fontSize: 14, color: '#71717A', marginTop: 4, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Combined Reach
            </span>
          </div>
        </div>

        {/* Bottom Section: Site Domain Info */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '24px',
            marginTop: '32px',
          }}
        >
          <span style={{ fontSize: 16, color: '#52525B', fontWeight: 500 }}>
            Powered by PostHog & Google Analytics
          </span>
          <span style={{ fontSize: 18, color: '#A1A1AA', fontWeight: 600, letterSpacing: '-0.01em' }}>
            veda.ng/job-boards
          </span>
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
