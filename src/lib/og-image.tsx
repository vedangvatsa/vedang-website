import { ImageResponse } from 'next/og';
import fs from 'fs';
import path from 'path';

export const ogSize = { width: 1200, height: 630 };

export function loadOgAssets() {
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

  return { avatarBase64, interBold, interRegular };
}

export function generateOgImage(title: string, subtitle?: string) {
  const { avatarBase64, interBold, interRegular } = loadOgAssets();

  const titleFontSize = title.length > 50 ? 48 : title.length > 35 ? 56 : title.length > 25 ? 64 : 72;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          fontFamily: 'Inter',
          padding: '60px 70px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          color: '#f8fafc',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decoration */}
        <div style={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 500,
          height: 500,
          borderRadius: 250,
          background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
          display: 'flex',
        }} />
        <div style={{
          position: 'absolute',
          bottom: -80,
          left: -80,
          width: 400,
          height: 400,
          borderRadius: 200,
          background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)',
          display: 'flex',
        }} />

        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {avatarBase64 ? (
              <div style={{
                display: 'flex',
                width: 52,
                height: 52,
                borderRadius: 26,
                overflow: 'hidden',
                border: '2px solid rgba(255,255,255,0.15)',
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={avatarBase64} width={52} height={52} style={{ objectFit: 'cover' }} alt="Vedang Vatsa avatar" />
              </div>
            ) : null}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', display: 'flex' }}>Vedang Vatsa FRSA</div>
              <div style={{ fontSize: 14, color: '#94a3b8', display: 'flex' }}>veda.ng</div>
            </div>
          </div>
          <div style={{
            display: 'flex',
            fontSize: 13,
            fontWeight: 700,
            color: '#3b82f6',
            letterSpacing: '0.12em',
            textTransform: 'uppercase' as const,
            padding: '6px 16px',
            border: '1px solid rgba(59,130,246,0.3)',
            borderRadius: 20,
          }}>
            VEDA.NG
          </div>
        </div>

        {/* Title area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: '950px' }}>
          <div
            style={{
              fontSize: titleFontSize,
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              color: '#f8fafc',
              display: 'flex',
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div style={{
              fontSize: 24,
              color: '#94a3b8',
              lineHeight: 1.4,
              display: 'flex',
            }}>
              {subtitle}
            </div>
          )}
        </div>

        {/* Bottom accent line */}
        <div style={{
          display: 'flex',
          width: '100%',
          height: 4,
          borderRadius: 2,
          background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #3b82f6 100%)',
        }} />
      </div>
    ),
    {
      ...ogSize,
      ...(interBold && interRegular ? {
        fonts: [
          { name: 'Inter', data: interRegular, weight: 400 as const, style: 'normal' as const },
          { name: 'Inter', data: interBold, weight: 700 as const, style: 'normal' as const }
        ]
      } : {})
    }
  );
}
