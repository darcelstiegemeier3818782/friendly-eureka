// Tiny index for client-side search
// Each doc: { id, title, url, body }
const DATA = [
  {
    id: 'home',
    title: 'Home · Techy Static PWA',
    url: 'index.html',
    body: 'A beautiful static site with PWA, offline caching, client-side search, accessibility, and a WCAG contrast checker. Generative SVG art and zero-build deployment.'
  },
  {
    id: 'contrast',
    title: 'WCAG Contrast Checker',
    url: 'contrast.html',
    body: 'Test two colors for WCAG 2.1 contrast compliance with an auto-fix feature that adjusts text color lightness to reach AA or AAA thresholds.'
  },
  {
    id: 'search',
    title: 'Search the Site',
    url: 'search.html',
    body: 'Search across pages using a simple TF-IDF-like ranker. Private, fast, and runs entirely on the client side.'
  },
  {
    id: 'gallery',
    title: 'Generative SVG Gallery',
    url: 'gallery.html',
    body: 'Create layered, gradient-filled shapes with seeded randomness. Save the SVG to your device.'
  },
  {
    id: 'articles',
    title: 'Articles: PWA, Accessibility, Search',
    url: 'articles.html',
    body: 'Why a service worker matters; Accessibility is a feature; Search without a backend. Precache, runtime caching, skipWaiting, clients.claim, aria-label, skip links.'
  },
  {
    id: 'about',
    title: 'About This Project',
    url: 'about.html',
    body: 'No-build static site featuring PWA, client-side search, WCAG color contrast checker, and generative SVG art. All files at root for easy GitHub Pages hosting.'
  },
  {
    id: 'contact',
    title: 'Contact',
    url: 'contact.html',
    body: 'Demo contact form. This is a demo only; form submissions are not transmitted.'
  }
];
