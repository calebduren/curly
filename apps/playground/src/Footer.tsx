import { useCallback, useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { CurlyLogo } from './CurlyLogo';

const landscape = String.raw`
       _                                                        _
      | |     _                                     _          | |
    _ | |    | |          __..--..__                | |    _    | | _
   | || |    | |    _..--''        ''--.._          | |   | |   | || |
   |__  |____| |_.-'                      '-.._    | |___| |   |  __|
      |  ____|                                 '-.|  _____|   | |
  ____| |_________________________________________| |_________| |____
`;

export function Footer() {
  const footer = useRef<HTMLElement>(null);
  const roll = useRef<HTMLPreElement>(null);
  const breeze = useCallback(() => {
    if (document.hidden || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (roll.current) roll.current.dataset.rolling = 'true';
  }, []);

  useEffect(() => {
    const node = footer.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          breeze();
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [breeze]);

  return (
    <footer
      ref={footer}
      onPointerEnter={(event) => {
        if (
          event.pointerType === 'mouse' &&
          window.matchMedia('(hover: hover) and (pointer: fine)').matches
        )
          breeze();
      }}
    >
      <div className="footer-content">
        <CurlyLogo label="Curly, back to top" />
        <p>Made with a little conviction.</p>
        <a href="https://cowboy.is">
          By Cowboy <ArrowUpRight size={15} />
        </a>
        <nav aria-label="Elsewhere">
          <a href="https://github.com/calebduren/curly">
            GitHub <ArrowUpRight size={15} />
          </a>
          <a href="https://github.com/calebduren/curly/releases">
            Releases <ArrowUpRight size={15} />
          </a>
        </nav>
        <span className="copyright">
          © {new Date().getFullYear()}{' '}
          <a href="https://calebduren.com">
            Caleb Durenberger <ArrowUpRight size={15} />
          </a>
        </span>
      </div>
      <div className="footer-landscape" aria-hidden="true">
        <pre>{landscape}</pre>
        <pre
          className="tumbleweed"
          ref={roll}
          data-rolling="false"
          onAnimationEnd={() => {
            if (roll.current) roll.current.dataset.rolling = 'false';
          }}
        >{String.raw` .\|/.
--(*)--
 '/|\'`}</pre>
      </div>
    </footer>
  );
}
