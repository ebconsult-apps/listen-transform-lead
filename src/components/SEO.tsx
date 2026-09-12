import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  path: string;
  type?: string;
  structuredData?: Record<string, unknown>;
  /** Keep utility pages (thank-you, booking confirmations) out of search/AI results */
  noindex?: boolean;
}

const SEO = ({
  title,
  description,
  path,
  type = "website",
  structuredData,
  noindex = false,
}: SEOProps) => {
  const siteUrl = "https://clear-framework.com";
  const canonicalUrl = `${siteUrl}${path}`;
  const ogImage = `${siteUrl}/og-image.jpg`;

  // `defer={false}` applies head changes synchronously instead of on the next
  // animation frame. The build-time prerenderer renders routes in background
  // tabs where rAF never fires, so with the default every page except the first
  // was captured with index.html's generic title, no description, and no JSON-LD.
  return (
    <Helmet defer={false}>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noindex && <meta name="robots" content="noindex" />}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
