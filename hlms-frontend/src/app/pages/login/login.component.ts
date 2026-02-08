import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-page">
      <div class="login-card">
        <!-- Logo -->
        <div class="logo-section">
          <div class="logo-icon">H</div>
          <h1>HLMS</h1>
          <p>Housing Loan Management System</p>
        </div>

        <!-- Error Message -->
        @if (error()) {
          <div class="error-alert">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{{ error() }}</span>
          </div>
        }

        <!-- Login Form -->
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="username">Username</label>
            <input
              type="text"
              id="username"
              formControlName="username"
              placeholder="Enter your username"
              autocomplete="username"
              [class.error]="loginForm.get('username')?.invalid && loginForm.get('username')?.touched"
            >
            @if (loginForm.get('username')?.hasError('required') && loginForm.get('username')?.touched) {
              <span class="field-error">Username is required</span>
            }
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <div class="password-input">
              <input
                [type]="hidePassword() ? 'password' : 'text'"
                id="password"
                formControlName="password"
                placeholder="Enter your password"
                autocomplete="current-password"
                [class.error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
              >
              <button type="button" class="toggle-btn" (click)="hidePassword.set(!hidePassword())">
                @if (hidePassword()) {
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                }
              </button>
            </div>
            @if (loginForm.get('password')?.hasError('required') && loginForm.get('password')?.touched) {
              <span class="field-error">Password is required</span>
            }
          </div>

          <button type="submit" class="submit-btn" [disabled]="loading() || loginForm.invalid">
            @if (loading()) {
              <div class="spinner"></div>
              <span>Signing in...</span>
            } @else {
              <span>Sign In</span>
            }
          </button>
        </form>

        <!-- Demo Credentials -->
        <div class="demo-info">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <span>Demo: <strong>admin</strong> / <strong>admin123</strong></span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1976d2 0%, #1565c0 50%, #0d47a1 100%);
      padding: 20px;
    }

    .login-card {
      background: #ffffff;
      border-radius: 16px;
      padding: 40px;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }

    .logo-section {
      text-align: center;
      margin-bottom: 32px;
    }

    .logo-icon {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, #1976d2, #1565c0);
      border-radius: 16px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 16px;
      box-shadow: 0 4px 14px rgba(25, 118, 210, 0.4);
    }

    .logo-section h1 {
      font-size: 24px;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 4px 0;
    }

    .logo-section p {
      font-size: 14px;
      color: #6b7280;
      margin: 0;
    }

    .error-alert {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 8px;
      margin-bottom: 24px;
      color: #dc2626;
      font-size: 14px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: #374151;
      margin-bottom: 6px;
    }

    .form-group input {
      width: 100%;
      height: 48px;
      padding: 0 16px;
      font-size: 15px;
      color: #1f2937;
      background: #ffffff;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      outline: none;
      transition: all 0.15s ease;
    }

    .form-group input::placeholder {
      color: #9ca3af;
    }

    .form-group input:focus {
      border-color: #1976d2;
      box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
    }

    .form-group input.error {
      border-color: #dc2626;
    }

    .form-group input.error:focus {
      box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
    }

    .password-input {
      position: relative;
    }

    .password-input input {
      padding-right: 48px;
    }

    .toggle-btn {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      border-radius: 6px;
      color: #6b7280;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .toggle-btn:hover {
      background: #f3f4f6;
      color: #374151;
    }

    .field-error {
      display: block;
      font-size: 12px;
      color: #dc2626;
      margin-top: 6px;
    }

    .submit-btn {
      width: 100%;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: linear-gradient(135deg, #1976d2, #1565c0);
      color: white;
      font-size: 15px;
      font-weight: 500;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.15s ease;
      box-shadow: 0 2px 8px rgba(25, 118, 210, 0.3);
    }

    .submit-btn:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(25, 118, 210, 0.4);
    }

    .submit-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .demo-info {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 24px;
      padding: 12px;
      background: #eff6ff;
      border-radius: 8px;
      font-size: 14px;
      color: #1e40af;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);
  hidePassword = signal(true);

  private returnUrl: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';

    if (this.authService.isAuthenticated) {
      this.router.navigate([this.returnUrl]);
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate([this.returnUrl]);
        } else {
          this.error.set('Login failed. Please try again.');
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Invalid username or password');
        this.loading.set(false);
      }
    });
  }
}
