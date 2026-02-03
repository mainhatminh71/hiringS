export interface Applicant {
    id?: string;
    formId: string;
    formName?: string;
    data: Record<string, any>;
    createdAt?: string;
    updatedAt?: string;
}