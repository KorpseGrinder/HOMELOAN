import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface PageRequest {
  page?: number;
  size?: number;
  sort?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get<T>(endpoint: string, params?: Record<string, string | number | boolean>): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          httpParams = httpParams.set(key, String(params[key]));
        }
      });
    }

    return this.http.get<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, { params: httpParams })
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          }
          throw new Error(response.error?.message || 'Request failed');
        }),
        catchError(this.handleError)
      );
  }

  getPage<T>(endpoint: string, pageRequest?: PageRequest, filters?: Record<string, string | number | boolean>): Observable<PagedResponse<T>> {
    let params: Record<string, string | number | boolean> = {};

    if (pageRequest) {
      params = {
        page: pageRequest.page ?? 0,
        size: pageRequest.size ?? 20,
        ...(pageRequest.sort && { sort: pageRequest.sort })
      };
    }

    if (filters) {
      params = { ...params, ...filters };
    }

    return this.get<PagedResponse<T>>(endpoint, params);
  }

  post<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, body)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          }
          throw new Error(response.error?.message || 'Request failed');
        }),
        catchError(this.handleError)
      );
  }

  put<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.put<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, body)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          }
          throw new Error(response.error?.message || 'Request failed');
        }),
        catchError(this.handleError)
      );
  }

  patch<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.patch<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, body)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          }
          throw new Error(response.error?.message || 'Request failed');
        }),
        catchError(this.handleError)
      );
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<ApiResponse<T>>(`${this.baseUrl}${endpoint}`)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          }
          throw new Error(response.error?.message || 'Request failed');
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      if (error.error?.error?.message) {
        errorMessage = error.error.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
    }

    console.error('API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
