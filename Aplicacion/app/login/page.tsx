import Link from "next/link";

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

          {/* Right Side: Formulario */}
          <div className="w-full max-w-md mx-auto">
            <div className="mb-10">
              <h1 className="font-headline text-4xl font-bold text-primary mb-3">Bienvenido de nuevo</h1>
              <p className="text-on-surface-variant font-body">Inicia sesion para comenzar a disfrutar de los beneficios exclusivos que tenemos para ti.</p>
            </div>

            <form className="space-y-8">
              <div className="space-y-6">
                {/* Email Field */}
                <div className="group">
                  <label className="block text-xs font-label uppercase tracking-widest text-on-surface-variant mb-2">Direccion de email</label>
                  <input 
                    className="w-full bg-slate-100/50 border-0 border-b border-outline-variant/50 py-3 px-4 focus:ring-0 focus:border-primary focus:bg-slate-100 outline-none transition-all placeholder:text-on-surface-variant/80 text-on-surface rounded-t-md" 
                    placeholder="tucorreo@luxury.com" 
                    type="email" 
                    required 
                  />
                </div>
                {/* Password Field */}
                <div className="group">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-label uppercase tracking-widest text-on-surface-variant">Contraseña</label>
                    <a href="#" className="text-xs font-label text-on-surface-variant hover:text-primary transition-colors">olvido su contraseña contraseña?</a>
                  </div>
                  <div className="relative">
                    <input 
                      className="w-full bg-slate-100/50 border-0 border-b border-outline-variant/50 py-3 px-4 focus:ring-0 focus:border-primary focus:bg-slate-100 outline-none transition-all placeholder:text-on-surface-variant/80 text-on-surface rounded-t-md" 
                      placeholder="••••••••" 
                      type="password" 
                      required 
                    />
                  </div>
                </div>
              </div>

              <button className="w-full py-5 silk-gradient text-white font-label text-sm uppercase tracking-[0.2em] font-semibold hover:opacity-90 transition-all duration-300 rounded shadow-lg shadow-primary-container/10" type="submit">
                Sign In
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-12 flex items-center">
              <div className="flex-grow border-t border-outline-variant/20"></div>
              <span className="flex-shrink mx-4 text-[10px] font-label tracking-widest text-on-surface-variant/40 uppercase">O iniciar sesion con</span>
              <div className="flex-grow border-t border-outline-variant/20"></div>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 py-4 border border-outline-variant/20 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                <span className="material-symbols-outlined text-xl">google</span>
                <span className="text-xs font-semibold uppercase tracking-wider">Google</span>
              </button>
              <button className="flex items-center justify-center gap-3 py-4 border border-outline-variant/20 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>apple</span>
                <span className="text-xs font-semibold uppercase tracking-wider">Apple</span>
              </button>
            </div>

            <p className="mt-12 text-center text-sm font-body text-on-surface-variant">
              No tiene una cuenta? 
              <Link href="/registro" className="text-primary font-semibold hover:underline underline-offset-4 ml-1">
                Crear una cuenta
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}