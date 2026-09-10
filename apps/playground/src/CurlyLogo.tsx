import { useCallback, useEffect, useRef } from 'react';

export function CurlyLogo({ label = 'Curly home' }: { label?: string }) {
  const link = useRef<HTMLAnchorElement>(null);
  const face = useRef<HTMLSpanElement>(null);
  const visible = useRef(false);
  const playing = useRef(false);

  const stop = useCallback(() => {
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
  }, []);

  useEffect(() => {
    const target = link.current;
    if (!target) return;

    let greeted = false;
    let greetingTimer: ReturnType<typeof setTimeout> | undefined;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting && entry.intersectionRatio >= 0.6;
        if (!visible.current) {
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
      <span
        className="curly-face"
        aria-hidden="true"
        data-expression="rest"
        ref={face}
        onAnimationEnd={(event) => {
          if (event.animationName === 'curly-mouth-wink') stop();
        }}
      >
        <span className="curly-eye curly-eye-left">‘</span>
        <span className="curly-eye curly-eye-right">
          <span className="curly-eye-open">‘</span>
          <span className="curly-eye-closed">˜</span>
        </span>
        <span className="curly-mouth">˘</span>
      </span>
      <span className="wordmark-name">Curly</span>
    </a>
  );
}
