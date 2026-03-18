import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const inputText = searchParams.get('input') || 'I got fired last week';
  const outputText = searchParams.get('output') || 'Thrilled to announce I\'ve been given the incredible gift of time to explore new opportunities!';

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
          fontFamily: 'Inter, system-ui, sans-serif',
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
            border: '1.5px solid #e0e0e0',
            borderRadius: 12,
            overflow: 'hidden',
            flex: 1,
          }}
        >
          {/* Left panel */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '50%',
              padding: '20px 24px',
              borderRight: '1.5px solid #e0e0e0',
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: '#3b82f6',
                marginBottom: 4,
                borderBottom: '2px solid #3b82f6',
                paddingBottom: 8,
                display: 'flex',
                width: 'fit-content',
              }}
            >
              Human Language
            </div>
            <div
              style={{
                fontSize: 20,
                color: '#222222',
                marginTop: 16,
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
                fontSize: 14,
                fontWeight: 600,
                color: '#3b82f6',
                marginBottom: 4,
                borderBottom: '2px solid #3b82f6',
                paddingBottom: 8,
                display: 'flex',
                width: 'fit-content',
              }}
            >
              LinkedIn Language
            </div>
            <div
              style={{
                fontSize: 20,
                color: '#222222',
                marginTop: 16,
                lineHeight: 1.5,
                display: 'flex',
              }}
            >
              {outputText}
            </div>
          </div>
        </div>

        {/* Branding */}
        <div style={{ fontSize: 24, fontWeight: 500, color: '#888888', marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          generated on <span style={{ fontWeight: 700, fontSize: 28, color: '#3b82f6', textDecoration: 'underline' }}>veda.ng/lit</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
