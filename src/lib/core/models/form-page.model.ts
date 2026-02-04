import { UIBlockInstance } from "./ui-block-instance.model";

export interface FormPage {
    id: string;
    name: string;
    instances: UIBlockInstance[];
    order: number;
}