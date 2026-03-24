export default function Page() {
  return (
    <main className="pt-24">
      <section className="relative h-204.75 flex items-center overflow-hidden bg-surface-container-low mb-20">
        <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center h-full">
          <div className="md:col-span-6 z-10 md:ml-20">
            <span className="inline-block px-4 py-1 rounded-full bg-tertiary-fixed-dim text-on-tertiary-fixed-variant text-sm font-label mb-6 tracking-widest uppercase">The Winter Collection</span>
            <h1 className="text-6xl md:text-8xl font-headline font-bold text-primary mb-8 leading-[0.9] tracking-tighter">
              Artifacts <br /><span className="italic font-normal serif">of</span> Style.
            </h1>
            <p className="text-on-surface-variant max-w-md text-lg font-body mb-10 leading-relaxed">
              Curating the world's most intentional objects for your home and wardrobe. Experience a higher standard of living.
            </p>
            <div className="flex gap-4">
              <button className="bg-primary-container text-on-primary px-8 py-4 rounded-md font-label font-semibold tracking-wide hover:bg-primary transition-colors flex items-center gap-2">
                Shop The Edit <span className="material-symbols-outlined text-sm" data-icon="arrow_forward">arrow_forward</span>
              </button>
              <button className="border border-outline-variant/20 text-on-surface px-8 py-4 rounded-md font-label font-semibold tracking-wide hover:bg-surface-container-high transition-colors">
                Explore Archive
              </button>
            </div>
          </div>
          <div className="hidden md:block md:col-span-6 h-[90%] relative">
            <div className="absolute inset-0 bg-linear-to-br from-primary-container/10 to-transparent rounded-xl"></div>
            <img alt="Editorial fashion photography" className="w-full h-full object-cover rounded-xl shadow-2xl" data-alt="Editorial fashion photography of high-end beige coat draped over a minimalist chair in a sun-drenched architectural space with soft shadows" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCLrpBn6OuOAyLrfD9Hrg-2muQ_lKDmCvuurmfs42UdsTPzQ2pWccr-wiZ0kaehCScnoXruy2iG5NVzNjdwFIfHbIVl1c8oQQE7NDRqRacMJjF9yOjCS_BBnAHsvStaHJJVniyUJXxwEStT9Ny0j9ldw44anR3PT3yBYLkeZSse2sqr-gGoy4xFTnO1MaWJ26aOZMYiFWsVaVuC5UVJnREwhbB-YZ1JjQkmDOJNbwdPmtD_hvNb41yMt9yK9xW7ohjzEiaZJhCFv8" />
          </div>
        </div>
      </section>
      <section className="container mx-auto px-6 md:px-12 mb-32">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-outline-variant/10 pb-8">
          <div>
            <h2 className="text-4xl font-headline font-bold text-primary mb-2">Curated Catalog</h2>
            <p className="text-on-surface-variant font-body">Showing 124 exceptional items</p>
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded-full">
              <span className="text-xs font-label text-on-surface-variant uppercase tracking-wider">Sort by</span>
              <select className="bg-transparent border-none focus:ring-0 text-sm font-semibold text-primary py-0 pl-0 pr-8 cursor-pointer">
                <option>Popularity</option>
                <option>Newest First</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar max-w-full">
              <button className="px-6 py-2 bg-primary text-on-primary rounded-full text-sm font-label whitespace-nowrap">All Collections</button>
              <button className="px-6 py-2 bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest transition-colors rounded-full text-sm font-label whitespace-nowrap">Clothing</button>
              <button className="px-6 py-2 bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest transition-colors rounded-full text-sm font-label whitespace-nowrap">Electronics</button>
              <button className="px-6 py-2 bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest transition-colors rounded-full text-sm font-label whitespace-nowrap">Home &amp; Living</button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          <div className="group">
            <div className="relative aspect-3/4 overflow-hidden rounded-xl bg-surface-container mb-6">
              <img alt="Premium Wool Coat" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" data-alt="Studio shot of a tailored charcoal grey wool overcoat on a minimalist hanger with soft directional lighting and neutral background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSfO55iNY_auONBanBhPLLYDmzhlboQFF4_606vvJep7JSy5bmtt_ahGm4hPceM8ulOapQoe-Qwy84uv8sYbbw_AJFXtU1zKPk_o6aF_NWazTEN48fmiVnr0wqcvWmcl2q54GoqZMJfmp6ehVJFOlq9J6VDBi2GIwsBG_FLQffUZt-m-w8NQNrY3JCRA1gGCcl3t4sr6cFOYkh7VHIQkYNw6V4ew5ezZf13KvMXGGbgiXEBDDOIOJslKsDYjhnyIaSo8Rw4Bzh2d0" />
              <button className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md text-primary py-3 rounded-lg font-label font-bold text-sm opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm" data-icon="add_shopping_cart">add_shopping_cart</span>
                Quick Add to Cart
              </button>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-on-tertiary-container font-bold mb-1 block">Clothing</span>
                <h3 className="text-xl font-headline font-semibold text-primary group-hover:text-surface-tint transition-colors">Sculptural Wool Overcoat</h3>
              </div>
              <span className="text-lg font-body font-light text-primary tracking-tight">$890.00</span>
            </div>
          </div>
          <div className="group">
            <div className="relative aspect-3/4 overflow-hidden rounded-xl bg-surface-container mb-6">
              <img alt="Wireless Studio Headphones" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" data-alt="Close-up of premium metallic gold and black wireless headphones resting on a marble slab with elegant shadows" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUVmQ8cd8lFaCTaonHReQEOwbVBXubPocK1N2BFBxICdyjfzWRncHBLTwhUtHW7WRX2Eud40Txsv09zJxz5ks3RVxlp9SxJbH-XD9ZXmdSfc_MTIE1A9dnMuQ1jHVPfBOWoHw7Ppnurtp8iPCEySbrFhqgAA405SzzRP8gwhpRWeqqaMv4g_9wyOdqahxxe36MunJRIwy5wEfOMVa-FJwPORMiPZdhm9NY_hDw1dpaUwDPBT2QfN4e3UYehz5tPC8x8XOIUgT3eBA" />
              <button className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md text-primary py-3 rounded-lg font-label font-bold text-sm opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm" data-icon="add_shopping_cart">add_shopping_cart</span>
                Quick Add to Cart
              </button>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-on-tertiary-container font-bold mb-1 block">Electronics</span>
                <h3 className="text-xl font-headline font-semibold text-primary group-hover:text-surface-tint transition-colors">Acoustic Reference Headset</h3>
              </div>
              <span className="text-lg font-body font-light text-primary tracking-tight">$450.00</span>
            </div>
          </div>
          <div className="group md:col-span-2 lg:col-span-2">
            <div className="relative aspect-video overflow-hidden rounded-xl bg-surface-container mb-6">
              <img alt="Home Living Set" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" data-alt="Contemporary living room set with a velvet sage sofa, travertine coffee table, and abstract art piece in a bright airy room" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBW5YNDHqqwP953G6WoaxZtafRr8UI17vcd3KQwwqaieG-EH9OkAkvZsC9yh6mpwBzGigF2Mzxwf8YxSoKxBeQ0G-vxUiAIhudEcfWoSP6wBkrR0Qm8k0MnR0sMElb1sbTzScYBDWffOAwFrhVHCT7LD4w0IUNmF222nbIaCoNWFhxNLrzXPzzhMTGzqwXY7zztihDbD8XIl9ZFIWfr8ySm_oVjMbRM2xrrp2EpUf-uM-879EfydCiaOT_-Up1OaEW_tbXSGiWVHfs" />
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute top-6 left-6">
                <span className="bg-primary text-on-primary px-3 py-1 rounded text-[10px] font-bold tracking-[0.2em] uppercase">Featured</span>
              </div>
              <button className="absolute bottom-4 left-4 right-4 md:w-fit md:px-12 bg-white/90 backdrop-blur-md text-primary py-3 rounded-lg font-label font-bold text-sm opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl flex items-center justify-center gap-2">
                View The Full Look
              </button>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-on-tertiary-container font-bold mb-1 block">Home &amp; Living</span>
                <h3 className="text-xl font-headline font-semibold text-primary group-hover:text-surface-tint transition-colors">The Solstice Living Suite</h3>
              </div>
              <span className="text-lg font-body font-light text-primary tracking-tight">From $3,200.00</span>
            </div>
          </div>
          <div className="group">
            <div className="relative aspect-3/4 overflow-hidden rounded-xl bg-surface-container mb-6">
              <img alt="Designer Watch" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" data-alt="Minimalist luxury wristwatch with a white face and tan leather strap against a textured cream background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCj1L8C7SHp8kvg6f1ydTA5OC_s3ye0xaSO9w7c7Fsen0BaNAd8jJmXlnWBv6a-Q4H02rmOtXgkCp-0w8APoSuNJotr6hY3_RZ_vf5ZfPy3m0Exg7XUI232OpA9cA66RwBe0wtN-T3qOZ5ucs24o18-_ZpyA7hTplwsTUIlpABewmi3Y_Am9EEIGjYR8xmD_Quu-ZLFCfocciW7WBH60miMJm9caPHPjSqzsOlFtgVaxQVIQy0Ibyd4LdEUaIOT6vMJmpS1gU-F4KQ" />
              <button className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md text-primary py-3 rounded-lg font-label font-bold text-sm opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm" data-icon="add_shopping_cart">add_shopping_cart</span>
                Quick Add to Cart
              </button>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-on-tertiary-container font-bold mb-1 block">Accessories</span>
                <h3 className="text-xl font-headline font-semibold text-primary group-hover:text-surface-tint transition-colors">Minimalist Horizon Watch</h3>
              </div>
              <span className="text-lg font-body font-light text-primary tracking-tight">$295.00</span>
            </div>
          </div>
          <div className="group">
            <div className="relative aspect-3/4 overflow-hidden rounded-xl bg-surface-container mb-6">
              <img alt="Performance Sneakers" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" data-alt="Sleek red performance sneakers in mid-air with dynamic lighting and a dark atmospheric background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKRMeFv3KL4OMaGDiLal-fo93RBiaKYdPJorX5QYVQvq-nTy1feGYsvOyexGxWJWpFoF14EM7PklIShD9vbeHtiKm35rXzMXmPmvbEb3AMXyg_AHufToLQDAHvgaOs-PU-TpDR756i-FbtatBp4Nc-BzNy_n6Mn9hqe4WH1b6StmGgutB09LYPAlk4WjzlZk01fX1lgrLViQeME2Yumzxe0sxhIOyfLnOtpXg27cs5s0VkFN0lviW7XR7MTWXpBoF1PEcIqyPLGb8" />
              <button className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md text-primary py-3 rounded-lg font-label font-bold text-sm opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm" data-icon="add_shopping_cart">add_shopping_cart</span>
                Quick Add to Cart
              </button>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-on-tertiary-container font-bold mb-1 block">Footwear</span>
                <h3 className="text-xl font-headline font-semibold text-primary group-hover:text-surface-tint transition-colors">Veloce Performance Trainer</h3>
              </div>
              <span className="text-lg font-body font-light text-primary tracking-tight">$180.00</span>
            </div>
          </div>
          <div className="group">
            <div className="relative aspect-3/4 overflow-hidden rounded-xl bg-surface-container mb-6">
              <img alt="Modern Stool" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" data-alt="Minimalist wooden bar stool with sleek black metal legs in a white studio setting with soft natural light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuUbv-rilLuDC4Y-CtC-qqf02Q9SUr6SF-vz8xO5DsfT8v8LbXb6uy0OfWb03yRA-_g4MyIXOB_e-OR3qaSUAZxv4a09MIkx8ofyfUj8K2Bt55F5unEqchOcuVk7rmgiKE2LxI-Yf22C-_UIHQ5mCmxGPa7PuYUiIGAGISMa8JW_yhRRy2ABOfADzHFXpOaIYsJpMpEL1zX909t7SbgIDGKQZO80DGBx1O3KZd4brVyBwAFkoO09Yq6-36Ib5UiumKRHhld6RqCMs" />
              <button className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md text-primary py-3 rounded-lg font-label font-bold text-sm opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm" data-icon="add_shopping_cart">add_shopping_cart</span>
                Quick Add to Cart
              </button>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-on-tertiary-container font-bold mb-1 block">Home &amp; Living</span>
                <h3 className="text-xl font-headline font-semibold text-primary group-hover:text-surface-tint transition-colors">Oak Helix Counter Stool</h3>
              </div>
              <span className="text-lg font-body font-light text-primary tracking-tight">$340.00</span>
            </div>
          </div>
          <div className="group">
            <div className="relative aspect-3/4 overflow-hidden rounded-xl bg-surface-container mb-6">
              <img alt="Linen Dress" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" data-alt="Flowing white linen dress hanging on a wooden rail with sunbeams and dust motes in an earthy mediterranean room" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCs1Gl8Mii9Vz9VJsW2lCuDOBN6V-ROgv3HUn4GzVPLIKPk-Ly6tSGGJZ6osl-RQ6v8GXT2qRa2KlB3BloOzA4zOGbfZA1PkSn3Fi1G2G2QBud_D1jHvDbVRi-RL1-U1kTtVGrlDOQ5srhM7gBU02sWS5BmEi4SwYorg5Mc5cNOZuR9721E57JUl-M2Vvq9-GYGm2JBjLdMUrume5BTZAuzRhvDj7rx4HKgRWZtBajHhjYTyhoYCPG8PsJxz0dbrioeqBy0T30td-E" />
              <button className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md text-primary py-3 rounded-lg font-label font-bold text-sm opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm" data-icon="add_shopping_cart">add_shopping_cart</span>
                Quick Add to Cart
              </button>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-on-tertiary-container font-bold mb-1 block">Clothing</span>
                <h3 className="text-xl font-headline font-semibold text-primary group-hover:text-surface-tint transition-colors">Ethereal Linen Maxi</h3>
              </div>
              <span className="text-lg font-body font-light text-primary tracking-tight">$210.00</span>
            </div>
          </div>
        </div>
        <div className="mt-20 flex justify-center">
          <button className="border border-outline-variant/30 px-12 py-4 text-on-surface font-label font-bold tracking-widest uppercase hover:bg-surface-container transition-all">
            Load More Artifacts
          </button>
        </div>
      </section>
      <section className="bg-surface-container-high py-24">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <span className="font-serif italic text-2xl text-emerald-900 mb-6 block">Join the Circle</span>
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-8 tracking-tight">Stay updated on our latest curations and artist collaborations.</h2>
            <form className="relative max-w-lg mx-auto">
              <input className="w-full bg-transparent border-none border-b border-outline-variant/40 focus:ring-0 focus:border-surface-tint text-xl font-body py-4 px-0 placeholder:text-slate-400" placeholder="Enter your email address" type="email" />
              <button className="absolute right-0 bottom-4 text-primary font-bold tracking-widest uppercase text-xs hover:text-surface-tint transition-colors">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </main>

  );
}