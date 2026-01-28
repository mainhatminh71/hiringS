import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DragDropModule, CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { UIBlockService } from '../../../core/services/ui-block.service';
import { UIBlock } from '../../../core/models/ui-block.model';
import { inject } from '@angular/core';
import { OnInit } from '@angular/core';
@Component({
  selector: 'app-component-palette',
  imports: [CommonModule, DragDropModule],
  templateUrl: './component-palette.component.html',
  styleUrl: './component-palette.component.scss',
  standalone: true
})
export class ComponentPaletteComponent implements OnInit {
  private uiBlockService = inject(UIBlockService);

  blocks: UIBlock[] = [];
  blocksByCategory: {[key: string]: UIBlock[]} = {};

  ngOnInit(): void {
    this.loadBlocks();
  }
  loadBlocks() {
    this.uiBlockService.getAllBlocks().subscribe(blocks => {
      this.blocks = blocks;
      this.groupByCategory();
    });
  }
  groupByCategory() {
    this.blocksByCategory = {
      basic: this.blocks.filter(block => block.category === 'basic'),
      advanced: this.blocks.filter(block => block.category === 'advanced'),
      layout: this.blocks.filter(block => block.category === 'layout'),
    }
  }
}
