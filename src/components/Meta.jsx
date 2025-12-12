import React, { useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const Meta = ({
  title,
  description,
  keywords,
  canonicalUrl,
  jsonLd,
  openGraph,
  twitterCard,
  noindex,
  locale = 'bn_BD',
}) => {
  useEffect(() => {
    console.log('[Meta] render', { title, canonicalUrl });
  }, [title, canonicalUrl]);

  const og = openGraph || {};
  const tw = twitterCard || {};

  const robotsContent = noindex ? 'noindex,nofollow' : 'index,follow';

  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
        {keywords && <meta name="keywords" content={keywords} />}
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        <meta name="robots" content={robotsContent} />

        <meta property="og:type" content={og.type || 'website'} />
        <meta property="og:title" content={og.title || title} />
        {description && <meta property="og:description" content={og.description || description} />} 
        {canonicalUrl && <meta property="og:url" content={og.url || canonicalUrl} />}
        {og.image && <meta property="og:image" content={og.image} />}
        <meta property="og:site_name" content={og.siteName || 'ফুলমুড়ী যুব ফাউন্ডেশন'} />
        <meta property="og:locale" content={og.locale || locale} />

        <meta name="twitter:card" content={tw.card || 'summary_large_image'} />
        <meta name="twitter:title" content={tw.title || title} />
        {description && <meta name="twitter:description" content={tw.description || description} />} 
        {tw.image && <meta name="twitter:image" content={tw.image} />}
        {tw.site && <meta name="twitter:site" content={tw.site} />}

        {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
      </Helmet>
    </HelmetProvider>
  );
};

export default Meta;
