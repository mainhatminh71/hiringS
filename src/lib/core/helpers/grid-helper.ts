import { Injectable } from "@angular/core";
import {GridConfig, GridPosition} from "../models/grid-config.model";

@Injectable({ providedIn: 'root' })
export class GridHelper {
    getGridItemStyle(position: GridPosition): Record<string, string> {
        return { 'grid-column' : `${position.start} / span ${position.span}`}
    }
    calculateDropPosition( gridConfig: GridConfig): GridPosition {
        return {start: 1, span: gridConfig.columns}
    }
    isValidPosition(position: GridPosition, gridConfig: GridConfig): boolean {
        return position.start >= 1 &&
        position.start <= gridConfig.columns &&
        position.span >= 1 && 
        (position.start + position.span - 1) <= gridConfig.columns;
    }
}