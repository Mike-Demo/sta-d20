import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  robots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  ogSiteName?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterCard?: string;
  favicon?: string;
}

const SEOHead = ({
  title = "Star Trek Adventures 2d20 Dice Roller — LCARS‑Style Tool",
  description = "2d20 dice roller for STA 2e. Roll d20s and challenge dice, track successes, complications, and rerolls in a clean, rules‑accurate interface.",
  canonical = "https://2d20.space/",
  robots = "index, follow",
  ogTitle,
  ogDescription,
  ogImage = "https://2d20.space/social-card.png",
  ogType = "website",
  ogSiteName = "2d20.space",
  twitterTitle,
  twitterDescription,
  twitterImage,
  twitterCard = "summary_large_image",
  favicon = "https://2d20.space/pwa-icon-512.png",
}: SEOHeadProps) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <meta name="robots" content={robots} />
    <link rel="icon" type="image/png" href={favicon} />

    <meta property="og:title" content={ogTitle ?? title} />
    <meta property="og:description" content={ogDescription ?? description} />
    <meta property="og:image" content={ogImage} />
    <meta property="og:type" content={ogType} />
    <meta property="og:url" content={canonical} />
    <meta property="og:site_name" content={ogSiteName} />
    <meta property="og:image:width" content="1920" />
    <meta property="og:image:height" content="1080" />

    <meta name="twitter:card" content={twitterCard} />
    <meta name="twitter:title" content={twitterTitle ?? title} />
    <meta name="twitter:description" content={twitterDescription ?? description} />
    <meta name="twitter:image" content={twitterImage ?? ogImage} />
  </Helmet>
);

export default SEOHead;
