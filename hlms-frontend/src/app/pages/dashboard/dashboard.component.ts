import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule } from '@angular/material/core';
import { ApiService } from '../../core/services/api.service';

interface DashboardStats {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  disbursedAmount: number;
  totalPortfolio: number;
  npaCount: number;
  npaAmount: number;
  collectionDue: number;
}

interface RecentApplication {
  id: number;
  applicationNumber: string;
  customerName: string;
  loanAmount: number;
  status: string;
  createdDate: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatRippleModule
  ],
  template: `
    <div class="dashboard">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <h1>Dashboard</h1>
          <p>Welcome back! Here's your loan portfolio overview.</p>
        </div>
        <a routerLink="/applications/new" class="primary-btn" matRipple>
          <mat-icon>add</mat-icon>
          <span>New Application</span>
        </a>
      </div>

      @if (loading()) {
        <div class="loading-state">
          <mat-spinner diameter="48"></mat-spinner>
        </div>
      } @else {
        <!-- Stats Grid -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon blue">
                <mat-icon>description</mat-icon>
              </div>
              <span class="stat-trend positive">+12%</span>
            </div>
            <div class="stat-value">{{ stats()?.totalApplications || 0 }}</div>
            <div class="stat-label">Total Applications</div>
          </div>

          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon amber">
                <mat-icon>schedule</mat-icon>
              </div>
            </div>
            <div class="stat-value">{{ stats()?.pendingApplications || 0 }}</div>
            <div class="stat-label">Pending Review</div>
          </div>

          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon green">
                <mat-icon>check_circle</mat-icon>
              </div>
              <span class="stat-trend positive">+8%</span>
            </div>
            <div class="stat-value">{{ stats()?.approvedApplications || 0 }}</div>
            <div class="stat-label">Approved This Month</div>
            <div class="stat-sub">₹{{ formatCurrency(stats()?.disbursedAmount || 0) }} disbursed</div>
          </div>

          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon purple">
                <mat-icon>account_balance</mat-icon>
              </div>
            </div>
            <div class="stat-value">₹{{ formatCurrency(stats()?.totalPortfolio || 0) }}</div>
            <div class="stat-label">Total Portfolio</div>
          </div>

          <div class="stat-card alert">
            <div class="stat-header">
              <div class="stat-icon red">
                <mat-icon>warning</mat-icon>
              </div>
            </div>
            <div class="stat-value">{{ stats()?.npaCount || 0 }}</div>
            <div class="stat-label">NPA Accounts</div>
            <div class="stat-sub">₹{{ formatCurrency(stats()?.npaAmount || 0) }} outstanding</div>
          </div>

          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon orange">
                <mat-icon>payments</mat-icon>
              </div>
            </div>
            <div class="stat-value">₹{{ formatCurrency(stats()?.collectionDue || 0) }}</div>
            <div class="stat-label">Collection Due</div>
            <div class="stat-sub">This month</div>
          </div>
        </div>

        <!-- Recent Applications -->
        <div class="table-section">
          <div class="section-header">
            <h2>Recent Applications</h2>
            <a routerLink="/applications" class="text-btn">
              View All
              <mat-icon>arrow_forward</mat-icon>
            </a>
          </div>
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Application #</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                @for (app of recentApplications(); track app.id) {
                  <tr [routerLink]="['/applications', app.id]" class="clickable-row" matRipple>
                    <td class="app-number">{{ app.applicationNumber }}</td>
                    <td>{{ app.customerName }}</td>
                    <td class="amount">₹{{ formatCurrency(app.loanAmount) }}</td>
                    <td>
                      <span class="status-badge" [attr.data-status]="app.status.toLowerCase()">
                        {{ formatStatus(app.status) }}
                      </span>
                    </td>
                    <td class="date">{{ formatDate(app.createdDate) }}</td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="5" class="empty-state">
                      <mat-icon>inbox</mat-icon>
                      <span>No recent applications</span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
    }

    .header-content h1 {
      font-size: 24px;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 4px 0;
    }

    .header-content p {
      font-size: 14px;
      color: #6b7280;
      margin: 0;
    }

    .primary-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: linear-gradient(135deg, #1976d2, #1565c0);
      color: white;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.15s ease;
      box-shadow: 0 2px 8px rgba(25, 118, 210, 0.3);
    }

    .primary-btn:hover {
      box-shadow: 0 4px 12px rgba(25, 118, 210, 0.4);
      transform: translateY(-1px);
    }

    .primary-btn mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .loading-state {
      display: flex;
      justify-content: center;
      padding: 80px 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      border: 1px solid #e5e7eb;
      transition: all 0.15s ease;
    }

    .stat-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      border-color: #d1d5db;
    }

    .stat-card.alert {
      border-left: 4px solid #ef4444;
    }

    .stat-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }

    .stat-icon {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon mat-icon {
      font-size: 22px;
      width: 22px;
      height: 22px;
    }

    .stat-icon.blue { background: #eff6ff; color: #2563eb; }
    .stat-icon.green { background: #f0fdf4; color: #16a34a; }
    .stat-icon.amber { background: #fffbeb; color: #d97706; }
    .stat-icon.purple { background: #faf5ff; color: #9333ea; }
    .stat-icon.red { background: #fef2f2; color: #dc2626; }
    .stat-icon.orange { background: #fff7ed; color: #ea580c; }

    .stat-trend {
      font-size: 12px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 12px;
    }

    .stat-trend.positive {
      background: #f0fdf4;
      color: #16a34a;
    }

    .stat-value {
      font-size: 28px;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 14px;
      color: #6b7280;
    }

    .stat-sub {
      font-size: 12px;
      color: #9ca3af;
      margin-top: 4px;
    }

    .table-section {
      background: white;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      overflow: hidden;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid #e5e7eb;
    }

    .section-header h2 {
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }

    .text-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      color: #1976d2;
      font-size: 14px;
      font-weight: 500;
      text-decoration: none;
    }

    .text-btn:hover {
      color: #1565c0;
    }

    .text-btn mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .table-wrapper {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      text-align: left;
      padding: 12px 16px;
      font-size: 12px;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      background: #f9fafb;
      border-bottom: 1px solid #e5e7eb;
    }

    td {
      padding: 14px 16px;
      font-size: 14px;
      color: #4b5563;
      border-bottom: 1px solid #f3f4f6;
    }

    .clickable-row {
      cursor: pointer;
      transition: background 0.1s ease;
    }

    .clickable-row:hover {
      background: #f9fafb;
    }

    .app-number {
      font-weight: 600;
      color: #1976d2;
    }

    .amount {
      font-weight: 500;
      color: #1f2937;
    }

    .date {
      color: #6b7280;
    }

    .status-badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-badge[data-status="pending"],
    .status-badge[data-status="under_review"] {
      background: #fef3c7;
      color: #92400e;
    }

    .status-badge[data-status="approved"],
    .status-badge[data-status="disbursed"] {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge[data-status="rejected"] {
      background: #fee2e2;
      color: #991b1b;
    }

    .empty-state {
      text-align: center;
      padding: 40px 16px !important;
      color: #9ca3af;
    }

    .empty-state mat-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
      margin-bottom: 8px;
    }

    .empty-state span {
      display: block;
    }
  `]
})
export class DashboardComponent implements OnInit {
  loading = signal(true);
  stats = signal<DashboardStats | null>(null);
  recentApplications = signal<RecentApplication[]>([]);

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.apiService.get<DashboardStats>('/admin/dashboard').subscribe({
      next: (data) => {
        this.stats.set(data);
        this.loading.set(false);
      },
      error: () => {
        // Mock data for demo
        this.stats.set({
          totalApplications: 1247,
          pendingApplications: 38,
          approvedApplications: 156,
          disbursedAmount: 45600000,
          totalPortfolio: 892000000,
          npaCount: 12,
          npaAmount: 18500000,
          collectionDue: 12800000
        });
        this.recentApplications.set([
          { id: 1, applicationNumber: 'HLMS-2024-001234', customerName: 'Rajesh Kumar', loanAmount: 5000000, status: 'PENDING', createdDate: '2024-01-15T10:30:00' },
          { id: 2, applicationNumber: 'HLMS-2024-001233', customerName: 'Priya Sharma', loanAmount: 3500000, status: 'APPROVED', createdDate: '2024-01-14T14:20:00' },
          { id: 3, applicationNumber: 'HLMS-2024-001232', customerName: 'Amit Patel', loanAmount: 7500000, status: 'DISBURSED', createdDate: '2024-01-13T09:15:00' },
          { id: 4, applicationNumber: 'HLMS-2024-001231', customerName: 'Sneha Reddy', loanAmount: 4200000, status: 'UNDER_REVIEW', createdDate: '2024-01-12T16:45:00' },
          { id: 5, applicationNumber: 'HLMS-2024-001230', customerName: 'Vikram Singh', loanAmount: 6000000, status: 'REJECTED', createdDate: '2024-01-11T11:00:00' }
        ]);
        this.loading.set(false);
      }
    });
  }

  formatCurrency(value: number): string {
    if (value >= 10000000) return (value / 10000000).toFixed(2) + ' Cr';
    if (value >= 100000) return (value / 100000).toFixed(2) + ' L';
    return value.toLocaleString('en-IN');
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  formatStatus(status: string): string {
    return status.replace(/_/g, ' ');
  }
}
