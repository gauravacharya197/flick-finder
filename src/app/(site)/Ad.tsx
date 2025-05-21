'use client';

import Script from 'next/script';

export default function MonetagLoader() {
  return (
    <Script
      id="monetag-loader"
      strategy="beforeInteractive"
      // no other props needed
      dangerouslySetInnerHTML={{
        __html: `(function(s,u,z,p){
  s.src = u;
  s.setAttribute('data-zone', z);
  p.appendChild(s);
})(
  document.createElement('script'),
  'https://al5sm.com/tag.min.js',
  9362559,
  document.body || document.documentElement
);`,
      }}
    />
  );
}
