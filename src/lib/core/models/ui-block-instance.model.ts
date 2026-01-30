// src/lib/core/models/ui-block-instance.model.ts

import { ComponentType } from './ui-block.types';


export interface UIBlockInstance {
  id: string;
  blockId: string; // Reference to UIBlock.id
  componentType: ComponentType;
  config: Record<string, any>; // Current configuration (merged from defaultConfig)
  createdAt: Date;

}