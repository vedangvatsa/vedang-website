'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { PageLayout } from '@/components/page-layout';
import { ArrowUpRight } from 'lucide-react';

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

const trafficCv = [
  { rank: '1', page: 'Homepage / Upload Landing Page (Aggregated)', url: 'https://cvin.bio/', views: '1,179' },
  { rank: '2', page: 'CV Editor / Resume Creator (/editor)', url: 'https://cvin.bio/editor', views: '1,016' },
  { rank: '3', page: 'CV in Bio Job Feed (/jobs variations)', url: 'https://cvin.bio/jobs', views: '739' },
  { rank: '4', page: 'Signup / Authentication Page (/signup)', url: 'https://cvin.bio/signup', views: '83' },
  { rank: '5', page: 'Candidate Profile: Ronald (/ronald)', url: 'https://cvin.bio/ronald', views: '81' },
  { rank: '6', page: 'Candidate Profile: Oscar (/oscar)', url: 'https://cvin.bio/oscar', views: '61' },
  { rank: '7', page: 'Candidate Profile: Oleksii Borysenko', url: 'https://cvin.bio/oleksiiborysenko', views: '52' },
  { rank: '8', page: 'Candidate Profile: Yohannes (/yohannes)', url: 'https://cvin.bio/yohannes', views: '38' },
  { rank: '9', page: 'CV in Bio News Feed (/news)', url: 'https://cvin.bio/news', views: '32' },
  { rank: '10', page: 'Candidate Profile: Jeremyyza (/jeremyyza)', url: 'https://cvin.bio/jeremyyza', views: '25' }
];

const trafficHash = [
  { rank: '1', page: 'Homepage / Job Listings Board (Aggregated)', url: 'https://hashtagweb3.com/', views: '19,310' },
  { rank: '2', page: 'Web3 Interview Question Bank', url: 'https://hashtagweb3.com/interview-questions', views: '1,596' },
  { rank: '3', page: 'Web3 Salary Calculator', url: 'https://hashtagweb3.com/salary-calculator', views: '1,446' },
  { rank: '4', page: 'How to Be a Good Community Moderator', url: 'https://hashtagweb3.com/how-to-be-a-good-community-moderator', views: '778' },
  { rank: '5', page: 'Web3 Resume Builder', url: 'https://hashtagweb3.com/resume-builder', views: '660' },
  { rank: '6', page: 'Web3 Archetype Assessment', url: 'https://hashtagweb3.com/web3-career-quiz', views: '631' },
  { rank: '7', page: 'What is DeFi? A Beginner\'s Guide', url: 'https://hashtagweb3.com/what-is-defi', views: '435' },
  { rank: '8', page: 'Digital Nomad Visa List', url: 'https://hashtagweb3.com/digital-nomad-visas', views: '366' },
  { rank: '9', page: 'Free Invoice Generator', url: 'https://hashtagweb3.com/invoice-generator', views: '276' },
  { rank: '10', page: 'Web3 News Feed (aggregated)', url: 'https://hashtagweb3.com/news', views: '380' }
];


// Ecosystem Clients Data
const ecosystemClients = [
  { name: 'Alemx', path: '/images/partners/alemx.png' },
  { name: 'Antier', path: '/images/partners/Antier.svg' },
  { name: 'Binance', path: '/images/partners/binance.png' },
  { name: 'Bitget', path: '/images/partners/bitget.png' },
  { name: 'Circle', path: '/images/partners/circle.png' },
  { name: 'Coinbase', path: '/images/partners/coinbase.png' },
  { name: 'DePHY', path: '/images/partners/dephy.png' },
  { name: 'dYdX', path: '/images/partners/dydx.png' },
  { name: 'Funtoken', path: '/images/partners/funtoken.png' },
  { name: 'Galxe', path: '/images/partners/galxe.png' },
  { name: 'Glassnode', path: '/images/partners/glassnode.png' },
  { name: 'Jaya Talent', path: '/images/partners/jayatalent.png' },
  { name: 'KCEX', path: '/images/partners/kcex.png' },
  { name: 'LBank', path: '/images/partners/lbank.png' },
  { name: 'LiquidX', path: '/images/partners/liquidx.png' },
  { name: 'Longhash Ventures', path: '/images/partners/longhash.png' },
  { name: 'Mercuryo', path: '/images/partners/mercuryo.png' },
  { name: 'Overmind', path: '/images/partners/overmind.png' },
  { name: 'Peanut Games', path: '/images/partners/peanut.png' },
  { name: 'Quantstamp', path: '/images/partners/quantstamp.png' },
  { name: 'Rho Protocol', path: '/images/partners/rho.png' },
  { name: 'Scallop', path: '/images/partners/scallop.png' },
  { name: 'Swell', path: '/images/partners/swell.png' },
  { name: 'The Hashgraph Group', path: '/images/partners/THA.avif' },
  { name: 'Trilitech', path: '/images/partners/trilitech.png' },
  { name: 'Truflation', path: '/images/partners/truflation.png' },
  { name: 'VNTR', path: '/images/partners/vn.png' },
  { name: 'Watches.io', path: '/images/partners/watches.png' },
  { name: 'Zeebu', path: '/images/partners/zeebu.png' },
  { name: 'Zerion', path: '/images/partners/zerion.png' }
];

// Community & University Partners Data
const communityPartners = [
  { name: 'AltLayer', path: '/images/partners/altlayer.png' },
  { name: 'Based in Lisbon', path: '/images/partners/basedinlisbon.png' },
  { name: 'BFF (Blockchain Founders Fund)', path: '/images/partners/bff.png' },
  { name: 'Coinfest Asia', path: '/images/partners/coinfest.png' },
  { name: 'DATE', path: '/images/partners/date.png' },
  { name: 'EDCON', path: '/images/partners/edcon.png' },
  { name: 'ETH Brussels', path: '/images/partners/ethbrussels.png' },
  { name: 'ETH Enugu', path: '/images/partners/ethenugu.png' },
  { name: 'ETH Oxford', path: '/images/partners/ETHOxford.png' },
  { name: 'ETH Vietnam', path: '/images/partners/ethvietnam.png' },
  { name: 'Frankfurt Blockchain Society (FBS)', path: '/images/partners/fbs.png' },
  { name: 'Harvard Blockchain Club', path: '/images/partners/harvard.png' },
  { name: 'India Blockchain Week 2024', path: '/images/partners/ibw.png' },
  { name: 'IEEE', path: '/images/partners/ieee.png' },
  { name: 'Istanbul Blockchain Week', path: '/images/partners/istanbul.png' },
  { name: 'London Blockchain Club (LBC)', path: '/images/partners/LBC_Logo_Black-min.png' },
  { name: 'London Blockchain Society (LBS)', path: '/images/partners/lbs.png' },
  { name: 'Malaysia Blockchain Week', path: '/images/partners/malaysiablockchainweek.png' },
  { name: 'Oxford Blockchain Club (OBC)', path: '/images/partners/obc.png' },
  { name: 'OnePiece Labs', path: '/images/partners/onepiece.png' },
  { name: 'Penn Blockchain (PBS)', path: '/images/partners/pbs.png' },
  { name: 'Taipei Blockchain Week', path: '/images/partners/taipeiblockchainweek.png' },
  { name: 'The Metaverse Institute', path: '/images/partners/The-Metaverse-Institute-partners-with-Hashtag-Web3.png' },
  { name: 'Token 2049', path: '/images/partners/token2049.png' },
  { name: 'Wharton Blockchain Society (WBS)', path: '/images/partners/wbs.png' }
];

// Community Testimonials Data
const communityTestimonials = [
  {
    quote: "Their jobs channel is the most effective Web3 job board I’ve come across. Its real-time updates allow me to apply to new roles the moment they are available on the market, significantly improving the visibility of my applications.",
    author: "Suki Cheung",
    title: "Community Lead, Trust Wallet",
    image: "/images/quotes/suki.png"
  },
  {
    quote: "We’ve got so many emails from candidates applying for our jobs—there’s a new one every 5 minutes!",
    author: "Kris Lai",
    title: "CEO, Scallop",
    image: "/images/quotes/kris.png"
  },
  {
    quote: "Our agency has been using the job board for the past year, and we’ve tripled our speed in closing roles thanks to their high-quality talent pool.",
    author: "Zhanna Manzyk",
    title: "CEO, Jaya Talent",
    image: "/images/quotes/zhanna.png"
  }
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
          <div className="text-left">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Platform Comparison Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Unified analytics of Hashtag Web3 & CV in Bio databases and social infrastructure.</p>
            
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-3 text-xs">
              <a 
                href="http://cvin.bio/story" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 hover:underline font-medium"
              >
                CV in Bio Story <ArrowUpRight className="w-3 h-3" />
              </a>
              <span className="text-slate-300 hidden sm:inline">|</span>
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
        </div>

        {/* ROW 1: CORE DATA & SENIORITY PICTOGRAPH */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Panel 1: Core Metrics */}
          <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold tracking-tight uppercase text-muted-foreground">
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
          </div>

          {/* Panel 2: Seniority Pictograph */}
          <div className="rounded-xl border bg-white p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold tracking-tight uppercase text-muted-foreground">
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
            <h2 className="text-sm font-semibold tracking-tight uppercase text-muted-foreground">
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
            <h2 className="text-sm font-semibold tracking-tight uppercase text-muted-foreground">
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

        {/* AS SEEN ON STRIPE CONTAINER */}
        <div className="rounded-xl border bg-white p-4 shadow-sm space-y-3">
          <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase text-center">As Seen On</div>
          
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

        {/* ROW 5: TOP 5 SKILLS COMPARISON (COMBINED TABLE) */}
        <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold tracking-tight uppercase text-muted-foreground">
            Top 5 In-Demand Skills Comparison
          </h2>
          
          <div className="overflow-x-auto rounded-lg border bg-white">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                {/* Master Headers */}
                <tr className="border-b bg-slate-50/50">
                  <th className="p-3 font-medium text-foreground w-16 border-r text-center">Rank</th>
                  <th colSpan={2} className="p-3 font-semibold text-emerald-600 text-center border-r bg-emerald-50/10">
                    CV in Bio <span className="font-normal text-muted-foreground text-[10px]">(Total: 45,342)</span>
                  </th>
                  <th colSpan={2} className="p-3 font-semibold text-rose-600 text-center bg-rose-50/10">
                    Hashtag Web3 <span className="font-normal text-muted-foreground text-[10px]">(Total: 2,736)</span>
                  </th>
                </tr>
                {/* Sub Headers */}
                <tr className="border-b bg-slate-50/30 text-[10px] uppercase text-muted-foreground">
                  <th className="px-3 py-2 font-medium border-r"></th>
                  <th className="px-3 py-2 font-medium">In-Demand Skill</th>
                  <th className="px-3 py-2 font-semibold text-emerald-600 text-right border-r">Job Volume / Share</th>
                  <th className="px-3 py-2 font-medium">In-Demand Skill</th>
                  <th className="px-3 py-2 font-semibold text-rose-600 text-right">Job Volume / Share</th>
                </tr>
              </thead>
              <tbody>
                {skillsCv.map((item, idx) => {
                  const hashItem = skillsHash[idx];
                  return (
                    <tr key={idx} className="border-b last:border-b-0 hover:bg-slate-50/20">
                      <td className="p-3 font-bold text-muted-foreground border-r text-center">{item.rank}</td>
                      
                      {/* CV in Bio columns */}
                      <td className="p-3 font-semibold text-foreground">{item.skill}</td>
                      <td className="p-3 text-right font-mono text-muted-foreground border-r">{item.stats}</td>
                      
                      {/* Hashtag Web3 columns */}
                      <td className="p-3 font-semibold text-foreground">{hashItem.skill}</td>
                      <td className="p-3 text-right font-mono text-muted-foreground">{hashItem.stats}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ROW 6: TOP 10 HIGH-TRAFFIC PAGES COMPARISON (COMBINED TABLE) */}
        <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold tracking-tight uppercase text-muted-foreground">
            Top 10 High-Traffic Pages & Tools Comparison
          </h2>
          
          <div className="overflow-x-auto rounded-lg border bg-white">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                {/* Master Headers */}
                <tr className="border-b bg-slate-50/50">
                  <th className="p-3 font-medium text-foreground w-16 border-r text-center">Rank</th>
                  <th className="p-3 font-semibold text-emerald-600 text-center border-r bg-emerald-50/10">
                    CV in Bio <span className="font-normal text-muted-foreground text-[10px]">(via PostHog Analytics)</span>
                  </th>
                  <th className="p-3 font-semibold text-rose-600 text-center bg-rose-50/10">
                    Hashtag Web3 <span className="font-normal text-muted-foreground text-[10px]">(via Google Analytics)</span>
                  </th>
                </tr>
                {/* Sub Headers */}
                <tr className="border-b bg-slate-50/30 text-[10px] uppercase text-muted-foreground">
                  <th className="px-3 py-2 font-medium border-r"></th>
                  <th className="px-3 py-2 font-medium border-r">Page / Utility Path</th>
                  <th className="px-3 py-2 font-medium">Page / Utility Path</th>
                </tr>
              </thead>
              <tbody>
                {trafficCv.map((item, idx) => {
                  const hashItem = trafficHash[idx];
                  return (
                    <tr key={idx} className="border-b last:border-b-0 hover:bg-slate-50/20">
                      <td className="p-3 font-bold text-muted-foreground border-r text-center">{item.rank}</td>
                      
                      {/* CV in Bio columns */}
                      <td className="p-3 font-semibold text-foreground border-r">
                        {item.url ? (
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline text-emerald-600 font-medium">
                            {item.page}
                          </a>
                        ) : (
                          item.page
                        )}
                      </td>
                      
                      {/* Hashtag Web3 columns */}
                      <td className="p-3 font-semibold text-foreground">
                        {hashItem.url ? (
                          <a href={hashItem.url} target="_blank" rel="noopener noreferrer" className="hover:underline text-rose-600 font-medium">
                            {hashItem.page}
                          </a>
                        ) : (
                          hashItem.page
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ROW 6: ECOSYSTEM CLIENTS GRID */}
        <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold tracking-tight uppercase text-muted-foreground">
            Clients
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 sm:gap-6 items-center justify-items-center pt-2">
            {ecosystemClients.map((client, idx) => (
              <div key={idx} className="relative w-full h-8 md:h-10 flex flex-col items-center justify-center group px-1">
                <Image
                  src={client.path}
                  alt={client.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 30vw, 15vw"
                  unoptimized={client.path.endsWith('.svg')}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ROW 7: COMMUNITY & ACADEMIC PARTNERS */}
        <div className="rounded-xl border bg-white p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold tracking-tight uppercase text-muted-foreground">
            Partners
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 sm:gap-6 items-center justify-items-center pt-2">
            {communityPartners.map((partner, idx) => (
              <div key={idx} className="relative w-full h-8 md:h-10 flex flex-col items-center justify-center group px-1">
                <Image
                  src={partner.path}
                  alt={partner.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 30vw, 15vw"
                />
              </div>
            ))}
          </div>
        </div>

        {/* ROW 8: WHAT OUR COMMUNITY SAYS */}
        <div className="rounded-xl border bg-slate-50/50 p-6 shadow-sm space-y-6">
          <h2 className="text-sm font-semibold tracking-tight uppercase text-muted-foreground text-center">
            What Our Community Says
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {communityTestimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-white rounded-xl border p-5 shadow-sm flex flex-col justify-between min-h-[220px] hover:shadow-md transition-shadow">
                <div className="flex-1 flex flex-col justify-center py-2">
                  <blockquote className="text-xs md:text-sm text-slate-700 italic leading-relaxed">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                </div>
                <div className="flex items-center gap-3 border-t pt-3">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border bg-slate-100">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-900">{testimonial.author}</h3>
                    <p className="text-[10px] text-slate-500">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </PageLayout>
  );
}
