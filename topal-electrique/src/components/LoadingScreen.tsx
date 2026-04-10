'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-dark-950"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            <Image
              src="/images/logo.png"
              alt="Topal Électrique"
              width={120}
              height={120}
              className="h-24 w-auto sm:h-32"
              style={{
                filter: 'drop-shadow(0 0 30px rgba(255, 107, 0, 0.5)) drop-shadow(0 0 60px rgba(255, 107, 0, 0.3))',
              }}
              priority
            />
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-3 font-heading text-xl font-bold tracking-widest text-orange-500"
              style={{
                textShadow: '0 0 20px rgba(255, 107, 0, 0.4)',
              }}
            >
              TOPAL ÉLECTRIQUE
            </motion.span>
          </motion.div>

          {/* Progress Bar */}
          <div className="mt-10 h-[2px] w-48 overflow-hidden rounded-full bg-white/10 sm:w-64">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full bg-gradient-to-r from-orange-600 to-orange-400"
              style={{
                boxShadow: '0 0 12px rgba(255, 107, 0, 0.6)',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
