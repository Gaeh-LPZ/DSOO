export default function () {
    return (
        <>
            <aside className="fixed left-0 top-24 h-[calc(100vh-6rem)] w-64 border-r border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col py-8 px-4 overflow-y-auto">
                <div className="mb-10 px-4">
                    <h2 className="font-serif text-xl italic text-emerald-950 dark:text-emerald-50">Departments</h2>
                    <p className="font-serif text-sm tracking-wide text-slate-500 dark:text-slate-400">Inventory Management</p>
                </div>
                <nav className="flex-1 space-y-1">
                    <a className="flex items-center gap-3 px-4 py-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-950 dark:text-emerald-50 font-medium border-r-2 border-emerald-900 dark:border-emerald-400 transition-colors" href="#">
                        <span className="material-symbols-outlined text-lg">home_max</span>
                        <span className="font-serif text-sm tracking-wide">Home &amp; Living</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors" href="#">
                        <span className="material-symbols-outlined text-lg">checkroom</span>
                        <span className="font-serif text-sm tracking-wide">Ready-to-Wear</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors" href="#">
                        <span className="material-symbols-outlined text-lg">diamond</span>
                        <span className="font-serif text-sm tracking-wide">Fine Jewelry</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors" href="#">
                        <span className="material-symbols-outlined text-lg">flare</span>
                        <span className="font-serif text-sm tracking-wide">Beauty &amp; Fragrance</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors" href="#">
                        <span className="material-symbols-outlined text-lg">shopping_bag</span>
                        <span className="font-serif text-sm tracking-wide">Accessories</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors" href="#">
                        <span className="material-symbols-outlined text-lg">history</span>
                        <span className="font-serif text-sm tracking-wide">Archive</span>
                    </a>
                </nav>
                <div className="mt-auto px-2">
                    <button className="w-full flex items-center justify-center gap-2 bg-primary-container text-on-primary py-4 rounded-lg hover:bg-primary transition-all duration-300 shadow-lg shadow-primary-container/20">
                        <span className="material-symbols-outlined">add</span>
                        <span className="text-xs font-bold uppercase tracking-widest">Add New SKU</span>
                    </button>
                </div>
            </aside>
            <main className="ml-64 mt-24 min-h-screen p-12 bg-surface">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <span className="text-xs font-bold tracking-[0.2em] text-on-primary-container uppercase mb-2 block">Inventory Dashboard</span>
                        <h1 className="text-4xl md:text-5xl font-serif text-emerald-950 dark:text-emerald-50 leading-tight">Home &amp; Living <span className="italic font-light opacity-60">Collections</span></h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
                            <input className="pl-12 pr-6 py-3 bg-surface-container-low border-none rounded-full w-64 focus:ring-2 focus:ring-surface-tint focus:w-80 transition-all duration-300 placeholder:text-outline/60 text-sm" placeholder="Search Inventory..." type="text" />
                        </div>
                        <button className="bg-primary-container text-on-primary px-8 py-3 rounded-full flex items-center gap-2 hover:bg-primary transition-all shadow-sm">
                            <span className="material-symbols-outlined text-lg">add</span>
                            <span className="text-sm font-medium">Add Product</span>
                        </button>
                    </div>
                </header>
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10 group hover:bg-primary transition-colors duration-500">
                        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4 group-hover:text-primary-fixed">Total SKUs</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-4xl font-serif text-on-surface group-hover:text-on-primary">1,284</h3>
                            <span className="text-xs text-emerald-600 group-hover:text-primary-fixed-dim">+12%</span>
                        </div>
                    </div>
                    <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10 group hover:bg-error transition-colors duration-500">
                        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4 group-hover:text-error-container">Low Stock Items</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-4xl font-serif text-on-surface group-hover:text-on-error">42</h3>
                            <span className="material-symbols-outlined text-error group-hover:text-on-error">warning</span>
                        </div>
                    </div>
                    <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10 group hover:bg-surface-container-highest transition-colors duration-500">
                        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Recently Updated</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-4xl font-serif text-on-surface">156</h3>
                            <span className="text-xs text-outline italic">Past 24h</span>
                        </div>
                    </div>
                    <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10 group hover:bg-inverse-surface transition-colors duration-500">
                        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4 group-hover:text-outline-variant">Out of Stock</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-4xl font-serif text-on-surface group-hover:text-white">08</h3>
                            <span className="material-symbols-outlined text-outline group-hover:text-outline-variant">inventory_2</span>
                        </div>
                    </div>
                </section>
                <section className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Filter by:</span>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 rounded-full bg-primary text-on-primary text-xs font-medium">All Categories</button>
                            <button className="px-4 py-2 rounded-full bg-surface-container-high text-on-surface text-xs font-medium hover:bg-surface-container-highest">Furniture</button>
                            <button className="px-4 py-2 rounded-full bg-surface-container-high text-on-surface text-xs font-medium hover:bg-surface-container-highest">Textiles</button>
                            <button className="px-4 py-2 rounded-full bg-surface-container-high text-on-surface text-xs font-medium hover:bg-surface-container-highest">Decor</button>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <select className="bg-transparent border-none text-sm font-medium text-on-surface-variant focus:ring-0 cursor-pointer">
                            <option>Sort by: Stock Level (High to Low)</option>
                            <option>Sort by: Stock Level (Low to High)</option>
                            <option>Sort by: Price (Highest)</option>
                            <option>Sort by: Name (A-Z)</option>
                        </select>
                        <div className="h-4 w-px bg-outline-variant/40"></div>
                        <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">grid_view</button>
                        <button className="material-symbols-outlined text-primary">list</button>
                    </div>
                </section>
                <section className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-container-low border-b border-outline-variant/10">
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Product Details</th>
                                    <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">SKU</th>
                                    <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Category</th>
                                    <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Stock Level</th>
                                    <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Unit Price</th>
                                    <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/10">
                                <tr className="hover:bg-surface-container transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded bg-surface-container-high overflow-hidden">
                                                <img alt="Velvet Armchair" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" data-alt="luxurious emerald green velvet armchair with gold legs in a brightly lit modern living room with minimalist decor" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAukA72baH-EYr6MKlphpTmVETm1H4z2XEb0z2_io1MvnBEZnN95Hnj_VBzLuDyxeo6ZKZJtihnbtXqJKRoDHfCI0Wjr0WJvHL8v5pHRsBD220o_k2cx9FuAYbcNAva5RGLEi6tIBoEUF2OdQL3fj2hgAg6030SnNbBuAJILJhL0JKQJrYr6oWdSKr-ZGmi1Tgz33VC-uCTN_xk-4LyvUP6wG-QjZlS6JtL9vCfXkm0ynmonA9ERrV5I-tsBLCE0e1t_ILPHEbgjsg" />
                                            </div>
                                            <div>
                                                <p className="font-serif text-emerald-950 font-medium">Heirloom Velvet Armchair</p>
                                                <p className="text-xs text-on-surface-variant">Forest Green / Oak Frame</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 font-mono text-xs text-on-surface-variant">HL-FR-00124</td>
                                    <td className="px-6 py-6"><span className="text-xs px-3 py-1 bg-surface-container-high rounded-full uppercase tracking-tighter">Furniture</span></td>
                                    <td className="px-6 py-6 text-sm">24 units</td>
                                    <td className="px-6 py-6 text-sm font-serif">$1,450.00</td>
                                    <td className="px-6 py-6">
                                        <span className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold uppercase tracking-widest">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-700"></span>
                                            In Stock
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right space-x-2">
                                        <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary-fixed-dim/20 rounded-lg transition-all"><span className="material-symbols-outlined text-xl">edit_note</span></button>
                                        <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary-fixed-dim/20 rounded-lg transition-all"><span className="material-symbols-outlined text-xl">visibility</span></button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-surface-container transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded bg-surface-container-high overflow-hidden">
                                                <img alt="Linen Drapery" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" data-alt="close-up of soft beige Belgian linen curtains catching warm sunlight coming through a window, showing natural texture" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD10hQd-GGoZErEXRBq1A2VsTLqsCDOPYhC8b3j6Pb1k-gceQsX6A7SFL-cFb3qoVKEbkjeMiQVCw-kvQugsQyB3hfwl_ce2Q4lE3mYzvYANPpdCeQ90vn95w8EeLOA5KRt3rjw9I0axhs5qXSc5vBbAC9CqW8_sCSTZDozcg5LKilqw-HzXiOrqAckLmpHBg68WFeKYB0FnB2myx8e6Vvp4GATpuv556749Q60AcNNtE3fVUq_ar09DGBQpXpZnVJOy-br2ksdt6I" />
                                            </div>
                                            <div>
                                                <p className="font-serif text-emerald-950 font-medium">Belgian Linen Drapery</p>
                                                <p className="text-xs text-on-surface-variant">Sandstone / 96-inch</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 font-mono text-xs text-on-surface-variant">HL-TX-00982</td>
                                    <td className="px-6 py-6"><span className="text-xs px-3 py-1 bg-surface-container-high rounded-full uppercase tracking-tighter">Textiles</span></td>
                                    <td className="px-6 py-6 text-sm">05 units</td>
                                    <td className="px-6 py-6 text-sm font-serif">$280.00</td>
                                    <td className="px-6 py-6">
                                        <span className="flex items-center gap-1.5 text-tertiary-fixed-dim text-xs font-bold uppercase tracking-widest">
                                            <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed-dim"></span>
                                            Low Stock
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right space-x-2">
                                        <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary-fixed-dim/20 rounded-lg transition-all"><span className="material-symbols-outlined text-xl">edit_note</span></button>
                                        <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary-fixed-dim/20 rounded-lg transition-all"><span className="material-symbols-outlined text-xl">visibility</span></button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-surface-container transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded bg-surface-container-high overflow-hidden">
                                                <img alt="Alabaster Lamp" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" data-alt="modern sculptural table lamp carved from white alabaster stone, emitting a soft warm glow in a dark moody interior" src="https://lh3.googleusercontent.com/aida-public/AB6AXuABXgEv70O3ywx2-vAFIHZ2S34knKcGYJKSOPweO3-IVeLBC1gaq-lhHxTPyQCEMNjj4J7Dd8pGqLSVZKswcp9k6SrnmpVlAklD2WO4D5YprNECMcDFZ3UHCUQGL3XKOyZ0TlaxhkvZ5BsR8I-OsCa8odDYPXFrfcFYiSj4vOzCkhF79EGqxb8W3JBuc_wih01cA9Kx44xqXkZm_wFH9j-gbf9gag85d_4THbbzf94_XmG3XgNXtZ47o9-8excZKm-_Mc4-i1RaoK0" />
                                            </div>
                                            <div>
                                                <p className="font-serif text-emerald-950 font-medium">Sculpted Alabaster Lamp</p>
                                                <p className="text-xs text-on-surface-variant">Matte White / Brass Base</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 font-mono text-xs text-on-surface-variant">HL-DC-04211</td>
                                    <td className="px-6 py-6"><span className="text-xs px-3 py-1 bg-surface-container-high rounded-full uppercase tracking-tighter">Decor</span></td>
                                    <td className="px-6 py-6 text-sm">0 units</td>
                                    <td className="px-6 py-6 text-sm font-serif">$560.00</td>
                                    <td className="px-6 py-6">
                                        <span className="flex items-center gap-1.5 text-error text-xs font-bold uppercase tracking-widest">
                                            <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                                            Out of Stock
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right space-x-2">
                                        <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary-fixed-dim/20 rounded-lg transition-all"><span className="material-symbols-outlined text-xl">edit_note</span></button>
                                        <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary-fixed-dim/20 rounded-lg transition-all"><span className="material-symbols-outlined text-xl">visibility</span></button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-surface-container transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded bg-surface-container-high overflow-hidden">
                                                <img alt="Ceramic Vase Set" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" data-alt="minimalist set of three artisanal ceramic vases with rough texture in earthy neutral tones on a limestone shelf" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDVQPB4byXWJeNlJEHQKeDy84JCscCorthQOez6Nxc37h1pO373JK5f1_zea2k3KpqFGWJbzvC2O9TBaTuMsm5lOzH0tEv9h5BTuEUmhmF3Esdl-9HxxjDsiKxqGcNclM2aHLAszRMPPISYEfoXugeCQz5RDYXiz55Eqn7wknceS_ARCVk6CS_4Lm160eaVyD7XSWV2WBx2qgpfQdP2g2wZXk6a8EKrFtJQebJEBAotGykFzTI6ISlLCo59Ex5NrfINURaoCDr7Ko" />
                                            </div>
                                            <div>
                                                <p className="font-serif text-emerald-950 font-medium">Artisanal Ceramic Trio</p>
                                                <p className="text-xs text-on-surface-variant">Earthy Tones / Unglazed</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 font-mono text-xs text-on-surface-variant">HL-DC-03310</td>
                                    <td className="px-6 py-6"><span className="text-xs px-3 py-1 bg-surface-container-high rounded-full uppercase tracking-tighter">Decor</span></td>
                                    <td className="px-6 py-6 text-sm">12 units</td>
                                    <td className="px-6 py-6 text-sm font-serif">$195.00</td>
                                    <td className="px-6 py-6">
                                        <span className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold uppercase tracking-widest">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-700"></span>
                                            In Stock
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right space-x-2">
                                        <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary-fixed-dim/20 rounded-lg transition-all"><span className="material-symbols-outlined text-xl">edit_note</span></button>
                                        <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary-fixed-dim/20 rounded-lg transition-all"><span className="material-symbols-outlined text-xl">visibility</span></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="px-8 py-6 bg-surface-container-low flex justify-between items-center">
                        <p className="text-xs text-on-surface-variant font-medium">Showing <span className="text-on-surface">1 - 4</span> of <span className="text-on-surface">1,284</span> SKUs</p>
                        <div className="flex gap-2">
                            <button className="px-4 py-1.5 rounded bg-surface-container-high text-xs font-bold uppercase tracking-widest disabled:opacity-30">Prev</button>
                            <button className="px-4 py-1.5 rounded bg-emerald-900 text-on-primary text-xs font-bold uppercase tracking-widest">Next</button>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}