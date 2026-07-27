'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const RotatingText = ({ items, interval = 2600 }: { items: string[]; interval?: number }) => {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setI((n) => (n + 1) % items.length), interval);
    return () => clearInterval(id);
  }, [items.length, interval]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={i}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        className="block"
      >
        {items[i]}
      </motion.span>
    </AnimatePresence>
  );
};

export default RotatingText;
