import { useCallback, useEffect, useRef } from 'react';
import { quoteOutline, smileOutline, winkOutline } from './curly-glyphs';

// A brief brand gesture: native SVG interpolation, with no per-frame JavaScript.
const gestureDuration = 960;
const gestureEase = '0.77 0 0.175 1';

export function CurlyLogo({ label = 'Curly home' }: { label?: string }) {
  const link = useRef<HTMLAnchorElement>(null);
  const face = useRef<SVGSVGElement>(null);
  const visible = useRef(false);
  const playing = useRef(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const stop = useCallback(() => {
    clearTimeout(resetTimer.current);
    face.current
      ?.querySelectorAll<SVGAnimationElement>('animate, animateTransform')
      .forEach((part) => {
        part.endElement();
      });
    playing.current = false;
    if (face.current) face.current.dataset.expression = 'rest';
  }, []);

  const wink = useCallback(() => {
    if (
      !face.current ||
      !visible.current ||
      playing.current ||
      document.hidden ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;

    playing.current = true;
    face.current.dataset.expression = 'wink';
    face.current
      .querySelectorAll<SVGAnimationElement>('animate, animateTransform')
      .forEach((part) => {
        part.beginElement();
      });
    resetTimer.current = setTimeout(() => {
      playing.current = false;
      if (face.current) face.current.dataset.expression = 'rest';
    }, gestureDuration);
  }, []);

  useEffect(() => {
    const target = link.current;
    if (!target) return;

    let greeted = false;
    let greetingTimer: ReturnType<typeof setTimeout> | undefined;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting;
        if (!entry.isIntersecting) {
          clearTimeout(greetingTimer);
          stop();
        } else if (!greeted) {
          greeted = true;
          greetingTimer = setTimeout(wink, 400);
        }
      },
      { threshold: 0.6 },
    );
    const onVisibility = () => {
      if (document.hidden) stop();
    };
    const onMotion = () => {
      if (motion.matches) stop();
    };

    observer.observe(target);
    document.addEventListener('visibilitychange', onVisibility);
    motion.addEventListener('change', onMotion);
    return () => {
      observer.disconnect();
      clearTimeout(greetingTimer);
      document.removeEventListener('visibilitychange', onVisibility);
      motion.removeEventListener('change', onMotion);
      stop();
    };
  }, [stop, wink]);

  return (
    <a
      className="wordmark"
      href="#top"
      aria-label={label}
      ref={link}
      onPointerEnter={(event) => {
        if (
          event.pointerType === 'mouse' &&
          window.matchMedia('(hover: hover) and (pointer: fine)').matches
        )
          wink();
      }}
      onPointerDown={(event) => {
        if (event.isPrimary && event.button === 0) wink();
      }}
    >
      <svg
        className="curly-face"
        viewBox="0 0 48 48"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
        data-expression="rest"
        ref={face}
      >
        <path d={quoteOutline} transform="translate(10.5 6) scale(2.5)" />
        <g transform="translate(30.5 6) scale(2.5)">
          <path className="curly-eye" d={quoteOutline}>
            <animate
              attributeName="d"
              begin="indefinite"
              dur={`${gestureDuration}ms`}
              values={`${quoteOutline};${quoteOutline};${winkOutline};${winkOutline};${quoteOutline};${quoteOutline}`}
              keyTimes="0;0.12;0.28;0.44;0.65;1"
              calcMode="spline"
              keySplines={Array(5).fill(gestureEase).join(';')}
              fill="remove"
              restart="whenNotActive"
            />
          </path>
        </g>
        <g className="curly-smile-tilt">
          <animateTransform
            attributeName="transform"
            type="rotate"
            begin="indefinite"
            dur={`${gestureDuration}ms`}
            values="0 24 32;-9 24 32;-5 24 32;0 24 32"
            keyTimes="0;0.3;0.6;1"
            calcMode="spline"
            keySplines={Array(3).fill(gestureEase).join(';')}
            fill="remove"
            restart="whenNotActive"
          />
          <g className="curly-smile-shift">
            <animateTransform
              attributeName="transform"
              type="translate"
              begin="indefinite"
              dur={`${gestureDuration}ms`}
              values="0 0;1.4 -1.5;0.8 -0.5;0 0"
              keyTimes="0;0.3;0.6;1"
              calcMode="spline"
              keySplines={Array(3).fill(gestureEase).join(';')}
              fill="remove"
              restart="whenNotActive"
            />
            <path d={smileOutline} transform="translate(40 28) rotate(90) scale(2.8)" />
          </g>
        </g>
      </svg>
      <span className="wordmark-name">Curly</span>
    </a>
  );
}
