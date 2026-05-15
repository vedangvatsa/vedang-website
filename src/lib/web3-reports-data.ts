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
  // ── State of Crypto ──
  {title:'State of Crypto 2024',source:'a16z crypto',url:'https://a16zcrypto.com/stateofcrypto/',date:'Oct 2024',category:'State of Crypto',type:'Report',description:'Annual industry report covering blockspace adoption, developer activity, and decentralized identity metrics.'},
  {title:'Crypto Theses 2025',source:'Messari',url:'https://messari.io/report/the-crypto-theses-2025',date:'Dec 2024',category:'State of Crypto',type:'Report',description:'Messari annual outlook covering macro, DeFi, infrastructure, and emerging ecosystems.'},
  {title:'Developer Report 2024',source:'Electric Capital',url:'https://www.developerreport.com/',date:'Dec 2024',category:'Web3 Infrastructure',type:'Analysis',description:'Annual analysis of developer activity, code commits, and ecosystem growth across blockchains.'},
  {title:'2025 Crypto Market Outlook',source:'Coinbase Institutional',url:'https://www.coinbase.com/institutional/research-insights',date:'Jan 2025',category:'Institutional Adoption',type:'Report',description:'Institutional outlook covering stablecoins, tokenization, crypto ETFs, and DeFi.'},
  {title:'Crypto and Blockchain Venture Capital Q4 2025',source:'Galaxy Digital',url:'https://www.galaxy.com/insights/research/',date:'Jan 2026',category:'State of Crypto',type:'Analysis',description:'Quarterly VC funding data across crypto and blockchain startups.'},

  // ── Regulation & Policy ──
  {title:'MiCA: Markets in Crypto-Assets Regulation',source:'European Commission',url:'https://finance.ec.europa.eu/digital-finance/digital-assets/markets-crypto-assets-regulation-mica_en',date:'Jun 2023',category:'Regulation & Policy',type:'Framework',description:'Full text of the EU regulation establishing a comprehensive framework for crypto-assets.'},
  {title:'The Next-Generation Monetary and Financial System',source:'Bank for International Settlements',url:'https://www.bis.org/publ/arpdf/ar2025e3.htm',date:'Jun 2025',category:'Regulation & Policy',type:'Report',description:'BIS Annual Economic Report chapter on tokenization, CBDCs, and stablecoins.'},
  {title:'Results of the 2024 BIS Survey on CBDCs and Crypto',source:'Bank for International Settlements',url:'https://www.bis.org/publ/bppdf/bispap159.htm',date:'Aug 2025',category:'Regulation & Policy',type:'Survey',description:'BIS survey of central bank involvement in CBDCs and cryptoassets.'},
  {title:'GENIUS Act: Stablecoin Regulation',source:'US Congress',url:'https://www.congress.gov/',date:'May 2025',category:'Regulation & Policy',type:'Guidance',description:'US federal stablecoin legislation establishing reserve and disclosure requirements.'},
  {title:'Responsible Financial Innovation Act',source:'US Senate',url:'https://www.congress.gov/',date:'2024',category:'Regulation & Policy',type:'Guidance'},

  // ── Security & Exploits ──
  {title:'2025 Crypto Crime Report',source:'Chainalysis',url:'https://go.chainalysis.com/2025-Crypto-Crime-Report.html',date:'Feb 2025',category:'Security & Exploits',type:'Report',description:'Annual report on illicit activity, sanctions evasion, and fraud across crypto networks.'},
  {title:'Web3 Security Quarterly Report Q4 2024',source:'CertiK',url:'https://www.certik.com/resources/blog',date:'Jan 2025',category:'Security & Exploits',type:'Report'},
  {title:'DeFi Exploits Database 2024',source:'Rekt News',url:'https://rekt.news/',date:'Dec 2024',category:'Security & Exploits',type:'Analysis'},

  // ── Institutional Adoption ──
  {title:'Institutional Digital Assets Survey 2024',source:'Fidelity Digital Assets',url:'https://www.fidelitydigitalassets.com/',date:'Oct 2024',category:'Institutional Adoption',type:'Survey',description:'Survey of institutional investors on digital asset allocation and sentiment.'},
  {title:'Tokenized Finance: Opportunities and Risks',source:'IMF',url:'https://www.imf.org/en/Publications',date:'2025',category:'Institutional Adoption',type:'Paper'},
  {title:'Digital Assets Banking and Capital Markets Digest',source:'Deloitte',url:'https://www2.deloitte.com/us/en/insights.html',date:'2025',category:'Institutional Adoption',type:'Report'},
  {title:'Financial Services Industry Predictions 2025',source:'Deloitte',url:'https://www2.deloitte.com/us/en/insights/industry/financial-services.html',date:'Jan 2025',category:'Institutional Adoption',type:'Report',description:'Annual predictions covering blockchain, tokenization, and digital asset trends.'},

  // ── DeFi & Yield ──
  {title:'DeFi in Depth: Liquidity and Yield Analysis 2025',source:'Delphi Digital',url:'https://members.delphidigital.io/',date:'Mar 2025',category:'DeFi & Yield',type:'Report'},
  {title:'Annual DeFi Review 2024',source:'DeFi Llama',url:'https://defillama.com/',date:'Jan 2025',category:'DeFi & Yield',type:'Analysis'},

  // ── L1 & L2 Scaling ──
  {title:'L2 Scaling Report 2025',source:'L2Beat',url:'https://l2beat.com/',date:'Mar 2025',category:'L1 & L2 Scaling',type:'Analysis',description:'Independent tracker of Layer 2 scaling solutions including TVL and risk assessment.'},
  {title:'Ethereum Roadmap Assessment 2025',source:'Ethereum Foundation',url:'https://ethereum.org/en/roadmap/',date:'2025',category:'L1 & L2 Scaling',type:'Report'},
  {title:'Solana Validator Economics Report',source:'Solana Foundation',url:'https://solana.com/news',date:'2025',category:'L1 & L2 Scaling',type:'Report'},

  // ── Zero-Knowledge & Privacy ──
  {title:'The State of ZK Rollups 2025',source:'Polygon Labs',url:'https://polygon.technology/blog',date:'2025',category:'Zero-Knowledge & Privacy',type:'Report'},
  {title:'Privacy and Compliance in Web3',source:'Aztec Network',url:'https://aztec.network/blog',date:'2025',category:'Zero-Knowledge & Privacy',type:'White Paper'},

  // ── NFTs & Creator Economy ──
  {title:'State of NFTs 2024',source:'NonFungible.com',url:'https://nonfungible.com/reports',date:'Jan 2025',category:'NFTs & Creator Economy',type:'Report'},

  // ── Web3 Infrastructure ──
  {title:'Crypto and Blockchain VC Landscape 2025',source:'Galaxy Digital',url:'https://www.galaxy.com/insights/research/',date:'Jul 2025',category:'Web3 Infrastructure',type:'Analysis'},
  {title:'State of Crypto Funding 2025',source:'The Block Research',url:'https://www.theblock.co/data',date:'2025',category:'Web3 Infrastructure',type:'Report'},
  {title:'On-Chain Data Intelligence Report 2025',source:'Nansen',url:'https://www.nansen.ai/research',date:'2025',category:'Web3 Infrastructure',type:'Report'},
  {title:'On-Chain Forensics and Compliance 2025',source:'Arkham Intelligence',url:'https://www.arkhamintelligence.com/',date:'2025',category:'Web3 Infrastructure',type:'Report'},

  // ── Tokenomics & Value Accrual ──
  {title:'Token Terminal Market Data Report 2025',source:'Token Terminal',url:'https://tokenterminal.com/',date:'2025',category:'Tokenomics & Value Accrual',type:'Analysis'},
  {title:'Stablecoin Market Report 2025',source:'Circle',url:'https://www.circle.com/en/research',date:'2025',category:'Tokenomics & Value Accrual',type:'Report'},

  // ── DAOs & Governance ──
  {title:'The State of DAOs 2024',source:'DeepDAO',url:'https://www.deepdao.io/',date:'Jan 2025',category:'DAOs & Governance',type:'Report'},

  // ── Bridges & Interoperability ──
  {title:'Cross-Chain Bridge Security Framework',source:'L2Beat',url:'https://l2beat.com/bridges/summary',date:'2025',category:'Bridges & Interoperability',type:'Framework'},

  // ── Consumer Crypto ──
  {title:'State of Crypto Adoption 2024',source:'Chainalysis',url:'https://www.chainalysis.com/blog/2024-global-crypto-adoption-index/',date:'Sep 2024',category:'Consumer Crypto',type:'Report',description:'Global crypto adoption index covering 150+ countries.'},
];

export const web3Reports: Web3Report[] = [...curatedReports, ...(generatedReports as Web3Report[])];
