import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatRippleModule } from '@angular/material/core';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatMenuModule, MatDividerModule, MatRippleModule],
  template: `
    <header class="header">
      <!-- Left side -->
      <div class="header-left">
        <button class="menu-btn" (click)="toggleSidebar.emit()" matRipple>
          <mat-icon>menu</mat-icon>
        </button>
        <div class="header-title">
          <h1>Housing Loan Management System</h1>
        </div>
      </div>

      <!-- Right side -->
      <div class="header-right">
        <!-- Notifications -->
        <button class="icon-btn" matRipple>
          <mat-icon>notifications_none</mat-icon>
          <span class="notification-badge">3</span>
        </button>

        <!-- User Menu -->
        <button class="user-btn" [matMenuTriggerFor]="userMenu" matRipple>
          <div class="user-avatar">
            {{ getUserInitials() }}
          </div>
          <div class="user-info">
            <span class="user-name">{{ authService.currentUser?.fullName || 'Admin User' }}</span>
            <span class="user-role">{{ authService.currentUser?.roles?.[0] || 'Administrator' }}</span>
          </div>
          <mat-icon class="dropdown-icon">expand_more</mat-icon>
        </button>

        <mat-menu #userMenu="matMenu" xPosition="before" class="user-menu">
          <div class="menu-header">
            <div class="menu-avatar">{{ getUserInitials() }}</div>
            <div class="menu-user-info">
              <span class="menu-user-name">{{ authService.currentUser?.fullName || 'Admin User' }}</span>
              <span class="menu-user-email">{{ authService.currentUser?.email || 'admin@hlms.com' }}</span>
            </div>
          </div>
          <mat-divider></mat-divider>
          <button mat-menu-item>
            <mat-icon>person_outline</mat-icon>
            <span>My Profile</span>
          </button>
          <button mat-menu-item>
            <mat-icon>settings</mat-icon>
            <span>Settings</span>
          </button>
          <mat-divider></mat-divider>
          <button mat-menu-item (click)="logout()" class="logout-item">
            <mat-icon>logout</mat-icon>
            <span>Sign Out</span>
          </button>
        </mat-menu>
      </div>
    </header>
  `,
  styles: [`
    .header {
      height: 64px;
      background: #ffffff;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .menu-btn {
      width: 40px;
      height: 40px;
      border: none;
      background: transparent;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #4b5563;
      transition: all 0.15s ease;
    }

    .menu-btn:hover {
      background: #f3f4f6;
      color: #1f2937;
    }

    .header-title h1 {
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }

    @media (max-width: 768px) {
      .header-title {
        display: none;
      }
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .icon-btn {
      width: 40px;
      height: 40px;
      border: none;
      background: transparent;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #4b5563;
      position: relative;
      transition: all 0.15s ease;
    }

    .icon-btn:hover {
      background: #f3f4f6;
      color: #1f2937;
    }

    .notification-badge {
      position: absolute;
      top: 6px;
      right: 6px;
      width: 18px;
      height: 18px;
      background: #ef4444;
      color: white;
      font-size: 11px;
      font-weight: 600;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .user-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px 12px 6px 6px;
      border: none;
      background: transparent;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .user-btn:hover {
      background: #f3f4f6;
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #1976d2, #1565c0);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 14px;
      font-weight: 600;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      text-align: left;
    }

    .user-name {
      font-size: 14px;
      font-weight: 500;
      color: #1f2937;
    }

    .user-role {
      font-size: 12px;
      color: #6b7280;
    }

    @media (max-width: 640px) {
      .user-info {
        display: none;
      }
    }

    .dropdown-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: #6b7280;
    }

    ::ng-deep .user-menu {
      min-width: 240px !important;
    }

    .menu-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
    }

    .menu-avatar {
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, #1976d2, #1565c0);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 16px;
      font-weight: 600;
    }

    .menu-user-info {
      display: flex;
      flex-direction: column;
    }

    .menu-user-name {
      font-size: 14px;
      font-weight: 600;
      color: #1f2937;
    }

    .menu-user-email {
      font-size: 13px;
      color: #6b7280;
    }

    ::ng-deep .logout-item {
      color: #dc2626 !important;
    }

    ::ng-deep .logout-item mat-icon {
      color: #dc2626 !important;
    }
  `]
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(public authService: AuthService) {}

  getUserInitials(): string {
    const name = this.authService.currentUser?.fullName || 'Admin User';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  logout(): void {
    this.authService.logout();
  }
}
