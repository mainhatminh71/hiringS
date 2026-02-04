import {UIBlockInstance} from "./ui-block-instance.model";
import {SurveyThemeKey} from "../helpers/theme-helper";
import { BaseEntity } from "./base-entity.model";
import { FormPage } from "./form-page.model";
export interface ApplicationForm extends BaseEntity{
    id: string;
    name?: string;
    instances: UIBlockInstance[];
    pages?: FormPage[];
    themeKey: SurveyThemeKey;
    themeColor: string;
    department?: string;
    location?: string;
    employmentType?: string;
    postedDate?: string;
   
}