'use client';

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';

const departmentData = [
  { dept: 'Engineering', cv: '14,028 (30.9%)', hash: '929 (34.0%)', valCv: 30.9, valHash: 34.0 },
  { dept: 'Operations', cv: '7,476 (16.5%)', hash: '135 (4.9%)', valCv: 16.5, valHash: 4.9 },
  { dept: 'Sales / BD', cv: '6,245 (13.8%)', hash: '222 (8.1%)', valCv: 13.8, valHash: 8.1 },
  { dept: 'Marketing', cv: '2,125 (4.7%)', hash: '357 (13.1%)', valCv: 4.7, valHash: 13.1 },
  { dept: 'Finance', cv: '1,586 (3.5%)', hash: '147 (5.4%)', valCv: 3.5, valHash: 5.4 },
  { dept: 'Data Sci / AI', cv: '1,413 (3.1%)', hash: '184 (6.7%)', valCv: 3.1, valHash: 6.7 },
  { dept: 'Design', cv: '1,323 (2.9%)', hash: '70 (2.6%)', valCv: 2.9, valHash: 2.6 }
];

const skillsData = [
  { subject: 'Python', cvinbio: 14.2, hashtag: 20.1 },
  { subject: 'SQL', cvinbio: 8.5, hashtag: 15.2 },
  { subject: 'Automation', cvinbio: 13.2, hashtag: 8.0 },
  { subject: 'ML / AI', cvinbio: 9.3, hashtag: 5.0 },
  { subject: 'Project Mgmt', cvinbio: 5.0, hashtag: 15.2 },
  { subject: 'AWS Infra', cvinbio: 4.0, hashtag: 14.2 }
];

export default function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      
      {/* Department share */}
      <div className="rounded-xl border bg-white p-5 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Departmental Distribution (%)</h3>
          <p className="text-[10px] text-muted-foreground mt-1">Side-by-side percentage split comparison across core tech nodes.</p>
        </div>
        
        <div className="h-64 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentData} margin={{ top: 5, right: 5, left: -15, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="dept" stroke="#475569" fontSize={11} fontWeight={500} tickLine={false} height={40} interval={0} />
              <YAxis stroke="#475569" fontSize={11} fontWeight={500} tickFormatter={(v) => `${v}%`} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '6px' }} formatter={(v) => [`${v}%`, '']} />
              <Legend verticalAlign="top" height={32} iconSize={10} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              <Bar name="CV in Bio" dataKey="valCv" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar name="Hashtag Web3" dataKey="valHash" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="text-[10px] text-muted-foreground border-t pt-3 leading-normal mt-4">
          Engineering dominates functional share on both networks. Traditional sales and business operations represent major CV in Bio hubs, while crypto marketing and compliance represent core Web3 hubs.
        </div>
      </div>

      {/* Top Skills radar */}
      <div className="rounded-xl border bg-white p-5 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Top Tech Skills Focus (%)</h3>
          <p className="text-[10px] text-muted-foreground mt-1">Radar overlay showing comparative skill tag densities.</p>
        </div>
        
        <div className="h-64 w-full flex justify-center items-center mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={skillsData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" stroke="#334155" fontSize={11} fontWeight={500} />
              <PolarRadiusAxis angle={30} domain={[0, 25]} stroke="#94a3b8" fontSize={9} />
              <Radar name="CV in Bio" dataKey="cvinbio" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
              <Radar name="Hashtag Web3" dataKey="hashtag" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.2} />
              <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '6px' }} />
              <Legend verticalAlign="top" height={32} iconSize={10} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="text-[10px] text-muted-foreground border-t pt-3 leading-normal mt-4">
          Python leads in both directories. CV in Bio shows high demand in Data Analysis and Automation, whereas Hashtag Web3 features high demand in Project Management and AWS Infrastructure.
        </div>
      </div>

    </div>
  );
}
