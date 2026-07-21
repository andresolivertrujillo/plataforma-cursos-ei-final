import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Course {
  _id?: string;
  title: string;
  description: string;
  category: string;
  instructor: string;
  credits: number;
  capacity: number;
  price: number;
  active?: boolean;
}

@Injectable({ providedIn: 'root' })
export class CourseService {
  private api = `${environment.apiUrl}/courses`;

  constructor(private http: HttpClient) {}

  list(): Observable<Course[]> {
    return this.http.get<Course[]>(this.api);
  }
  create(course: Course): Observable<Course> {
    return this.http.post<Course>(this.api, course);
  }
  update(id: string, course: Course): Observable<Course> {
    return this.http.put<Course>(`${this.api}/${id}`, course);
  }
  remove(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/${id}`);
  }
}
