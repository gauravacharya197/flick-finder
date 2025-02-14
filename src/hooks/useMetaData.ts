// hooks/useMetadata.js
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface OGTags {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
}

const useMetadata = (
  title: string,
  description: string,
  og?: OGTags
) => {
  const router = useRouter();

  useEffect(() => {
    // Set basic metadata
    document.title = title;
    
    // Handle description meta tag
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = description;
      document.head.appendChild(meta);
    }

    // Handle OG tags if provided
    if (og) {
      const ogTags = {
        'og:title': og.title || title,
        'og:description': og.description || description,
        'og:image': og.image,
        'og:url': og.url,
        'og:type': og.type,
        'og:site_name': og.siteName
      };

      // Update or create OG meta tags
      Object.entries(ogTags).forEach(([property, content]) => {
        if (content) {
          const existingTag = document.querySelector(`meta[property="${property}"]`);
          if (existingTag) {
            existingTag.setAttribute('content', content);
          } else {
            const meta = document.createElement('meta');
            meta.setAttribute('property', property);
            meta.setAttribute('content', content);
            document.head.appendChild(meta);
          }
        }
      });
    }

    // Cleanup function to remove dynamically added tags when component unmounts
    return () => {
      // Optional: Remove dynamic tags on cleanup if needed
    };
  }, [title, description, og, router.replace]);
};

export default useMetadata;