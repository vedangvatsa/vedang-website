import { ImageResponse } from 'next/og';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

export const alt = 'English to LinkedIn Translator';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  const inputText = 'I got fired last week';
  const outputText = "Thrilled to announce I've been given the incredible gift of time to explore new opportunities!";

  let interBold, interRegular, interSemiBold;
  try {
     interBold = fs.readFileSync(path.join(process.cwd(), 'public/fonts/Inter-Bold.ttf'));
     interRegular = fs.readFileSync(path.join(process.cwd(), 'public/fonts/Inter-Regular.ttf'));
     // Will just reuse bold for semibold
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
          justifyContent: 'flex-start',
          backgroundColor: '#ffffff',
          fontFamily: 'Inter',
          padding: '40px 60px',
        }}
      >
        {/* Title */}
        <div style={{ fontSize: 36, fontWeight: 700, color: '#111111', marginBottom: 24 }}>
          English to LinkedIn Translator
        </div>

        {/* Card */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            border: '2px solid #e0e0e0',
            borderRadius: 12,
            overflow: 'hidden',
            flex: 1,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          }}
        >
          {/* Left panel */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '50%',
              padding: '20px 24px',
              borderRight: '2px solid #e0e0e0',
            }}
          >
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: '#3b82f6',
                marginBottom: 4,
                borderBottom: '2px solid #3b82f6',
                paddingBottom: 8,
                display: 'flex',
              }}
            >
              Human Language
            </div>
            <div
              style={{
                fontSize: 24,
                color: '#222222',
                marginTop: 24,
                lineHeight: 1.5,
                display: 'flex',
              }}
            >
              {inputText}
            </div>
          </div>

          {/* Right panel */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '50%',
              padding: '20px 24px',
              backgroundColor: '#f8f8f8',
            }}
          >
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: '#3b82f6',
                marginBottom: 4,
                borderBottom: '2px solid #3b82f6',
                paddingBottom: 8,
                display: 'flex',
              }}
            >
              LinkedIn Language
            </div>
            <div
              style={{
                fontSize: 24,
                color: '#222222',
                marginTop: 24,
                lineHeight: 1.5,
                display: 'flex',
              }}
            >
              {outputText}
            </div>
          </div>
        </div>

        {/* Branding */}
        <div style={{ fontSize: 24, fontWeight: 400, color: '#888888', marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          generated on <span style={{ fontWeight: 700, fontSize: 28, color: '#3b82f6', textDecoration: 'underline' }}>veda.ng/lit</span>
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
