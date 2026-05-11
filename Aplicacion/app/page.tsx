"use client";

import { useState, useEffect } from "react";
import Header from "./ui/header";
import { newsreader } from "./ui/fonts";
import Link from "next/link";

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
            <Link href='/tienda' className="bg-primary text-on-primary px-10 py-5 rounded-sm font-manrope uppercase tracking-[0.2em] text-xs hover:bg-primary-container transition-all shadow-xl cursor-pointer">
              Explore the Collection
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}