import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getProducts } from "@/lib/supabase";
import AddToCartRoundButton from "@/components/AddToCartRoundButton";
import Logo from "@/components/Logo";
import ProductRating from "@/components/ProductRating";

export default async function Home() {
  const products = await getProducts();
  
  const topProducts = products.slice(0, 4);
  const marqueeProducts = [...topProducts, ...topProducts];

  // Get promotional products
  const keychainProduct = products.find(p => p.category.toLowerCase() === 'keychains') || products[0];
  const frameProduct = products.find(p => p.category.toLowerCase() === 'frames') || products[1] || products[0];
  const fidgetProduct = products.find(p => p.category.toLowerCase() === 'fidgets') || products[2] || products[0];

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 12px)); }
        }
      `}} />

      <div className="bg-[#f9f9fa] text-[#1a1c1d] selection:bg-[#29fe57] selection:text-[#00711f]" style={{fontFamily: "'Plus Jakarta Sans', sans-serif"}}>
        <Navbar />

        <main className="pt-20">
          <section className="relative min-h-[700px] h-[90vh] w-full flex items-center justify-center overflow-hidden bg-[#eeeeef]">
            <div className="absolute inset-0 z-0">
              <img className="w-full h-full object-cover grayscale contrast-125 opacity-90" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCW9AQFxIPyy49vxLdTz2x9iQdF3VHsBEztrKTPaI3ByyjkRSpyRl_dyEI0ojZjk9au2Jl6IAYBU2SyUn58TTY7VjAlr-sf2LSXoAUTvwAx4MhAYsdGwIZJJ8oy1Q194hhDp7DeR8fSkWp9wuOON-CN-OmH_A3ctpMLw2FFNysksqni8CV3CGRxWPuv8EkW5GJacNxLdVSoPt7xH4YIXgfruxf5FsduZD7nlb0LizYyvP7qo12TCZIEZOT2hZH6Xb4xpp-iegdlW0E5"/>
              <div className="absolute inset-0 bg-gradient-to-r from-[#f9f9fa]/40 to-transparent"></div>
            </div>
            <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
              <div className="max-w-2xl bg-white/40 backdrop-blur-md p-8 border border-white/20">
                <span className="text-[14px] leading-[1.2] tracking-[0.05em] font-bold text-[#006e1e] mb-4 block uppercase">New Arrival: Velo 01</span>
                <h1 className="text-[48px] leading-[1.1] tracking-[-0.04em] font-extrabold text-black mb-6">ENGINEERED FOR YOUR POCKET.</h1>
                <p className="text-[18px] leading-[1.6] text-[#46464a] mb-8 max-w-lg">High-velocity aesthetics meet industrial-grade durability. Every Fun Find product is CNC-milled for the modern collector.</p>
                <div className="flex gap-4">
                  <Link href="/collection" className="inline-block bg-black text-white text-[14px] leading-[1.2] tracking-[0.05em] font-bold px-10 py-5 rounded-none hover:bg-[#006e1e] transition-all active:scale-95 uppercase">Shop the Drop</Link>
                  <Link href="/collection" className="inline-block border border-black text-black text-[14px] leading-[1.2] tracking-[0.05em] font-bold px-10 py-5 rounded-none hover:bg-black hover:text-white transition-all active:scale-95 uppercase">View Lookbook</Link>
                </div>
              </div>
            </div>
          </section>

          <section className="py-24 max-w-[1440px] mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-8 group relative aspect-[16/9] overflow-hidden bg-zinc-100 border border-zinc-200">
                {keychainProduct?.image_url && <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={keychainProduct.image_url} alt="Car Keys"/>}
                <div className="absolute inset-0 bg-black/20 flex flex-col justify-end p-8 backdrop-blur-sm bg-white/10">
                  <h3 className="text-[32px] leading-[1.2] tracking-[-0.02em] font-bold text-white uppercase drop-shadow-md">Car Keys</h3>
                  <Link className="text-[14px] leading-[1.2] tracking-[0.05em] font-bold text-white uppercase mt-2 inline-flex items-center gap-2 group-hover:gap-4 transition-all drop-shadow-md" href="/collection?category=Keychains">Explore Collection <span className="material-symbols-outlined">arrow_forward</span></Link>
                </div>
              </div>

              <div className="md:col-span-4 group relative aspect-square md:aspect-auto overflow-hidden bg-zinc-100 border border-zinc-200">
                {frameProduct?.image_url && <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={frameProduct.image_url} alt="Squish Frames"/>}
                <div className="absolute inset-0 bg-black/20 flex flex-col justify-end p-8 backdrop-blur-sm bg-white/10">
                  <h3 className="text-[32px] leading-[1.2] tracking-[-0.02em] font-bold text-white uppercase drop-shadow-md">Squish Frames</h3>
                  <Link className="absolute inset-0 z-10" href="/collection?category=Frames" aria-label="Explore Frames"></Link>
                </div>
              </div>

              <div className="md:col-span-12 group relative h-96 overflow-hidden bg-zinc-100 border border-zinc-200">
                {fidgetProduct?.image_url && <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={fidgetProduct.image_url} alt="Fidgets"/>}
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center p-8 backdrop-blur-sm">
                  <h3 className="text-[48px] leading-[1.1] tracking-[-0.04em] font-extrabold text-white uppercase mb-4 drop-shadow-md">Fidgets</h3>
                  <Link href="/collection?category=Fidgets" className="inline-block bg-white text-black text-[14px] leading-[1.2] tracking-[0.05em] font-bold px-8 py-3 rounded-none uppercase hover:bg-[#29fe57] transition-colors relative z-10">Browse Gear</Link>
                </div>
              </div>
            </div>
          </section>

          <section className="py-24 bg-[#f3f3f4] overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12 mb-12 flex justify-between items-end">
              <div>
                <span className="text-[14px] leading-[1.2] tracking-[0.05em] font-bold text-[#006e1e] uppercase">Live Now</span>
                <h2 className="text-[48px] leading-[1.1] tracking-[-0.04em] font-extrabold text-black mt-2">TRENDING NOW</h2>
              </div>
              <div className="flex gap-2">
                <button className="p-3 border border-[#77777b]/30 rounded-full hover:bg-white transition-colors"><span className="material-symbols-outlined">chevron_left</span></button>
                <button className="p-3 border border-[#77777b]/30 rounded-full hover:bg-white transition-colors"><span className="material-symbols-outlined">chevron_right</span></button>
              </div>
            </div>

            <div className="w-full relative group overflow-hidden">
              <div className="flex gap-6 w-max animate-[marquee_20s_linear_infinite] group-hover:[animation-play-state:paused] px-6">
                {marqueeProducts.map((p, idx) => (
                  <div key={`${p.id}-${idx}`} className="w-[280px] sm:w-[320px] bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:shadow-xl hover:border-zinc-300 transition-all duration-300 group/card shrink-0 flex flex-col">
                    <Link href={`/product/${p.id}`} className="block aspect-square relative overflow-hidden bg-[#eeeeef]">
                      {p.image_url ? (
                        <img className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500" src={p.image_url} alt={p.name}/>
                      ) : (
                        <div className="w-full h-full bg-zinc-200"></div>
                      )}
                      {p.stock < 5 && p.stock > 0 && (
                        <div className="absolute top-4 left-4 bg-[#29fe57] text-[#00711f] px-3 py-1 text-[10px] font-bold uppercase rounded-full shadow-sm z-10">Sold Out Soon</div>
                      )}
                      {p.stock === 0 && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 text-[10px] font-bold uppercase rounded-full shadow-sm z-10">Sold Out</div>
                      )}
                    </Link>
                    <div className="p-6 flex flex-col justify-between flex-1 bg-white">
                      <div>
                        <p className="text-[12px] leading-[1.2] font-medium text-zinc-500 uppercase mb-1">{p.category}</p>
                        <Link href={`/product/${p.id}`} className="hover:underline">
                          <h4 className="text-[24px] leading-[1.3] font-bold text-zinc-900 group-hover/card:text-black transition-colors mb-2 uppercase line-clamp-2">{p.name}</h4>
                        </Link>
                        <ProductRating productId={p.id} />
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-[18px] leading-[1.6] font-bold text-[#006e1e]">₹{p.price.toFixed(2)}</span>
                        <AddToCartRoundButton product={p} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-24 max-w-[1440px] mx-auto px-6 lg:px-12 border-t border-zinc-100">
            <div className="text-center mb-16">
              <h2 className="text-[48px] leading-[1.1] tracking-[-0.04em] font-extrabold text-black mb-2">JOINED BY 50K+ COLLECTORS</h2>
              <p className="text-[18px] leading-[1.6] text-[#46464a]">Tag <span className="font-bold text-black">#FunFind</span> to be featured.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="aspect-square bg-zinc-100 overflow-hidden"><img className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcIqLERrNkcoYvRALC5tkKq3CzXnXJnhZboaxgVRIEPWTgPTsq-nPCjDJTe_O2FdjCksg2YvILCi8pc8JwNGRqh4fZwhhapGQlV94aVFmpm7Jf5K5hdaZZ1G4Gj6nFGW_n5eWc7VIGOihaDAwAdt7GZQGPV0SQcQ5MJ5ONgsFABPTabbbOlIXf74WvzRVBj_rWfIzaq1GtCiW2DKSl2FWdx5JVvhxPBwSHG1iLFnYhuWP_g6tvFVvCejaBBRxUJ3G1GwQWV5PHQSyv"/></div>
              <div className="aspect-square bg-zinc-100 overflow-hidden"><img className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhaONeA7cArgtKRSOVYlhH5EPW4qZ4ZF2KMPX7_X-zT2gLEU_sN6K0iEFy4Xy5zUelA3TCYJlzXvYbSRwkMo50hBZfrH_IijXMn_8RZUSFkVZLWU9eogbvm0RU2uO1k6xb8QLM7mwjqR4BWnuBWwAsHDYME2xQ8mjpzmmRRkNA8gVJetXCGofat5bG7JQvaGgSOWBirWb-mjMWUdV3T7lh082aqdf6t8GyAqQ3DrUaJBRahZuNyfnVzja80zY7NNKE6Yqkb0WNPPqv"/></div>
              <div className="aspect-square bg-zinc-100 overflow-hidden"><img className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2GCP7oF_5LREr7BOu1GG7Tf3Q2KGW5h2dpZTtwRFzlrQ7GUziaBr12Qx3nv4hVA6_sdFDaQXqVesox_tdT_MsKN0VdutjN56ZKForQeRRZK_V9sx2jEgL4Qm1L8pcCVvrrXKuGdPYNiTnXuSAPmPArXGb0Fl17QiAH4Q9bYt82KlDJqcGHrhf-I6MTSnIj-HlUYh8Q6rbV8iW81oYUHZ9-jqjb2Oa7_Ey6jg1m1kT3J4bx3MU0E8zf2zhc1zFiqQXu4PAog4q8hr2"/></div>
              <div className="aspect-square bg-zinc-100 overflow-hidden"><img className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNp0DmNlsdZ6TCBSjh8mlk4TcpYc_wC_olqpF8rgKJNQcssGenP_uvbTr-E5maJ5Z4bFyTviAKulU-JYlGCO0__CSU2OsvmldzemkfO4MRrPOEBgKpTi4Q2YiE5jqciBYRNNmPRQ8QLpweHCuJpTLjfifbNUSu24Dfm0tMKBjTTAAH0AcwDlpD9y96tmifvTnwyqbHhx7JTn83tyYVBjJ1otBWJdI58DtTmKCzzLZsYJaS-xqokMsv4eMVU4wF7oWRhlUiqSHRIXPk"/></div>
              <div className="aspect-square bg-zinc-100 overflow-hidden"><img className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4elCNrLtunEVP6mXuyg_vdDkYntAuCtMs2dNMMyz30cm6kxTBC61W9kHF1uZTgLiHmAZcyPKXG2fnEkXHkukWHvKBmwHb6WebDlprroozms1kF1Lj0HW8lbTOgkgZTXYGCv5AMXQfIoZhIyTNjdkxtvnP23i97KF3OLd7T6pCgwFhwBMzbY3_xsFgk5A8TpgZPJv2ucFxaAh4ggG7x8C-iAlBk_eUc3un_O54zXDTqqjiqoZThyz5Z70Hc4PZZmrx6XAzQEUNOvfW"/></div>
              <div className="aspect-square bg-zinc-100 overflow-hidden"><img className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBO_nqvPtkrACylFyVJSA9wVjpeDDD7ng7BdAdr180gv2viTUiK856B8VH_Zom77bWcE480oKVGcizQhtFlBGiZ4Vxsnz23wrTzGRQo9iBsfzu9HJ2YzYcK1XrxcjQmfmNmNkS-AnPLR8n5rhR9ZR-U9menbu8IwmAi7osCQxLi2XGFbxPoTBgW6q-gjhste77-LPCBZmojvhcXZa4P7Rz2uG3UhJY52i12knsBGudJNBeyaCT2xEzVO36KxIfWhuycMl6M4IMJBGKg"/></div>
            </div>
          </section>

          <section className="bg-black text-white py-24">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-[48px] leading-[1.1] tracking-[-0.04em] font-extrabold mb-6">DON&apos;T MISS THE NEXT DROP.</h2>
              <p className="text-[18px] leading-[1.6] mb-10 opacity-80">Be the first to know about limited releases and engineered drops. We only email when it matters.</p>
              <form className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
                <input className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-white/40 px-6 py-4 focus:ring-2 focus:ring-[#29fe57] focus:border-transparent outline-none uppercase text-[14px] leading-[1.2] tracking-[0.05em] font-bold backdrop-blur-md" placeholder="ENTER YOUR EMAIL" type="email"/>
                <button className="bg-[#29fe57]/90 backdrop-blur-md text-[#00711f] px-10 py-4 text-[14px] leading-[1.2] tracking-[0.05em] font-bold uppercase hover:bg-white transition-colors">Notify Me</button>
              </form>
            </div>
          </section>
        </main>

        <footer className="bg-zinc-900 border-t border-zinc-800">
          <div className="flex flex-col items-center py-16 px-6 text-center">
            <div className="mb-4">
              <Logo className="text-3xl" inverted />
            </div>
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              <Link className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-50 transition-opacity" href="/legal/terms">Terms</Link>
              <Link className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-50 transition-opacity" href="/legal/shipping">Shipping</Link>
              <Link className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-50 transition-opacity" href="/legal/returns">Returns</Link>
              <Link className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-50 transition-opacity" href="/legal/privacy">Privacy</Link>
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">© 2024 Fun Find © 2024</div>
          </div>
        </footer>
      </div>
    </>
  );
}
