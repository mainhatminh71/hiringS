import {Injectable} from '@angular/core';
import { IRepository } from './repository.interface';
import { UIBlock } from '../models/ui-block.model';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, forkJoin } from 'rxjs';
import * as yaml from 'js-yaml';
import { switchMap, catchError } from 'rxjs/operators';
@Injectable({providedIn: 'root'})
export class UIBlockRepository implements IRepository<UIBlock> {
    private readonly basePath = 'assets/configs';
    private readonly localStorageKey = 'ui-block-custom';

    private http = inject(HttpClient);
    private cache: Map<string, UIBlock> = new Map();

    create(block: UIBlock): Observable<UIBlock> {
        if (!block.validate()) {
            throw new Error('Invalid block configuration');
        }
        const customBlocks = this.getCustomBlocks();
        customBlocks.push(block.toJson());
        localStorage.setItem(this.localStorageKey, JSON.stringify(customBlocks));
        this.cache.set(block.id, block);
        return of(block);
    }
    read(id: string): Observable<UIBlock | null> {
        if (this.cache.has(id)) {
            return of(this.cache.get(id)!);
        }
        return this.http.get(`${this.basePath}/${id}.yaml`,
            {responseType: 'text'}
        ).pipe(
            map(response => {
                const data = yaml.load(response) as any;
                if (!data || !data.id) {
                    console.warn(`Invalid YAML data for block: ${id}`);
                    return null;
                }
                const block = new UIBlock(data.id, data.componentType, data.displayName, data.icon, data.category, data.description);
                if (data.defaultConfig) {
                    block.defaultConfig = data.defaultConfig;
                }
                if (data.configurableProps) {
                    block.configurableProps = data.configurableProps;
                }
                this.cache.set(id, block);
                return block;
            }),
            catchError(error => {
                // Handle 404 or other HTTP errors
                console.warn(`Failed to load block ${id}:`, error);
                // Try custom blocks
                const customBlocks = this.getCustomBlocks();
                const customBlock = customBlocks.find((b: any) => b.id === id);
                if (customBlock) {
                    try {
                        const block = new UIBlock(
                            customBlock.id, 
                            customBlock.componentType, 
                            customBlock.displayName, 
                            customBlock.icon, 
                            customBlock.category, 
                            customBlock.description
                        );
                        if (customBlock.defaultConfig) {
                            block.defaultConfig = customBlock.defaultConfig;
                        }
                        if (customBlock.configurableProps) {
                            block.configurableProps = customBlock.configurableProps;
                        }
                        this.cache.set(id, block);
                        return of(block);
                    } catch (err) {
                        console.error(`Error creating block from custom data for ${id}:`, err);
                        return of(null);
                    }
                }
                return of(null);
            })
        )
    }
    readAll(): Observable<UIBlock[]> {
        return this.http.get(`${this.basePath}/index.yaml`,
            {responseType: 'text'}
        ).pipe(
            map(response => {
                const index = yaml.load(response) as any;
                const blockFiles = index.blocks.map((b: any) => b.file.replace('.yaml', ''));
                return blockFiles;
            }),
            switchMap(blockFiles => {
                const requests: Observable<UIBlock | null>[] = blockFiles.map((file: string) => 
                    this.read(file).pipe(
                        catchError(() => {
                            console.warn(`Failed to load block: ${file}`);
                            return of(null);
                        })
                    )
                );
                return forkJoin(requests);
            }),
            map((blocks: (UIBlock | null)[]) => {
                // Filter out null values
                const validBlocks = blocks.filter((b: UIBlock | null): b is UIBlock => b !== null);
                
                // Merge with custom blocks
                const customBlocks = this.getCustomBlocks().map((data: any) => {
                    try {
                        const block = new UIBlock(
                            data.id, 
                            data.componentType, 
                            data.displayName, 
                            data.icon, 
                            data.category, 
                            data.description
                        );
                        if (data.defaultConfig) {
                            block.defaultConfig = data.defaultConfig;
                        }
                        if (data.configurableProps) {
                            block.configurableProps = data.configurableProps;
                        }
                        return block;
                    } catch (error) {
                        console.warn('Invalid custom block:', data, error);
                        return null;
                    }
                }).filter((b): b is UIBlock => b !== null);
                
                return [...validBlocks, ...customBlocks];
            })
        )
    }

    update(id: string, data: Partial<UIBlock>) : Observable<UIBlock> {
        return this.read(id).pipe(
            map(block => {
                if (!block) throw new Error('Block not found');
                block.update(data);
                if (!block.validate()) throw new Error('Invalid block configuration');
                const customBlocks = this.getCustomBlocks();
                const index = customBlocks.findIndex((b: any) => b.id === id);
                if (index !== -1) {
                    customBlocks[index] = block.toJson();
                    localStorage.setItem(this.localStorageKey, JSON.stringify(customBlocks));
                }
                this.cache.set(id, block);
                return block;
            })
        )
    }

    delete(id: string): Observable<boolean> {
        return this.read(id).pipe(
            map(block => {
                if (!block) return false;
                const customBlocks = this.getCustomBlocks();
                const index = customBlocks.findIndex((b: any) => b.id === id);
                localStorage.setItem(this.localStorageKey, JSON.stringify(customBlocks.filter((_, i) => i !== index)));
                this.cache.delete(id);
                return true;
            })
        )
    }

    findBy(predicate: (block: UIBlock) => boolean): Observable<UIBlock[]> {
        return this.readAll().pipe(
            map(blocks => blocks.filter(predicate))
        )
    }
    findByCategory(category: string): Observable<UIBlock[]> {
        return this.findBy(block => block.category === category);
    }
    findByComponentType(componentType: string): Observable<UIBlock[]> {
        return this.findBy(block => block.componentType === componentType);
    }
    clearCache(): void {
        this.cache.clear();
    }

    private getCustomBlocks(): any[] {
        const stored = localStorage.getItem(this.localStorageKey);
        return stored ? JSON.parse(stored) : [];
    }
}