import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApplicationForm } from '../models/application-form.model';
import { IRepository } from './repository.interface';

@Injectable({ providedIn: 'root' })
export class FormConfigRepository implements IRepository<ApplicationForm> {
  private http = inject(HttpClient);
  private baseUrl = '/api/forms';

  create(form: ApplicationForm): Observable<ApplicationForm> {
    return this.http.post<ApplicationForm>(this.baseUrl, form);
  }
  read(id: string): Observable<ApplicationForm | null> {
    return this.http.get<ApplicationForm | null>(`${this.baseUrl}/${id}`);
  }
  readAll(): Observable<ApplicationForm[]> {
    return this.http.get<ApplicationForm[]>(this.baseUrl);
  }
  update(id: string, data: Partial<ApplicationForm>): Observable<ApplicationForm> {
    return this.http.put<ApplicationForm>(`${this.baseUrl}/${id}`, data);
  }
  delete(id: string): Observable<boolean> {
    return this.http
      .delete<{ deleted: boolean }>(`${this.baseUrl}/${id}`)
      .pipe(map(r => r.deleted));
  }
  findBy(predicate: (form: ApplicationForm) => boolean): Observable<ApplicationForm[]> {
    return this.readAll().pipe(map(list => list.filter(predicate)));
  }
}