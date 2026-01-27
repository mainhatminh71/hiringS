export interface FieldTemplate {
    componentType: string;
    displayName: string;
    icon: string;
    category: string;
    defaultConfig: Record<string, any>;
    configurableProps: ConfigurableProp[];
}
export interface ConfigurableProp {
    name: string;
    type: 'string' | 'boolean' | 'number' | 'array-of-objects';
    label: string;
    default: any;
    options?: { label: string; value: any }[]; // Cho select
}
export interface FormField {
    id: string;
    type: string;
    config: Record<string, any>;
}