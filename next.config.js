/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export — GitHub Pages serves files, it does not run Node.
  output: 'export',
  // next/image cannot resize at request time under `export`; sizes are pre-generated.
  images: { unoptimized: true },
  // /projects -> /projects/index.html, so Pages resolves it without a rewrite rule.
  trailingSlash: true,
}

module.exports = nextConfig
