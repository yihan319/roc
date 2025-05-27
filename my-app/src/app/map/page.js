'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MapPage() {
 
  const [vw, setVw] = useState(0);
  useEffect(() => {
    const setWidth = () => setVw(window.innerWidth);
    setWidth();                         
    window.addEventListener('resize', setWidth);
    return () => window.removeEventListener('resize', setWidth);
  }, []);

  return (
    <>
    
      <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-[#00BB00] to-[#0066CC] shadow-lg px-4 py-2 z-50">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
        
          <ul className="flex gap-4 text-white text-xl lg:text-2xl">
            <li><Link href="/">首頁</Link></li>
            <li><Link href="/map">地圖</Link></li>
            <li><Link href="#">通報狀況</Link></li>
          </ul>
          <ul className="flex gap-4 text-white text-xl lg:text-2xl">
            <li><Link href="/signup">註冊</Link></li>
            <li><Link href="/signin">登入</Link></li>
          </ul>
        </nav>
      </header>

    
      <main className="pt-24 flex justify-center">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3616.459855520764!2d121.33977687418142!3d24.984485640285808!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1szh-TW!2stw!4v1748362641384!5m2!1szh-TW!2stw"
         
          width={vw > 1024 ? 1024 : Math.max(300, vw * 0.95)}
          height="600"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </main>
    </>
  );
}
