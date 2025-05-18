'use client';

const customLoader = ({ src, width, quality }: any) => {
  if (src.startsWith('http')) {
    return src;
  }
  if (src.endsWith('.svg')) {
    return `https://cdn.ordrat.com${src}`;
  }
  return `https://cdn.ordrat.com${src}?w=${width}&q=${quality || 75}`;
};

const CustomImage = ({ src, width = 800, quality = 75, alt = '', className = '', ...rest }: any) => {
  const computedSrc = customLoader({ src, width, quality });

  return (
    <img
      src={computedSrc}
      width={width}
      alt={alt}
      className={className}
      {...rest}
    />
  );
};

export default CustomImage;
