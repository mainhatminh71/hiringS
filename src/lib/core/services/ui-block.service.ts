import { inject } from "@angular/core";
import { Observable, forkJoin, map, switchMap } from "rxjs";
import { UIBlockRepository } from "../repositories/ui-block.repository";
import { Injectable } from "@angular/core";
import { UIBlock } from "../models/ui-block.model";

@Injectable({providedIn: 'root'})
export class UIBlockService {
    private repository = inject(UIBlockRepository);
   
    createBlock(data: Partial<UIBlock>): Observable<UIBlock> {
        if (!data.id || !data.componentType || !data.displayName || !data.icon || !data.category) {
            throw new Error('Missing required fields: id, componentType, displayName, icon, and category are required');
        }
        const block = new UIBlock(data.id, data.componentType, data.displayName, data.icon, data.category, data.description);
        return this.repository.create(block);
    }
    getBlock(id: string): Observable<UIBlock | null> {
        return this.repository.read(id);
    }
    getAllBlocks(): Observable<UIBlock[]> {
        return this.repository.readAll();
    }
    updateBlock(id: string, data: Partial<UIBlock>): Observable<UIBlock> {
        return this.repository.update(id, data);
    }
    deleteBlock(id: string): Observable<boolean> {
        return this.repository.delete(id);
    }
    getBlocksByCategory(category: string): Observable<UIBlock[]> {
        return this.repository.findByCategory(category);
    }
    getBlocksByType(componentType: string): Observable<UIBlock[]> {
        return this.repository.findByComponentType(componentType);
    }
    duplicateBlock(id: string): Observable<UIBlock> {
        return this.repository.read(id).pipe(
        switchMap(block => {
            if (!block) throw new Error('Block not found');
            const cloned = block.clone();
            return this.repository.create(cloned);
        })
        )
    }
    clearCache(): void {
        this.repository.clearCache();
    }
}