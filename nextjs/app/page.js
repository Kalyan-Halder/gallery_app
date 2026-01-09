'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const PHOTOS = [
  '/home1.jpg',
  '/home2.jpg',
  '/home3.jpg',
  '/home4.jpg',
  '/home5.jpg',
   
];

const CTA_CLASS =
  'inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm sm:text-base font-semibold bg-white text-black hover:bg-white/90 active:scale-[0.99] shadow-[0_18px_45px_rgba(0,0,0,0.45)] transition';

const EASE_OUT = [0.16, 1, 0.3, 1];

function PhotoCard({ src, priority = false }) {
  return (
    <div className="group relative h-37.5 w-27.5 sm:h-50 sm:w-37.5 rounded-2xl overflow-hidden border border-white/20 bg-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur">
      <Image
        src={src}
        alt="Shutter Sphere preview"
        fill
        sizes="(max-width: 640px) 110px, 150px"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
        priority={priority}
      />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-linear-to-tr from-white/0 via-white/10 to-white/0" />
    </div>
  );
}

function StaticStack() {
  const rotations = [-10, -6, -2, 2, 6, 10, -8, 8];

  return (
    <div className="relative h-85 sm:h-130 w-full max-w-225 mx-auto">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-60 w-60 sm:h-80 sm:w-80 rounded-full blur-3xl bg-white/10" />

      {PHOTOS.map((src, i) => (
        <div
          key={src + i}
          className="absolute left-1/2 top-1/2"
          style={{
            transform: `translate(-50%, -50%) rotate(${rotations[i % rotations.length]}deg)`,
            zIndex: 20 + i,
          }}
        >
          <PhotoCard src={src} priority={i < 2} />
        </div>
      ))}
    </div>
  );
}

function AnimatedBurst({ onDone, spreadDone }) {
  const cards = useMemo(() => {
    const count = PHOTOS.length;

    // bigger spread radius
    const RADIUS = 240;
    const Y_SQUASH = 0.88;

    // EDIT THIS to change starting point of the circle:
    // 0 = right, -Math.PI/2 = top, Math.PI/2 = bottom, Math.PI = left
    const START_ANGLE = -Math.PI / 2;

    return Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * Math.PI * 2 + START_ANGLE;
      const x = Math.cos(angle) * RADIUS;
      const y = Math.sin(angle) * (RADIUS * Y_SQUASH);
      const finalRotate = Math.round((i - count / 2) * 7);

      return {
        i,
        x,
        y,
        finalRotate,
        z: 50 + (i % 4) * 6,
        floatDelay: i * 0.25,
      };
    });
  }, []);

  const lastIndex = PHOTOS.length - 1;

  return (
    <div className="relative h-85 sm:h-130 w-full max-w-225 mx-auto">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-60 w-60 sm:h-80 sm:w-80 rounded-full blur-3xl bg-white/10" />

      {PHOTOS.map((src, i) => {
        const c = cards[i];

        return (
          <motion.div
            key={src + i}
            className="absolute left-1/2 top-1/2 origin-center"
            style={{
              zIndex: c.z,
              // force transform origin center (no React warning)
              transformOrigin: '50% 50%',
            }}
            // IMPORTANT: keeps the card centered at (50%,50%) before motion transforms
            transformTemplate={(transform, generated) => `translate(-50%, -50%) ${generated}`}
            initial={{ x: 0, y: 0, rotate: -12 + i * 3, scale: 0.78, opacity: 0 }}
            animate={
              spreadDone
                ? { x: c.x, y: c.y, rotate: c.finalRotate, scale: 1, opacity: 1 }
                : {
                    x: [0, c.x],
                    y: [0, c.y],
                    // slower spin
                    rotate: [0, 240 + c.finalRotate],
                    scale: [0.78, 1],
                    opacity: [0, 1],
                  }
            }
            transition={
              spreadDone
                ? { duration: 0.65, ease: 'easeOut' }
                : {
                    duration: 1.9,
                    delay: 0.18 + i * 0.07,
                    ease: EASE_OUT,
                  }
            }
            onAnimationComplete={() => {
              if (!spreadDone && i === lastIndex) onDone();
            }}
          >
            {/* gentle floating AFTER spread */}
            <motion.div
              className="origin-center"
              style={{ transformOrigin: '50% 50%' }} // center rotation (no React warning)
              animate={
                spreadDone
                  ? {
                      y: [0, -10 - (i % 3) * 2, 0],
                      rotate: [0, 1.6, 0],
                    }
                  : {}
              }
              transition={
                spreadDone
                  ? {
                      duration: 4.8 + (i % 4) * 0.6,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: c.floatDelay,
                    }
                  : undefined
              }
            >
              <PhotoCard src={src} priority={i < 2} />
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [spreadDone, setSpreadDone] = useState(false);

  // hydration-safe: only animate after mount
  useEffect(() => setMounted(true), []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[url('/bg1.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 bg-linear-to-b from-black/55 via-black/40 to-black/70" />
      <div className="absolute inset-0 [box-shadow:inset_0_0_160px_rgba(0,0,0,0.75)]" />

      {/* layout */}
      <div className="relative z-10 h-full w-full flex flex-col items-center">
        {/* TOP TEXT (kept above photos) */}
        <div className="w-full max-w-6xl px-6 pt-10 sm:pt-14 text-center select-none relative z-30">
          {mounted ? (
            <>
              <motion.h1
                initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.85, ease: 'easeOut' }}
                className="text-5xl sm:text-5xl font-bold tracking-tight text-amber-400 drop-shadow"
              >
                Capture your creative shot
              </motion.h1>
              <motion.h2
                initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.9, delay: 0.12, ease: 'easeOut' }}
                className="mt-3 text-2xl sm:text-2xl text-green-400"
              >
                And store forever for everyone
              </motion.h2>
            </>
          ) : (
            <>
              <h1 className="text-5xl sm:text-5xl font-bold tracking-tight text-white drop-shadow">
                Capture your creative shot
              </h1>
              <h2 className="mt-3 text-xl sm:text-2xl text-green-400">
                And store forever for everyone
              </h2>
            </>
          )}

            
        </div>

        {/* MIDDLE VISUAL */}
        <div className="flex-1 w-full flex items-center justify-center px-6 relative z-20">
          {mounted ? (
            <AnimatedBurst onDone={() => setSpreadDone(true)} spreadDone={spreadDone} />
          ) : (
            <StaticStack />
          )}
        </div>

        {/* CTA (centered) */}
        <div className="w-full px-6 pb-10 sm:pb-12 flex justify-center relative z-30">
          {mounted ? (
            <motion.div
              initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
              animate={
                spreadDone
                  ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                  : { opacity: 0, y: 10, filter: 'blur(6px)' }
              }
              transition={{ duration: 0.55, ease: 'easeOut' }}
            >
              <Link href="/signin" className={CTA_CLASS}>
                Go to Login <span aria-hidden>→</span>
              </Link>
            </motion.div>
          ) : (
            // keeps markup consistent for hydration
            <div className="opacity-0 absolute">
              <Link href="/login" className={CTA_CLASS}>
                Go to Login <span aria-hidden>→</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
