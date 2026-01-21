export interface InputConfig {
    type: string,
    label: string,
    placeholder: string,
    id: string,
    value: any,
    required: boolean,
    disabled: boolean,
    size: 'large' | 'default' | 'small',
}