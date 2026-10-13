import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  accessToken?: string;
  message?: string;
}

export interface CurrentUser {
  id: number | string;
  name: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/api/auth';
  private readonly tokenKey = 'token';

  login(credentials: LoginData): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          const token = response.token ?? response.accessToken;

          if (token) {
            this.saveToken(token);
          }
        })
      );
  }

  
getCurrentUser(): Observable<CurrentUser> {
  return this.http
    .get<{ user: CurrentUser }>(`${this.apiUrl}/me`)
    .pipe(
      map((response) => response.user)
    );
}


  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  
  onLogout(callback: () => void): void {
    window.addEventListener('storage', (event) => {
      if (event.key === this.tokenKey && event.newValue === null) {
        callback();
      }
    });
  }

  
register(data: { name: string; email: string; password: string }) {
  return this.http.post<{ message: string; user: CurrentUser }>(
    `${this.apiUrl}/register`,
    data
  );
}


isAdmin(): boolean {
  const token = this.getToken();

  if (!token) {
    return false;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role === 'ADMIN';
  } catch {
    return false;
  }
}





}