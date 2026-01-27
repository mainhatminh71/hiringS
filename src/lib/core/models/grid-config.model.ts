import { FormField } from "./field-template.model";

export interface GridConfig {
    columns: number;
    gap: number;
    showGridLines: boolean;
    snapToGrid: boolean;
}
export interface GridPosition {
    start: number;
    span: number
}
export interface FormFieldWithGrid extends FormField {
    gridPosition?: GridPosition;
    width?: number;  // Width in pixels
    height?: number; // Height in pixels
    minWidth?: number;
    minHeight?: number;
    left?: number;
}