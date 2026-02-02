export type ComponentType = 'input-text' | 'input-email' | 'input-password' | 'input-number' | 'select' | 'checkbox' | 'radio' | 'textarea' | 'datepicker' | 'file-upload' | 'button' | 'divider';
export type CategoryRule = 'basic' | 'advanced' | 'layout';
export type PropType = 'string' | 'number' | 'boolean' | 'array' | 'object' | 'array-of-objects';
export interface Option {
    label: string;
    value: any;
}
export interface PropertySchema {
    name: string;
    type: PropType;
    required?: boolean;
}
export interface ConfigurableProp {
    name: string;
    type: PropType;
    label: string;
    default?: any;
    required?: boolean;
    options?: Option[];
    schema?: PropertySchema[];
    description?: string;
    min?: number;
    max?: number;
    pattern?: string;
}