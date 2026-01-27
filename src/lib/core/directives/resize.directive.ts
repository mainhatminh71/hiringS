import { Directive, ElementRef, HostListener, Input, Output, EventEmitter, Renderer2 } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
type ResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

@Directive({
  selector: '[appResize]',
  standalone: true
})
export class ResizeDirective {
  @Input() appResize: boolean = true;
  @Input() minWidth = 100;
  @Input() minHeight = 60;
  @Input() maxWidth?: number;
  @Input() maxHeight?: number;
  @Output() resize = new EventEmitter<{ width: number; height: number; leftOffset?: number }>();

  private isResizing = false;
  private handle: ResizeHandle | null = null;
  private startX = 0;
  private startY = 0;
  private startWidth = 0;
  private startHeight = 0;

  private startLeft = 0;
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if (!this.appResize) return;
    
    const target = event.target as HTMLElement;
    
    // Check if clicked element is a resize handle or is inside one
    const resizeHandle = target.closest('.resize-handle') as HTMLElement;
    if (!resizeHandle) return;
    
    const handle = resizeHandle.dataset['resizeHandle'] as ResizeHandle;
    if (!handle) return;
    
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation(); // ← Thêm dòng này


    const el = this.el.nativeElement;
    this.renderer.setAttribute(el, 'cdkDragDisabled', 'true');
    
    
    this.isResizing = true;
    this.handle = handle;
    this.startX = event.clientX;
    this.startY = event.clientY;

    const rect = this.el.nativeElement.getBoundingClientRect();
    this.startWidth = rect.width;
    this.startHeight = rect.height;
    this.startLeft = rect.left;
    
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);

    this.renderer.addClass(document.body, 'resizing');
    this.renderer.setStyle(document.body, 'user-select', 'none');
  }

  private onMouseMove = (event: MouseEvent) => {
    if (!this.isResizing || !this.handle) return;
    const deltaX = event.clientX - this.startX;
    const deltaY = event.clientY - this.startY;

    let newWidth = this.startWidth;
    let newHeight = this.startHeight;
    let leftOffset = 0;

    // Calculate new dimensions based on handle direction
    switch (this.handle) {
      case 'nw': // Top-left
        newWidth = this.startWidth - deltaX;
        newHeight = this.startHeight - deltaY;
        leftOffset = deltaX; // Di chuyển sang phải khi thu hẹp
        break;
      case 'w': // Left
        newWidth = this.startWidth - deltaX;
        leftOffset = deltaX; // Di chuyển sang phải khi thu hẹp
        break;
      case 'sw': // Bottom-left
        newWidth = this.startWidth - deltaX;
        newHeight = this.startHeight + deltaY;
        leftOffset = deltaX; // Di chuyển sang phải khi thu hẹp
        break;
      case 'ne': // Top-right
        newWidth = this.startWidth + deltaX;
        newHeight = this.startHeight - deltaY;
        break;
      case 'e': // Right
        newWidth = this.startWidth + deltaX;
        break;
      case 'se': // Bottom-right
        newWidth = this.startWidth + deltaX;
        newHeight = this.startHeight + deltaY;
        break;
      case 'n': // Top
        newHeight = this.startHeight - deltaY;
        break;
      case 's': // Bottom
        newHeight = this.startHeight + deltaY;
        break;
    }
    // Apply constraints
    newWidth = Math.max(this.minWidth, newWidth);
    newHeight = Math.max(this.minHeight, newHeight);
    if (this.maxWidth) newWidth = Math.min(this.maxWidth, newWidth);
    if (this.maxHeight) newHeight = Math.min(this.maxHeight, newHeight);

    const canvasBounds = this.getCanvasBounds();
    newWidth = Math.min(newWidth, canvasBounds.width);

    if (leftOffset !== 0) {
      const actualWidthChange = this.startWidth - newWidth;
      leftOffset = actualWidthChange;
      const currentLeft = this.startLeft - canvasBounds.left; 
      const newLeft = currentLeft + leftOffset;
      const maxLeft = canvasBounds.width - newWidth; 
      
      if (newLeft < 0) {
        leftOffset = -currentLeft; // Set về 0
        newWidth = this.startWidth; // Giữ nguyên width
      } else if (newLeft + newWidth > canvasBounds.width) {
        leftOffset = maxLeft - currentLeft; // Set về max
        newWidth = canvasBounds.width - maxLeft; 
      } else {
        // Clamp leftOffset trong phạm vi hợp lệ
        leftOffset = Math.max(0, Math.min(newLeft, maxLeft)) - currentLeft;
      }
    }

    // Apply styles
    this.renderer.setStyle(this.el.nativeElement, 'width', `${newWidth}px`);
    this.renderer.setStyle(this.el.nativeElement, 'height', `${newHeight}px`);
    
    
    if (leftOffset !== 0) {
      this.renderer.setStyle(
        this.el.nativeElement, 
        'transform', 
        `translateX(${leftOffset}px)`
      );
    } else {
      this.renderer.setStyle(this.el.nativeElement, 'transform', 'none');
    }

    // Chỉ emit width và height trong mousemove, không emit leftOffset
    // leftOffset chỉ được emit trong onMouseUp để tránh cộng dồn
    this.resize.emit({ 
      width: newWidth, 
      height: newHeight
    });
  };

  private onMouseUp = () => {
    if (!this.isResizing) { return;}

    const finalLeftOffset = this.getCurrentLeftOffset();

    this.isResizing = false;
    this.handle = null;
    
    // Tính toán left position TRƯỚC khi reset transform
    let absoluteLeft = 0;
    if (finalLeftOffset !== 0) {
      const rect = this.el.nativeElement.getBoundingClientRect();
      // Tính left position tuyệt đối so với grid container
      const gridContainer = this.el.nativeElement.parentElement;
      if (gridContainer) {
        const containerRect = gridContainer.getBoundingClientRect();
        // Vị trí hiện tại (sau transform) trừ đi container left
        absoluteLeft = rect.left - containerRect.left;
      }
    }
    
    // Reset transform sau khi đã tính toán
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'none');

    // Emit event với leftOffset nếu có
    if (finalLeftOffset !== 0) {
      const rect = this.el.nativeElement.getBoundingClientRect();
      this.resize.emit({ 
        width: rect.width, 
        height: rect.height,
        leftOffset: absoluteLeft // Left position tuyệt đối
      });
    }
      // Re-enable drag after resize
      const cdkDragElement = this.el.nativeElement;
      if (cdkDragElement.hasAttribute('cdkDrag')) {
        this.renderer.removeAttribute(cdkDragElement, 'cdkDragDisabled');
      }
      
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
      this.renderer.removeClass(document.body, 'resizing');
      this.renderer.removeStyle(document.body, 'user-select');
    };
    private getCurrentLeftOffset(): number {
      if (!isPlatformBrowser(this.platformId)) return 0;
      const transform = getComputedStyle(this.el.nativeElement).transform;
      if (transform && transform !== 'none') {
        const matrix = new DOMMatrix(transform);
        return matrix.e; // translateX value
      }
      return 0;
    }
    private getCanvasBounds(): { width: number; left: number } {
      if (!isPlatformBrowser(this.platformId)) return {width: 1436, left: 32};
      const gridContainer = this.el.nativeElement.parentElement;
      if (gridContainer) {
        const containerRect = gridContainer.getBoundingClientRect();
        // Canvas có padding 32px mỗi bên
        return {
          width: containerRect.width - 64, // 1500 - 64 = 1436
          left: 32
        };
      }
      return { width: 1436, left: 32 }; // Fallback
    }

   
}