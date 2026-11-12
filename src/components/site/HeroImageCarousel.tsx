import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
} from "react";
import { CAMPUS_IMAGES } from "@/lib/campus-images";
import { cn } from "@/lib/utils";

/**
 * Canonical campus images in sequence:
 * 1. Gate (Main campus entrance winter arch)
 * 2. College (Main academic building and fountain in winter)
 * 3. Computer Lab (Students working in computing facility)
 * 4. Medical Lab (Diagnostic & medical laboratory technology)
 * 5. Electrical/Electronics Lab (Students working on practical experiments)
 * 6. Library (Central library reading hall and study tables)
 */
const HERO_CAMPUS_SLIDES = [
  {
    src: CAMPUS_IMAGES.winterGate,
    alt: "Government Polytechnic for Women, Srinagar entrance gate in winter",
    width: 1024,
    height: 682,
  },
  {
    src: CAMPUS_IMAGES.collegeHero,
    alt: "Government Polytechnic for Women, Srinagar main academic campus building",
    width: 1024,
    height: 768,
  },
  {
    src: CAMPUS_IMAGES.computerLab,
    alt: "Computer laboratory with students at GPW Srinagar",
    width: 1024,
    height: 579,
  },
  {
    src: CAMPUS_IMAGES.microscopeLab,
    alt: "Medical laboratory students working with microscopes",
    width: 1024,
    height: 577,
  },
  {
    src: CAMPUS_IMAGES.electronicsLabStudents,
    alt: "Students conducting electrical and electronics laboratory practicals at Government Polytechnic for Women, Srinagar",
    width: 1024,
    height: 577,
  },
  {
    src: CAMPUS_IMAGES.libraryStudyTable,
    alt: "Students studying in the college central library",
    width: 1024,
    height: 576,
  },
] as const;

const SLIDE_INTERVAL_MS = 3600;

export type HeroImageCarouselProps = HTMLAttributes<HTMLDivElement> & {
  className?: string;
  style?: CSSProperties;
};

export const HeroImageCarousel = forwardRef<HTMLDivElement, HeroImageCarouselProps>(
  function HeroImageCarousel({ className, style, ...props }, ref) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [withTransition, setWithTransition] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const total = HERO_CAMPUS_SLIDES.length;

    // Append a clone of slide 0 at the end for an imperceptible, seamless infinite loop
    const extendedSlides = [...HERO_CAMPUS_SLIDES, HERO_CAMPUS_SLIDES[0]];

    const advanceSlide = useCallback(() => {
      setCurrentIndex((prev) => {
        if (prev >= total) {
          // If already at or beyond clone, snap cleanly to 0
          setWithTransition(false);
          return 0;
        }
        setWithTransition(true);
        return prev + 1;
      });
    }, [total]);

    // Automatically slide horizontally every 3.6 seconds in one continuous forward direction
    useEffect(() => {
      if (isHovered) return;
      const interval = setInterval(advanceSlide, SLIDE_INTERVAL_MS);
      return () => clearInterval(interval);
    }, [advanceSlide, isHovered]);

    // Handle seamless reset when reaching cloned slide at the end
    // Guaranteed by both transitionEnd and a fallback timeout (handles inactive tabs / frame drops)
    useEffect(() => {
      if (currentIndex >= total) {
        const timer = setTimeout(() => {
          setWithTransition(false);
          setCurrentIndex(0);
        }, 720);
        return () => clearTimeout(timer);
      }
      if (!withTransition) {
        const raf = requestAnimationFrame(() => {
          setWithTransition(true);
        });
        return () => cancelAnimationFrame(raf);
      }
      return undefined;
    }, [currentIndex, total, withTransition]);

    const onTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
      if (e.target !== e.currentTarget) return;
      if (currentIndex >= total) {
        // We reached the cloned first slide: instantly snap to index 0 without animation
        setWithTransition(false);
        setCurrentIndex(0);
      }
    };

    return (
      <div
        ref={ref}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "group relative aspect-[16/9] sm:aspect-[16/10] lg:aspect-[4/3] w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-light-blue/30 shadow-raised select-none",
          className,
        )}
        style={style}
        role="region"
        aria-label="Campus highlights slideshow"
        {...props}
      >
        <div
          onTransitionEnd={onTransitionEnd}
          className={cn(
            "flex h-full w-full will-change-transform",
            withTransition
              ? "transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
              : "transition-none",
          )}
          style={{
            transform: `translate3d(-${currentIndex * 100}%, 0, 0)`,
          }}
        >
          {extendedSlides.map((slide, index) => {
            const isClone = index === total;
            return (
              <div
                key={`${slide.src}-${index}`}
                className="relative h-full w-full flex-none shrink-0"
                aria-hidden={isClone}
              >
                <img
                  src={slide.src}
                  alt={slide.alt}
                  width={slide.width}
                  height={slide.height}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className="h-full w-full object-cover object-center pointer-events-none"
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);
