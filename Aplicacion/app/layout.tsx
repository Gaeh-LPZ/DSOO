// app/layout.tsx
import type { Metadata } from "next";
import { notoSerif, manrope } from "./ui/fonts";
import "./globals.css";
import Header from "./ui/header";

export const metadata: Metadata = {
  title: "The Atelier | Create Account",
  description: "Sistema de gestión para tienda departamental",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${notoSerif.variable} ${manrope.variable} h-full antialiased`}
    >
      <head>
        {/* Importación de Material Symbols */}
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" 
        />
      </head>
      <body className="min-h-full flex flex-col font-body">
        <Header/>
        {children}
      </body>
    </html>
  );
}