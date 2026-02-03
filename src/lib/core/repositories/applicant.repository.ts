import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Applicant} from '../models/applicant.model';

@Injectable({providedIn: 'root'})
export class ApplicantRepository {
    private http = inject(HttpClient);
    private baseUrl = '/api/applicants';

    createApplicant(applicant: Partial<Applicant>): Observable<Applicant> {
        return this.http.post<Applicant>(this.baseUrl, applicant);
    }
    getApplicant(id: string): Observable<Applicant | null> {
        return this.http.get<Applicant | null>(`${this.baseUrl}/${id}`);
    }
    getAllApplicants(): Observable<Applicant[]> {
        return this.http.get<Applicant[]>(this.baseUrl);
    }
    updateApplicant(id: string, data: Partial<Applicant>): Observable<Applicant> {
        return this.http.put<Applicant>(`${this.baseUrl}/${id}`, data);
    }
}