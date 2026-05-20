import fs from 'fs';
import path from 'path';

// Read and parse the large JSON file from the filesystem dynamically
const getGeneratedReports = (): AIReport[] => {
  try {
    const filePath = path.join(process.cwd(), 'src', 'lib', 'ai-reports-data-generated.json');
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8')) as AIReport[];
    }
  } catch (err) {
    console.error('Failed to load generated AI reports JSON:', err);
  }
  return [];
};

export interface AIReport {
  title: string;
  source: string;
  url: string;
  date: string;
  category: string;
  type: string;
  description?: string;
}

export const CATEGORIES = [
  'AI Research',
  'Industry & Enterprise',
  'Healthcare & Science',
  'Ethics & Policy',
  'Finance & Investment',
  'Society & Labor',
  'Robotics & Hardware',
  'Security & Defense',
  'Climate & Energy',
  'Creative & Media',
];

const manualReports: AIReport[] = [
  // ── State of AI ──
  {title:'Stanford HAI AI Index Report 2026',source:'Stanford HAI',url:'https://aiindex.stanford.edu/report/',date:'Apr 2026',category:'AI Research',type:'Report',description:'Most comprehensive annual assessment of AI technical, economic and societal trends.'},
  {title:'Stanford HAI AI Index Report 2025',source:'Stanford HAI',url:'https://aiindex.stanford.edu/report/',date:'Apr 2025',category:'AI Research',type:'Report'},
  {title:'State of AI Report 2025',source:'Nathan Benaich & Air Street Capital',url:'https://www.stateof.ai/',date:'Oct 2025',category:'AI Research',type:'Report',description:'Annual review of AI research, industry, politics and safety.'},
  {title:'State of AI Report 2026',source:'Nathan Benaich & Air Street Capital',url:'https://www.stateof.ai/',date:'Oct 2026',category:'AI Research',type:'Report'},
  {title:'AI in 2026: A Tale of Two AIs',source:'Sequoia Capital',url:'https://www.sequoiacap.com/article/',date:'Dec 2025',category:'AI Research',type:'Analysis'},
  {title:'2026: This is AGI',source:'Sequoia Capital',url:'https://www.sequoiacap.com/article/',date:'Jan 2026',category:'AI Research',type:'Analysis'},
  {title:'Big Ideas 2026',source:'ARK Invest',url:'https://ark-invest.com/big-ideas-2026',date:'Jan 2026',category:'AI Research',type:'Report',description:'AI infrastructure buildout, agentic productivity and economic impact forecasts.'},
  {title:'Big Ideas 2025',source:'ARK Invest',url:'https://ark-invest.com/big-ideas-2025',date:'Jan 2025',category:'AI Research',type:'Report'},
  {title:'Technology Trends Outlook 2026',source:'McKinsey',url:'https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights',date:'May 2026',category:'AI Research',type:'Report'},
  {title:'Technology Trends Outlook 2025',source:'McKinsey',url:'https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights',date:'May 2025',category:'AI Research',type:'Report'},
  {title:'Technology Vision 2025: A Declaration of Autonomy',source:'Accenture',url:'https://www.accenture.com/us-en/insights/technology/technology-trends',date:'Jan 2025',category:'AI Research',type:'Report'},
  {title:'Pulse of Change 2026',source:'Accenture',url:'https://www.accenture.com/us-en/insights/consulting/pulse-of-change',date:'Jan 2026',category:'AI Research',type:'Survey'},
  {title:'Emerging Technology Trends 2026',source:'J.P. Morgan',url:'https://www.jpmorgan.com/insights/technology',date:'Jan 2026',category:'AI Research',type:'Report'},
  {title:'State of Markets 2026',source:'a16z',url:'https://a16z.com/',date:'Mar 2026',category:'AI Research',type:'Analysis'},

  // ── Enterprise & Strategy ──
  {title:'The State of AI in 2025',source:'McKinsey',url:'https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai',date:'May 2025',category:'Industry & Enterprise',type:'Survey',description:'Annual survey: only 6% of orgs are AI high performers realizing material EBIT impact.'},
  {title:'The State of AI in Early 2026',source:'McKinsey',url:'https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai',date:'Mar 2026',category:'Industry & Enterprise',type:'Survey'},
  {title:'Superagency in the Workplace',source:'McKinsey Global Institute',url:'https://www.mckinsey.com/mgi/overview',date:'Jan 2025',category:'Industry & Enterprise',type:'Report'},
  {title:'AI Trust Maturity Survey 2026',source:'McKinsey',url:'https://www.mckinsey.com/capabilities/quantumblack/our-insights',date:'Apr 2026',category:'Industry & Enterprise',type:'Survey'},
  {title:'State of AI in the Enterprise 2026',source:'Deloitte',url:'https://www.deloitte.com/global/en/our-thinking/topics/artificial-intelligence.html',date:'Feb 2026',category:'Industry & Enterprise',type:'Report',description:'Only 25% moved 40%+ of AI pilots to production; 30% redesigning processes.'},
  {title:'State of Generative AI in the Enterprise Q1 2025',source:'Deloitte',url:'https://www.deloitte.com/global/en/our-thinking/topics/artificial-intelligence.html',date:'Mar 2025',category:'Industry & Enterprise',type:'Survey'},
  {title:'AI Radar 2026',source:'BCG',url:'https://www.bcg.com/publications/collections/artificial-intelligence',date:'Jan 2026',category:'Industry & Enterprise',type:'Report',description:'Shift from CIO-led to CEO-led AI; rapid growth of agentic AI.'},
  {title:'AI Performance Study 2026',source:'PwC',url:'https://www.pwc.com/gx/en/issues/artificial-intelligence.html',date:'Feb 2026',category:'Industry & Enterprise',type:'Report'},
  {title:'Global AI Sentiment Survey 2026',source:'EY',url:'https://www.ey.com/en_gl/ai',date:'Mar 2026',category:'Industry & Enterprise',type:'Survey'},
  {title:'CEO Survey: AI Investment Priorities 2026',source:'KPMG',url:'https://kpmg.com/xx/en/our-insights/ai-and-technology.html',date:'Feb 2026',category:'Industry & Enterprise',type:'Survey'},
  {title:'Proof over Promise: Real-World AI Adoption 2025',source:'World Economic Forum',url:'https://www.weforum.org/reports/',date:'Jan 2026',category:'Industry & Enterprise',type:'White Paper'},
  {title:'Organizational Transformation in the Age of AI',source:'World Economic Forum',url:'https://www.weforum.org/reports/',date:'Mar 2026',category:'Industry & Enterprise',type:'White Paper'},
  {title:'AI in Action: Beyond Experimentation',source:'World Economic Forum',url:'https://www.weforum.org/reports/',date:'Sep 2025',category:'Industry & Enterprise',type:'Report'},
  {title:'AI Build-Out: CapEx Projections 2026',source:'Goldman Sachs',url:'https://www.goldmansachs.com/insights/pages/ai-investment-forecast.html',date:'Feb 2026',category:'Industry & Enterprise',type:'Analysis'},
  {title:'Gartner Strategic Predictions 2026',source:'Gartner',url:'https://www.gartner.com/en/articles/top-strategic-predictions',date:'Oct 2025',category:'Industry & Enterprise',type:'Report'},
  {title:'IDC FutureScape: AI 2026 Predictions',source:'IDC',url:'https://www.idc.com/getdoc.jsp?containerId=prUS52691024',date:'Nov 2025',category:'Industry & Enterprise',type:'Report'},

  // ── AI Ethics & Governance ──
  {title:'NIST AI Risk Management Framework (AI RMF 1.0)',source:'NIST',url:'https://www.nist.gov/artificial-intelligence/ai-risk-management-framework',date:'Jan 2023',category:'Ethics & Policy',type:'Framework'},
  {title:'NIST Generative AI Profile (AI 600-1)',source:'NIST',url:'https://airc.nist.gov/Docs/1',date:'Jul 2024',category:'Ethics & Policy',type:'Framework'},
  {title:'NIST AI RMF Profile for Critical Infrastructure 2026',source:'NIST',url:'https://www.nist.gov/artificial-intelligence',date:'Apr 2026',category:'Ethics & Policy',type:'Framework'},
  {title:'EU AI Act: Full Text and Implementation Timeline',source:'European Commission',url:'https://artificialintelligenceact.eu/',date:'Aug 2024',category:'Ethics & Policy',type:'Guidance'},
  {title:'EU AI Act Omnibus: Clarifications 2026',source:'European Commission',url:'https://artificialintelligenceact.eu/',date:'Mar 2026',category:'Ethics & Policy',type:'Guidance'},
  {title:'OECD Due Diligence Guidance for Responsible AI',source:'OECD',url:'https://oecd.ai/en/papers-and-publications',date:'Jan 2026',category:'Ethics & Policy',type:'Guidance'},
  {title:'Trends in AI Incidents and Hazards',source:'OECD',url:'https://oecd.ai/en/papers-and-publications',date:'Feb 2026',category:'Ethics & Policy',type:'Report'},
  {title:'Exploring Possible AI Trajectories Through 2030',source:'OECD',url:'https://oecd.ai/en/papers-and-publications',date:'Feb 2026',category:'Ethics & Policy',type:'Paper'},
  {title:'AI Governance Profession Report 2025',source:'IAPP',url:'https://iapp.org/resources/article/ai-governance-profession-report/',date:'Sep 2025',category:'Ethics & Policy',type:'Survey'},
  {title:'ISO/IEC 42001: AI Management System Standard',source:'ISO',url:'https://www.iso.org/standard/81230.html',date:'Dec 2023',category:'Ethics & Policy',type:'Framework'},
  {title:'Foundation Model Transparency Index 2026',source:'Stanford HAI',url:'https://crfm.stanford.edu/fmti/',date:'Apr 2026',category:'Ethics & Policy',type:'Report'},

  // ── AI Safety & Alignment ──
  {title:'Responsible Scaling Policy 3.0',source:'Anthropic',url:'https://www.anthropic.com/research',date:'Feb 2026',category:'AI Research',type:'Framework'},
  {title:'GPT-5 System Card',source:'OpenAI',url:'https://openai.com/research',date:'2026',category:'AI Research',type:'Paper'},
  {title:'o3 Reasoning Model System Card',source:'OpenAI',url:'https://openai.com/research',date:'2025',category:'AI Research',type:'Paper'},
  {title:'Advanced AI Scaling Framework',source:'Meta',url:'https://ai.meta.com/research/',date:'2025',category:'AI Research',type:'Framework'},
  {title:'Responsible AI Progress Report 2026',source:'Google',url:'https://blog.google/technology/ai/responsible-ai-progress/',date:'Feb 2026',category:'AI Research',type:'Report'},
  {title:'Frontier AI Safety Commitments',source:'UK AI Safety Institute',url:'https://www.gov.uk/government/organisations/ai-safety-institute',date:'Nov 2025',category:'AI Research',type:'Framework'},
  {title:'International AI Safety Report',source:'AI Seoul Summit',url:'https://www.gov.uk/government/publications/international-ai-safety-report',date:'May 2025',category:'AI Research',type:'Report'},

  // ── Workforce & Labor ──
  {title:'Future of Jobs Report 2025',source:'World Economic Forum',url:'https://www.weforum.org/publications/the-future-of-jobs-report-2025/',date:'Jan 2025',category:'Society & Labor',type:'Report',description:'92M jobs displaced, 170M created by 2030 - net gain of 78M.'},
  {title:'Generative AI and the Future of Work',source:'ILO',url:'https://www.ilo.org/publications',date:'2025',category:'Society & Labor',type:'Paper'},
  {title:'The Agent Revolution: Workforce Impact',source:'McKinsey Global Institute',url:'https://www.mckinsey.com/mgi/overview',date:'Mar 2026',category:'Society & Labor',type:'Report'},
  {title:'Work Trend Index 2026',source:'Microsoft',url:'https://www.microsoft.com/en-us/worklab/work-trend-index/',date:'May 2026',category:'Society & Labor',type:'Report'},
  {title:'New Economy Skills: AI & Digital Capabilities',source:'World Economic Forum',url:'https://www.weforum.org/reports/',date:'2025',category:'Society & Labor',type:'White Paper'},

  // ── Healthcare & Biotech ──
  {title:'State of AI in Healthcare and Life Sciences 2026',source:'NVIDIA',url:'https://blogs.nvidia.com/blog/',date:'Mar 2026',category:'Healthcare & Science',type:'Survey'},
  {title:'Guiding Principles of Good AI Practice in Drug Development',source:'FDA',url:'https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-and-machine-learning-software-medical-device',date:'Jan 2026',category:'Healthcare & Science',type:'Guidance'},
  {title:'TPLC Management of AI/ML SaMD Draft Guidance',source:'FDA',url:'https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-and-machine-learning-software-medical-device',date:'Jan 2025',category:'Healthcare & Science',type:'Guidance'},
  {title:'AI for Drug and Biological Products Guidance',source:'FDA',url:'https://www.fda.gov/regulatory-information/search-fda-guidance-documents',date:'2025',category:'Healthcare & Science',type:'Guidance'},
  {title:'AlphaFold Database Expansion 2026',source:'Google DeepMind / EMBL-EBI',url:'https://alphafold.ebi.ac.uk/',date:'2026',category:'Healthcare & Science',type:'Paper'},
  {title:'Healthcare AI Report 2026',source:'Modus Create',url:'https://moduscreate.com/',date:'2026',category:'Healthcare & Science',type:'Report'},

  // ── Finance & Banking ──
  {title:'Global Financial Stability Report: AI Risks',source:'IMF',url:'https://www.imf.org/en/Publications/GFSR',date:'Apr 2026',category:'Finance & Investment',type:'Report'},
  {title:'Evaluating Implications of CBDC for Financial Stability',source:'IMF',url:'https://www.imf.org/en/Publications',date:'2025',category:'Finance & Investment',type:'Paper'},
  {title:'AI Adoption in Financial Services',source:'FSB',url:'https://www.fsb.org/publications/',date:'2025',category:'Finance & Investment',type:'Report'},
  {title:'Global AI in Finance 2026',source:'KPMG',url:'https://kpmg.com/xx/en/our-insights/ai-and-technology.html',date:'Feb 2026',category:'Finance & Investment',type:'Report'},
  {title:'Global AI in Financial Services Report 2026',source:'Cambridge Centre for Alternative Finance',url:'https://www.jbs.cam.ac.uk/faculty-research/centres/alternative-finance/',date:'2026',category:'Finance & Investment',type:'Report'},
  {title:'Venture Capital Investments in AI Through 2025',source:'OECD',url:'https://oecd.ai/en/papers-and-publications',date:'Feb 2026',category:'Finance & Investment',type:'Analysis'},
  {title:'Tokenized Finance: Opportunities and Risks',source:'IMF',url:'https://www.imf.org/en/Publications',date:'2025',category:'Finance & Investment',type:'Paper'},

  // ── Education ──
  {title:'Digital Education Outlook 2026: Generative AI in Education',source:'OECD',url:'https://www.oecd.org/en/publications/oecd-digital-education-outlook-2025_2bba0e9c-en.html',date:'2026',category:'Society & Labor',type:'Report',description:'Introduces Learning-Performance Paradox: AI improves grades but may not improve genuine learning.'},
  {title:'AI for Skills Development in Higher Education',source:'UNESCO',url:'https://www.unesco.org/en/digital-education/artificial-intelligence',date:'2025',category:'Society & Labor',type:'Framework'},
  {title:'Navigating Ethical Impacts of GenAI in Computing Education',source:'ACM Education Board',url:'https://www.acm.org/',date:'2025',category:'Society & Labor',type:'Report'},

  // ── Climate & Energy ──
  {title:'Energy and AI Report 2025',source:'IEA',url:'https://www.iea.org/reports/energy-and-ai',date:'2025',category:'Climate & Energy',type:'Report'},
  {title:'State of Energy Innovation 2026',source:'IEA',url:'https://www.iea.org/reports',date:'2026',category:'Climate & Energy',type:'Report'},
  {title:'Digitalization for the Energy Transition',source:'IRENA',url:'https://www.irena.org/publications',date:'2025',category:'Climate & Energy',type:'Report'},
  {title:'AI and Environmental Sustainability',source:'UNEP',url:'https://www.unep.org/resources',date:'2025',category:'Climate & Energy',type:'Report'},

  // ── Cybersecurity & Defense ──
  {title:'AI-Enabled Cyber Operations',source:'RAND Corporation',url:'https://www.rand.org/topics/artificial-intelligence.html',date:'2025',category:'Security & Defense',type:'Report'},
  {title:'AGI and National Security',source:'RAND Corporation',url:'https://www.rand.org/topics/artificial-intelligence.html',date:'2026',category:'Security & Defense',type:'Paper'},
  {title:'Agentic Warfare and Cyber Defense',source:'CSIS',url:'https://www.csis.org/programs/strategic-technologies-program',date:'2026',category:'Security & Defense',type:'Analysis'},
  {title:'Meaningful Human Control Over Autonomous Military AI',source:'NATO STO',url:'https://www.sto.nato.int/',date:'Jan 2026',category:'Security & Defense',type:'Report'},
  {title:'US Presidential Executive Order on AI',source:'White House',url:'https://www.whitehouse.gov/briefing-room/presidential-actions/',date:'Dec 2025',category:'Security & Defense',type:'Guidance'},

  // ── Legal & Justice ──
  {title:'AI in the Courts: Judicial Guidance 2026',source:'American Bar Association',url:'https://www.americanbar.org/',date:'2026',category:'Ethics & Policy',type:'Guidance'},
  {title:'State of AI in Legal 2026',source:'Thomson Reuters Institute',url:'https://www.thomsonreuters.com/en/institute.html',date:'2026',category:'Ethics & Policy',type:'Report',description:'Org-wide AI use surged to 40% (up from 22% in 2025); only 18% track ROI.'},
  {title:'TAKE IT DOWN Act (Deepfake Regulation)',source:'US Congress',url:'https://www.congress.gov/',date:'May 2025',category:'Ethics & Policy',type:'Guidance'},

  // ── Creative Industries ──
  {title:'Generative AI in Media & Entertainment 2026',source:'Deloitte',url:'https://www.deloitte.com/global/en/our-thinking/topics/artificial-intelligence.html',date:'2026',category:'Creative & Media',type:'Report'},
  {title:'AI Copyright Office Report',source:'US Copyright Office',url:'https://www.copyright.gov/',date:'2025',category:'Creative & Media',type:'Report'},
  {title:'State of Generative Media 2026',source:'a16z',url:'https://a16z.com/',date:'2026',category:'Creative & Media',type:'Analysis'},

  // ── Supply Chain & Manufacturing ──
  {title:'Predicts 2026: Supply Chain Technology',source:'Gartner',url:'https://www.gartner.com/en/supply-chain',date:'2025',category:'Industry & Enterprise',type:'Report'},
  {title:'Industry 4.0 and Digital Factories',source:'McKinsey',url:'https://www.mckinsey.com/capabilities/operations/our-insights',date:'2026',category:'Industry & Enterprise',type:'Report'},

  // ── Semiconductors & Infrastructure ──
  {title:'AI Chip Supply Chain Analysis 2026',source:'Epoch AI',url:'https://epoch.ai/',date:'2026',category:'Robotics & Hardware',type:'Analysis'},
  {title:'Semiconductor Market Forecast to 2030',source:'TSMC',url:'https://www.tsmc.com/',date:'2026',category:'Robotics & Hardware',type:'Report'},
  {title:'Global Data Center Investment Tracker',source:'IDC',url:'https://www.idc.com/',date:'2026',category:'Robotics & Hardware',type:'Report'},

  // ── VC & Startup Funding ──
  {title:'State of AI Startup Funding Q1 2026',source:'CB Insights',url:'https://www.cbinsights.com/research/report/artificial-intelligence-trends/',date:'Apr 2026',category:'Finance & Investment',type:'Report',description:'Q1 2026: $255.5B in AI VC funding, surpassing full-year 2025 total.'},
  {title:'AI Funding Annual Report 2025',source:'PitchBook',url:'https://pitchbook.com/',date:'Jan 2026',category:'Finance & Investment',type:'Report'},
  {title:'Global AI Investment Landscape 2026',source:'Crunchbase',url:'https://www.crunchbase.com/discover/funding_rounds',date:'2026',category:'Finance & Investment',type:'Analysis'},

  // ── Government & Public Sector ──
  {title:'Blueprint for Modern Digital Government',source:'UK Government',url:'https://www.gov.uk/government/publications',date:'2026',category:'Ethics & Policy',type:'Framework'},
  {title:'AI Opportunities Action Plan',source:'UK Government',url:'https://www.gov.uk/government/publications',date:'2026',category:'Ethics & Policy',type:'Framework'},
  {title:'Smart Nation 2.0 Strategy',source:'Singapore Government',url:'https://www.smartnation.gov.sg/',date:'2024',category:'Ethics & Policy',type:'Framework'},
  {title:'Federal AI Use Cases Inventory 2025',source:'US Government',url:'https://ai.gov/',date:'2025',category:'Ethics & Policy',type:'Report'},

  // ── LLMs & Benchmarks ──
  {title:'GPT-5 Technical Report',source:'OpenAI',url:'https://openai.com/research',date:'2026',category:'AI Research',type:'Paper'},
  {title:'Claude Opus 4 Model Card',source:'Anthropic',url:'https://www.anthropic.com/research',date:'2026',category:'AI Research',type:'Paper'},
  {title:'Gemini 3 Technical Report',source:'Google DeepMind',url:'https://deepmind.google/technologies/gemini/',date:'2026',category:'AI Research',type:'Paper'},
  {title:'Llama 4 Model Card',source:'Meta',url:'https://ai.meta.com/llama/',date:'2026',category:'AI Research',type:'Paper'},
  {title:'Qwen 3.5 Technical Report',source:'Alibaba',url:'https://qwenlm.github.io/',date:'2026',category:'AI Research',type:'Paper'},
  {title:'DeepSeek-R1 Technical Report',source:'DeepSeek',url:'https://www.deepseek.com/',date:'2025',category:'AI Research',type:'Paper'},
  {title:'LMSYS Chatbot Arena Leaderboard',source:'LMSYS',url:'https://chat.lmsys.org/',date:'2026',category:'AI Research',type:'Report'},

  // ── Robotics & Embodied AI ──
  {title:'Atlas Commercial Platform Announcement',source:'Boston Dynamics',url:'https://bostondynamics.com/',date:'Jan 2026',category:'Robotics & Hardware',type:'Report'},
  {title:'Tesla Optimus Gen 3 Progress Update',source:'Tesla',url:'https://www.tesla.com/AI',date:'2026',category:'Robotics & Hardware',type:'Report'},
  {title:'Figure 03: Autonomous Shift Operations',source:'Figure AI',url:'https://www.figure.ai/',date:'2026',category:'Robotics & Hardware',type:'Paper'},

  // ── Privacy & Data Protection ──
  {title:'EU AI Act & GDPR Intersection Analysis',source:'DPO Centre',url:'https://www.dpocentre.com/',date:'2026',category:'Ethics & Policy',type:'Analysis'},
  {title:'Synthetic Data for Privacy-Preserving AI',source:'GDPR Local',url:'https://gdprlocal.com/',date:'2026',category:'Ethics & Policy',type:'Paper'},

  // ── Retail & E-Commerce ──
  {title:'Agentic Commerce: The Future of Retail AI',source:'Salesforce',url:'https://www.salesforce.com/resources/',date:'2026',category:'Industry & Enterprise',type:'Report'},
  {title:'AI-Powered Personalization at Scale',source:'Amazon',url:'https://www.aboutamazon.com/',date:'2026',category:'Industry & Enterprise',type:'Report'},

  // ── Telecom & Connectivity ──
  {title:'Ericsson Mobility Report 2026',source:'Ericsson',url:'https://www.ericsson.com/en/reports-and-papers/mobility-report',date:'Jun 2026',category:'Industry & Enterprise',type:'Report'},
  {title:'6G Flagship White Papers',source:'University of Oulu',url:'https://www.6gflagship.com/',date:'2026',category:'Industry & Enterprise',type:'White Paper'},

  // ── Quantum Computing ──
  {title:'IBM Quantum Development Roadmap 2026',source:'IBM',url:'https://www.ibm.com/quantum',date:'2026',category:'AI Research',type:'Report'},
  {title:'Google Willow Quantum Processor Results',source:'Google Quantum AI',url:'https://quantumai.google/',date:'2026',category:'AI Research',type:'Paper'},

  // ── Emerging Markets ──
  {title:'AI in Southeast Asia: An Era of Opportunity',source:'McKinsey / EDB / Tech in Asia',url:'https://www.mckinsey.com/',date:'Feb 2026',category:'Society & Labor',type:'Report'},
  {title:'ASEAN Digital Outlook 2026',source:'ASEAN Foundation',url:'https://www.aseanfoundation.org/',date:'Feb 2026',category:'Society & Labor',type:'Report'},
  {title:'State of AI in Africa Report 2025',source:'CIPIT',url:'https://www.cipit.org/',date:'2025',category:'Society & Labor',type:'Report'},
  {title:'Digital Progress and Trends Report 2025',source:'World Bank',url:'https://www.worldbank.org/',date:'2025',category:'Society & Labor',type:'Report',description:'The "Four Cs" framework: Connectivity, Compute, Context, Competency.'},

  // ── Insurance ──
  {title:'Tech Trend Radar 2026',source:'Munich Re',url:'https://www.munichre.com/',date:'2026',category:'Industry & Enterprise',type:'Report'},
  {title:'sigma: AI and Insurance Demand Reallocation',source:'Swiss Re Institute',url:'https://www.swissre.com/institute/',date:'2026',category:'Industry & Enterprise',type:'Report'},

  // ── Agriculture & Food ──
  {title:'Artificial Intelligence for Food Safety',source:'FAO / Wageningen',url:'https://www.fao.org/',date:'2025',category:'Healthcare & Science',type:'Report'},
  {title:'Digital Agriculture and AI Innovation Roadmap',source:'FAO',url:'https://www.fao.org/',date:'2025',category:'Healthcare & Science',type:'Framework'},
  {title:'USDA AI Strategy FY 2025-2026',source:'USDA',url:'https://www.usda.gov/',date:'2025',category:'Healthcare & Science',type:'Framework'},

  // ── More Enterprise & Strategy (additional) ──
  {title:'Global AI Diffusion Report H2 2025',source:'Microsoft',url:'https://blogs.microsoft.com/on-the-issues/',date:'2025',category:'Industry & Enterprise',type:'Report'},
  {title:'AI Agent Strategy for 2026',source:'Google Cloud',url:'https://cloud.google.com/resources',date:'2026',category:'Industry & Enterprise',type:'White Paper'},
  {title:'AI Business Trends 2025',source:'Google',url:'https://blog.google/',date:'2025',category:'Industry & Enterprise',type:'Report'},
  {title:'Gensler Design Forecast 2026: AI Tipping Point',source:'Gensler',url:'https://www.gensler.com/',date:'2026',category:'Industry & Enterprise',type:'Report'},
];
export const aiReports: AIReport[] = [...manualReports, ...getGeneratedReports()];
