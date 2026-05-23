import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
    title, 
    description, 
    keywords, 
    ogImage, 
    ogUrl, 
    ogType = 'website',
    schemaData 
}) => {
    const siteTitle = 'Indian Furniture Mart | Indian Furniture Mart — Premium Luxury Furniture & Interior Collections';
    const fullTitle = title ? `${title} | Indian Furniture Mart` : siteTitle;
    const defaultDescription = 'Explore handcrafted furniture, elegant interiors, and curated modern living collections from Indian Furniture Mart.';
    const metaDescription = description || defaultDescription;
    const currentUrl = ogUrl || window.location.href;
    const defaultImage = 'https://indianfurnituremart.com/og-image.jpg'; 
    const metaImage = ogImage || defaultImage;

    return (
        <Helmet>
            {/* Standard metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />
            {keywords && <meta name="keywords" content={keywords} />}
            <link rel="canonical" href={currentUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={metaImage} />
            <meta property="og:url" content={currentUrl} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={metaImage} />

            {/* Structured Data */}
            {schemaData && (
                <script type="application/ld+json">
                    {JSON.stringify(schemaData)}
                </script>
            )}

            {/* Default Organization Schema */}
            {!schemaData && (
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FurnitureStore",
                        "name": "Indian Furniture Mart",
                        "image": metaImage,
                        "@id": "https://indianfurnituremart.com",
                        "url": "https://indianfurnituremart.com",
                        "telephone": "+91-XXXXXXXXXX",
                        "address": {
                            "@type": "PostalAddress",
                            "streetAddress": "Indian Furniture Mart",
                            "addressLocality": "Calicut",
                            "addressRegion": "Kerala",
                            "postalCode": "673001",
                            "addressCountry": "IN"
                        },
                        "geo": {
                            "@type": "GeoCoordinates",
                            "latitude": 11.2588,
                            "longitude": 75.7804
                        },
                        "openingHoursSpecification": {
                            "@type": "OpeningHoursSpecification",
                            "dayOfWeek": [
                                "Monday",
                                "Tuesday",
                                "Wednesday",
                                "Thursday",
                                "Friday",
                                "Saturday"
                            ],
                            "opens": "09:00",
                            "closes": "20:00"
                        }
                    })}
                </script>
            )}
        </Helmet>
    );
};

export default SEO;
