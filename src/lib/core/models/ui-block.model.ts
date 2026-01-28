import { BaseEntity } from "./base-entity.model";
import {ComponentType, CategoryRule, PropType, ConfigurableProp} from './ui-block.types';
import { UIBlockInstance } from "./ui-block-instance.model";

export class UIBlock extends BaseEntity{
    readonly id: string;
    componentType: ComponentType;
    displayName: string;
    icon: string;
    category: CategoryRule;
    defaultConfig: Record<string, any> = {};
    configurableProps: ConfigurableProp[] = [];
    description?: string;

    constructor(id: string, componentType: ComponentType, displayName: string, icon: string, category: CategoryRule, description?: string) {
        super();
        this.id = id;
        this.componentType = componentType;
        this.displayName = displayName;
        this.icon = icon;
        this.category = category;
        this.description = description;
    }
    validate(): boolean {
        if (!this.id || !this.componentType || !this.displayName) {
            return false;
        }
        for (const prop of this.configurableProps) {
            if (prop.required && !prop.default) {
                return false;
            }
        }
        return true;
    }
    clone(): UIBlock {
        const cloned = new UIBlock(
          `${this.id}-copy`,
          this.componentType,
          `${this.displayName} (Copy)`,
          this.icon,
          this.category,
          this.description
        );
        cloned.defaultConfig = { ...this.defaultConfig };
        cloned.configurableProps = JSON.parse(JSON.stringify(this.configurableProps));
        cloned.createdAt = new Date();
        cloned.updatedAt = new Date();
        return cloned;
      }
      toJson(): any {
        return {
            id: this.id,
            componentType: this.componentType,
            displayName: this.displayName,
            icon: this.icon,
            category: this.category,
            defaultConfig: this.defaultConfig,
            configurableProps: this.configurableProps,
            description: this.description,
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString(),
        }
      }
      createInstance(userConfig?: Record<string, any>): UIBlockInstance {
        return {
          id: this.generateInstanceId(),
          blockId: this.id,
          componentType: this.componentType,
          config: this.mergeConfig(userConfig || {}),
          createdAt: new Date()
        };
      }
     
      mergeConfig (userConfig: Record<string, any>): Record<string, any> {
        return { ...this.defaultConfig, ...userConfig };
      }
      
      update(data: Partial<UIBlock>): void {
        if (data.displayName !== undefined) this.displayName = data.displayName;
        if (data.icon !== undefined) this.icon = data.icon;
        if (data.category !== undefined) this.category = data.category;
        if (data.defaultConfig !== undefined) this.defaultConfig = data.defaultConfig;
        if (data.configurableProps !== undefined) this.configurableProps = data.configurableProps;
        if (data.description !== undefined) this.description = data.description;
        this.touch();
      }
      private generateId(): string {
        return `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      }
    
      private generateInstanceId(): string {
        return `${this.id}-instance-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      }
}