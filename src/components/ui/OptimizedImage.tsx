import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  fallbackText?: string;
}

export function OptimizedImage({
  src,
  alt,
  className = "",
  fallbackText = "Image unavailable",
  loading = "lazy",
  decoding = "async",
  ...props
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div className={`flex flex-col items-center justify-center bg-secondary/60 text-muted-foreground p-4 text-center select-none ${className}`}>
        <ImageIcon className="h-6 w-6 text-muted-foreground/50 mb-1" />
        <span className="text-[10px] font-medium">{fallbackText}</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-secondary/40 ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-secondary/60 animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding={decoding}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={`h-full w-full object-cover transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        {...props}
      />
    </div>
  );
}
