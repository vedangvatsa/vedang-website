
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { PageLayout } from '@/components/page-layout';
import Link from 'next/link';
import { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { Star, ExternalLink, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { pageMetadata, generateMetadata } from '@/lib/metadata';
import { WebEvolution, BlockchainExplainer, SmartContractExplainer, Web3Ecosystem, Web3Passport, Web3Future } from '@/components/courses/web3-visuals';

const referenceLinks = [
    {
        name: 'Blockchain Fundamentals',
        links: [
            { name: 'Ethereum.org Learn', url: 'https://ethereum.org/en/learn/' },
            { name: 'Bitcoin Whitepaper', url: 'https://bitcoin.org/bitcoin.pdf' },
            { name: 'Solana Docs', url: 'https://solana.com/docs' },
        ],
    },
    {
        name: 'Wallets and Getting Started',
        links: [
            { name: 'MetaMask', url: 'https://metamask.io/' },
            { name: 'Rainbow Wallet', url: 'https://www.rainbow.me/' },
            { name: 'Phantom (Solana)', url: 'https://phantom.app/' },
        ],
    },
    {
        name: 'DeFi and dApps',
        links: [
            { name: 'Uniswap', url: 'https://uniswap.org/' },
            { name: 'Aave', url: 'https://aave.com/' },
            { name: 'DappRadar', url: 'https://dappradar.com/' },
            { name: 'DeFi Llama', url: 'https://defillama.com/' },
        ],
    },
    {
        name: 'Learning Resources',
        links: [
            { name: 'a16z Crypto Canon', url: 'https://a16zcrypto.com/posts/article/crypto-readings-resources/' },
            { name: 'Ethereum Name Service (ENS)', url: 'https://ens.domains/' },
            { name: 'L2Beat (Layer 2 Tracker)', url: 'https://l2beat.com/' },
        ],
    },
];


export const metadata: Metadata = generateMetadata({
  title: pageMetadata.web3101.title,
  description: pageMetadata.web3101.description,
  url: pageMetadata.web3101.url,
  ogImageAlt: 'Web3 Fundamentals Course - Learn Blockchain & Decentralization',
});

const faqItems = [
  {
    question: "Is Web3 just about cryptocurrencies like Bitcoin?",
    answer: "No, that's a common misconception. While cryptocurrencies like Bitcoin were the first major application of blockchain, Web3 is a much broader concept. Think of crypto as the fuel for the Web3 engine, not the entire vehicle. Web3 is about building a decentralized internet where users, not corporations, control their own data, identity, and digital assets. This includes decentralized applications (dApps), digital ownership via NFTs, decentralized governance (DAOs), and more."
  },
  {
    question: "Do I need to be a developer to use Web3?",
    answer: "Not at all. While developers are essential for building Web3 applications, anyone can use them. In the early days, it was very technical, but today's user experience is rapidly improving. Using Web3 is as simple as getting a digital wallet (like a Web3-enabled browser extension or mobile app) and interacting with dApps. This course will guide you through getting started safely."
  },
  {
    question: "Is Web3 secure? What are the risks?",
    answer: "Web3's decentralization offers a new security model. Because data is distributed across thousands of computers, there is no single point of failure for an attacker to target, making the underlying network highly resistant to attacks. However, this model shifts responsibility to the user. You are in control of your own assets ('self-custody'), which means you must protect your wallet's 'private keys' or 'seed phrase.' The biggest risks are scams (phishing), social engineering, and interacting with poorly-coded smart contracts. Education is your best defense."
  },
  {
    question: "What is a 'DAO' and how does it work?",
    answer: "A DAO is a 'Decentralized Autonomous Organization.' Think of it as an internet-native organization or club where the rules are written in code (smart contracts) and enforced by the network, not by a central authority like a CEO. Decisions are made collectively by members, who typically vote using governance tokens. This allows for transparent and democratic management of anything from a DeFi protocol to a community art fund."
  },
  {
    question: "Are NFTs just overpriced JPEGs?",
    answer: "The 'overpriced JPEG' narrative comes from the 2021 art boom, but it misses the fundamental technology. An NFT (Non-Fungible Token) is a unique, verifiable certificate of ownership for any digital or physical asset, recorded on a blockchain. This could be art, but it could also be a concert ticket, a university degree, a title deed to a house, an in-game item, or your digital identity. The core innovation is provable digital ownership, which has applications far beyond art."
  },
  {
    question: "How is Web3 different from Web2 (the current internet)?",
    answer: "The simplest way to think about it is ownership and control. Web1 was 'read-only' (static websites). Web2 is 'read-write,' but large tech companies own the platforms and control your data (think Facebook, Google, X). Web3 is 'read-write-own.' It's a shift from a platform-centric internet to a user-centric one, where you have more sovereignty over your data and digital assets through decentralized networks."
  },
  {
    question: "How much money do I need to get started with Web3?",
    answer: "You can start for free. Setting up a wallet like MetaMask costs nothing. Many blockchains like Solana and Polygon have transaction fees measured in fractions of a cent. You can explore dApps, claim free airdrops, and learn the ecosystem without spending anything. Only invest money you can afford to lose, and start small."
  },
  {
    question: "Is blockchain bad for the environment?",
    answer: "This was a legitimate concern during Bitcoin's early years when Proof of Work mining consumed enormous amounts of energy. However, the industry has shifted significantly. Ethereum moved to Proof of Stake in 2022, reducing its energy consumption by over 99.9%. Most new blockchains (Solana, Polygon, Avalanche) use energy-efficient consensus mechanisms. The environmental argument against blockchain is increasingly outdated."
  },
  {
    question: "What is DeFi and is it safe?",
    answer: "DeFi (Decentralized Finance) refers to financial services built on blockchain, like lending, borrowing, and trading, without traditional banks as intermediaries. It offers higher yields and permissionless access, but carries real risks. Smart contract bugs, rug pulls, and impermanent loss are real. Start with established protocols like Aave and Uniswap, use small amounts, and never invest what you cannot afford to lose."
  },
  {
    question: "What changed with the Bitcoin and Ethereum ETF approvals?",
    answer: "In 2024, the SEC approved spot Bitcoin and Ethereum ETFs, allowing traditional investors to gain crypto exposure through regulated brokerage accounts without needing a wallet or exchange. This was a watershed moment. It brought institutional capital into crypto and legitimized the asset class in the eyes of regulators and financial advisors. It also reduced the UX barrier since anyone with a brokerage account can now hold crypto indirectly."
  },
];

const courseSchema = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'Fundamentals of Web3',
  description: 'A free, self-paced course covering blockchain, cryptocurrencies, smart contracts, dApps, NFTs, DAOs, and decentralized systems.',
  url: 'https://veda.ng/web3-101',
  provider: { '@type': 'Person', name: 'Vedang Vatsa', url: 'https://veda.ng' },
  isAccessibleForFree: true,
  educationalLevel: 'Beginner',
  hasCourseInstance: {
    '@type': 'CourseInstance',
    courseMode: 'online',
    instructor: { '@type': 'Person', name: 'Vedang Vatsa', url: 'https://veda.ng' },
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
};

export default function Web3CoursePage() {
  return (
    <PageLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

        <section className="text-center pt-16 pb-12">
             <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                <Badge variant="secondary">
                    <Star className="w-3 h-3 mr-1.5" />
                    A Free, Self-Paced Course
                </Badge>
                <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">
                    Fundamentals of Web3
                </h1>
                <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
                Go beyond the buzzwords and understand the next evolution of the internet. This course breaks down Web3, including blockchain, decentralization, and digital ownership, into clear, practical concepts. Learn what it means to build and participate in a user-owned web.
                </p>

                <div className="mt-8 flex justify-center items-center gap-4">
                    <Badge variant="outline">By: Vedang Vatsa</Badge>
                    <Badge variant="outline">Prerequisite: An open mind</Badge>
                </div>
            </div>
        </section>

        <section id="curriculum" className="py-16 bg-muted/30 border-y -mx-4 px-4 md:-mx-6 md:px-6">
            <div className="max-w-none">
                <div className="text-left mb-8">
                    <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Course Curriculum</h2>
                    <p className="mt-2 text-muted-foreground">Eight modules to understand the decentralized web.</p>
                </div>
                <div className="space-y-4">
                    <Link href="/web3-101/module-1-vision" className="block p-6 rounded-xl border bg-card hover:border-primary/50 transition-colors shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-lg">1. The Vision: Why Web3 Matters</h3>
                                <p className="text-sm text-muted-foreground mt-1">Trace the internet's evolution and the problems Web3 aims to solve.</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0 ml-4" />
                        </div>
                    </Link>
                    <Link href="/web3-101/module-2-bedrock" className="block p-6 rounded-xl border bg-card hover:border-primary/50 transition-colors shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-lg">2. The Bedrock: Blockchain</h3>
                                <p className="text-sm text-muted-foreground mt-1">Understand the core technology and the role of cryptocurrencies.</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0 ml-4" />
                        </div>
                    </Link>
                    <Link href="/web3-101/module-3-smart-contracts" className="block p-6 rounded-xl border bg-card hover:border-primary/50 transition-colors shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-lg">3. Smart Contracts</h3>
                                <p className="text-sm text-muted-foreground mt-1">Explore how code transforms blockchain into a global computer.</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0 ml-4" />
                        </div>
                    </Link>
                    <Link href="/web3-101/module-4-ecosystem" className="block p-6 rounded-xl border bg-card hover:border-primary/50 transition-colors shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-lg">4. The Ecosystem</h3>
                                <p className="text-sm text-muted-foreground mt-1">Discover dApps, NFTs, and DAOs.</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0 ml-4" />
                        </div>
                    </Link>
                    <Link href="/web3-101/module-5-getting-started" className="block p-6 rounded-xl border bg-card hover:border-primary/50 transition-colors shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-lg">5. Getting Started</h3>
                                <p className="text-sm text-muted-foreground mt-1">Learn how to set up a wallet and navigate Web3 safely.</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0 ml-4" />
                        </div>
                    </Link>
                    <Link href="/web3-101/module-6-future" className="block p-6 rounded-xl border bg-card hover:border-primary/50 transition-colors shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-lg">6. The Future</h3>
                                <p className="text-sm text-muted-foreground mt-1">Explore the challenges and opportunities ahead for the decentralized web.</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0 ml-4" />
                        </div>
                    </Link>
                    <Link href="/web3-101/module-7-layer2s" className="block p-6 rounded-xl border bg-card hover:border-primary/50 transition-colors shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-lg">7. Layer 2s & Scaling</h3>
                                <p className="text-sm text-muted-foreground mt-1">Understand rollups, L2 ecosystems, and cross-chain bridges.</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0 ml-4" />
                        </div>
                    </Link>
                    <Link href="/web3-101/module-8-tokenomics" className="block p-6 rounded-xl border bg-card hover:border-primary/50 transition-colors shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-lg">8. Tokenomics & Governance</h3>
                                <p className="text-sm text-muted-foreground mt-1">Learn how tokens are designed, distributed, and govern protocols.</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0 ml-4" />
                        </div>
                    </Link>
                </div>
            </div>
        </section>

            <section id="references" className="py-16">
                <div className="text-center">

                    <h2 className="mt-4 text-2xl md:text-3xl font-semibold tracking-tight">Learn More</h2>
                    <p className="mt-2 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                        Wallets, protocols, and resources to start your Web3 journey.
                    </p>
                </div>
                 <div className="mt-12 columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                    {referenceLinks.map((tool) => (
                        <div key={tool.name} className="break-inside-avoid">
                            <h3 className="font-semibold text-lg mb-2">{tool.name}</h3>
                            <ul className="space-y-2">
                                {tool.links.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-muted-foreground hover:text-primary group">
                                            {link.name}
                                            <ExternalLink className="ml-1.5 h-3 w-3 opacity-70 group-hover:opacity-100" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            <section id="faq" className="py-16">
                <div className="text-center">
                    <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Frequently Asked Questions</h2>
                    <p className="mt-2 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                        Some common questions about Web3, answered.
                    </p>
                </div>
                <div className="max-w-5xl mx-auto mt-12">
                    <Accordion type="single" collapsible className="w-full grid md:grid-cols-2 gap-x-8">
                       {faqItems.map((item, index) => (
                         <AccordionItem key={index} value={`faq-${index + 1}`}>
                            <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                            <AccordionContent>
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                       ))}
                    </Accordion>
                </div>
            </section>
    </PageLayout>
  );
}

    