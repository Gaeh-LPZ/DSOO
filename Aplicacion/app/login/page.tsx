import Link from "next/link";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="bg-surface text-on-surface flex flex-col min-h-screen">
      {/* Brand Header */}
      <header className="w-full px-12 py-8 flex justify-center">
        <Link href="/" className="text-4xl font-headline italic tracking-tighter text-primary font-bold">
          The Luxury Store
        </Link>
      </header>

      <main className="flex-grow flex items-center justify-center px-6 py-12 bg-[#fafaf5]">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          {/* Left Side: Imagen Editorial */}
          <div className="hidden md:block relative h-[700px] overflow-hidden rounded-xl bg-surface-container-low">
            <img 
              alt="Luxury department store interior" 
              className="w-full h-full object-cover grayscale-[20%] brightness-95" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgQVgtqM9fx_8bru3mcZFHuPp9hIStTeNQ0B3UN4YIuXv4bcYtx0edApQa97uNE4lJK5X8FVOdx1DAByOW22SjqEUJcsbtuUVVQAP6tUR6tkTZz10T8lST_cTm8iWJfpTbEiHLTthUqOgtWQkihMStDzJPl9juEA9gQZghdxLshEEDgGdFBG9V4WTwNGVMxZB8Lt49fB4sW0VA7c-0UiktBUBHW_YdKTN32MgqnNmRHsGs-oYTdhqweoT0O30FHpzm-aW8uwtHfAc" 
            />
            <div className="absolute bottom-12 left-12 right-12 text-white">
              <p className="font-headline italic text-3xl leading-snug tracking-tight mb-4">
                "Luxury store es el lujo definitivo en un mundo de abundancia."
              </p>
              <div className="h-[1px] w-24 bg-white/50 mb-4"></div>
              <span className="text-sm font-label uppercase tracking-widest">Temporada verano</span>
            </div>
          </div>

          <LoginForm />
          
        </div>
      </main>
    </div>
  );
}