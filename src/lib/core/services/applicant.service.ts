import {Injectable, inject} from '@angular/core';
import {ApplicantRepository} from '../repositories/applicant.repository';
import {Observable} from 'rxjs';
import {Applicant} from '../models/applicant.model';

@Injectable({providedIn: 'root'})
export class ApplicantService {
    private repository = inject(ApplicantRepository);
    createApplicant(data: Partial<Applicant>): Observable<Applicant> {
        if (!data.formId || !data.data) {
            throw new Error('Missing required fields: formId and data are required');
        }
        return this.repository.createApplicant(data as Applicant);
    }
    getApplicant(id: string): Observable<Applicant | null> {
        return this.repository.getApplicant(id);
    }
    getAllApplicants(): Observable<Applicant[]> {
        return this.repository.getAllApplicants();
    }
    updateApplicant(id: string, data: Partial<Applicant>): Observable<Applicant> {
        return this.repository.updateApplicant(id, data);
    }

}