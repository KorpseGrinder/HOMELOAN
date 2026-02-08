import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

interface ApprovalItem {
  id: number;
  applicationNumber: string;
  customerName: string;
  loanAmount: number;
  loanType: string;
  stage: string;
  creditScore: number;
  foir: number;
  recommendation: 'APPROVE' | 'CONDITIONAL' | 'REJECT';
  assessedBy: string;
  assessedDate: string;
  pendingSince: string;
  priority: 'HIGH' | 'NORMAL';
}

@Component({
  selector: 'app-approval-queue',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="page-container">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <h1>Approval Queue</h1>
          <p>Review and approve loan applications pending sanction</p>
        </div>
        <div class="header-stats">
          <div class="stat-item">
            <span class="stat-value">{{ pendingCount() }}</span>
            <span class="stat-label">Pending Approval</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">₹{{ formatCrores(totalAmount()) }} Cr</span>
            <span class="stat-label">Total Value</span>
          </div>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="filter-tabs">
        <button
          class="filter-tab"
          [class.active]="activeFilter() === 'all'"
          (click)="activeFilter.set('all')"
        >
          All ({{ applications().length }})
        </button>
        <button
          class="filter-tab"
          [class.active]="activeFilter() === 'approve'"
          (click)="activeFilter.set('approve')"
        >
          <span class="dot green"></span>
          Recommended ({{ getCountByRecommendation('APPROVE') }})
        </button>
        <button
          class="filter-tab"
          [class.active]="activeFilter() === 'conditional'"
          (click)="activeFilter.set('conditional')"
        >
          <span class="dot amber"></span>
          Conditional ({{ getCountByRecommendation('CONDITIONAL') }})
        </button>
        <button
          class="filter-tab"
          [class.active]="activeFilter() === 'reject'"
          (click)="activeFilter.set('reject')"
        >
          <span class="dot red"></span>
          For Rejection ({{ getCountByRecommendation('REJECT') }})
        </button>
      </div>

      <!-- Applications List -->
      <div class="applications-list">
        @if (loading()) {
          <div class="loading-state">
            <div class="spinner"></div>
          </div>
        } @else {
          @for (app of filteredApplications(); track app.id) {
            <div class="application-card" [class.high-priority]="app.priority === 'HIGH'">
              @if (app.priority === 'HIGH') {
                <div class="priority-badge">HIGH PRIORITY</div>
              }
              <div class="card-header">
                <div class="app-info">
                  <h3>{{ app.applicationNumber }}</h3>
                  <span class="app-type">{{ app.loanType }}</span>
                </div>
                <div class="recommendation-badge" [attr.data-type]="app.recommendation.toLowerCase()">
                  @if (app.recommendation === 'APPROVE') {
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Recommended for Approval
                  } @else if (app.recommendation === 'CONDITIONAL') {
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    Conditional Approval
                  } @else {
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                    Recommended for Rejection
                  }
                </div>
              </div>

              <div class="card-body">
                <div class="customer-section">
                  <div class="avatar">{{ getInitials(app.customerName) }}</div>
                  <div class="customer-info">
                    <span class="customer-name">{{ app.customerName }}</span>
                    <span class="assessed-by">Assessed by {{ app.assessedBy }} on {{ formatDate(app.assessedDate) }}</span>
                  </div>
                </div>

                <div class="metrics-grid">
                  <div class="metric">
                    <span class="metric-label">Loan Amount</span>
                    <span class="metric-value">₹{{ formatCurrency(app.loanAmount) }}</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Credit Score</span>
                    <span class="metric-value" [attr.data-level]="getScoreLevel(app.creditScore)">{{ app.creditScore }}</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">FOIR</span>
                    <span class="metric-value" [class.warning]="app.foir > 50">{{ app.foir }}%</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Pending Since</span>
                    <span class="metric-value">{{ formatDate(app.pendingSince) }}</span>
                  </div>
                </div>
              </div>

              <div class="card-footer">
                <a [routerLink]="['/applications', app.id]" class="btn-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  View Details
                </a>
                <div class="action-buttons">
                  <button class="btn-reject">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                    Reject
                  </button>
                  <button class="btn-approve">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Approve
                  </button>
                </div>
              </div>
            </div>
          } @empty {
            <div class="empty-state">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M9 12l2 2 4-4"/>
                <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
              </svg>
              <h3>No Applications Pending</h3>
              <p>All applications have been processed</p>
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 24px;
      max-width: 1200px;
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

    .header-stats {
      display: flex;
      gap: 32px;
    }

    .stat-item {
      text-align: right;
    }

    .stat-value {
      display: block;
      font-size: 24px;
      font-weight: 700;
      color: #1976d2;
    }

    .stat-label {
      font-size: 12px;
      color: #6b7280;
    }

    .filter-tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid #e5e7eb;
    }

    .filter-tab {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      font-size: 14px;
      font-weight: 500;
      color: #6b7280;
      background: transparent;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .filter-tab:hover {
      background: #f9fafb;
      color: #1f2937;
    }

    .filter-tab.active {
      background: #1976d2;
      color: white;
      border-color: #1976d2;
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .dot.green { background: #16a34a; }
    .dot.amber { background: #f59e0b; }
    .dot.red { background: #dc2626; }

    .filter-tab.active .dot {
      background: white;
    }

    .loading-state {
      display: flex;
      justify-content: center;
      padding: 60px 0;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #e5e7eb;
      border-top-color: #1976d2;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .applications-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .application-card {
      background: white;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      overflow: hidden;
      transition: all 0.15s ease;
    }

    .application-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    .application-card.high-priority {
      border-color: #fbbf24;
    }

    .priority-badge {
      background: #fef3c7;
      color: #92400e;
      font-size: 11px;
      font-weight: 600;
      padding: 6px 16px;
      letter-spacing: 0.05em;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 16px 20px;
      border-bottom: 1px solid #f3f4f6;
    }

    .app-info h3 {
      font-size: 16px;
      font-weight: 600;
      color: #1976d2;
      margin: 0;
    }

    .app-type {
      font-size: 13px;
      color: #6b7280;
    }

    .recommendation-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
    }

    .recommendation-badge[data-type="approve"] {
      background: #d1fae5;
      color: #065f46;
    }

    .recommendation-badge[data-type="conditional"] {
      background: #fef3c7;
      color: #92400e;
    }

    .recommendation-badge[data-type="reject"] {
      background: #fee2e2;
      color: #991b1b;
    }

    .card-body {
      padding: 20px;
    }

    .customer-section {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }

    .avatar {
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, #1976d2, #1565c0);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 14px;
      font-weight: 600;
    }

    .customer-info {
      display: flex;
      flex-direction: column;
    }

    .customer-name {
      font-size: 15px;
      font-weight: 600;
      color: #1f2937;
    }

    .assessed-by {
      font-size: 12px;
      color: #9ca3af;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }

    .metric {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .metric-label {
      font-size: 12px;
      color: #6b7280;
    }

    .metric-value {
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
    }

    .metric-value[data-level="excellent"] { color: #16a34a; }
    .metric-value[data-level="good"] { color: #2563eb; }
    .metric-value[data-level="fair"] { color: #d97706; }
    .metric-value[data-level="poor"] { color: #dc2626; }

    .metric-value.warning {
      color: #d97706;
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      background: #f9fafb;
      border-top: 1px solid #e5e7eb;
    }

    .btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      font-size: 13px;
      font-weight: 500;
      color: #4b5563;
      background: white;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      cursor: pointer;
      text-decoration: none;
    }

    .btn-secondary:hover {
      background: #f3f4f6;
    }

    .action-buttons {
      display: flex;
      gap: 10px;
    }

    .btn-approve, .btn-reject {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      font-size: 13px;
      font-weight: 500;
      border-radius: 6px;
      border: none;
      cursor: pointer;
    }

    .btn-approve {
      background: #16a34a;
      color: white;
    }

    .btn-approve:hover {
      background: #15803d;
    }

    .btn-reject {
      background: white;
      color: #dc2626;
      border: 1px solid #dc2626;
    }

    .btn-reject:hover {
      background: #fee2e2;
    }

    .empty-state {
      text-align: center;
      padding: 80px 20px;
      color: #9ca3af;
    }

    .empty-state svg {
      margin-bottom: 16px;
      color: #d1d5db;
    }

    .empty-state h3 {
      font-size: 18px;
      font-weight: 600;
      color: #4b5563;
      margin: 0 0 8px 0;
    }

    .empty-state p {
      margin: 0;
      font-size: 14px;
    }

    @media (max-width: 768px) {
      .metrics-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class ApprovalQueueComponent implements OnInit {
  loading = signal(true);
  applications = signal<ApprovalItem[]>([]);
  activeFilter = signal('all');
  pendingCount = signal(0);
  totalAmount = signal(0);

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    setTimeout(() => {
      const apps: ApprovalItem[] = [
        { id: 1, applicationNumber: 'HLMS-2024-001234', customerName: 'Rajesh Kumar', loanAmount: 5000000, loanType: 'Home Purchase', stage: 'SANCTION', creditScore: 780, foir: 38, recommendation: 'APPROVE', assessedBy: 'Priya Sharma', assessedDate: '2024-01-16', pendingSince: '2024-01-17', priority: 'NORMAL' },
        { id: 2, applicationNumber: 'HLMS-2024-001235', customerName: 'Amit Patel', loanAmount: 7500000, loanType: 'Home Purchase', stage: 'SANCTION', creditScore: 720, foir: 45, recommendation: 'CONDITIONAL', assessedBy: 'Suresh Menon', assessedDate: '2024-01-15', pendingSince: '2024-01-16', priority: 'HIGH' },
        { id: 3, applicationNumber: 'HLMS-2024-001236', customerName: 'Sneha Reddy', loanAmount: 4200000, loanType: 'Balance Transfer', stage: 'SANCTION', creditScore: 650, foir: 52, recommendation: 'CONDITIONAL', assessedBy: 'Priya Sharma', assessedDate: '2024-01-14', pendingSince: '2024-01-15', priority: 'NORMAL' },
        { id: 4, applicationNumber: 'HLMS-2024-001237', customerName: 'Vikram Singh', loanAmount: 3000000, loanType: 'Home Construction', stage: 'SANCTION', creditScore: 580, foir: 62, recommendation: 'REJECT', assessedBy: 'Amit Verma', assessedDate: '2024-01-13', pendingSince: '2024-01-14', priority: 'NORMAL' }
      ];
      this.applications.set(apps);
      this.pendingCount.set(apps.length);
      this.totalAmount.set(apps.reduce((sum, a) => sum + a.loanAmount, 0));
      this.loading.set(false);
    }, 500);
  }

  filteredApplications(): ApprovalItem[] {
    const filter = this.activeFilter();
    if (filter === 'all') return this.applications();
    return this.applications().filter(a => a.recommendation.toLowerCase() === filter);
  }

  getCountByRecommendation(rec: string): number {
    return this.applications().filter(a => a.recommendation === rec).length;
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  getScoreLevel(score: number): string {
    if (score >= 750) return 'excellent';
    if (score >= 700) return 'good';
    if (score >= 650) return 'fair';
    return 'poor';
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('en-IN');
  }

  formatCrores(value: number): string {
    return (value / 10000000).toFixed(2);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  }
}
