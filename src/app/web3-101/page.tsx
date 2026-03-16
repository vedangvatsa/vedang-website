
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { PageLayout } from '@/components/page-layout';

import { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { Globe, Layers, ShieldCheck, Wallet, Puzzle, Star, BrainCircuit } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { pageMetadata, generateMetadata } from '@/lib/metadata';

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
    answer: "Web3's decentralization offers a new security model. Because data is distributed across thousands of computers, there is no single point of failure for an attacker to target, making the underlying network extremely robust. However, this model shifts responsibility to the user. You are in control of your own assets ('self-custody'), which means you must protect your wallet's 'private keys' or 'seed phrase.' The biggest risks are scams (phishing), social engineering, and interacting with poorly-coded smart contracts. Education is your best defense."
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
                Go beyond the buzzwords and discover the next evolution of the internet. This course demystifies Web3, breaking down blockchain, decentralization, and digital ownership into clear, understandable concepts. Learn what it means to build and participate in a user-owned web.
                </p>

                <div className="mt-8 flex justify-center items-center gap-4">
                    <Badge variant="outline">By: Vedang Vatsa</Badge>
                    <Badge variant="outline">Prerequisite: An open mind</Badge>
                </div>
            </div>
        </section>

        <div className="container mx-auto px-4 md:px-6 max-w-5xl py-16 space-y-12">
            
            <Card className="overflow-hidden border-primary/20 shadow-lg shadow-primary/5">
                <CardHeader className="bg-secondary/30 p-6">
                    <div className="flex items-center gap-4">
                        <div>
                           <Globe className="w-6 h-6 text-muted-foreground"/>
                        </div>
                        <div>
                            <CardDescription>Module 1</CardDescription>
                            <CardTitle className="text-2xl">The Vision: Why Web3 Matters</CardTitle>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                     <p className="text-muted-foreground">Before diving into the technology, it's crucial to understand the 'why' behind Web3. This module traces the internet's evolution, highlighting the problems Web3 aims to solve and laying out its philosophical foundations based on decentralization, user sovereignty, and open protocols.</p>
                    <Accordion type="single" collapsible className="w-full mt-4">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-lg">The Evolution of the Web: From Read to Read-Write-Own</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <p>The internet has evolved through distinct phases, each defined by how we interact with information:</p>
                                <ul className="my-6 space-y-4">
                                    <li>
                                        <strong>Web1 (The Read-Only Web, ~1990-2004):</strong> This was the era of static websites. Information was presented by creators (companies, institutions) for users to consume. Think of it as a giant, linked digital encyclopedia. Interaction was minimal, and users were passive consumers of content. The protocols (HTTP, SMTP) were open and decentralized.
                                    </li>
                                    <li>
                                        <strong>Web2 (The Read-Write Web, ~2004-Present):</strong> The rise of social media and user-generated content transformed users into creators. Platforms like Facebook, YouTube, and Twitter made it easy to create and share content. However, this came at a cost: centralization. A few large corporations now act as gatekeepers, controlling the platforms, owning user data, and setting the rules. You can create content, but you don't truly own it or your digital identity.
                                    </li>
                                    <li>
                                        <strong>Web3 (The Read-Write-Own Web):</strong> This is the next paradigm shift, aiming to combine the decentralized, open ethos of Web1 with the rich, interactive experience of Web2. Built on technologies like blockchain, Web3 enables users to truly own their data, assets, and identity. It's about shifting power from centralized platforms back to users and creators.
                                    </li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger className="text-lg">The Core Problem Web3 Addresses: Centralization</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <p>Web2, for all its benefits, has led to significant issues stemming from centralization:</p>
                                <ul className="my-6">
                                    <li><strong>Censorship and Control:</strong> Centralized platforms can unilaterally de-platform users, remove content, or change their rules at any time, often with little recourse.</li>
                                    <li><strong>Data Exploitation:</strong> Your personal data is the product. It's collected, analyzed, and sold to advertisers, often without your full understanding or consent. You have little control over how it's used.</li>
                                    <li><strong>Value Extraction:</strong> Platforms take a significant cut of the value created by users. Creators are subject to changing monetization policies and platform fees, making their livelihoods precarious.</li>
                                    <li><strong>Single Points of Failure:</strong> If a platform's servers go down, the service becomes unavailable for everyone. They are also prime targets for data breaches.</li>
                                </ul>
                                <p>Web3 proposes a solution through decentralization, creating systems that are more resilient, transparent, and fair by removing the need for a trusted central intermediary.</p>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>

            <Card className="overflow-hidden border-primary/20 shadow-lg shadow-primary/5">
                <CardHeader className="bg-secondary/30 p-6">
                    <div className="flex items-center gap-4">
                        <div>
                           <Layers className="w-6 h-6 text-muted-foreground"/>
                        </div>
                        <div>
                            <CardDescription>Module 2</CardDescription>
                            <CardTitle className="text-2xl">The Bedrock: Blockchain and Cryptocurrencies</CardTitle>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <p className="text-muted-foreground">This module demystifies the core technology that underpins Web3. We'll break down what a blockchain is, how it works, and the crucial role cryptocurrencies play in making these decentralized networks function.</p>
                     <Accordion type="single" collapsible className="w-full mt-4">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-lg">What is a Blockchain? (A Simple Analogy)</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <p>Imagine a shared, digital notebook that is copied and distributed to thousands of people around the world. This is a blockchain.</p>
                                <ul className="my-6">
                                    <li><strong>Blocks are Pages:</strong> Each page in the notebook is a "block" that contains a list of transactions. Once a page is full, it's added to the notebook.</li>
                                    <li><strong>Chain is the Binding:</strong> Each new page is cryptographically "chained" to the previous one, creating a chronological and unbreakable sequence. This cryptographic link makes it impossible to alter a past page without invalidating all the pages that come after it.</li>
                                    <li><strong>Distributed and Synchronized:</strong> Everyone in the network has a copy of the notebook. When a new page is added, everyone updates their copy. This massive redundancy is what makes it so secure. There's no single "master copy" to attack or corrupt.</li>
                                </ul>
                                <p>This creates a shared, immutable ledger-a single source of truth that isn't controlled by any one person or company. It allows people who don't know or trust each other to agree on a set of facts without needing a middleman.</p>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                             <AccordionTrigger className="text-lg">The Role of Cryptocurrencies (e.g., ETH)</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <p>Cryptocurrencies are not just speculative assets; they are essential for the functioning of a blockchain network. They serve two critical purposes:</p>
                                 <ul>
                                    <li><strong>Paying for Computation ("Gas"):</strong> Every action on a blockchain-sending money, minting an NFT, voting in a DAO-requires computational resources from the network. Cryptocurrencies (like Ether, or ETH, on the Ethereum blockchain) are used to pay the network participants ("validators" or "miners") for this computation. This fee is often called "gas."</li>
                                    <li><strong>Economic Security (Incentives):</strong> Cryptocurrencies are used to reward validators for honestly processing transactions and securing the network. Validators often have to "stake" a large amount of crypto as collateral. If they act dishonestly, they can lose their stake. This powerful economic incentive aligns their interests with the health of the network, removing the need for a central administrator.</li>
                                </ul>
                                <p>In essence, crypto provides the economic layer that allows a decentralized network of strangers to coordinate and secure itself.</p>
                            </AccordionContent>
                        </AccordionItem>
                     </Accordion>
                </CardContent>
            </Card>

            <Card className="overflow-hidden border-primary/20 shadow-lg shadow-primary/5">
                <CardHeader className="bg-secondary/30 p-6">
                    <div className="flex items-center gap-4">
                        <div>
                           <BrainCircuit className="w-6 h-6 text-muted-foreground"/>
                        </div>
                        <div>
                            <CardDescription>Module 3</CardDescription>
                            <CardTitle className="text-2xl">Smart Contracts: The Brains of Web3</CardTitle>
                        </div>
                    </div>
                </CardHeader>
                 <CardContent className="p-6">
                     <p className="text-muted-foreground">If blockchain is the immutable ledger, smart contracts are what make it programmable and intelligent. This module explores how these pieces of code are transforming blockchain from a simple database into a global, permissionless computer.</p>
                     <Accordion type="single" collapsible className="w-full mt-4">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-lg">What are Smart Contracts?</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <p>A smart contract is simply a program that runs on the blockchain. It's a self-executing contract where the terms of the agreement between parties are written directly into code. They run exactly as programmed without any possibility of downtime, censorship, fraud, or third-party interference.</p>
                                <blockquote className="border-l-4 border-primary/50 pl-4 italic my-4">
                                  <strong>Analogy: A Vending Machine.</strong> A vending machine is a physical smart contract. You put in money (input), select an item (condition), and the machine automatically dispenses the item (output). There's no cashier needed; the logic is baked into the machine. Smart contracts are digital vending machines for any kind of agreement or application.
                                </blockquote>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                             <AccordionTrigger className="text-lg">Key Properties and Capabilities</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                 <ul>
                                    <li><strong>Autonomous:</strong> Once deployed to the blockchain, they run automatically when their conditions are met, without needing anyone to trigger them.</li>
                                    <li><strong>Immutable:</strong> The code of a smart contract cannot be changed after it's deployed. This ensures that the rules of the game are fixed and cannot be altered by a single party.</li>
                                    <li><strong>Transparent:</strong> The code is visible to everyone on the blockchain, allowing anyone to verify its logic and functionality.</li>
                                    <li><strong>Composable ("Money Legos"):</strong> This is one of the most powerful features. Because smart contracts are open and live on the same network, developers can build new applications by combining existing ones, like snapping together Lego blocks. A new DeFi protocol can integrate a pre-existing stablecoin and a decentralized exchange to create a completely new product without asking for permission.</li>
                                </ul>
                                <p>This composability accelerates innovation at an unprecedented rate and is the driving force behind the rapid growth of the Web3 ecosystem.</p>
                            </AccordionContent>
                        </AccordionItem>
                     </Accordion>
                </CardContent>
            </Card>

            <Card className="overflow-hidden border-primary/20 shadow-lg shadow-primary/5">
                <CardHeader className="bg-secondary/30 p-6">
                    <div className="flex items-center gap-4">
                        <div>
                           <Puzzle className="w-6 h-6 text-muted-foreground"/>
                        </div>
                        <div>
                            <CardDescription>Module 4</CardDescription>
                            <CardTitle className="text-2xl">The Web3 Ecosystem: dApps, NFTs, and DAOs</CardTitle>
                        </div>
                    </div>
                </CardHeader>
                 <CardContent className="p-6">
                     <p className="text-muted-foreground">With the foundational technologies in place, we can now explore the exciting landscape of applications being built in Web3. This module covers the three most important pillars of the current ecosystem.</p>
                     <Accordion type="single" collapsible className="w-full mt-4">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-lg">dApps: Decentralized Applications</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <p>A dApp is a decentralized application. While its frontend might look and feel like a regular website or mobile app, its backend logic is powered by smart contracts running on a blockchain. This means no single entity controls the app.</p>
                                <p><strong>Key Differences from Web2 Apps:</strong></p>
                                <ul>
                                    <li><strong>Decentralized Backend:</strong> Instead of relying on a company's private servers (like AWS), dApps run on a peer-to-peer network.</li>
                                    <li><strong>Permissionless Login:</strong> You don't sign up with an email and password. You connect your digital wallet, which acts as your secure, self-owned identity.</li>
                                    <li><strong>Transparency:</strong> All transactions and interactions are recorded on the public blockchain for anyone to verify.</li>
                                </ul>
                                <blockquote className="border-l-4 border-primary/50 pl-4 italic my-4">
                                  <strong>Example: Uniswap.</strong> Uniswap is a decentralized exchange (DEX) for swapping cryptocurrencies. Unlike a centralized exchange like Coinbase, there is no company holding your funds or acting as an intermediary. It's just a set of smart contracts that allow users to trade directly with each other from their own wallets.
                                </blockquote>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                             <AccordionTrigger className="text-lg">NFTs: The Ownership Layer of the Internet</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <p>An NFT (Non-Fungible Token) is a unique digital token on a blockchain that represents and proves ownership of an asset. "Non-fungible" means it's one-of-a-kind and cannot be replaced with another identical token (unlike a dollar bill, which is fungible).</p>
                                <p>NFTs solve a fundamental problem of the internet: the inability to prove ownership of a digital item. Before NFTs, any digital file could be endlessly copied, making the original indistinguishable from a copy. NFTs create verifiable digital scarcity.</p>
                                <p><strong>Applications of NFTs:</strong></p>
                                 <ul>
                                    <li><strong>Digital Art & Collectibles:</strong> The most famous use case, allowing artists to sell verifiably unique digital works directly to collectors.</li>
                                    <li><strong>Gaming:</strong> In-game items (like swords, skins, or land) can be NFTs, which means players truly own them and can trade or sell them on open marketplaces, even outside the game.</li>
                                    <li><strong>Ticketing & Memberships:</strong> An NFT can act as a ticket to an event or a key to a private community, with ownership being easily verifiable.</li>
                                    <li><strong>Digital Identity:</strong> Your ".eth" name (from the Ethereum Name Service) is an NFT that acts as a human-readable username for your wallet and a decentralized profile.</li>
                                </ul>
                                <p>NFTs are the building blocks for an economy based on digital ownership, giving power back to creators and users.</p>
                            </AccordionContent>
                        </AccordionItem>
                         <AccordionItem value="item-3">
                            <AccordionTrigger className="text-lg">DAOs: A New Model for Organization</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <p>A DAO (Decentralized Autonomous Organization) is a community-led entity with no central leadership. It's a new way for people to coordinate and govern themselves over the internet.</p>
                                <p><strong>How a DAO Works:</strong></p>
                                <ol>
                                    <li><strong>Rules as Code:</strong> The organization's rules and governance mechanisms are written into smart contracts.</li>
                                    <li><strong>Community Treasury:</strong> DAOs typically have a shared treasury that no single person can access without the group's approval.</li>
                                    <li><strong>Governance Tokens:</strong> To make decisions, the DAO issues governance tokens. Members vote on proposals with these tokens, and the outcome is automatically executed by the smart contracts if the vote passes.</li>
                                    <li><strong>Proposals:</strong> Any member can make a proposal, such as how to spend treasury funds or whether to approve a new project.</li>
                                </ol>
                                <p>DAOs are being used to manage everything from DeFi protocols (like MakerDAO) to social clubs (like Friends with Benefits) and investment collectives. They represent a powerful new tool for collective action and governance.</p>
                            </AccordionContent>
                        </AccordionItem>
                     </Accordion>
                </CardContent>
            </Card>

            <Card className="overflow-hidden border-primary/20 shadow-lg shadow-primary/5">
                <CardHeader className="bg-secondary/30 p-6">
                    <div className="flex items-center gap-4">
                        <div>
                           <Wallet className="w-6 h-6 text-muted-foreground"/>
                        </div>
                        <div>
                            <CardDescription>Module 5</CardDescription>
                            <CardTitle className="text-2xl">Getting Started: Your Passport to Web3</CardTitle>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <p className="text-muted-foreground">Ready to dive in? This module covers the practical first steps to begin your journey into the world of Web3. It's less technical than you might think, but requires a new mindset around security and self-custody.</p>
                     <Accordion type="single" collapsible className="w-full mt-4">
                         <AccordionItem value="item-1">
                            <AccordionTrigger className="text-lg">Step 1: Get a Digital Wallet</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <p>A digital wallet is your primary tool for interacting with Web3. It's a secure application that lets you store and manage your cryptocurrencies and NFTs. More importantly, it acts as your digital identity, allowing you to log in to dApps without needing a username and password.</p>
                                <ul>
                                    <li><strong>Self-Custodial vs. Custodial:</strong> A self-custodial wallet (like MetaMask or Rainbow) means YOU, and only you, have control over your assets. A custodial wallet (like a Coinbase account) means the company holds your assets for you. For true Web3 participation, you need a self-custodial wallet.</li>
                                    <li><strong>The Seed Phrase: The Golden Rule of Web3.</strong> When you create a self-custodial wallet, you will be given a "seed phrase" or "recovery phrase"-a unique 12 or 24-word password. This is the master key to all your assets.
                                      <ul className="my-4">
                                        <li><strong>You MUST write it down and store it securely offline.</strong></li>
                                        <li><strong>NEVER share it with anyone.</strong></li>
                                        <li><strong>NEVER store it digitally (e.g., in a text file, email, or photo).</strong></li>
                                      </ul>
                                      If you lose your seed phrase, you lose access to your assets forever. If someone else gets it, they can steal all your assets. This is the most important rule of Web3.
                                    </li>
                                    <li><strong>Popular Wallets:</strong> The most common wallets are browser extensions like <Link href="https://metamask.io/" target="_blank" rel="noopener noreferrer">MetaMask</Link> or mobile apps like <Link href="https://www.rainbow.me/" target="_blank" rel="noopener noreferrer">Rainbow</Link> and <Link href="https://phantom.app/" target="_blank" rel="noopener noreferrer">Phantom</Link> (for the Solana ecosystem).</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger className="text-lg">Step 2: Get Some Crypto (The Safe Way)</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <p>To use most dApps, you'll need a small amount of cryptocurrency to pay for transaction fees (known as "gas"). The process of converting traditional money (like USD or EUR) into cryptocurrency is called an "onramp."</p>
                                <ol>
                                  <li><strong>Use a Reputable Centralized Exchange:</strong> For beginners, the safest way to buy your first crypto is through a large, regulated exchange like Coinbase, Kraken, or Gemini.</li>
                                  <li><strong>Link Your Bank Account:</strong> You can link your bank account or debit card to purchase crypto.</li>
                                  <li><strong>Buy a Major Cryptocurrency:</strong> Start with a well-established cryptocurrency like Ether (ETH), which is the native currency of the Ethereum network and is required for most dApp interactions.</li>
                                  <li><strong>Withdraw to Your Self-Custodial Wallet:</strong> Once you've bought crypto on the exchange, you need to withdraw it to your own wallet (the one you created in Step 1). This moves it from the exchange's custody to your self-custody. You will need to copy your wallet's public address (a long string of characters starting with '0x') and paste it into the withdrawal form on the exchange. Double-check the address!</li>
                                </ol>
                            </AccordionContent>
                        </AccordionItem>
                         <AccordionItem value="item-3">
                            <AccordionTrigger className="text-lg">Step 3: Explore the Ecosystem</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <p>Now that you have a wallet with some funds, you're ready to explore! Here are some things you can do:</p>
                                <ul>
                                  <li><strong>Get a Web3 Username:</strong> Go to the Ethereum Name Service (ENS) and register a ".eth" name for your wallet. This gives you a human-readable username instead of a long address.</li>
                                  <li><strong>Try a dApp:</strong> Explore a dApp aggregator like DappRadar to find interesting applications. You could try swapping a small amount of tokens on a decentralized exchange like Uniswap.</li>
                                  <li><strong>Collect an NFT:</strong> Look for a free or low-cost NFT to mint. This will give you first-hand experience of what digital ownership feels like.</li>
                                </ul>
                                <p><strong>Important:</strong> Start small. Only use small amounts of money that you are comfortable losing as you learn. The goal is to learn the mechanics safely.</p>
                            </AccordionContent>
                        </AccordionItem>
                     </Accordion>
                </CardContent>
            </Card>

            <Card className="overflow-hidden border-primary/20 shadow-lg shadow-primary/5">
                <CardHeader className="bg-secondary/30 p-6">
                     <div className="flex items-center gap-4">
                        <div>
                           <ShieldCheck className="w-6 h-6 text-muted-foreground"/>
                        </div>
                        <div>
                            <CardDescription>Module 6</CardDescription>
                            <CardTitle className="text-2xl">The Future: Challenges and Opportunities</CardTitle>
                        </div>
                    </div>
                </CardHeader>
                 <CardContent className="p-6">
                     <p className="text-muted-foreground">Web3 is not a utopia. It's a young, evolving technology with immense potential but also significant hurdles. This final module explores the open questions and the exciting road ahead.</p>
                     <Accordion type="single" collapsible className="w-full mt-4">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-lg">The Promise: A More Equitable Internet</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <p>The potential of Web3 is vast. By building on open, permissionless, and user-owned infrastructure, we can create:</p>
                                <ul>
                                    <li><strong>A Fairer Creator Economy:</strong> Artists, musicians, and writers can publish their work as NFTs, capturing more of the value and building a direct relationship with their audience, free from platform intermediaries.</li>
                                    <li><strong>User-Owned Platforms:</strong> Social media, gaming, and other platforms can be owned and governed by their users through DAOs, ensuring the rules are fair and the value is distributed among those who create it.</li>
                                    <li><strong>A Global, Open Financial System (DeFi):</strong> Decentralized Finance aims to rebuild the traditional financial system on open rails, providing access to services like lending, borrowing, and trading to anyone with an internet connection, without needing a bank.</li>
                                    <li><strong>Portable Digital Identity:</strong> Your wallet becomes your universal, self-sovereign identity, allowing you to move seamlessly between applications without giving up control of your data.</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                         <AccordionItem value="item-2">
                             <AccordionTrigger className="text-lg">The Challenges on the Horizon</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                               <p>Despite the promise, Web3 faces significant challenges that need to be solved for mass adoption:</p>
                               <ul>
                                    <li><strong>Scalability:</strong> Decentralized networks are inherently slower and more expensive to use than centralized ones. A transaction on Ethereum can sometimes cost several dollars and take seconds to confirm. Solutions like "Layer 2s" (e.g., Arbitrum, Optimism, Base) are being built to address this by processing transactions off-chain, but the technology is still maturing.</li>
                                    <li><strong>User Experience (UX):</strong> The current UX is too complex for the average user. Managing seed phrases, paying gas fees, and navigating different blockchain networks are major points of friction. Abstracting this complexity away is the single biggest challenge for onboarding the next billion users.</li>
                                    <li><strong>Regulation:</strong> Governments around the world are still grappling with how to regulate cryptocurrencies, DAOs, and DeFi. This legal and regulatory uncertainty creates risk for builders and users alike.</li>
                                    <li><strong>Security and Education:</strong> The self-custody model puts a huge burden on the user. Scams are rampant, and without proper education, new users are highly vulnerable. Building safer wallets and better educational resources is paramount.</li>
                                </ul>
                                <p>Solving these challenges is the primary focus of the thousands of developers and entrepreneurs building in the Web3 space today. The journey is just beginning.</p>
                            </AccordionContent>
                        </AccordionItem>
                     </Accordion>
                </CardContent>
            </Card>

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
        </div>
    </PageLayout>
  );
}

    