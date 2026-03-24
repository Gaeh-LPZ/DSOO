import { Noto_Serif, Manrope } from "next/font/google";

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function Header(){
    return(
        <header className="flex flex-row bg-white text-black justify-between h-20 items-center p-2">
            <div className="flex flex-row gap-3 items-center">
                <h1 className={`text-xl text-green-900`}>The Atelier</h1>
                <nav className="flex flex-row gap-2 text-sm">
                    <a href="/">Home</a>
                    <a href="#">New Arrivals</a>
                    <a href="#">Designers</a>
                    <a href="#">Beauty</a>
                    <a href="#">Archive</a>
                </nav>
            </div>
            <div className="flex flex-row gap-3">
                <img src="/person.svg" alt="sign in icon" width={24} height={24}/>
                <img src="/search.svg" alt="search icon" width={24} height={24}/>
                <img src="/shopping-bag.svg" alt="shopping bag icon" width={32} height={32}/>
            </div>
        </header>
    );
}