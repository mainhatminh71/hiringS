import { FormField } from "../models/form-config.model";
import { input,  } from "../helpers/form-helpers";

export const FIELD_REGISTRY: Record<string, () => FormField> = {
    'email': () => input('email', 'email', 'Email', 'Enter your email', {
    required: true,
    size: 'large'
  }),

  'password': () => input('password', 'password', 'Password', 'Enter your password', {
    required: true,
    size: 'large'
  }),
  'employeeId': () => input('employeeId', 'text', 'Employee ID', 'Enter your employee ID', {
    required: true,
    size: 'large'
  }),
  'department': () => input('department', 'text', 'Department', 'Enter your department', {
    required: true,
    size: 'large'
  }),
  'manager': () => input('manager', 'text', 'Manager', 'Enter your manager name', {
    required: true,
    size: 'large'
  }),
  'managerId': () => input('managerId', 'text', 'Manager ID', 'Enter your manager ID', {
    required: true,
    size: 'large'
  }),
  'fullName': () => input('fullName', 'text', 'Full Name', 'Enter your full name', {
    required: true,
    size: 'large'
  }),
  'company': () => input('company', 'text', 'Company', 'Enter your company name', {
    required: true,
    size: 'large'
  }),

}
