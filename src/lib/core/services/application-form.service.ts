import {inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormConfigRepository } from '../repositories/form-config.repository';
import {ApplicationForm} from '../models/application-form.model';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class ApplicationFormService {
    private repository = inject(FormConfigRepository);

    createForm(data: Partial<ApplicationForm>): Observable<ApplicationForm> {
        if (!data.id || !data.name || !data.themeKey) {
            throw new Error('Missing required fields: id, name, and themeKey are required');
        }
        return this.repository.create(data as ApplicationForm);
    }
    getForm(id: string): Observable<ApplicationForm | null> {
        return this.repository.read(id);
    }
    getAllForms(): Observable<ApplicationForm[]> {
        return this.repository.readAll();
    }
    updateForm(id: string, data: Partial<ApplicationForm>): Observable<ApplicationForm> {
        return this.repository.update(id, data);
    }
    deleteForm(id: string): Observable<boolean> {
        return this.repository.delete(id);
    }
    findBy(predicate: (form: ApplicationForm) => boolean): Observable<ApplicationForm[]> {
        return this.repository.findBy(predicate);
    }
}