import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import PageWrapper from "@/components/PageWrapper";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fun Find | Discover Something New",
  description: "High-performance EDC and artifacts for the modern collector.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} h-full antialiased`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-brand-black text-brand-white selection:bg-brand-neon selection:text-brand-black">
        <CartProvider>
          <SmoothScroll>
            <PageWrapper>
              {children}
              <CartDrawer />
            </PageWrapper>
          </SmoothScroll>
        </CartProvider>
      </body>
    </html>
  );
}
