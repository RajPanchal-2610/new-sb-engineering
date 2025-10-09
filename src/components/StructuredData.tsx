import { Helmet } from 'react-helmet-async';

export const StructuredData = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "New SB Engineering",
    "description": "Expert metal fabrication services with 20+ years of experience. Custom gates, railings, and architectural metalwork.",
    "founder": {
      "@type": "Person",
      "name": "Nilesh R. Panchal"
    },
    "url": "https://newsbengineering.netlify.app",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Bardoli",
      "addressRegion": "Gujarat",
      "addressCountry": "IN"
    },
    "openingHours": "Mo-Sa 09:00-18:00",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Metal Fabrication Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Custom Metal Gates",
            "description": "Security gates and decorative metal gates"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Window Grills",
            "description": "Custom window grills and security solutions"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Railings",
            "description": "Balcony railings and staircase railings"
          }
        }
      ]
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};