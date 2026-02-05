import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ScrollAnimationService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private observers = new Map<string, IntersectionObserver>();

  /**
   * Animate elements on scroll using Intersection Observer
   * @param selector CSS selector for elements to animate
   * @param options Animation options
   */
  observeElements(
    selector: string,
    options: {
      threshold?: number;
      rootMargin?: string;
      animationClass?: string;
      once?: boolean;
    } = {}
  ): void {
    if (!this.isBrowser) return;

    const {
      threshold = 0.1,
      rootMargin = '0px 0px -100px 0px',
      animationClass = 'animate-in',
      once = true
    } = options;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(animationClass);
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            entry.target.classList.remove(animationClass);
          }
        });
      },
      { threshold, rootMargin }
    );

    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => observer.observe(el));

    this.observers.set(selector, observer);
  }

  /**
   * Animate with stagger effect (sequential animation)
   */
  observeStagger(
    selector: string,
    options: {
      staggerDelay?: number;
      threshold?: number;
      rootMargin?: string;
    } = {}
  ): void {
    if (!this.isBrowser) return;

    const {
      staggerDelay = 100,
      threshold = 0.1,
      rootMargin = '0px 0px -50px 0px'
    } = options;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('animate-in');
            }, index * staggerDelay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => observer.observe(el));

    this.observers.set(`${selector}-stagger`, observer);
  }

  /**
   * Parallax effect for elements
   */
  observeParallax(
    selector: string,
    speed: number = 0.5
  ): void {
    if (!this.isBrowser) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            const updateParallax = () => {
              const rect = element.getBoundingClientRect();
              const scrolled = window.pageYOffset;
              const rate = scrolled * speed;
              element.style.transform = `translateY(${rate}px)`;
            };

            window.addEventListener('scroll', updateParallax);
            updateParallax();
          }
        });
      },
      { threshold: [0, 1] }
    );

    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => observer.observe(el));

    this.observers.set(`${selector}-parallax`, observer);
  }

  /**
   * Cleanup observers
   */
  disconnect(selector?: string): void {
    if (selector) {
      const observer = this.observers.get(selector);
      if (observer) {
        observer.disconnect();
        this.observers.delete(selector);
      }
    } else {
      this.observers.forEach((observer) => observer.disconnect());
      this.observers.clear();
    }
  }
}

