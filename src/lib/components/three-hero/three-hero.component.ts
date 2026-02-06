import { Component, OnInit, OnDestroy, PLATFORM_ID, inject, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';

@Component({
  selector: 'app-three-hero',
  standalone: true,
  template: '<div #container class="three-hero-container"></div>',
  styles: [`
    .three-hero-container {
      width: 100%;
      height: 100%;
      position: absolute;
      inset: 0;
      z-index: 0;
      max-width: 100%;
      overflow: hidden;
      box-sizing: border-box;
    }
    
    .three-hero-container canvas {
      width: 100% !important;
      height: 100% !important;
      max-width: 100% !important;
      display: block;
    }
  `]
})
export class ThreeHeroComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('container', { static: true }) containerRef!: ElementRef<HTMLDivElement>;
  
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private animationId: number | null = null;
  private particles!: THREE.Points;

  ngOnInit(): void {
    if (!this.isBrowser) return;
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    
    setTimeout(() => {
      this.initThree();
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  }

  private initThree(): void {
    const container = this.containerRef.nativeElement;
    if (!container) return;

    // Scene với animated gradient background đẹp hơn
    this.scene = new THREE.Scene();
    
    // Tạo animated gradient background với hiệu ứng đẹp
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;
    
    let animationTime = 0;
    
    // Function để vẽ animated gradient với hiệu ứng xoay và pulse
    const drawGradient = (time: number) => {
      ctx.clearRect(0, 0, 1024, 1024);
      
      // Tạo multiple gradients để có hiệu ứng phức tạp hơn
      const centerX = 512 + Math.sin(time * 0.0005) * 100;
      const centerY = 512 + Math.cos(time * 0.0005) * 100;
      const radius = 600 + Math.sin(time * 0.001) * 200;
      
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      
      // 7 màu cầu vồng với animation
      const hueOffset = (time * 0.0001) % 1;
      const rainbowStops = [
        { pos: 0, hue: (hueOffset + 0) % 1 },
        { pos: 0.14, hue: (hueOffset + 0.14) % 1 },
        { pos: 0.28, hue: (hueOffset + 0.28) % 1 },
        { pos: 0.42, hue: (hueOffset + 0.42) % 1 },
        { pos: 0.57, hue: (hueOffset + 0.57) % 1 },
        { pos: 0.71, hue: (hueOffset + 0.71) % 1 },
        { pos: 0.85, hue: (hueOffset + 0.85) % 1 },
        { pos: 1, hue: hueOffset % 1 }
      ];
      
      rainbowStops.forEach(stop => {
        const hsl = `hsla(${stop.hue * 360}, 100%, 60%, 0.5)`;
        gradient.addColorStop(stop.pos, hsl);
      });
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1024, 1024);
      
      // Thêm layer thứ 2 với opacity thấp hơn để tạo depth
      const gradient2 = ctx.createRadialGradient(
        1024 - centerX, 
        1024 - centerY, 
        0, 
        1024 - centerX, 
        1024 - centerY, 
        radius * 0.8
      );
      
      rainbowStops.forEach(stop => {
        const hsl = `hsla(${(stop.hue * 360 + 180) % 360}, 100%, 50%, 0.3)`;
        gradient2.addColorStop(stop.pos, hsl);
      });
      
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, 1024, 1024);
    };
    
    drawGradient(0);
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
    
    this.scene.background = texture;
    this.scene.fog = new THREE.FogExp2(0xffffff, 0.00015);
    
    // Animate background
    const animateBackground = () => {
      animationTime += 16;
      drawGradient(animationTime);
      texture.needsUpdate = true;
    };
    
    // Store animation function
    (this as any).animateBackground = animateBackground;

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.z = 500;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    const width = container.clientWidth;
    const height = container.clientHeight;
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.maxWidth = '100%';
    this.renderer.domElement.style.display = 'block';
    container.appendChild(this.renderer.domElement);

    // Particles với 7 màu cầu vồng - sặc sỡ hơn
    const particleCount = 5000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // 7 màu cầu vồng rực rỡ: Đỏ, Cam, Vàng, Xanh lá, Xanh dương, Chàm, Tím
    const rainbowColors = [
      new THREE.Color(1, 0, 0),        // Đỏ rực
      new THREE.Color(1, 0.5, 0),      // Cam rực
      new THREE.Color(1, 1, 0),        // Vàng rực
      new THREE.Color(0, 1, 0),        // Xanh lá rực
      new THREE.Color(0, 0.5, 1),      // Xanh dương rực
      new THREE.Color(0.3, 0, 0.8),    // Chàm rực
      new THREE.Color(0.6, 0, 0.8)     // Tím rực
    ];

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Positions - spread rộng hơn
      positions[i3] = (Math.random() - 0.5) * 4000;
      positions[i3 + 1] = (Math.random() - 0.5) * 4000;
      positions[i3 + 2] = (Math.random() - 0.5) * 4000;

      // Colors - chọn ngẫu nhiên từ 7 màu cầu vồng, màu sắc rực rỡ hơn
      const colorIndex = Math.floor(Math.random() * rainbowColors.length);
      const selectedColor = rainbowColors[colorIndex];
      
      // Giảm variation để màu sắc rực rỡ và rõ ràng hơn
      const variation = 0.1;
      const r = Math.max(0, Math.min(1, selectedColor.r + (Math.random() - 0.5) * variation));
      const g = Math.max(0, Math.min(1, selectedColor.g + (Math.random() - 0.5) * variation));
      const b = Math.max(0, Math.min(1, selectedColor.b + (Math.random() - 0.5) * variation));
      
      colors[i3] = r;
      colors[i3 + 1] = g;
      colors[i3 + 2] = b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 5,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);

    // Handle resize
    window.addEventListener('resize', () => this.onWindowResize());

    // Start animation
    this.animate();
  }

  private onWindowResize(): void {
    const container = this.containerRef.nativeElement;
    if (!container || !this.camera || !this.renderer) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.maxWidth = '100%';
  }

  private animate = (): void => {
    this.animationId = requestAnimationFrame(this.animate);

    // Animate background gradient
    if ((this as any).animateBackground) {
      (this as any).animateBackground();
    }

    if (this.particles) {
      this.particles.rotation.x += 0.0005;
      this.particles.rotation.y += 0.001;
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  };
}

