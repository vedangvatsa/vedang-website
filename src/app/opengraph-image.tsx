import { ImageResponse } from 'next/og';
import { loadOgAssets, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'Vedang Vatsa - Personal Website, Essays & Research Hub';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  const { avatarBase64, interBold, interRegular } = loadOgAssets();

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
          fontFamily: 'Inter',
          backgroundColor: '#ffffff',
          padding: '60px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 24,
          }}
        >
          {/* Circular photo */}
          <div
            style={{
              width: 280,
              height: 280,
              borderRadius: 140,
              border: '6px solid #f1f5f9',
              boxShadow: '0 20px 30px -10px rgba(0, 0, 0, 0.15)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#ffffff',
            }}
          >
            {avatarBase64 ? (
              <img src={avatarBase64} width={280} height={280} style={{ objectFit: 'cover' }} alt="Vedang Vatsa" />
            ) : (
              <div style={{ fontSize: 96, fontWeight: 700, color: '#9ca3af' }}>VV</div>
            )}
          </div>

          {/* Typography */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <div
              style={{
                fontSize: 76,
                fontWeight: 700,
                color: '#000000',
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                display: 'flex',
              }}
            >
              Vedang Vatsa FRSA
            </div>
            <div
              style={{
                fontSize: 34,
                color: '#333333',
                fontWeight: 400,
                display: 'flex',
              }}
            >
              Founder & Researcher
            </div>
            <div
              style={{
                fontSize: 26,
                color: '#777777',
                fontWeight: 400,
                display: 'flex',
              }}
            >
              veda.ng
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
      ...(interBold && interRegular
        ? {
            fonts: [
              { name: 'Inter', data: interRegular, weight: 400 as const, style: 'normal' as const },
              { name: 'Inter', data: interBold, weight: 700 as const, style: 'normal' as const },
            ],
          }
        : {}),
    }
  );
}
