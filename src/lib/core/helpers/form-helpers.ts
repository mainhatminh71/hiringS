import { FormField } from '../models/form-config.model';
import { InputConfig } from '../models/input-config.model';


export function input(id: string, type: string, label: string, placeholder: string, opts: Partial<InputConfig>): FormField {
    return {
        id,
        type: 'input',
        config: {
            type,
            label,
            placeholder,
            id,
            value: '',
            required: true,
            disabled: false,
            size: 'large',
            ...opts
          },
          label,
          required: true,
          grid: {cols: 2, span: 1},
          options: []
    }
}
export function checkbox(id: string, label: string, required: false): FormField {
    return {id, type: 'checkbox', label, required};
}
export function divider(label: string): FormField {
    return {id: 'divider', type: 'divider', label};
}