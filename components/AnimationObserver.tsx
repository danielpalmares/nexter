'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AnimationObserver() {
  const pathname = usePathname();

  useEffect(() => {
    let observer: IntersectionObserver;

    const timer = setTimeout(() => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );

      document.querySelectorAll('.animate:not(.visible)').forEach((el) =>
        observer.observe(el)
      );
    }, 50);

    return () => {
      clearTimeout(timer);
      observer?.disconnect();
    };
  }, [pathname]);

  return null;
}
