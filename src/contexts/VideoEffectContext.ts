import { createContext } from 'react';
import { VideoEffect } from '../ui/VideoEffectsList.tsx';

type VideoEffectContextType = {
  videoEffects: Set<VideoEffect>;
  setVideoEffects: (videoEffects: Set<VideoEffect>) => void;
};

export const VideoEffectContext = createContext<VideoEffectContextType>(
  {} as VideoEffectContextType,
);
