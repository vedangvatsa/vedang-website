'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { PageLayout } from '@/components/page-layout';
import { 
  Briefcase, 
  Users, 
  Zap, 
  ArrowUpRight, 
  GraduationCap,
  MessageSquare,
  Globe
} from 'lucide-react';

// Dynamic import for the entire charting section to prevent HMR and SSR factory errors cleanly
const DashboardCharts = dynamic(
  () => import('@/components/dashboard-charts'),
  { ssr: false }
);

// Inline SVGs for brand logos
const LinkedInIcon = () => (
  <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-[#0A66C2] text-white flex-shrink-0">
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  </span>
);

const TelegramIcon = () => (
  <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-[#229ED9] text-white flex-shrink-0">
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-1-.65-.35-1 .22-1.62.15-.15 2.7-2.46 2.75-2.68.01-.03.01-.14-.06-.2-.07-.06-.17-.04-.25-.02-.11.02-1.87 1.19-5.29 3.5-.5.35-.96.52-1.37.51-.45-.01-1.32-.26-1.97-.47-.8-.26-1.43-.4-1.38-.85.03-.23.35-.47.96-.71 3.76-1.64 6.27-2.72 7.54-3.25 3.58-1.48 4.32-1.74 4.81-1.75.11 0 .35.03.5.16.13.11.17.26.19.37 0 .07.01.22 0 .27z" />
    </svg>
  </span>
);

const WhatsAppIcon = () => (
  <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-[#25D366] text-white flex-shrink-0">
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.733-1.455L0 24zm6.59-4.846c1.66.986 3.296 1.489 4.954 1.49 5.375 0 9.75-4.332 9.753-9.658 0-2.58-1.01-5.002-2.845-6.83-1.834-1.83-4.272-2.838-6.856-2.838-5.37 0-9.74 4.331-9.743 9.658-.002 1.79.49 3.535 1.426 5.097L2.175 21.84l5.074-1.31c.21.05.42.09.63.13z" />
    </svg>
  </span>
);

const MailIcon = () => (
  <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-slate-100 text-slate-600 border flex-shrink-0">
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  </span>
);

// Pictogram Component
const PersonIcon = ({ active, activeColor }: { active: boolean; activeColor: string }) => (
  <svg 
    className={`w-3.5 h-3.5 flex-shrink-0 ${active ? activeColor : 'text-slate-100'}`} 
    viewBox="0 0 24 24" 
    fill="currentColor"
  >
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

const renderPictograms = (percentage: number, colorClass: string) => {
  const activeCount = Math.round(percentage / 10);
  return (
    <div className="flex gap-0.5 items-center">
      {Array.from({ length: 10 }).map((_, i) => (
        <PersonIcon key={i} active={i < activeCount} activeColor={colorClass} />
      ))}
    </div>
  );
};

// Data sets
const asSeenOnRow1 = [
  { name: 'Decrypt', logo: '/images/media/decrypt.png' },
  { name: 'Outlook Money', logo: '/images/media/outlook.png' },
  { name: 'TheStreet Roundtable', logo: '/images/media/thestreet.svg' },
  { name: 'Yahoo Finance', logo: '/images/media/yahoo.png' },
  { name: 'Barcelona Tribune', logo: '/images/media/barcelona.png' }
];

const asSeenOnRow2 = [
  { name: 'British News Network', logo: '/images/media/british.png' },
  { name: 'England News Portal', logo: '/images/media/england.png' },
  { name: 'Korean Talks', logo: '/images/media/korean.png' },
  { name: 'Business Standard', logo: '/images/media/business-standard.png' },
  { name: 'Coin Edition', logo: '/images/media/coinedition.png' }
];

const coreMetrics = [
  { name: 'Total Active Jobs', cvinbio: '45,342', hashtag: '2,736' },
  { name: 'Unique Companies', cvinbio: '2,052', hashtag: '165' },
  { name: 'Disclosed Salary', cvinbio: '6,701 (14.8%)', hashtag: '139 (5.1%)' }
];

const seniorityLevels = [
  { level: 'Senior-Level', countLabel: 'Senior-Level', total: '28,391', cvCount: '27,026', cvPct: 59.6, hashCount: '1,365', hashPct: 49.9, color: 'text-blue-500', activeCol: 'text-blue-600' },
  { level: 'Mid-Level', countLabel: 'Mid-Level', total: '15,824', cvCount: '15,404', cvPct: 34.0, hashCount: '420', hashPct: 15.4, color: 'text-amber-500', activeCol: 'text-amber-500' },
  { level: 'Junior-Level', countLabel: 'Junior-Level', total: '3,089', cvCount: '2,912', cvPct: 6.4, hashCount: '177', hashPct: 6.5, color: 'text-emerald-500', activeCol: 'text-emerald-500' }
];

const socialMediaMetrics = [
  { channel: 'LinkedIn Followers', icon: <LinkedInIcon />, hashtag: '37,000', cvinbio: '1,200' },
  { channel: 'Telegram Networking', icon: <TelegramIcon />, hashtag: '18,000 members', cvinbio: '-' },
  { channel: 'Telegram Job Alerts', icon: <TelegramIcon />, hashtag: '62,000 subscribers', cvinbio: '3,200 subscribers' },
  { channel: 'Telegram News Feed', icon: <TelegramIcon />, hashtag: '11,000 subscribers', cvinbio: '-' },
  { channel: 'Telegram Per-Post Avg Views', icon: <TelegramIcon />, hashtag: '3,000', cvinbio: '300' },
  { channel: 'Telegram Alerts Notification Enabled', icon: <TelegramIcon />, hashtag: '45.0%', cvinbio: '50.0%' },
  { channel: 'Email List', icon: <MailIcon />, hashtag: '150,000', cvinbio: '7,000' },
  { channel: 'WhatsApp Groups', icon: <WhatsAppIcon />, hashtag: '26,000 members', cvinbio: '9,000' }
];

const operationsData = [
  { action: 'Job Scraping (Multi-ATS pipeline)', hashtag: '100% automated', cvinbio: '100% automated' },
  { action: 'Posting on Website and Telegram (Cron-triggered)', hashtag: '100% automated', cvinbio: '100% automated' },
  { action: 'Social Media Posting', hashtag: '100% automated', cvinbio: '100% automated' },
  { action: 'Client Communication', hashtag: 'Manual for scam checks', cvinbio: '-' },
  { action: 'Email Alerts', hashtag: '100% automated', cvinbio: '100% automated' },
  { action: 'Virality factor', hashtag: 'Social messaging forwards', cvinbio: 'Profile link sharing with watermark' },
  { action: 'Error Handling', hashtag: 'Manual', cvinbio: 'Manual' }
];

const departmentData = [
  { dept: 'Engineering', cv: '14,028 (30.9%)', hash: '929 (34.0%)' },
  { dept: 'Operations', cv: '7,476 (16.5%)', hash: '135 (4.9%)' },
  { dept: 'Sales / BD', cv: '6,245 (13.8%)', hash: '222 (8.1%)' },
  { dept: 'Marketing', cv: '2,125 (4.7%)', hash: '357 (13.1%)' },
  { dept: 'Finance', cv: '1,586 (3.5%)', hash: '147 (5.4%)' },
  { dept: 'Data Science / AI', cv: '1,413 (3.1%)', hash: '184 (6.7%)' },
  { dept: 'Design', cv: '1,323 (2.9%)', hash: '70 (2.6%)' },
  { dept: 'Legal & Compliance', cv: '899 (2.0%)', hash: '198 (7.2%)' },
  { dept: 'Customer Support', cv: '911 (2.0%)', hash: '54 (2.0%)' },
  { dept: 'People / HR', cv: '858 (1.9%)', hash: '43 (1.6%)' },
  { dept: 'Product Management', cv: '2,226 (4.9%)', hash: '14 (0.5%)' },
  { dept: 'Data Engineering', cv: '431 (1.0%)', hash: '53 (1.9%)' }
];

const skillsCv = [
  { rank: '#1', skill: 'Python', stats: '6,434 / 14.2%' },
  { rank: '#2', skill: 'Data Analysis', stats: '6,400 / 14.1%' },
  { rank: '#3', skill: 'Automation', stats: '5,983 / 13.2%' },
  { rank: '#4', skill: 'Customer Success', stats: '4,484 / 9.9%' },
  { rank: '#5', skill: 'Machine Learning', stats: '4,200 / 9.3%' }
];

const skillsHash = [
  { rank: '#1', skill: 'Python', stats: '549 / 20.1%' },
  { rank: '#2', skill: 'SQL', stats: '417 / 15.2%' },
  { rank: '#3', skill: 'Project Management', stats: '416 / 15.2%' },
  { rank: '#4', skill: 'Risk Management', stats: '409 / 15.0%' },
  { rank: '#5', skill: 'AWS', stats: '388 / 14.2%' }
];

// Testimonials Data
const testimonials = [
  {
    quote: "I always find his work to be of just the absolute high quality. He is always timely, so easy to work with, responsive to notes and always able to explain things to me when it's hard for me to get things. He has my highest endorsement.",
    author: "Jack Alison",
    title: "Screenwriter for Academy Awards (Oscars)"
  },
  {
    quote: "I am very comfortable to recommend him for any job that requires strict deadlines, taking on new challenges at short notice and dealing with altering priorities, efficient client communication and good analytical capabilities.",
    author: "Bharath Visweswariah",
    title: "Director Investments, Omidyar Network"
  },
  {
    quote: "He helped me a lot in working closely with me and understand my requirements even though we had some language barriers between us but Vedang has never let these barriers be the reason of any delay in the work.",
    author: "Eran Malovani",
    title: "Founder of CPA+"
  }
];

// Partner Logos Data
const partnerLogos = [
  { name: 'Harvard Blockchain Club', path: '/images/partners/harvard.png' },
  { name: 'Token 2049', path: '/images/partners/token2049.png' },
  { name: 'ETH Oxford', path: '/images/partners/ETHOxford.png' },
  { name: 'AltLayer', path: '/images/partners/altlayer.png' },
  { name: 'EDCON', path: '/images/partners/edcon.png' },
  { name: 'ETH Vietnam', path: '/images/partners/ethvietnam.png' },
  { name: 'IEEE', path: '/images/partners/ieee.png' }
];

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-24 text-center">
          <div className="animate-pulse space-y-3">
            <div className="h-6 w-48 bg-muted rounded mx-auto"></div>
            <div className="h-4 w-72 bg-muted rounded mx-auto"></div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl space-y-8 animate-in fade-in duration-300">
        
        {/* HEADER SECTION */}
        <div className="text-center border-b pb-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
            <div className="text-left">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">Platform Comparison Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">Unified analytics of Hashtag Web3 & CV in Bio databases and social infrastructure.</p>
              
              <div className="flex flex-wrap gap-4 mt-3 text-xs">
                <a 
                  href="http://cvin.bio/story" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 hover:underline font-medium"
                >
                  CV in Bio Story <ArrowUpRight className="w-3 h-3" />
                </a>
                <span className="text-slate-300">|</span>
                <a 
                  href="https://hashtagweb3.com/community" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-700 hover:underline font-medium"
                >
                  Hashtag Web3 Community <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Audited Data
            </div>
          </div>

          {/* AS SEEN ON STRIPE CONTAINER */}
          <div className="rounded-xl border bg-white p-4 shadow-sm space-y-3">
            <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">As Seen On</div>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 md:gap-6 items-center justify-items-center">
              {[...asSeenOnRow1, ...asSeenOnRow2].map((media, idx) => (
                <div key={idx} className="relative w-full h-7 md:h-9 flex items-center justify-center px-2">
                  <Image
                    src={media.logo}
                    alt={media.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 45vw, 15vw"
                    unoptimized={media.logo.endsWith('.svg')}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ROW 1: CORE DATA & SENIORITY PICTOGRAPH */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Panel 1: Core Metrics */}
          <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold tracking-tight uppercase text-muted-foreground flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-indigo-600" />
              Core Database Volume
            </h2>
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="p-3 font-medium text-foreground">Database Metric</th>
                    <th className="p-3 font-semibold text-emerald-600 text-right">CV in Bio</th>
                    <th className="p-3 font-semibold text-rose-600 text-right">Hashtag Web3</th>
                  </tr>
                </thead>
                <tbody>
                  {coreMetrics.map((item, idx) => (
                    <tr key={idx} className="border-b last:border-b-0 hover:bg-slate-50/50">
                      <td className="p-3 font-medium text-foreground">{item.name}</td>
                      <td className="p-3 text-right text-muted-foreground font-mono font-semibold">{item.cvinbio}</td>
                      <td className="p-3 text-right text-muted-foreground font-mono font-semibold">{item.hashtag}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-muted-foreground leading-normal">
              CV in Bio represents broad-scale database volume. Hashtag Web3 targets hyper-focused Web3 hiring circles.
            </p>
          </div>

          {/* Panel 2: Seniority Pictograph */}
          <div className="rounded-xl border bg-white p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold tracking-tight uppercase text-muted-foreground flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-indigo-600" />
              Breakdown Within Each Seniority Level
            </h2>
            
            <div className="space-y-4">
              {seniorityLevels.map((row, idx) => (
                <div key={idx} className="flex flex-col sm:grid sm:grid-cols-3 gap-3 border-b last:border-b-0 pb-3 last:pb-0">
                  
                  {/* Column 1: Label */}
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${row.level === 'Senior-Level' ? 'bg-blue-500' : row.level === 'Mid-Level' ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                    <div>
                      <div className="text-xs font-semibold text-foreground">{row.level}</div>
                      <div className="text-[10px] text-muted-foreground">Total: {row.total}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 sm:contents">
                    {/* Column 2: CV in Bio */}
                    <div className="space-y-1">
                      <div className="text-[10px] font-semibold text-blue-600">
                        CV in Bio <span className="font-normal text-muted-foreground">({row.cvCount} / {row.cvPct}%)</span>
                      </div>
                      {renderPictograms(row.cvPct, 'text-blue-500')}
                    </div>

                    {/* Column 3: Hashtag Web3 */}
                    <div className="space-y-1">
                      <div className="text-[10px] font-semibold text-emerald-600">
                        Hashtag Web3 <span className="font-normal text-muted-foreground">({row.hashCount} / {row.hashPct}%)</span>
                      </div>
                      {renderPictograms(row.hashPct, 'text-emerald-500')}
                    </div>
                  </div>

                </div>
              ))}
            </div>
            
            <div className="text-[10px] text-muted-foreground text-center pt-1 flex items-center justify-center gap-1">
              <span className="inline-block"><PersonIcon active={true} activeColor="text-slate-400" /></span>
              Each figure represents ~10% of the active database segment.
            </div>
          </div>

        </div>

        {/* ROW 2: OPERATIONS & SOCIAL MEDIA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Panel 3: Operations Table */}
          <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold tracking-tight uppercase text-muted-foreground flex items-center gap-2">
              <Zap className="h-4 w-4 text-indigo-600" />
              Platform Operations
            </h2>
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="p-3 font-medium text-foreground">Operations</th>
                    <th className="p-3 font-semibold text-rose-600 text-center">Hashtag Web3</th>
                    <th className="p-3 font-semibold text-emerald-600 text-center">CV in Bio</th>
                  </tr>
                </thead>
                <tbody>
                  {operationsData.map((item, idx) => (
                    <tr key={idx} className="border-b last:border-b-0 hover:bg-slate-50/50">
                      <td className="p-3 font-medium text-foreground">{item.action}</td>
                      <td className="p-3 text-center font-mono text-[11px] text-muted-foreground">{item.hashtag}</td>
                      <td className="p-3 text-center font-mono text-[11px] text-muted-foreground">{item.cvinbio}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Panel 4: Social Media Table */}
          <div className="rounded-xl border bg-white p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold tracking-tight uppercase text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4 text-indigo-600" />
              Social Media Infrastructure
            </h2>
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="p-3 font-medium text-foreground">Social Media Channel</th>
                    <th className="p-3 font-semibold text-rose-600 text-right">Hashtag Web3</th>
                    <th className="p-3 font-semibold text-emerald-600 text-right">CV in Bio</th>
                  </tr>
                </thead>
                <tbody>
                  {socialMediaMetrics.map((item, idx) => (
                    <tr key={idx} className="border-b last:border-b-0 hover:bg-slate-50/50">
                      <td className="p-3 font-medium text-foreground flex items-center gap-2">
                        {item.icon}
                        <span>{item.channel}</span>
                      </td>
                      <td className="p-3 text-right font-mono font-semibold text-muted-foreground">{item.hashtag}</td>
                      <td className="p-3 text-right font-mono font-semibold text-muted-foreground">{item.cvinbio}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* ROW 3: DEACTIVE PORT CHARTS (DYNAMIC IMPORTED SECTION) */}
        <DashboardCharts />

        {/* ROW 4: DEPARTMENTS SPLIT TABLE */}
        <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Functional Share Splits</h3>
          
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="p-2.5 font-medium text-foreground">Department Category</th>
                  <th className="p-2.5 font-semibold text-emerald-600 text-right">CV in Bio</th>
                  <th className="p-2.5 font-semibold text-rose-600 text-right">Hashtag Web3</th>
                </tr>
              </thead>
              <tbody>
                {departmentData.map((item, idx) => (
                  <tr key={idx} className="border-b last:border-b-0 hover:bg-slate-50/30">
                    <td className="p-2.5 font-medium text-foreground">{item.dept}</td>
                    <td className="p-2.5 text-right font-mono font-semibold text-emerald-600">{item.cv}</td>
                    <td className="p-2.5 text-right font-mono font-semibold text-rose-600">{item.hash}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ROW 5: TOP 5 SKILLS COMPARISON */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* CV in Bio Skills */}
          <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-emerald-600 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              CV in Bio (Total: 45,342) - Top Skills
            </h3>
            
            <div className="overflow-x-auto rounded-lg border bg-white">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b bg-slate-50/50">
                    <th className="p-3 font-medium text-foreground w-16">Rank</th>
                    <th className="p-3 font-medium text-foreground">In-Demand Skill</th>
                    <th className="p-3 font-semibold text-emerald-600 text-right">Job Volume / Share</th>
                  </tr>
                </thead>
                <tbody>
                  {skillsCv.map((item, idx) => (
                    <tr key={idx} className="border-b last:border-b-0 hover:bg-slate-50/20">
                      <td className="p-3 font-bold text-muted-foreground">{item.rank}</td>
                      <td className="p-3 font-semibold text-foreground">{item.skill}</td>
                      <td className="p-3 text-right font-mono text-muted-foreground">{item.stats}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Hashtag Web3 Skills */}
          <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-rose-600 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              Hashtag Web3 (Total: 2,736) - Top Skills
            </h3>
            
            <div className="overflow-x-auto rounded-lg border bg-white">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b bg-slate-50/50">
                    <th className="p-3 font-medium text-foreground w-16">Rank</th>
                    <th className="p-3 font-medium text-foreground">In-Demand Skill</th>
                    <th className="p-3 font-semibold text-rose-600 text-right">Job Volume / Share</th>
                  </tr>
                </thead>
                <tbody>
                  {skillsHash.map((item, idx) => (
                    <tr key={idx} className="border-b last:border-b-0 hover:bg-slate-50/20">
                      <td className="p-3 font-bold text-muted-foreground">{item.rank}</td>
                      <td className="p-3 font-semibold text-foreground">{item.skill}</td>
                      <td className="p-3 text-right font-mono text-muted-foreground">{item.stats}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* ROW 6: TESTIMONIALS SECTION (PREMIUM CARDS) */}
        <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold tracking-tight uppercase text-muted-foreground flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-indigo-600" />
            Executive Testimonials
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="rounded-xl border bg-white p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <blockquote className="border-l-2 border-indigo-500 pl-4 italic text-xs text-muted-foreground leading-relaxed">
                  "{t.quote}"
                </blockquote>
                <div className="mt-4 text-right">
                  <span className="block text-xs font-semibold text-foreground">{t.author}</span>
                  <span className="block text-[10px] text-muted-foreground">{t.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ROW 7: COMMUNITY PARTNERS & CLIENTS GRID */}
        <div className="rounded-xl border bg-white p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold tracking-tight uppercase text-muted-foreground flex items-center gap-2">
            <Globe className="h-4 w-4 text-indigo-600" />
            Community Partners & Ecosystem Clients
          </h2>
          <p className="text-xs text-muted-foreground">
            Hashtag Web3 maintains key strategic alliances and syndication networks with global blockchain networks, developer clubs, and crypto ecosystems:
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-6 items-center justify-items-center pt-2">
            {partnerLogos.map((partner, idx) => (
              <div key={idx} className="relative w-full h-8 md:h-10 flex flex-col items-center justify-center group px-1">
                <Image
                  src={partner.path}
                  alt={partner.name}
                  fill
                  className="object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                  sizes="(max-width: 768px) 30vw, 15vw"
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </PageLayout>
  );
}
