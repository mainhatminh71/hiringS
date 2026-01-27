import { Injectable, signal } from "@angular/core";
import * as yaml from 'js-yaml';
import { FieldTemplate } from "../models/field-template.model";
import { HttpClient } from "@angular/common/http";
import { map, catchError } from 'rxjs/operators';
import { forkJoin, of } from "rxjs";
import { Observable } from "rxjs";
import { computed } from "@angular/core";
import { FormField } from "../models/field-template.model";

@Injectable({
    providedIn: 'root',
})
export class FieldRegistryService {
    private readonly FIELD_TYPES = [
        'text', 'email', 'textarea', 'select',
        'radio', 'checkbox', 'date', 'file',
    ]
    private readonly SCHEMAS_PATH = 'assets/field-schemas';

    private registry = signal<Map<string, FieldTemplate>>(new Map());
    private loading = signal<boolean>(false);

    toolboxItems = computed(() => {
        const reg = this.registry();
        return Array.from(reg.values()).sort((a, b) => 
          a.category.localeCompare(b.category) || a.displayName.localeCompare(b.displayName)
        );
      });

    constructor(private http: HttpClient) {}
    isLoading(): boolean {
        return this.loading();
    }

    loadRegistry() : Observable<void> {
        this.loading.set(true);

        const loadRequests = this.FIELD_TYPES.map(type => 
            this.http.get(`${this.SCHEMAS_PATH}/${type}.yaml`, {
                responseType: 'text',
            }).pipe(
                map(yamlText => {
                    const template = yaml.load(yamlText) as FieldTemplate;
                    return {type, template};
                }),
                catchError(error => {
                    console.error(`Failed to load schema for ${type}:`, error);
                    return of({type, template: null});
                })
            )
        );
       return forkJoin(loadRequests).pipe(
        map(results => {
            const newRegistry = new Map<string, FieldTemplate>();
            results.forEach(result => {
                if (result && result.template) {
                    newRegistry.set(result.type, result.template);
                }
            });
            this.registry.set(newRegistry);
            this.loading.set(false);
    })
       )
    }
    getTemplate(type: string): FieldTemplate | undefined {
        return this.registry().get(type);
    }
    createNewFieldFromTemplate(type: string) : FormField | null {
        const template = this.getTemplate(type);
        if (!template) return null;
        return {
            id: crypto.randomUUID(),
            type: template.componentType,
            config: {...template.defaultConfig},
        }
    }
}