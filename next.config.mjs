/** @type {import('next').NextConfig} */
const nextConfig = {
  // GitHub Pages serves static files only — no Node server.
  output: 'export',
  // Required by `output: 'export'`; next/image's optimizer needs a server.
  // Responsive sizes are pre-generated instead — see scripts/build-images.sh.
  images: { unoptimized: true },
  // /work -> /work/index.html, which is what Pages actually resolves.
  trailingSlash: true,
}

export default nextConfig
