import { InputConfig } from "./input-config.model";
import { ButtonConfig } from "./button-config.model";
export interface FormField {
    id: string;
    type: 'input' | 'checkbox' | 'select' | 'radio' | 'divider';
    config?: InputConfig;
    label?: string;
    text?: string;
    required?: boolean;
    checked?: boolean;
    value?: any;
    multiple?: boolean;
    grid?: { cols?: number; span?: number; class?: string };
    options?: { label: string; value: any }[];
    class?: string;
}

export interface FormConfig {
    id: string;
    title: string;
    subtitle: string;
    maxWidth: 'max-w-md' | 'max-w-lg';
    fields: FormField[];
    socialButtons: ButtonConfig[];
    submitLabel: string;
    passwordMatch?: boolean;
    gridLayout?: boolean;
}