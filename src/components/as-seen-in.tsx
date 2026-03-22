
import Image from 'next/image';

const asSeenInLogos = [
    { name: 'Inc42', logo: '/images/press/68296-business-media-company-inc42-startup-marketing.png' },
    { name: 'KPMG', logo: '/images/press/TheStreetRoundtable_Vedang.png' },
    { name: 'ANI', logo: '/images/press/Ani-logo-black.png' },
    { name: 'Business Today', logo: '/images/press/bt_business_today_vedang%20vatsa-min%20(1).png' },
    { name: 'Business Insider', logo: '/images/press/Business_Insider_2023_logo.svg.png' },
    { name: 'Business Standard', logo: '/images/press/business-standard-logo-2.png' },
    { name: 'Dainik Bhaskar', logo: '/images/press/Dainik_Bhaskar_Logo.png' },
    { name: 'Decrypt', logo: '/images/press/Decrypt_logo.svg' },
    { name: 'ET', logo: '/images/press/et-logo4px.png' },
    { name: 'IEEE Computer', logo: '/images/press/IEEE_Computer.png' },
    { name: 'BeInCrypto', logo: '/images/press/beincrypto_Vedang.png' },
    { name: 'Irish Tech News', logo: '/images/press/irishtechnews_Vedang.png' },
    { name: 'OpIndia', logo: '/images/press/image-28.webp' },
    { name: 'IndiaAI', logo: '/images/press/image-29.webp' },
    { name: 'Lebigdata', logo: '/images/press/image-32.webp' },
    { name: 'Cryptonews', logo: '/images/press/cryptonews_Vedang.png' },
    { name: 'TheNewsCrypto', logo: '/images/press/thenewscrypto_vedang.png' },
    { name: 'NDTVGadgets360', logo: '/images/press/image-48.webp' },
    { name: 'BritishNewsNetwork', logo: '/images/press/BritishNewsNetwork_vedang.png' },
    { name: 'Yourstory', logo: '/images/press/yourstory_vedang.png' },
    { name: 'Outlook Money', logo: '/images/press/money-logo.png' },
    { name: 'The Tribune IPRD', logo: '/images/press/The_Tribune_India_IPRD_Indian_PR_Distribution.png' },
    { name: 'ThePrint', logo: '/images/press/ThePrint_logo.png' },
    { name: 'Yahoo! Finance', logo: '/images/press/Yahoo!_Finance_logo_2021%20(1).png' },
    { name: 'Startup India', logo: '/images/press/DPIIT_StartupIndia_Vedang.png' },
    { name: 'Investing.com', logo: '/images/press/investing_vedang.webp' },
];

export function AsSeenIn() {
  return (
    <section className="py-12 bg-background">
        <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-center mb-6">As Seen In</h2>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 items-center pb-2">
          {asSeenInLogos.map((media, index) => (
            <div key={index} className="flex justify-center flex-shrink-0 w-[100px] sm:w-[120px]">
              <Image
                      src={media.logo}
                      alt={`${media.name} logo`}
                      width={120}
                      height={40}
                      className="object-contain dark:brightness-0 dark:invert"
                    />
                </div>
              ))}
            </div>
        </div>
    </section>
  );
}
