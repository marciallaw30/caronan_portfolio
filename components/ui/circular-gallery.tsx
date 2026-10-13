import React, { useState, useEffect, useRef, HTMLAttributes } from 'react';

// A simple utility for conditional class names
const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

// Define the type for a single gallery item
export interface GalleryItem {
  id?: string;
  common: string;
  binomial: string;
  photo: {
    url: string; 
    text: string;
    pos?: string;
    by: string;
  };
  details?: {
    element?: string;
    icon?: string;
    catalyst?: string;
    hierarchy?: string;
    passive?: string;
    ultimate?: string;
    [key: string]: any;
  };
}

// Define the props for the CircularGallery component
interface CircularGalleryProps extends HTMLAttributes<HTMLDivElement> {
  items: GalleryItem[];
  /** Controls how far the items are from the center. */
  radius?: number;
  /** Controls the speed of auto-rotation when not scrolling. */
  autoRotateSpeed?: number;
  /** Optional callback fired when an item card is clicked */
  onItemClick?: (item: GalleryItem, index: number) => void;
}

const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
  ({ items, className, radius = 600, autoRotateSpeed = 0.02, onItemClick, ...props }, ref) => {
    const [rotation, setRotation] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | number | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    // Effect to handle scroll-based rotation
    useEffect(() => {
      const handleScroll = () => {
        setIsScrolling(true);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current as any);
        }

        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
        const scrollRotation = scrollProgress * 360;
        setRotation(scrollRotation);

        scrollTimeoutRef.current = setTimeout(() => {
          setIsScrolling(false);
        }, 150);
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', handleScroll);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current as any);
        }
      };
    }, []);

    // Effect for auto-rotation when not scrolling
    useEffect(() => {
      const autoRotate = () => {
        if (!isScrolling) {
          setRotation(prev => prev + autoRotateSpeed);
        }
        animationFrameRef.current = requestAnimationFrame(autoRotate);
      };

      animationFrameRef.current = requestAnimationFrame(autoRotate);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [isScrolling, autoRotateSpeed]);

    const anglePerItem = items.length > 0 ? 360 / items.length : 0;
    
    return (
      <div
        ref={ref}
        role="region"
        aria-label="Circular 3D Gallery"
        className={cn("relative w-full h-full flex items-center justify-center", className)}
        style={{ perspective: '2000px' }}
        {...props}
      >
        <div
          className="relative w-full h-full"
          style={{
            transform: `rotateY(${rotation}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {items.map((item, i) => {
            const itemAngle = i * anglePerItem;
            const totalRotation = rotation % 360;
            const relativeAngle = (itemAngle + totalRotation + 360) % 360;
            const normalizedAngle = Math.abs(relativeAngle > 180 ? 360 - relativeAngle : relativeAngle);
            const opacity = Math.max(0.3, 1 - (normalizedAngle / 180));

            return (
              <div
                key={item.id || item.photo.url} 
                role="group"
                aria-label={item.common}
                className={cn(
                  "absolute w-[300px] h-[400px] select-none",
                  onItemClick ? "cursor-pointer" : ""
                )}
                onClick={() => onItemClick?.(item, i)}
                style={{
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  left: '50%',
                  top: '50%',
                  marginLeft: '-150px',
                  marginTop: '-200px',
                  opacity: opacity,
                  transition: 'opacity 0.3s linear, transform 0.2s ease',
                  pointerEvents: opacity > 0.4 ? 'auto' : 'none'
                }}
              >
                <div className="relative w-full h-full rounded-2xl shadow-2xl overflow-hidden group border border-border bg-card/70 dark:bg-card/30 backdrop-blur-lg hover:border-amber-400 hover:shadow-amber-500/20 transition-all duration-300 hover:-translate-y-2">
                  <img
                    src={item.photo.url}
                    alt={item.photo.text}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    style={{ objectPosition: item.photo.pos || 'center' }}
                  />
                  {/* Overlay gradient with Kingdom / Animal details */}
                  <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent text-white">
                    <div className="flex items-center justify-between mb-1">
                      <h2 className="text-xl font-bold leading-tight drop-shadow">{item.common}</h2>
                      {item.details?.icon && (
                        <span className="text-xl filter drop-shadow">{item.details.icon}</span>
                      )}
                    </div>
                    <em className="text-sm italic opacity-85 block drop-shadow-sm">{item.binomial}</em>
                    
                    {item.details?.catalyst && (
                      <div className="mt-1 text-xs text-amber-300 font-mono">
                        <span className="text-amber-400 font-semibold">Catalyst:</span> {item.details.catalyst}
                      </div>
                    )}

                    <div className="mt-2 pt-2 border-t border-white/20 flex items-center justify-between text-xs">
                      <span className="opacity-70 truncate max-w-[170px]">Photo: {item.photo.by}</span>
                      <span className="text-cyan-300 font-semibold group-hover:text-amber-300 group-hover:translate-x-1 transition-all flex items-center gap-1">
                        Details &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

CircularGallery.displayName = 'CircularGallery';

export { CircularGallery };
