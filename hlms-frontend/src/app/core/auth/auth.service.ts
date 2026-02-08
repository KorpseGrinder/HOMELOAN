import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of, BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  roles: string[];
  branch?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
}

export interface JwtPayload {
  sub: string;
  roles: string[];
  exp: number;
  iat: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkTokenExpiration();
  }

  get isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.setToken(response.data.accessToken);
            this.setRefreshToken(response.data.refreshToken);
            this.setUser(response.data.user);
            this.currentUserSubject.next(response.data.user);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem(environment.tokenKey);
    localStorage.removeItem(environment.refreshTokenKey);
    localStorage.removeItem(environment.userKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<LoginResponse | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      return of(null);
    }

    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/refresh`, { refreshToken })
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.setToken(response.data.accessToken);
            this.setRefreshToken(response.data.refreshToken);
          }
        }),
        catchError(() => {
          this.logout();
          return of(null);
        })
      );
  }

  getToken(): string | null {
    return localStorage.getItem(environment.tokenKey);
  }

  private setToken(token: string): void {
    localStorage.setItem(environment.tokenKey, token);
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem(environment.refreshTokenKey);
  }

  private setRefreshToken(token: string): void {
    localStorage.setItem(environment.refreshTokenKey, token);
  }

  private setUser(user: User): void {
    localStorage.setItem(environment.userKey, JSON.stringify(user));
  }

  private getStoredUser(): User | null {
    const userStr = localStorage.getItem(environment.userKey);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  private checkTokenExpiration(): void {
    const token = this.getToken();
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        const expiresIn = decoded.exp * 1000 - Date.now();

        if (expiresIn < 0) {
          this.logout();
        } else if (expiresIn < 5 * 60 * 1000) {
          // Refresh if less than 5 minutes left
          this.refreshToken().subscribe();
        }
      } catch {
        this.logout();
      }
    }
  }

  hasRole(role: string): boolean {
    return this.currentUser?.roles?.includes(role) ?? false;
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.hasRole(role));
  }
}
