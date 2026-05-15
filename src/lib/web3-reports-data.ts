import generatedReports from './web3-reports-data-generated.json';

export interface Web3Report {
  title: string;
  source: string;
  url: string;
  date: string;
  category: string;
  type: string;
  description?: string;
}

export const CATEGORIES = [
  'State of Crypto',
  'DeFi & Yield',
  'NFTs & Creator Economy',
  'L1 & L2 Scaling',
  'DAOs & Governance',
  'Regulation & Policy',
  'Institutional Adoption',
  'Zero-Knowledge & Privacy',
  'Tokenomics & Value Accrual',
  'Web3 Infrastructure',
  'Gaming & Metaverse',
  'Identity & Reputation',
  'Consumer Crypto',
  'Bridges & Interoperability',
  'Security & Exploits',
];

const curatedReports: Web3Report[] = [
  {title:'State of Crypto 2026',source:'a16z crypto',url:'https://a16zcrypto.com/state-of-crypto/',date:'Oct 2026',category:'State of Crypto',type:'Report',description:'Annual report covering blockspace adoption, developer activity, and decentralized identity metrics.'},
  {title:'Developer Report Q1 2026',source:'Electric Capital',url:'https://www.developerreport.com/',date:'Apr 2026',category:'Web3 Infrastructure',type:'Analysis'},
  {title:'Institutional Digital Asset Survey',source:'Fidelity Digital Assets',url:'https://www.fidelitydigitalassets.com/',date:'Jan 2026',category:'Institutional Adoption',type:'Survey'},
  {title:'State of DeFi 2026',source:'Messari',url:'https://messari.io/',date:'Feb 2026',category:'DeFi & Yield',type:'Report'},
];

export const web3Reports: Web3Report[] = [...curatedReports, ...(generatedReports as Web3Report[])];
