
import Image from 'next/image';

const asSeenInLogos = [
    { name: 'Inc42', logo: '/images/press/68296-business-media-company-inc42-startup-marketing.webp' },
    { name: 'KPMG', logo: '/images/press/TheStreetRoundtable_Vedang.webp' },
    { name: 'ANI', logo: '/images/press/Ani-logo-black.webp' },
    { name: 'Business Today', logo: '/images/press/bt_business_today_vedang_vatsa.webp' },
    { name: 'Business Insider', logo: '/images/press/Business_Insider_2023_logo.svg.png' },
    { name: 'Business Standard', logo: '/images/press/business-standard-logo-2.webp' },
    { name: 'Dainik Bhaskar', logo: '/images/press/Dainik_Bhaskar_Logo.webp' },
    { name: 'Decrypt', logo: '/images/press/Decrypt_logo.svg' },
    { name: 'ET', logo: '/images/press/et-logo4px.webp' },
    { name: 'IEEE Computer', logo: '/images/press/IEEE_Computer.webp' },
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
    { name: 'Outlook Money', logo: '/images/press/money-logo.webp' },
    { name: 'The Tribune IPRD', logo: '/images/press/The_Tribune_India_IPRD_Indian_PR_Distribution.webp' },
    { name: 'ThePrint', logo: '/images/press/ThePrint_logo.webp' },
    { name: 'Yahoo! Finance', logo: '/images/press/Yahoo_Finance_logo.webp' },
    { name: 'Startup India', logo: '/images/press/DPIIT_StartupIndia_Vedang.webp' },
    { name: 'Investing.com', logo: '/images/press/investing_vedang.webp' },
];

export function AsSeenIn() {
  return (
    <section className="py-8 bg-background" data-nosnippet>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-center mb-5">As Seen In</h2>
        <div className="grid w-full grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-6 md:gap-8 items-center">
          {asSeenInLogos.map((media, index) => (
            <div key={index} className="flex items-center justify-center">
              <Image
                src={media.logo}
                alt={`${media.name} logo`}
                width={120}
                height={40}
                unoptimized={media.logo.endsWith('.svg')}
                priority={index < 7}
                style={{ width: 'auto', height: 'auto' }}
                className="w-full h-8 sm:h-10 object-contain mix-blend-multiply opacity-80 hover:opacity-100 transition-all duration-300"
              />
            </div>
          ))}
        </div>
    </section>
  );
}
