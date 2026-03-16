

import { PageLayout } from '@/components/page-layout';
import { BreadcrumbSchema } from '@/components/breadcrumb-schema';
import { Card, CardContent } from '@/components/ui/card';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { MoveUpRight } from 'lucide-react';
import { AsSeenIn } from '@/components/as-seen-in';
import { pageMetadata, generateMetadata } from '@/lib/metadata';
import { TwitterEmbed } from '@/components/twitter-embed';

export const metadata: Metadata = generateMetadata({
  title: pageMetadata.media.title,
  description: pageMetadata.media.description,
  url: pageMetadata.media.url,
  ogImage: '/images/speaker/Vedang - speaker1.webp',
  ogImageAlt: 'Vedang Vatsa speaking at a conference.',
});

const mediaMentions = [
  { title: "India's CBI Raids 60 Locations in Crackdown on GainBitcoin Scam", source: 'Decrypt', url: 'https://decrypt.co/307790/indias-cbi-raids-60-locations-in-crackdown-on-gainbitcoin-scam' },
  { title: 'Indian Web3 Delegation Submits Recommendations to Chairperson of Parliamentary Standing Committee on Finance', source: 'ANI News', url: 'https://aninews.in/news/business/indian-web3-delegation-submits-recommendations-to-chairperson-of-parliamentary-standing-committee-on-finance20250731143537/' },
  { title: "#Web3 Releases a Collaborative Report on India's Digital Currency", source: 'Business Standard', url: 'https://www.business-standard.com/content/press-releases-ani/hashtag-web3-releases-a-collaborative-report-on-indias-digital-currency-124111200684_1.html' },
  { title: 'Web3 Developers Secure Top-Tier Salaries in 2024: Report', source: 'Cryptorank', url: 'https://cryptorank.io/news/feed/cd6b0-web3-developers-secure-top-tier-salaries-in-2024-report' },
  { title: "India’s Top Web3 Leaders Collaborate To Shape The Future Of The Digital Rupee", source: 'Digital South', url: 'https://digitalsouth.co.in/press-release' },
  { title: 'Crypto In India: Path To Financial Freedom Or A Burden?', source: 'Outlook Money', url: 'https://www.outlookmoney.com/cryptocurrency/crypto-in-india-path-to-financial-freedom-or-a-burden' },
  { title: 'Vedang Vatsa, a star Web3 community builder', source: 'Irish Tech News', url: 'https://irishtechnews.ie/vedang-vatsa-a-star-web3-community-builder/' },
  { title: 'Indian Web3 delegation submits recommendations to Chairperson of Parliamentary Standing Committee on Finance', source: 'The Tribune', url: 'https://www.tribuneindia.com/news/business/indian-web3-delegation-submits-recommendations-to-chairperson-of-parliamentary-standing-committee-on-finance/' },
  { title: 'Tech as an enabler in the new normal', source: 'YourStory', url: 'https://yourstory.com/2020/10/quotes-tech-enabler-digital' },
  { title: 'Digital service delivery will bolster an Atmanirbhar Bharat', source: 'OpIndia', url: 'https://myvoice.opindia.com/2020/09/digital-service-delivery-will-bolster-an-atmanirbhar-bharat/' },
  { title: 'India is hosting the India Blockchain Month festival', source: 'Incrypted', url: 'https://incrypted.com/en/india-is-hosting-the-india-blockchain-month-festival/' },
  { title: 'Delhi to Lead the World in Web3, AI, Real-World Asset Innovation', source: 'MEXC', url: 'https://www.mexc.co/en-IN/news/delhi-to-lead-the-world-in-web3-ai-real-world-asset-innovation/106035' },
  { title: 'India sets sights on becoming a Web3 powerhouse with VDA focus', source: 'Devdiscourse', url: 'https://www.devdiscourse.com/article/business/3542756-india-sets-sights-on-becoming-a-web3-powerhouse-with-vda-focus' },
  { title: 'Stablecoins Surge 72% in 14 Months, Disrupting $27 Trillion Payment Flows', source: 'AInvest', url: 'https://www.ainvest.com/news/stablecoins-surge-72-14-months-disrupting-27-trillion-payment-flows-2507/' },
  { title: 'India Blockchain Month 2025: Delhi Takes Center Stage in Web3, AI, Real-World Asset Innovation', source: 'Toktimes', url: 'https://toktimes.com/india-blockchain-month-2025-delhi-takes-center-stage-in-web3-ai-real-world-asset-innovation/' },
  { title: 'IIT Professor’s Witty Response To Student Asking For Attendance Goes Viral', source: 'Storypick', url: 'https://storypick.com/iit-professor-response-to-student-asking-for-attendance/' },
  { title: 'Bias-free algorithm is essential for trustworthy Artificial Intelligence', source: 'YourStory', url: 'https://yourstory.com/2020/10/bias-free-algorithm-artificial-intelligence' },
  { title: 'From DeFi To NFT: A New Era Of Innovation In Crypto Landscape', source: 'Outlook Money', url: 'https://www.outlookmoney.com/cryptocurrency/from-defi-to-nft-a-new-era-of-innovation-in-crypto-landscape' },
  { title: 'India Blockchain Month 2024 Kicked Off Yesterday', source: 'BeInCrypto', url: 'https://beincrypto.com/india-blockchain-month-2024-kicked-off-yesterday/' },
  { title: "Crypto Appears in Indian Minister's Asset Declaration For First Time", source: 'Yahoo Finance', url: 'https://finance.yahoo.com/news/crypto-appears-indian-ministers-asset-105037335.html' },
  { title: 'What Are Stablecoins And Why Investors Must Know About Them', source: 'Outlook Money', url: 'https://www.outlookmoney.com/cryptocurrency/what-are-stablecoins-and-why-investors-must-know-about-them' },
  { title: "Dell Technologies Forum 2025 Spotlights AI for India's Economic Boom", source: 'WebProNews', url: 'https://www.webpronews.com/dell-technologies-forum-2025-spotlights-ai-for-indias-economic-boom/' },
  { title: 'Bitcoin Hits New All-Time High Above $100,000, Crypto Market Gains', source: 'Outlook Money', url: 'https://www.outlookmoney.com/cryptocurrency/bitcoin-hits-new-all-time-high-above-100000-crypto-market-gains-trading-volume-rises-15' },
  { title: "US House Passes 'GENIUS Act,' Marking Major Step for Crypto Innovation", source: 'Outlook Money', url: 'https://www.outlookmoney.com/cryptocurrency/us-house-passes-genius-act-marking-major-step-for-crypto-innovation' },
  { title: "El Salvador's Bitcoin Bet Swells to $644M as Rally Boosts Sovereign Holdings", source: 'Decrypt', url: 'https://decrypt.co/320814/el-salvadors-bitcoin-bet-swells-to-644m-as-rally-boosts-sovereign-holdings' },
  { title: 'Bitcoin Volatility Soars as Crypto Market Braces for US Presidential Election Result', source: 'Outlook Money', url: 'https://www.outlookmoney.com/cryptocurrency/bitcoin-volatility-soars-as-crypto-market-braces-for-us-presidential-election-result' },
  { title: 'Bitcoin Soars Past $88K, Sparking Optimism in the Crypto Market', source: 'Outlook Money', url: 'https://www.outlookmoney.com/cryptocurrency/bitcoin-soars-past-88k-sparking-optimism-in-the-crypto-market' },
  { title: 'Bitcoin at $106K? Ether Dips as Post-Election Crypto Market Tumbles', source: 'Decrypt', url: 'https://decrypt.co/320879/bitcoin-106k-tumbling-ethereum-dips' },
  { title: "From 2008 To 2024: Bitcoin's Evolution From Idea To Record-Breaking Height", source: 'Outlook Money', url: 'https://www.outlookmoney.com/cryptocurrency/from-2008-to-2024-bitcoins-evolution-from-idea-to-record-breaking-height' },
  { title: 'What Happens If You’ve Accidentally Sent Cryptocurrency To The Wrong Address?', source: 'Outlook Money', url: 'https://www.outlookmoney.com/cryptocurrency/what-happens-if-youve-accidentally-sent-cryptocurrency-to-the-wrong-address' },
  { title: 'DeepSeek AI Unveils Janus for Enhanced AI Reasoning', source: 'InfoQ', url: 'https://www.infoq.com/news/2025/01/deepseek-ai-janus/' },
  { title: 'Cryptocurrency: A New Cyber Threat in BFSI Sector - Report', source: 'Outlook Money', url: 'https://www.outlookmoney.com/cryptocurrency/cryptocurrency-a-new-cyber-threat-in-bfsi-sector-report' },
  { title: "IIT Professor's Harsh Response To Student's Attendance Request Sparks Outrage", source: 'News18', url: 'https://www.news18.com/viral/iit-professors-harsh-response-to-students-attendance-request-sparks-outrage-on-a-different-ego-trip-9108412.html' },
  { title: 'Robert Kiyosaki On Bitcoin: How Fear Of Making Mistakes Keeps Investors From Building Wealth', source: 'Outlook Money', url: 'http://outlookmoney.com/cryptocurrency/robert-kiyosaki-on-bitcoin-how-fear-of-making-mistakes-keeps-investors-from-building-wealth' },
  { title: 'Bitcoin Celebrates Pizza Day By Crossing $111,000 Mark', source: 'Outlook Money', url: 'https://www.outlookmoney.com/cryptocurrency/bitcoin-celebrates-pizza-day-by-crossing-111000-mark-for-first-time-in-market-history' },
  { title: 'Bitcoin Hits $122K: What Lies Ahead For The Market?', source: 'Outlook Money', url: 'https://www.outlookmoney.com/cryptocurrency/bitcoin-hits-122k-what-lies-ahead-for-the-market' },
  { title: 'Economist Peter Schiff Predicts Bitcoin’s End in 2025 Financial Crisis', source: 'Outlook Money', url: 'https://www.outlookmoney.com/cryptocurrency/economist-peter-schiff-predicts-bitcoins-end-in-2025-financial-crisis' },
  { title: "Binance Co-Founder CZ: 'I Haven't Bought a Single Meme Coin or NFT'", source: 'Decrypt', url: 'https://decrypt.co/305216/binance-co-founder-cz-i-havent-bought-a-single-meme-coin-or-nft' },
  { title: 'Bitcoin To Reach $1M by 2030? Robert Kiyosaki’s Projection And What It Means For You', source: 'Outlook Money', url: 'https://www.outlookmoney.com/cryptocurrency/bitcoin-to-reach-1m-by-2030-robert-kiyosakis-projection-and-what-it-means-for-you' },
  { title: 'CFTC’s Kristin Johnson Exits With Warning on Crypto’s Systemic Risk', source: 'Yahoo Finance', url: 'https://finance.yahoo.com/news/cftcs-kristin-johnson-exits-warning-091653928.html' },
  { title: 'Recruiters Say Web3 Execs Lose Remote Edge to Developers', source: 'TheStreet', url: 'https://www.thestreet.com/crypto/innovation/recruiters-say-web3-execs-lose-remote-edge-to-developers' },
  { title: 'Web3 Tarjoaa Osaajille Huippuluokan Palkan', source: 'CryptoNews', url: 'https://cryptonews.com/fi/news/web3-tarjoaa-osaajille-huippuluokan-palkan/' },
  { title: 'Key Reasons Why Ethereum Is Lagging Despite Underlying Potential', source: 'Outlook Money', url: 'https://www.outlookmoney.com/cryptocurrency/key-reasons-why-ethereum-is-lagging-despite-underlying-potential' },
  { title: "A Beginner's Guide To NFTs: From Understanding To Investing In Digital Assets", source: 'Outlook Money', url: 'https://www.outlookmoney.com/cryptocurrency/a-beginners-guide-to-nfts-from-understanding-to-investing-in-digital-assets' },
  { title: 'Income Tax Tribunal Ruling: Cryptocurrencies Treated As Capital Assets For Taxation', source: 'Outlook Money', url: 'https://www.outlookmoney.com/cryptocurrency/income-tax-tribunal-ruling-cryptocurrencies-treated-as-capital-assets-for-taxation' },
  { title: 'JioCoin: What It Is And How Users Can Earn Digital Tokens', source: 'Outlook Money', url: 'https://www.outlookmoney.com/cryptocurrency/jiocoin-what-it-is-and-how-users-can-earn-digital-tokens' },
  { title: 'CFTC’s Kristin Johnson Exits With Warning on Prediction Markets', source: 'Decrypt', url: 'https://decrypt.co/338050/cftcs-kristin-johnson-exits-with-warning-on-prediction-markets' },
  { title: 'Aposta de El Salvador no Bitcoin chega a R$ 3,6 bilhões com alta do mercado', source: 'Portal do Bitcoin', url: 'https://portaldobitcoin.uol.com.br/aposta-de-el-salvador-no-bitcoin-chega-a-r-36-bilhoes-com-alta-do-mercado/' },
  { title: 'Krypto-News: CFTC-Vorsitzende Johnson kritisiert Prognosemärkte', source: 'Business Insider', url: 'https://www.businessinsider.de/krypto/krypto-news-cftc-vorsitzende-johnson-kritisiert-prognosemaerkte/' },
  { title: 'Exchange perde US$ 4,4 milhões em hack e oferece prêmio para quem recuperar fundos', source: 'Portal do Bitcoin', url: 'https://portaldobitcoin.uol.com.br/exchange-perde-de-us-44-milhoes-em-hack-e-oferece-premio-para-quem-recuperar-fundos/' },
  { title: "Study explores Digital Rupee's transformative potential in financial inclusion", source: 'ET Government', url: 'https://government.economictimes.indiatimes.com/news/economy/study-explores-digital-rupees-transformative-potential-in-financial-inclusion/115208696' },
  { title: 'Découvrez le créateur de Deepseek qui se cache derrière l’IA qui fait trembler OpenAI', source: 'Le Big Data', url: 'https://www.lebigdata.fr/decouvrez-le-createur-de-deepseek-qui-se-cache-derriere-lia-qui-fait-trembler-openai' },
  { title: 'What will the ultimate form of the stablecoin chain be?', source: 'Odaily', url: 'https://www.odaily.news/en/post/5206196' },
  { title: 'Will The Indian Parliament Discuss The Issue Of Moonlighting?', source: 'Inventiva', url: 'https://www.inventiva.co.in/stories/parliament-discuss-issue-moonlighting/' },
  { title: 'Indian Web3 delegation submits proposal to Chairman of Parliamentary Standing Committee on Finance', source: 'Bitpush News', url: 'https://www.bitpush.news/articles/7572507' },
  { title: "#Web3 Releases a Collaborative Report on India's Digital Currency", source: 'ThePrint', url: 'https://theprint.in/ani-press-releases/hashtag-web3-releases-a-collaborative-report-on-indias-digital-currency/2352522' },
  { title: 'Parliamentary Committee on Finance selects Virtual Digital Assets for 2024-25 examination', source: 'The Tribune', url: 'https://www.tribuneindia.com/news/business/parliamentary-committee-on-finance-selects-virtual-digital-assets-for-2024-25-examination/' },
  { title: 'Loyalty has gone for a toss: Millennials, moonlighting & start-ups', source: 'Business Today', url: 'https://www.businesstoday.in/entrepreneurship/story/loyalty-has-gone-for-a-toss-millennials-moonlighting-start-ups-350929-2022-10-27' },
  { title: '5 Common Mistakes Every Beginner Should Avoid In Crypto', source: 'Outlook Money', url: 'https://www.outlookmoney.com/cryptocurrency/5-common-mistakes-every-beginner-should-avoid-in-crypto' },
  { title: "Przełom! YouTube Płaci Twórcom w Kryptowalutach. Rewolucja w Monetyzacji 2025?", source: 'Investing.com', url: 'https://pl.investing.com/analysis/przelom-youtube-placi-tworcom-w-kryptowalutach-rewolucja-w-monetyzacji-2025-200294875' },
  { title: "YouTube to Let US Creators Take Earnings in PayPal's Stablecoin", source: 'Decrypt', url: 'https://decrypt.co/352125/youtube-us-creators-take-earnings-paypals-stablecoin' },
  { title: "YouTube Now Lets U.S. Creators Take Earnings in PayPal's Stablecoin", source: 'Yahoo Finance', url: 'https://finance.yahoo.com/news/youtube-now-lets-us-creators-053731369.html' },
  { title: 'Blockchain Applications', source: 'Startup India', url: 'https://www.startupindia.gov.in/content/sih/en/bloglist/blogs/Blockchain_Applications.html' },
  { title: 'YouTube now allows creators to be paid in cryptocurrencies', source: 'Portal do Bitcoin', url: 'https://portaldobitcoin.uol.com.br/youtube-agora-permite-que-criadores-sejam-pagos-em-criptomoedas/' },
];

const speakingEngagementImages = [
  '/images/speaker/Vedang - speaker1.webp',
  '/images/speaker/Vedang - speaker2.webp',
  '/images/speaker/Vedang - speaker3.webp',
  '/images/speaker/Vedang - speaker4.webp',
  '/images/speaker/Vedang - speaker5.webp',
  '/images/speaker/Vedang - speaker6.webp',
  '/images/speaker/Vedang - speaker7.webp',
  '/images/speaker/Vedang - speaker8.webp',
  '/images/speaker/Vedang - speaker9.webp',
  '/images/speaker/Vedang - speaker10.webp',
  '/images/speaker/Vedang - speaker11.webp',
  '/images/speaker/Vedang - speaker12.webp',
  '/images/speaker/Vedang - speaker13.webp',
  '/images/speaker/Vedang - speaker14.webp',
  '/images/speaker/Vedang - speaker15.webp',
  '/images/speaker/Vedang - speaker16.webp',
  '/images/speaker/Vedang - speaker17.webp',
  '/images/speaker/Vedang - speaker18.webp',
  '/images/speaker/Vedang - speaker19.webp',
  '/images/speaker/Vedang - speaker20.webp',
  '/images/speaker/Vedang - speaker21.webp',
  '/images/speaker/Vedang - speaker22.jpg',
  '/images/speaker/Vedang - speaker23.jpg',
  '/images/speaker/Vedang - speaker24.jpeg',
  '/images/speaker/Vedang - speaker25.jpeg',
  '/images/speaker/Vedang - speaker26.jpg',
  '/images/speaker/Vedang - speaker27.jpeg',
  '/images/speaker/Vedang - speaker28.jpeg',
];


export default function MediaPage() {
  return (
    <PageLayout>
      <BreadcrumbSchema items={[{ name: "Media & Speaking", url: "https://veda.ng/media" }]} />
      <div className="py-8">
        <div className="container mx-auto px-4 md:px-6">
          <section className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Speaker on Emerging Technologies</h1>
            <p className="mt-3 text-base md:text-lg text-muted-foreground">
              As a recognized voice in AI, Web3, and the future of technology, Vedang is a frequent speaker at
              international conferences, academic institutions, and corporate events. His talks demystify complex
              topics, including decentralized economies and agentic AI, providing audiences with actionable insights
              into the forces shaping our world. Below is a glimpse into his media features and speaking engagements.
            </p>
          </section>

          <section className="max-w-4xl mx-auto py-8">
            <ul className="space-y-1 text-sm text-muted-foreground text-left md:columns-2 md:gap-4">
              <li className="flex items-start gap-2"><span className="text-primary mt-1">◆</span><span>Founder, Hashtag Web3 (100,000+ member community of AI & Web3 professionals)</span></li>
              <li className="flex items-start gap-2"><span className="text-primary mt-1">◆</span><span>Featured in Favikon’s Top 50 Fintech & Crypto Creators and Thinkers360’s Top 50 Metaverse Thought Leaders</span></li>
              <li className="flex items-start gap-2"><span className="text-primary mt-1">◆</span><span>BE, Mtech, MBA, Chartered Engineer, IIT Kanpur alumnus, Fellow of the Royal Society of Arts</span></li>
              <li className="flex items-start gap-2"><span className="text-primary mt-1">◆</span><span>Speaker at IIT Delhi, IIT Kanpur, OP Jindal University, Bharati Vidyapeeth, TUM Munich, ISB Hyderabad, ETH Enugu, India Blockchain Month, Premier AI and Web3 Gala, The Responsible AI Forum, Bizthon, Code Arica Conference, etc.</span></li>
              <li className="flex items-start gap-2"><span className="text-primary mt-1">◆</span><span>Young Researcher 2020 (with 25 publications) and Young Achiever 2020-21 awardee</span></li>
              <li className="flex items-start gap-2"><span className="text-primary mt-1">◆</span><span>Ex-EY & KPMG Consultant, Former Country Head for one of the largest career-tech companies</span></li>
              <li className="flex items-start gap-2"><span className="text-primary mt-1">◆</span><span>Recommendation by Jack Allison (Screenwriter for Oscars 2017), medal by the former director of Indian Prime Minister’s office</span></li>
              <li className="flex items-start gap-2"><span className="text-primary mt-1">◆</span><span>80 million Linkedin post views & 55 million views on Telegram channel</span></li>
              <li className="flex items-start gap-2"><span className="text-primary mt-1">◆</span><span>Issued Japan’s special visa for Intellectual people</span></li>
              <li className="flex items-start gap-2"><span className="text-primary mt-1">◆</span><span>Traveled 18 countries & jumped the world’s highest canyon swing</span></li>
            </ul>
          </section>
          
          <section className="py-8">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-center mb-6">Invited at the Parliament of India to discuss about Virtual Digital Assets</h2>
            <Card className="max-w-xl mx-auto">
                <CardContent className="p-2 sm:p-4">
                    <TwitterEmbed tweetId="1996239975906676795" />
                </CardContent>
            </Card>
          </section>

          <AsSeenIn />

          <section className="py-8">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-center mb-6">Speaking Engagements</h2>
            <div className="columns-2 sm:columns-3 md:columns-4 gap-4">
              {speakingEngagementImages.map((src, index) => (
                <div key={index} className="mb-4 break-inside-avoid">
                  <Image
                    src={src}
                    alt={`Vedang Vatsa speaking at engagement ${index + 1}`}
                    width={500}
                    height={500}
                    className="rounded-md object-cover w-full h-auto"
                    data-ai-hint="person speaking"
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="py-8">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-center mb-6">Media Mentions</h2>
            <div className="grid md:grid-cols-2 gap-4">
                {mediaMentions.map((mention, index) => (
                  <Link
                    key={index}
                    href={mention.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-md border bg-card text-card-foreground transition-shadow duration-300 block hover:bg-muted/50 p-4"
                  >
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-lg font-semibold leading-snug group-hover:text-primary">{mention.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{mention.source}</p>
                        </div>
                        <MoveUpRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </div>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}
