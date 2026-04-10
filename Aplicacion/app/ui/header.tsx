'use client';

import { newsreader } from "./fonts";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";


export default function Header() {
    const routes = [
        { name: 'Tienda', href: '/' },
        { name: 'Categorias', href: '#' },
        { name: 'Colecciones', href: '#' },
        { name: 'About', href: '#' },
    ]    

    const pathname = usePathname();
    if (pathname === '/reporteGerencial') {
        return null;
    }

    
    return (
        <header className="bg-zinc-160 text-black flex flex-row items-center justify-between md:p-10 z-50 relative">
            <nav className="flex flex-row gap-2.5 text-lg">
                {routes.map(route => (
                    <Link key={route.name} href={route.href} className={clsx(
                        "text-lg text-primary",
                        {
                            'underline decoration-primary': pathname === route.href,
                        },
                    )}>
                        {route.name}
                    </Link>
                ))}
            </nav>
            <h1 className={`${newsreader.className} text-2xl font-extrabold font-newsreader`}>ATELIER</h1>
            <nav className="flex flex-row gap-2.5">

                <Link href="#">
                    <svg width={24} height={24}>
                        <use xlinkHref="/search.svg"></use>
                    </svg>
                </Link>

                <Link href="/perfil">
                    <svg width={24} height={24}>
                        <use xlinkHref="/user.svg"></use>
                    </svg>
                </Link>

                <Link href="/carrito">
                    <svg width={24} height={24}>
                        <use xlinkHref="/shopping-bag.svg"></use>
                    </svg>
                </Link>

            </nav>
        </header>
    );
}