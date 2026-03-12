'use client';

import { motion } from 'framer-motion';

const BRANDS = [
  { 
    name: 'Apple',
    offer: 'EXCLUSIVE DEALS',
    logo: (
      <svg viewBox="0 0 24 24" className="w-10 h-10 fill-current" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.05 20.28c-.98.95-2.05 1.72-3.23 1.72-1.15 0-1.55-.69-2.92-.69-1.38 0-1.85.67-2.92.67-1.13 0-2.15-.72-3.15-1.68C2.8 18.35 1.5 15.15 1.5 12.1c0-4.05 2.58-6.18 5.12-6.18 1.35 0 2.5.85 3.32.85.8 0 2.15-.95 3.65-.95 1.25 0 4.15.5 5.58 3-2.95 1.35-2.45 5.25.42 6.55-1.1 2.38-2.52 4.93-2.54 4.93zM12.03 5.07c.05-2.58 2.08-4.57 4.53-4.57.05 2.7-2.3 4.88-4.53 4.57z"/>
      </svg>
    ) 
  },
  { 
    name: 'Samsung',
    offer: '30% OFF SELECT', 
    logo: (
      <svg viewBox="0 0 24 24" className="w-12 h-12 fill-current" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
        <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="4" fontWeight="900" style={{ fontFamily: 'sans-serif' }}>SAMSUNG</text>
      </svg>
    ) 
  },
  { 
    name: 'Sony',
    offer: 'FREE SHIPPING', 
    logo: (
      <svg viewBox="0 0 24 24" className="w-12 h-12 fill-current" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.5 7.5h3v9h-3v-9zm4.5 0h6v3h-3v3h3v3h-6v-9zm7.5 0h3v9h-3v-9zm4.5 0h6v3h-3v3h3v3h-6v-9z"/>
        <text x="12" y="20" dominantBaseline="middle" textAnchor="middle" fontSize="8" fontWeight="900">SONY</text>
      </svg>
    ) 
  },
  { 
    name: 'Microsoft',
    offer: 'LIMITED EDITION', 
    logo: (
      <svg viewBox="0 0 24 24" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0h11.4v11.4H0V0zm12.6 0H24v11.4h-11.4V0zM0 12.6h11.4V24H0v-11.4zm12.6 0H24V24h-11.4v-11.4z" fill="currentColor"/>
      </svg>
    )
  },
  { 
    name: 'Amazon',
    offer: 'SEASON BESTSELLERS', 
    logo: (
      <svg viewBox="0 0 24 24" className="w-10 h-10 fill-current" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.93 17.09c-.27-.19-.48-.26-.6-.2-.12.06-.11.23.01.5.12.25.13.43.03.53-.1.11-.32.11-.66 0-.34-.11-.57-.27-.69-.48-.12-.21-.12-.46 0-.75.12-.29.35-.55.69-.78l.02-.02c.33-.22.61-.31.84-.27.23.04.42.17.57.39.15.22.21.5.18.84l-.01.44c0 .35.09.56.28.63.19.07.47-.03.84-.3l.11-.08c.11-.07.24-.03.3.1.06.13.02.26-.1.35C17.65 19 16.63 19.34 16 19.1c-.63-.24-.91-.77-.84-1.57l.01-.44h.76zM12.92 5.06c.15-.31.37-.58.66-.8s.64-.37 1.05-.44 1.14 0 1.63.2c.49.2 1.15.6 1.7.9l1.45.8c.28.15.48.33.59.54s.11.45 0 .73-.34.56-.67.84c-.33.28-.6.54-.81.78l-4.52 4.96c-.19.2-.42.34-.69.4s-.54.02-.82-.13l-.53-.29c-.28-.15-.52-.39-.71-.73-.19-.34-.28-.7-.28-1.09V9.11c0-.44-.1-.82-.29-1.15-.19-.33-.46-.57-.82-.71l-.1-.04c-.37-.14-.6-.4-.69-.78s.02-.73.34-1.06l.89-.91c.21-.21.46-.35.7-.44zM2.38 18.02c.07-.08.19-.11.28-.06.09.05.14.15.11.25-.03.1-.11.18-.21.23-.39.19-2.06-.11-2.06-.11s-.11-.01-.15.02c-.04.03-.04.08-.02.11.02.03.4.45 2.12 1.15 1.72.7 4.34 1.2 7.02.82 2.68-.38 4.9-1.63 6.13-2.92.1-.11.27-.12.38-.03.11.09.12.26.03.37-1.34 1.41-3.77 2.76-6.68 3.17-2.91.41-5.7-.12-7.53-.87-1.83-.75-2.26-1.18-2.28-1.2h.88z"/>
      </svg>
    )
  },
  { 
    name: 'Google',
    offer: 'UP TO 40% OFF', 
    logo: (
      <svg viewBox="0 0 24 24" className="w-10 h-10 fill-current" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.85 0-5.27-1.92-6.14-4.51H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.86 14.13c-.22-.67-.35-1.39-.35-2.13s.13-1.46.35-2.13V7.03H2.18C1.43 8.53 1 10.21 1 12s.43 3.47 1.18 4.97l3.68-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.03l3.68 2.84c.87-2.6 3.29-4.49 6.14-4.49z" fill="#EA4335"/>
      </svg>
    )
  },
  { 
    name: 'Asus',
    offer: 'NEW ARRIVALS',
    logo: (
      <svg viewBox="0 0 24 24" className="w-12 h-12 fill-current" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.5 15.5l3-3.5 3 3.5h-2v3.5h-2v-3.5h-2zm6.5 0h6v2h-4v1h4v2h-6v-5zm7.5 0h6v2h-4v1h4v2h-6v-5z"/>
        <text x="12" y="20" dominantBaseline="middle" textAnchor="middle" fontSize="6" fontWeight="900">ASUS</text>
      </svg>
    )
  },
];

export function BrandSlider() {
  // Duplicate the brands to create a seamless infinite loop
  const duplicatedBrands = [...BRANDS, ...BRANDS, ...BRANDS];

  return (
    <section className="relative py-8 bg-transparent text-gray-900 dark:text-white border-y border-white/5 overflow-hidden transition-colors duration-500">
      <div className="relative max-w-7xl mx-auto px-4 mb-4 text-center pb-4 z-20">
        <span className="text-[10px] uppercase font-black text-orange-500 tracking-[0.3em] whitespace-nowrap mb-4 block">
            PARTNERED BRANDS
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-zinc-50 tracking-tight">
            Top Brands & Offers
        </h2>
      </div>

      <div className="relative group overflow-visible py-4 pb-6 z-20">
        {/* Gradients for soft edges */}
        <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-orange-50/10 dark:from-[#050505]/10 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-orange-100/10 dark:from-[#1a0f00]/10 to-transparent z-10 pointer-events-none" />

        <div className="flex overflow-hidden">
          <motion.div
            className="flex items-center gap-6 md:gap-8 whitespace-nowrap pl-6 md:pl-8"
            animate={{
              x: [0, -1600], // Adjust based on total width of card row
            }}
            transition={{
              duration: 45,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {duplicatedBrands.map((brand, idx) => (
              <div
                key={`${brand.name}-${idx}`}
                className="flex-shrink-0 w-44 md:w-52 h-44 md:h-52 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center p-6 cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:border-orange-500/20 dark:hover:border-orange-500/30 transition-all duration-300 group/brandCard"
              >
                <div className="h-16 flex items-center justify-center text-gray-900 dark:text-zinc-100 group-hover/brandCard:text-orange-500 transition-colors duration-300">
                  {brand.logo}
                </div>
                <div className="mt-4 text-center">
                    <h3 className="text-xs md:text-sm font-black text-gray-900 dark:text-zinc-100 uppercase tracking-widest">{brand.name}</h3>
                    <p className="text-[9px] md:text-[10px] font-bold text-orange-500 mt-1 uppercase tracking-widest bg-orange-50 dark:bg-orange-500/10 px-2 py-0.5 rounded-full inline-block">
                        {brand.offer}
                    </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Dynamic Background Detail */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-1/2 h-12 bg-orange-500/5 dark:bg-orange-500/[0.02] blur-3xl rounded-full opacity-50" />
    </section>
  );
}
