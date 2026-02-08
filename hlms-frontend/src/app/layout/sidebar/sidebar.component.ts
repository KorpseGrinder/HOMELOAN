import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  exact?: boolean;
  section?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule, MatTooltipModule, MatRippleModule],
  template: `
    <aside class="sidebar" [class.collapsed]="collapsed">
      <!-- Logo -->
      <div class="sidebar-header">
        <div class="logo">
          <div class="logo-icon">H</div>
          @if (!collapsed) {
            <span class="logo-text">HLMS</span>
          }
        </div>
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        @for (item of navItems; track item.route) {
          @if (item.section && !collapsed) {
            <div class="nav-section">{{ item.section }}</div>
          }
          <a
            [routerLink]="item.route"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: item.exact ?? false }"
            class="nav-item"
            [matTooltip]="collapsed ? item.label : ''"
            matTooltipPosition="right"
            matRipple
          >
            <mat-icon>{{ item.icon }}</mat-icon>
            @if (!collapsed) {
              <span class="nav-label">{{ item.label }}</span>
            }
          </a>
        }
      </nav>

      <!-- Footer -->
      <div class="sidebar-footer">
        <button class="collapse-btn" (click)="toggleCollapse.emit()" matRipple>
          <mat-icon>{{ collapsed ? 'chevron_right' : 'chevron_left' }}</mat-icon>
          @if (!collapsed) {
            <span>Collapse</span>
          }
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      height: 100%;
      width: 256px;
      background: #ffffff;
      border-right: 1px solid #e5e7eb;
      display: flex;
      flex-direction: column;
      transition: width 0.2s ease;
    }

    .sidebar.collapsed {
      width: 72px;
    }

    .sidebar-header {
      height: 64px;
      padding: 0 16px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #e5e7eb;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #1976d2, #1565c0);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      font-size: 18px;
      flex-shrink: 0;
    }

    .logo-text {
      font-size: 18px;
      font-weight: 700;
      color: #1a1a2e;
      white-space: nowrap;
    }

    .sidebar-nav {
      flex: 1;
      padding: 16px 12px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .nav-section {
      font-size: 11px;
      font-weight: 600;
      color: #9ca3af;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 16px 12px 8px 12px;
      margin-top: 8px;
    }

    .nav-section:first-child {
      margin-top: 0;
      padding-top: 0;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border-radius: 8px;
      color: #4b5563;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.15s ease;
      cursor: pointer;
    }

    .nav-item:hover {
      background: #f3f4f6;
      color: #1f2937;
    }

    .nav-item.active {
      background: #eff6ff;
      color: #1976d2;
    }

    .nav-item.active mat-icon {
      color: #1976d2;
    }

    .nav-item mat-icon {
      font-size: 22px;
      width: 22px;
      height: 22px;
      color: #6b7280;
      flex-shrink: 0;
    }

    .nav-label {
      white-space: nowrap;
      overflow: hidden;
    }

    .sidebar.collapsed .nav-item {
      justify-content: center;
      padding: 12px;
    }

    .sidebar-footer {
      padding: 12px;
      border-top: 1px solid #e5e7eb;
    }

    .collapse-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px;
      border: none;
      background: transparent;
      border-radius: 8px;
      color: #6b7280;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .collapse-btn:hover {
      background: #f3f4f6;
      color: #1f2937;
    }

    .collapse-btn mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .sidebar.collapsed .collapse-btn span {
      display: none;
    }
  `]
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Output() toggleCollapse = new EventEmitter<void>();

  navItems: NavItem[] = [
    // Main
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard', exact: true },
    { label: 'Workflow', icon: 'timeline', route: '/workflow' },
    { label: 'Customers', icon: 'people', route: '/customers' },
    // Origination
    { label: 'Applications', icon: 'description', route: '/applications', exact: true, section: 'Origination' },
    { label: 'New Application', icon: 'add_circle_outline', route: '/applications/new' },
    { label: 'KYC Verification', icon: 'verified_user', route: '/kyc' },
    { label: 'Documents', icon: 'folder_open', route: '/documents' },
    // Credit & Approval
    { label: 'Underwriting', icon: 'fact_check', route: '/underwriting', section: 'Credit' },
    { label: 'Sanction', icon: 'gavel', route: '/sanction' },
    { label: 'Disbursement', icon: 'payments', route: '/disbursement' },
    // Servicing
    { label: 'Loan Servicing', icon: 'account_balance', route: '/servicing', section: 'Servicing' },
    { label: 'Collections', icon: 'phone_callback', route: '/collections' },
    { label: 'NPA Management', icon: 'warning', route: '/npa' },
    // Analytics & Admin
    { label: 'Reports', icon: 'assessment', route: '/reports', section: 'Analytics' },
    { label: 'User Management', icon: 'admin_panel_settings', route: '/admin/users', section: 'Admin' },
    { label: 'Settings', icon: 'settings', route: '/admin/settings' },
  ];
}
