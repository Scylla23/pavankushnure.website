export interface Film {
  title: string;
  slug: string;
  label: string;
  video: string;
  poster: string;
  width: number;
  height: number;
  seconds: number;
  caption: string;
  link: string;
  transcript: string;
}

export const films: Film[] = [
  {
    title: 'Hotelist',
    slug: 'hotelist',
    label: 'spec film',
    video: '/films/hotelist.mp4',
    poster: '/films/hotelist-poster.jpg',
    width: 1920,
    height: 1080,
    seconds: 20,
    caption: "A 20-second film for Pieter Levels' hotel search. Nobody asked me to make it, and it isn't affiliated with Hotelist. The data in it comes from the live site, down to the dips both World Wars left in the chart of when its hotels were built.",
    link: 'https://hotelist.com',
    transcript: "Why is every hotel a 4.7? Hotelist rates them honestly, with AI. It reads what real travelers say, looks at the actual room photos, and checks if the gym is really a gym. You can even see both World Wars. Nobody can buy their way to the top. Find a good hotel at hotelist.com.",
  },
];

export interface InspirationFilm {
  title: string;
  slug: string;
  video: string;
  poster: string;
  width: number;
  height: number;
  seconds: number;
}

export const inspirationFilms: InspirationFilm[] = [
  {
    title: 'Gumroad',
    slug: 'gumroad',
    video: '/films/inspiration/gumroad.mp4',
    poster: '/films/inspiration/gumroad-poster.jpg',
    width: 1920,
    height: 1080,
    seconds: 31,
  },
  {
    title: 'Shopify',
    slug: 'shopify',
    video: '/films/inspiration/shopify.mp4',
    poster: '/films/inspiration/shopify-poster.jpg',
    width: 1920,
    height: 1080,
    seconds: 20,
  },
  {
    title: 'Figma',
    slug: 'figma',
    video: '/films/inspiration/figma.mp4',
    poster: '/films/inspiration/figma-poster.jpg',
    width: 1920,
    height: 1080,
    seconds: 23,
  },
];

export const offer = { month: 'October', price: 99, slots: 3, slotsLeft: 3 };
