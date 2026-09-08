'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Slide = {
  imageUrl: string;
  caption: string | null;
  projectName: string;
  projectSlug: string;
};

export default function ProjectGalleryHero({ slides }: { slides: Slide[] }) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) {
    return (
      <section className="bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 px-6 py-24 text-center text-white sm:py-32">
        <HeroCopy />
      </section>
    );
  }

  const slide = slides[activeSlide];
  return (
    <section className="relative isolate min-h-[560px] overflow-hidden bg-emerald-950 text-white sm:min-h-[640px]">
      {slides.map((item, index) => (
        <img
          key={item.imageUrl}
          src={item.imageUrl}
          alt={item.caption || `${item.projectName} project activity`}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${index === activeSlide ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-950/60 to-emerald-950/20" />
      <div className="relative mx-auto flex min-h-[560px] max-w-6xl flex-col justify-end px-6 py-16 sm:min-h-[640px] sm:py-20">
        <div className="max-w-2xl">
          <HeroCopy />
          <Link href={`/projects/${slide.projectSlug}`} className="mt-6 inline-block text-sm font-semibold text-emerald-100 hover:text-white">
            Featured photo from {slide.projectName} →
          </Link>
          {slide.caption && <p className="mt-2 text-sm text-white/80">{slide.caption}</p>}
        </div>
        {slides.length > 1 && <div className="mt-8 flex gap-2" aria-label="Choose a featured project photo">
          {slides.map((item, index) => (
            <button key={`${item.projectSlug}-${item.imageUrl}`} type="button" onClick={() => setActiveSlide(index)} aria-label={`Show ${item.projectName} photo`} className={`h-2 rounded-full transition-all ${index === activeSlide ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'}`} />
          ))}
        </div>}
      </div>
    </section>
  );
}

function HeroCopy() {
  return <><p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-200">Eco Warriors Initiative Uganda</p><h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-6xl">Communities leading a greener, healthier future.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-green-100">Empowering communities through climate action, health, education, and sustainable livelihoods.</p><div className="mt-9 flex flex-wrap gap-3"><Link href="/get-involved" className="rounded-full bg-white px-6 py-3 font-semibold text-emerald-900 hover:bg-emerald-100">Get involved</Link><Link href="/programs" className="rounded-full border border-white/70 px-6 py-3 font-semibold hover:bg-white/10">Explore our work</Link></div></>;
}
