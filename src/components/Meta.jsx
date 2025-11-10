import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const Meta = ({ title, description, keywords, canonicalUrl, jsonLd }) => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <link rel="canonical" href={canonicalUrl} />
        {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
      </Helmet>
    </HelmetProvider>
  );
};

export default Meta;