
import Image from 'next/image';

const asSeenInLogos = [
    { name: 'Inc42', logo: '/images/press/68296-business-media-company-inc42-startup-marketing.png' },
    { name: 'KPMG', logo: '/images/press/TheStreetRoundtable_Vedang.webp' },
    { name: 'ANI', logo: '/images/press/Ani-logo-black.png' },
    { name: 'Business Today', logo: '/images/press/bt_business_today_vedang_vatsa.png' },
    { name: 'Business Insider', logo: '/images/press/Business_Insider_2023_logo.svg.png' },
    { name: 'Business Standard', logo: '/images/press/business-standard-logo-2.png' },
    { name: 'Dainik Bhaskar', logo: '/images/press/Dainik_Bhaskar_Logo.png' },
    { name: 'Decrypt', logo: '/images/press/Decrypt_logo.svg' },
    { name: 'ET', logo: '/images/press/et-logo4px.png' },
    { name: 'IEEE Computer', logo: '/images/press/IEEE_Computer.png' },
    { name: 'BeInCrypto', logo: '/images/press/beincrypto_Vedang.webp' },
    { name: 'Irish Tech News', logo: '/images/press/irishtechnews_Vedang.webp' },
    { name: 'OpIndia', logo: '/images/press/image-28.webp' },
    { name: 'IndiaAI', logo: '/images/press/image-29.webp' },
    { name: 'Lebigdata', logo: '/images/press/image-32.webp' },
    { name: 'Cryptonews', logo: '/images/press/cryptonews_Vedang.webp' },
    { name: 'TheNewsCrypto', logo: '/images/press/thenewscrypto_vedang.webp' },
    { name: 'NDTVGadgets360', logo: '/images/press/image-48.webp' },
    { name: 'BritishNewsNetwork', logo: '/images/press/BritishNewsNetwork_vedang.webp' },
    { name: 'Yourstory', logo: '/images/press/yourstory_vedang.webp' },
    { name: 'Outlook Money', logo: '/images/press/money-logo.png' },
    { name: 'The Tribune IPRD', logo: '/images/press/The_Tribune_India_IPRD_Indian_PR_Distribution.png' },
    { name: 'ThePrint', logo: '/images/press/ThePrint_logo.png' },
    { name: 'Yahoo! Finance', logo: '/images/press/Yahoo_Finance_logo.png' },
    { name: 'Startup India', logo: '/images/press/DPIIT_StartupIndia_Vedang.webp' },
    { name: 'Investing.com', logo: '/images/press/investing_vedang.webp' },
];

export function AsSeenIn() {
  return (
    <section className="py-12 bg-background" data-nosnippet>
        <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-center mb-6">As Seen In</h2>
            <div className="mx-auto max-w-6xl grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-6 md:gap-8 items-center">
              {asSeenInLogos.map((media, index) => (
                <div key={index} className="flex items-center justify-center">
                  <Image
                    src={media.logo}
                    alt={`${media.name} logo`}
                    width={120}
                    height={40}
                    unoptimized={media.logo.endsWith('.svg')}
                    className="w-full h-8 sm:h-10 object-contain dark:brightness-0 dark:invert"
                  />
                </div>
              ))}
            </div>
        </div>
    </section>
  );
}
