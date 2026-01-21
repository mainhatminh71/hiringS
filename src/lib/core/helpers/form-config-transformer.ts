import { FormConfig, FormField } from "../models/form-config.model";
import { FIELD_REGISTRY } from "../configs/field-registry";
import { CustomerConfig } from "../models/customer-config.model";
import { socialButton } from "./form-helpers";

export function transformToFormConfig(customerConfig: CustomerConfig,
    formType: 'signIn' | 'signUp',
    options: {
        title: string;
        subtitle: string;
        submitLabel: string;
        maxWidth?: 'max-w-md' | 'max-w-lg';
    } 
): FormConfig {
    const authConfig = customerConfig[formType];

    const fields = authConfig.fields
        .map(field => {
            const fieldGenerator = FIELD_REGISTRY[field];
            if (!fieldGenerator) {
                console.warn(`⚠️ Field "${field}" not found in FIELD_REGISTRY`);
                return null;
            }
            return fieldGenerator();
        })
        .filter((field): field is FormField => field !== null);

    const socialButtons = authConfig.socialButtons.map(provider => 
        socialButton(provider as any)
    );

    const formConfig: FormConfig = {
        id: `${customerConfig.id}-${formType}`,
        title: options.title,
        subtitle: options.subtitle,
        maxWidth: options.maxWidth || 'max-w-md',
        fields,
        socialButtons: socialButtons,
        submitLabel: options.submitLabel,
    }
    if (formType === 'signUp') {
        formConfig.passwordMatch = customerConfig.signUp.passwordMatch;
        formConfig.gridLayout = customerConfig.signUp.gridLayout;
    }
    return formConfig;
}