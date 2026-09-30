import type { Metadata } from 'next';
import ProjectsPageClient from '@/components/ProjectsPageClient';

export const metadata: Metadata = {
  alternates: { canonical: 'https://pavankushnure.website/projects' },
};

export default function ProjectsPage() {
  return <ProjectsPageClient />;
}
