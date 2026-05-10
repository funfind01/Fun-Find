// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');
let html = fs.readFileSync('src/app/page.tsx', 'utf-8');

// Extract the html string
const match = html.match(/const dashboardHtml = `([\s\S]*?)`;/);
if (!match) process.exit(1);

let jsx = match[1];
jsx = jsx.replace(/class=/g, 'className=');
jsx = jsx.replace(/onclick=/g, 'onClick=');
jsx = jsx.replace(/<img(.*?)>/g, (m, p1) => {
  if (p1.endsWith('/')) return `<img${p1}>`;
  return `<img${p1}/>`;
});
jsx = jsx.replace(/<input(.*?)>/g, (m, p1) => {
  if (p1.endsWith('/')) return `<input${p1}>`;
  return `<input${p1}/>`;
});
jsx = jsx.replace(/<link(.*?)>/g, (m, p1) => {
  if (p1.endsWith('/')) return `<link${p1}>`;
  return `<link${p1}/>`;
});
jsx = jsx.replace(/style="([^"]*)"/g, (m, p1) => {
  const styles = p1.split(';').filter(s => s.trim() !== '');
  const obj = {};
  styles.forEach(s => {
    let [key, val] = s.split(':');
    if (!key || !val) return;
    key = key.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
    obj[key] = val.trim();
  });
  return `style={${JSON.stringify(obj)}}`;
});
jsx = jsx.replace(/<!--[\s\S]*?-->/g, '');

const finalFile = `
"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: \`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 12px)); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      \`}} />
      ${jsx.replace(/<link[^>]*>/g, '').replace(/<style>[\s\S]*?<\/style>/, '').replace(/<nav[\s\S]*?<\/nav>/, '<Navbar />')}
    </>
  );
}
`;

fs.writeFileSync('src/app/page.tsx.new', finalFile);
