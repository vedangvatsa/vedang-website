'use client';

import { useRef, useState } from 'react';
import { Download, Linkedin } from 'lucide-react';

interface CertificateGeneratorProps {
  studentName: string;
  courseTitle: string;
  courseId: string;
}

export function CertificateGenerator({ studentName, courseTitle, courseId }: CertificateGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [generated, setGenerated] = useState(false);

  const generateCertificate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1200x630 for OG image compatibility
    canvas.width = 1200;
    canvas.height = 630;

    // Background gradient (dark, premium)
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 630);
    bgGrad.addColorStop(0, '#0a0a0a');
    bgGrad.addColorStop(0.5, '#111827');
    bgGrad.addColorStop(1, '#0a0a0a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 630);

    // Subtle border
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(24, 24, 1152, 582);

    // Inner decorative border
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.15)';
    ctx.lineWidth = 1;
    ctx.strokeRect(32, 32, 1136, 566);

    // Top accent line
    const accentGrad = ctx.createLinearGradient(100, 0, 1100, 0);
    accentGrad.addColorStop(0, 'rgba(212, 175, 55, 0)');
    accentGrad.addColorStop(0.3, 'rgba(212, 175, 55, 0.8)');
    accentGrad.addColorStop(0.7, 'rgba(212, 175, 55, 0.8)');
    accentGrad.addColorStop(1, 'rgba(212, 175, 55, 0)');
    ctx.fillStyle = accentGrad;
    ctx.fillRect(100, 60, 1000, 2);

    // "CERTIFICATE OF COMPLETION" label
    ctx.fillStyle = 'rgba(212, 175, 55, 0.7)';
    ctx.font = '500 13px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '6px';
    ctx.fillText('CERTIFICATE OF COMPLETION', 600, 110);

    // Student name (large, gold)
    ctx.fillStyle = '#d4af37';
    ctx.font = '700 48px Inter, system-ui, sans-serif';
    ctx.letterSpacing = '0px';
    
    // Truncate name if too long
    const displayName = studentName.length > 30 ? studentName.slice(0, 28) + '...' : studentName;
    ctx.fillText(displayName, 600, 210);

    // Decorative line under name
    const nameWidth = ctx.measureText(displayName).width;
    const lineGrad = ctx.createLinearGradient(600 - nameWidth/2 - 20, 0, 600 + nameWidth/2 + 20, 0);
    lineGrad.addColorStop(0, 'rgba(212, 175, 55, 0)');
    lineGrad.addColorStop(0.2, 'rgba(212, 175, 55, 0.4)');
    lineGrad.addColorStop(0.8, 'rgba(212, 175, 55, 0.4)');
    lineGrad.addColorStop(1, 'rgba(212, 175, 55, 0)');
    ctx.fillStyle = lineGrad;
    ctx.fillRect(600 - nameWidth/2 - 20, 225, nameWidth + 40, 1);

    // "has successfully completed" text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '400 16px Inter, system-ui, sans-serif';
    ctx.fillText('has successfully completed', 600, 275);

    // Course title
    ctx.fillStyle = '#ffffff';
    ctx.font = '600 32px Inter, system-ui, sans-serif';
    ctx.fillText(courseTitle, 600, 330);

    // "and passed the final examination" text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '400 14px Inter, system-ui, sans-serif';
    ctx.fillText('and passed the final examination', 600, 370);

    // Date
    const date = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', month: 'long', day: 'numeric' 
    });
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '400 14px Inter, system-ui, sans-serif';
    ctx.fillText(date, 600, 430);

    // Certificate ID
    const certId = generateCertId(studentName, courseId);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.font = '400 11px monospace';
    ctx.fillText(`ID: ${certId}`, 600, 460);

    // Bottom accent line
    ctx.fillStyle = accentGrad;
    ctx.fillRect(100, 500, 1000, 2);

    // Issuer
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '400 13px Inter, system-ui, sans-serif';
    ctx.fillText('Issued by Vedang Vatsa', 400, 545);

    // URL
    ctx.fillStyle = 'rgba(212, 175, 55, 0.5)';
    ctx.font = '400 13px Inter, system-ui, sans-serif';
    ctx.fillText('veda.ng', 800, 545);

    // Convert to image
    const url = canvas.toDataURL('image/png');
    setImageUrl(url);
    setGenerated(true);
  };

  // Generate on first render
  if (!generated) {
    setTimeout(generateCertificate, 100);
  }

  const downloadCertificate = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.download = `${courseId}-certificate-${studentName.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = imageUrl;
    link.click();
  };

  const shareToLinkedIn = () => {
    const text = encodeURIComponent(
      `I just completed ${courseTitle} on veda.ng and passed the final exam! 🎓\n\nhttps://veda.ng/${courseId}`
    );
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=https://veda.ng/${courseId}&text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <canvas ref={canvasRef} className="hidden" />
      
      {imageUrl && (
        <>
          <div className="rounded-lg overflow-hidden border border-muted shadow-2xl">
            <img src={imageUrl} alt="Course completion certificate" className="w-full" />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={downloadCertificate}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              <Download className="h-4 w-4" />
              Download Certificate
            </button>
            <button
              onClick={shareToLinkedIn}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-[#0077B5]/30 text-[#0077B5] font-medium hover:bg-[#0077B5]/10 transition-colors"
            >
              <Linkedin className="h-4 w-4" />
              Share on LinkedIn
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function generateCertId(name: string, courseId: string): string {
  const input = `${name.toLowerCase().trim()}-${courseId}-${new Date().toISOString().slice(0, 10)}`;
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `VNG-${Math.abs(hash).toString(36).toUpperCase().slice(0, 8)}`;
}
