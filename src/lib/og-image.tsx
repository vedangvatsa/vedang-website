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
          background: '#ffffff',
          color: '#111111',
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
          background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
          display: 'flex',
        }} />
        <div style={{
          position: 'absolute',
          bottom: -80,
          left: -80,
          width: 400,
          height: 400,
          borderRadius: 200,
          background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)',
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
                border: '2px solid rgba(0,0,0,0.08)',
              }}>
                <img src={avatarBase64} width={52} height={52} style={{ objectFit: 'cover' }} alt="Vedang Vatsa avatar" />
              </div>
            ) : null}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', display: 'flex' }}>Vedang Vatsa FRSA</div>
              <div style={{ fontSize: 14, color: '#64748b', display: 'flex' }}>veda.ng</div>
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
            border: '1px solid rgba(59,130,246,0.25)',
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
              color: '#111111',
              display: 'flex',
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div style={{
              fontSize: 24,
              color: '#64748b',
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

export interface TerminalLine {
  text: string;
  color: 'command' | 'success';
}

export function generateTerminalOgImage(
  titleLine1: string,
  titleLine2: string,
  url: string,
  terminalLines: TerminalLine[],
) {
  const { interBold, interRegular } = loadOgAssets();

  const colorMap = {
    command: '#6366f1',
    success: '#16a34a',
  };

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
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 8,
          height: '100%',
          background: '#4f46e5',
          display: 'flex',
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '580px' }}>
          <div style={{
            fontSize: 82,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            color: '#0f172a',
            display: 'flex',
          }}>
            {titleLine1}
          </div>
          <div style={{
            fontSize: 82,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            color: '#6366f1',
            display: 'flex',
          }}>
            {titleLine2}
          </div>
          <div style={{
            fontSize: 26,
            fontWeight: 700,
            color: '#6366f1',
            display: 'flex',
            marginTop: 60,
          }}>
            {url}
          </div>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          width: 440,
          height: 420,
          borderRadius: 16,
          background: '#f1f5f9',
          border: '2px solid #cbd5e1',
          padding: '24px 28px',
        }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
            <div style={{ width: 16, height: 16, borderRadius: 8, background: '#ff5f56', display: 'flex' }} />
            <div style={{ width: 16, height: 16, borderRadius: 8, background: '#ffbd2e', display: 'flex' }} />
            <div style={{ width: 16, height: 16, borderRadius: 8, background: '#27c93f', display: 'flex' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {terminalLines.map((line, i) => (
              <div key={i} style={{ fontSize: 24, color: colorMap[line.color], display: 'flex' }}>
                {line.text}
              </div>
            ))}
          </div>
        </div>
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
