import {Observable} from 'rxjs';
import {BaseEntity} from '../models/base-entity.model';
export interface IRepository<T extends BaseEntity> {
    create(entity: T): Observable<T>;
    read(id: string): Observable<T | null>;
    readAll(): Observable<T[]>;
    update(id: string, data: Partial<T>): Observable<T>;
    delete(id: string): Observable<boolean>;
    findBy(predicate: (entity: T) => boolean): Observable<T[]>;
}