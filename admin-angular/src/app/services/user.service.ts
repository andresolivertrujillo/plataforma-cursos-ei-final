import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AppUser {
  _id?: string;
  name: string;
  email: string;
  role: string;
  password?: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private api = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  list(): Observable<AppUser[]> {
    return this.http.get<AppUser[]>(this.api);
  }
  create(user: AppUser): Observable<AppUser> {
    return this.http.post<AppUser>(this.api, user);
  }
  update(id: string, user: Partial<AppUser>): Observable<AppUser> {
    return this.http.put<AppUser>(`${this.api}/${id}`, user);
  }
  remove(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/${id}`);
  }
}
