'use client';

import Image from 'next/image';
import { useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';

const education = [
  {
    institution: "Shri Guru Gobind Singhji Institute of Engineering and Technology, Nanded",
    degree: "Bachelor of Technology in Computer Science and Engineering",
    period: "2019 — 2023",
    image: "/unnamed.webp",
    details: [
      "CGPA: 9.02",
      "Coursework: Data Structures and Algorithms (DSA), Operating Systems (OS), Database Management Systems (DBMS), Computer Networks (CN), System Design"
    ]
  },
  {
    institution: "Jawahar Navodaya Vidyalaya, Wardha",
    degree: "Class XII (PCM) and Class X",
    period: "2011 — 2018",
    image: "/IMG_0278.jpeg",
    details: [
      "Class XII (PCM): 94%",
      "Class X: CGPA 10"
    ]
  }
];

export default function Education() {
  const [hoveredEducation, setHoveredEducation] = useState<string | null>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const x = useSpring(mouseX, { damping: 20, stiffness: 300, mass: 0.5 });
  const y = useSpring(mouseY, { damping: 20, stiffness: 300, mass: 0.5 });

  return (
    <section className="mb-16">
      <h2 id="education-heading" className="text-lg font-bold mb-6 text-black dark:text-white flex items-center gap-2">
        Education <span className="text-zinc-400 font-normal">#</span>
      </h2>

      <div className="space-y-4">
        {education.map((edu) => (
          <motion.div
            key={edu.institution}
            className="group rounded-lg border border-transparent hover:border-zinc-100 dark:hover:border-zinc-800 transition-colors duration-200"
            onMouseEnter={() => setHoveredEducation(edu.institution)}
            onMouseLeave={() => setHoveredEducation(null)}
            onMouseMove={(event) => {
              mouseX.set(event.clientX + 16);
              mouseY.set(event.clientY + 16);
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between p-4 pb-2">
              <div className="flex flex-col">
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  {edu.degree}
                </h3>
                <p className="text-sm text-zinc-500 mt-1">
                  at <span className="text-zinc-700 dark:text-zinc-300 font-medium">{edu.institution}</span>
                </p>
              </div>
              <span className="text-sm text-zinc-500 font-mono mt-2 sm:mt-0 flex-shrink-0">
                {edu.period}
              </span>
            </div>

            <div className="px-4 pb-4">
              <ul className="list-disc list-inside space-y-1 text-sm text-zinc-600 dark:text-zinc-400 marker:text-zinc-300 dark:marker:text-zinc-700">
                {edu.details.map((detail, i) => (
                  <li key={i}>{detail}</li>
                ))}
              </ul>
            </div>

            <AnimatePresence>
              {hoveredEducation === edu.institution && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  style={{ x, y }}
                  transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
                  className="hidden md:block fixed top-0 left-0 w-72 aspect-[16/9] rounded-xl overflow-hidden border border-zinc-200/50 dark:border-zinc-700/50 shadow-2xl z-50 bg-zinc-100 dark:bg-zinc-900 pointer-events-none"
                >
                  <Image
                    src={edu.image}
                    alt={edu.institution}
                    fill
                    className="object-cover"
                    sizes="288px"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
