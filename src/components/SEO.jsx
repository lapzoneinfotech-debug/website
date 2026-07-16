import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, url, image }) => {
  const siteTitle = 'LAPZONE INFOTECH | Premium Refurbished Laptops & Desktops';
  const defaultDescription = 'Buy premium refurbished laptops, desktops, and accessories at LAPZONE INFOTECH. Quality checked, warranty included, and fast delivery all over India.';
  const defaultImage = 'https://www.lapzoneinfotech.in/logo.png';
  const defaultUrl = 'https://www.lapzoneinfotech.in/';

  return (
    <Helmet>
      <title>{title ? `${title} | LAPZONE INFOTECH` : siteTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={title ? `${title} | LAPZONE INFOTECH` : siteTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:url" content={url || defaultUrl} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:title" content={title ? `${title} | LAPZONE INFOTECH` : siteTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={image || defaultImage} />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
};

export default SEO;
