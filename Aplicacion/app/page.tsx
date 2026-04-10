"use client";

import { useState, useEffect } from "react";
import Header from "./ui/header";
import { newsreader } from "./ui/fonts";

const images = [
  "/bg-1.png",
  "/bg-2.jpg",
  "/bg-3.jpg"
];

export default function Page() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      
      <main>
        <div className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
          {images.map((src, index) => {
            let position = "translate-x-full opacity-0";
            if (index === currentIndex) {
              position = "translate-x-0 opacity-100 z-10";
            } else if (index === (currentIndex - 1 + images.length) % images.length) {
              position = "-translate-x-full opacity-0";
            }
            return (
              <img
                key={src}
                src={src}
                alt={`Background image ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${position}`}
              />
            );
          })}
          <div className="relative z-20 text-white text-center">
            <h1 className={`${newsreader.className} text-display-lg text-6xl md:text-8xl text-surface font-light tracking-tighter leading-tight max-w-4xl mx-auto`}>
              Elysian Heritage: <br /> <span className="italic">A New Era of Luxury</span>
            </h1>
            <button className="bg-primary text-on-primary px-10 py-5 rounded-sm font-manrope uppercase tracking-[0.2em] text-xs hover:bg-primary-container transition-all shadow-xl cursor-pointer">
              Explore the Collection
            </button>
          </div>
        </div>
        <section className="py-32 px-8 max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-300 md:h-200">
            <div className="md:col-span-7 relative group overflow-hidden bg-surface-container-low cursor-pointer">
              <img alt="Ready-to-Wear" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="Editorial fashion shot of a woman in high-end tailored wool coat standing against a brutalist concrete wall" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCuOlHX2KJ4VyxirJ6uEpKzeeuHUmiwaSaoE96s3IH_1x2Rs49L5hn1QesiNDCQOH1u4ifHRSiHGcr23F1EksORnSQQdHiqVzwzH1pzkyxq-uP0VmAstK2jHpH0Peyn2RA1sg1-Itirx9SwvXDIlXcI25iLmu0vMNCR_4Y6WT9g13uwEngllFdPzYLZsbqBOniOjERbWe7e0KC_yXSET6hzJhnKKhexxq52UxmFxBUzX_QazemVYcs2xYZ8r1WIvuNeGx7SKW3yQ_v" />
              <div className="absolute bottom-10 left-10">
                <span className="font-manrope text-[10px] uppercase tracking-[0.3em] text-surface mb-2 block">Curation 01</span>
                <h2 className="font-newsreader text-4xl text-surface">Ready-to-Wear</h2>
              </div>
            </div>
            <div className="md:col-span-5 relative group overflow-hidden bg-surface-container-low cursor-pointer">
              <img alt="Accessories" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="Close up of a luxury leather handbag on a marble pedestal with deep shadows and warm brass lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIdNfzW5vCk5VXiF9jAC0d8jaQ1c00jav4Xdr2HJbp2143YGlSelRxEj9Jdlw0u182vomuS8NV3YDnf9qsuIFZrMFXgkHAhmbpclga2gP31XUMZc4HbzDRHd6-MTJiD_zv6L0K_jlYB0QwlYeOwKW5q70eIDWdGsCxFw67N-RpBcDQMZo8cgu2mi4sN-j2mREeZ9xycGOiVqkz5Qg-C9X_NwxUNHDqIyLI33DAOHpHUCl_gZ9-70VlRVwRTncBqd_hKZCff8zaFhUL" />
              <div className="absolute bottom-10 left-10">
                <span className="font-manrope text-[10px] uppercase tracking-[0.3em] text-surface mb-2 block">Curation 02</span>
                <h2 className="font-newsreader text-4xl text-surface">Accessories</h2>
              </div>
            </div>
            <div className="md:col-span-5 relative group overflow-hidden bg-surface-container-low cursor-pointer">
              <img alt="Home &amp; Living" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="Modern minimalist living room featuring a sculptural chair and artisan ceramic vase in soft neutral tones" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWHQrXQ3h3dVefZaeUmoknbsR6PL8GSsWQ-EWubbleZxIMh_wIjlrmcsvuGTfnsAorh1bDMDXRGQDQXAQ2Hemt9udMfbTmMQsti68iLim3dQQspxFWS-yiR-qc2XOtJDpnZZ8wm3Cedq9AsFQXvuPTGizLU8VO_GPppqjC62W4XX3EDnL3Xp-kdajf68cAhW5kGnideAxwxWGyGRjVHCVaKCrgmyRTFsDavJUCz06eoUh1g10FEG1wVv6_FkFyxsWRYzOrXv85cu04" />
              <div className="absolute bottom-10 left-10">
                <span className="font-manrope text-[10px] uppercase tracking-[0.3em] text-surface mb-2 block">Curation 03</span>
                <h2 className="font-newsreader text-4xl text-surface">Home &amp; Living</h2>
              </div>
            </div>
            <div className="md:col-span-7 relative group overflow-hidden bg-surface-container-low cursor-pointer">
              <img alt="Fine Jewelry" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="Exquisite gold and diamond necklace displayed on dark textured silk background with cinematic lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKVGIrFJkx_agT1jjaasgKruNoiZ6dkzVYwluG2NLS0nGndlHM7jTtL1II3Xb5cQU2CB_x4s7jucfG3FOYKuTR4fW2zpDNPg47XZ8hHF36mp1Lih3sKD9A40m1S65YshMHSsNA77Mo9i-BPkZ5ax9TzbK_1-3otsktvrRU-IVIzsr3ZrqdbN9WMcnAte4LHRS8FBvUMutk2Q6iX-ddUWmJbm-sv20rOeGI6-4R01vtWvA1QBD2rWH-phpLhfKWckXQkfs4oKC64pCk" />
              <div className="absolute bottom-10 left-10">
                <span className="font-manrope text-[10px] uppercase tracking-[0.3em] text-surface mb-2 block">Curation 04</span>
                <h2 className="font-newsreader text-4xl text-surface">Fine Jewelry</h2>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}