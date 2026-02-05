import {Injectable, PLATFORM_ID, inject} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import Lenis from 'lenis';

@Injectable({
    providedIn: 'root'
})
export class LenisService {
    private platformId = inject(PLATFORM_ID);
    private isBrowser = isPlatformBrowser(this.platformId);
    private lenis: Lenis | null = null;
    private rafId: number | null = null;
    init() {
        if (!this.isBrowser || this.lenis) return;
        this.lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
            infinite: false,
          });
      
          const raf = (time: number) => {
            this.lenis?.raf(time);
            this.rafId = requestAnimationFrame(raf);
          };
      
          this.rafId = requestAnimationFrame(raf);
    }
    destroy() {
        if (!this.isBrowser || !this.lenis) return;
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
        }
        this.lenis.destroy();
        this.lenis = null;
    }
    getInstance(): Lenis | null {
        return this.lenis;
    }
}