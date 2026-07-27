'use client';

import { createContext, useContext, useState } from 'react';
import { SCENES, type Scene } from '@/data/ambience';

type AmbienceContextType = {
  scene: Scene
  index: number
  setIndex: (i: number) => void
}

const AmbienceContext = createContext<AmbienceContextType | undefined>(undefined);

export const useAmbience = () => {
  const context = useContext(AmbienceContext);
  if (context === undefined) {
    throw new Error('useAmbience must be used within an AmbienceProvider');
  }
  return context;
};

// The player sits in the layout and the banner sits inside the page, so the
// selected scene has no prop path between them.
export const AmbienceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [index, setIndex] = useState(0);

  return (
    <AmbienceContext.Provider value={{ scene: SCENES[index], index, setIndex }}>
      {children}
    </AmbienceContext.Provider>
  );
};
