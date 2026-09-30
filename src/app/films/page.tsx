import type { Metadata } from 'next';
import FilmsPageClient from '@/components/FilmsPageClient';

const description = '20-second launch films for software products, made in code.';
const url = 'https://pavankushnure.website/films';
const image = {
  url: '/films/og.jpg',
  width: 1200,
  height: 630,
  alt: 'Hotelist launch film: Why is every hotel a 4.7?',
};

export const metadata: Metadata = {
  title: 'Launch films',
  description,
  alternates: { canonical: url },
  openGraph: {
    type: 'website',
    title: 'Launch films | Pavan Kushnure',
    description,
    url,
    images: [image],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Launch films | Pavan Kushnure',
    description,
    images: [image],
  },
};

export default function FilmsPage() {
  return <FilmsPageClient />;
}
