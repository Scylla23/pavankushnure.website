export type Scene = {
  id: string
  label: string
  /** Loopable ambience track in public/music/. */
  audio: string
  /** 1600x600 banner cut by scripts/build-images.sh. */
  photo: string
  /** Overlaid on the banner while this scene is showing. */
  caption: string
}

export const SCENES: Scene[] = [
  {
    id: 'forest',
    label: 'forest',
    audio: '/music/forest.mp3',
    photo: '/img/scene-forest.jpg',
    caption: 'The biggest risk is not taking any risk.',
  },
  {
    id: 'ocean',
    label: 'ocean',
    audio: '/music/ocean.mp3',
    photo: '/img/scene-ocean.jpg',
    caption: 'You cannot stop the waves, but you can learn to surf.',
  },
  {
    id: 'mountains',
    label: 'mountains',
    audio: '/music/mountains.mp3',
    photo: '/img/scene-mountains.jpg',
    caption: 'The summit is not the point. The climb is.',
  },
  {
    id: 'rain',
    label: 'rain',
    audio: '/music/rain.mp3',
    photo: '/img/scene-rain.jpg',
    caption: 'Everything grows in the monsoon.',
  },
]
