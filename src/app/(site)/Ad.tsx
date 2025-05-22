'use client';

import Script from 'next/script';

export default function MonetagAd() {
  // Next.js will inline this at build time
  const zone = process.env.NEXT_PUBLIC_MONETAG_ZONE;

  return (
    <Script
      id="site-minify"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `(function(s,u,z,p){
  s.src = u;
  s.setAttribute('data-zone', z);
  p.appendChild(s);
})(
  document.createElement('script'),
  'https://al5sm.com/tag.min.js',
  ${zone},
  document.body || document.documentElement
);`,
      }}
    />
  );
}
