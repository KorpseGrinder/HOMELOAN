import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

interface CreditApplication {
  id: number;
  applicationNumber: string;
  customerName: string;
  loanAmount: number;
  loanType: string;
  monthlyIncome: number;
  existingEMI: number;
  creditScore: number;
  foir: number;
  ltv: number;
  status: string;
  assignedDate: string;
  dueDate: string;
}

@Component({
  selector: 'app-credit-assessment',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="page-container">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <h1>Credit Assessment Queue</h1>
          <p>Review and assess loan applications for credit worthiness</p>
        </div>
        <div class="header-stats">
          <div class="stat-item">
            <span class="stat-value">{{ pendingCount() }}</span>
            <span class="stat-label">Pending</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ overdueCount() }}</span>
            <span class="stat-label text-red">Overdue</span>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters-section">
        <div class="search-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
          <input type="text" [formControl]="searchControl" placeholder="Search by application number or customer...">
        </div>
        <select [formControl]="priorityControl" class="filter-select">
          <option value="">All Priorities</option>
          <option value="high">High Priority</option>
          <option value="normal">Normal</option>
        </select>
      </div>

      <!-- Applications Table -->
      <div class="table-section">
        @if (loading()) {
          <div class="loading-state">
            <div class="spinner"></div>
          </div>
        } @else {
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Application</th>
                  <th>Customer</th>
                  <th>Loan Amount</th>
                  <th>Credit Score</th>
                  <th>FOIR</th>
                  <th>LTV</th>
                  <th>Due Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                @for (app of applications(); track app.id) {
                  <tr [class.overdue]="isOverdue(app.dueDate)">
                    <td>
                      <div class="app-cell">
                        <span class="app-number">{{ app.applicationNumber }}</span>
                        <span class="app-type">{{ app.loanType }}</span>
                      </div>
                    </td>
                    <td>{{ app.customerName }}</td>
                    <td class="amount">₹{{ formatCurrency(app.loanAmount) }}</td>
                    <td>
                      <div class="score-cell" [attr.data-score]="getScoreLevel(app.creditScore)">
                        <span class="score-value">{{ app.creditScore }}</span>
                        <span class="score-label">{{ getScoreLabel(app.creditScore) }}</span>
                      </div>
                    </td>
                    <td>
                      <span class="metric" [class.warning]="app.foir > 50" [class.danger]="app.foir > 60">
                        {{ app.foir }}%
                      </span>
                    </td>
                    <td>
                      <span class="metric" [class.warning]="app.ltv > 75" [class.danger]="app.ltv > 80">
                        {{ app.ltv }}%
                      </span>
                    </td>
                    <td>
                      <span class="due-date" [class.overdue]="isOverdue(app.dueDate)">
                        {{ formatDate(app.dueDate) }}
                      </span>
                    </td>
                    <td>
                      <a [routerLink]="['/underwriting/assess', app.id]" class="btn-assess">
                        Assess
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </a>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="8" class="empty-state">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M9 12l2 2 4-4"/>
                        <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
                      </svg>
                      <p>No applications pending credit assessment</p>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .page-container {
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

    .header-stats {
      display: flex;
      gap: 24px;
    }

    .stat-item {
      text-align: center;
    }

    .stat-value {
      display: block;
      font-size: 28px;
      font-weight: 700;
      color: #1976d2;
    }

    .stat-label {
      font-size: 12px;
      color: #6b7280;
    }

    .stat-label.text-red {
      color: #dc2626;
    }

    .filters-section {
      display: flex;
      gap: 16px;
      margin-bottom: 20px;
    }

    .search-box {
      position: relative;
      flex: 1;
      max-width: 400px;
    }

    .search-box svg {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: #9ca3af;
    }

    .search-box input {
      width: 100%;
      height: 44px;
      padding: 0 16px 0 44px;
      font-size: 14px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      outline: none;
    }

    .search-box input:focus {
      border-color: #1976d2;
      box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
    }

    .filter-select {
      height: 44px;
      padding: 0 36px 0 14px;
      font-size: 14px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      background: white;
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
      background-position: right 10px center;
      background-repeat: no-repeat;
      background-size: 16px;
    }

    .table-section {
      background: white;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      overflow: hidden;
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

    .table-wrapper {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      text-align: left;
      padding: 14px 16px;
      font-size: 12px;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      background: #f9fafb;
      border-bottom: 1px solid #e5e7eb;
    }

    td {
      padding: 14px 16px;
      font-size: 14px;
      color: #4b5563;
      border-bottom: 1px solid #f3f4f6;
    }

    tr:hover td {
      background: #f9fafb;
    }

    tr.overdue td {
      background: #fef2f2;
    }

    .app-cell {
      display: flex;
      flex-direction: column;
    }

    .app-number {
      font-weight: 600;
      color: #1976d2;
    }

    .app-type {
      font-size: 12px;
      color: #9ca3af;
    }

    .amount {
      font-weight: 600;
      color: #1f2937;
    }

    .score-cell {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      padding: 6px 12px;
      border-radius: 6px;
    }

    .score-cell[data-score="excellent"] {
      background: #d1fae5;
    }

    .score-cell[data-score="good"] {
      background: #dbeafe;
    }

    .score-cell[data-score="fair"] {
      background: #fef3c7;
    }

    .score-cell[data-score="poor"] {
      background: #fee2e2;
    }

    .score-value {
      font-size: 16px;
      font-weight: 700;
    }

    .score-cell[data-score="excellent"] .score-value { color: #065f46; }
    .score-cell[data-score="good"] .score-value { color: #1e40af; }
    .score-cell[data-score="fair"] .score-value { color: #92400e; }
    .score-cell[data-score="poor"] .score-value { color: #991b1b; }

    .score-label {
      font-size: 10px;
      text-transform: uppercase;
      font-weight: 500;
    }

    .score-cell[data-score="excellent"] .score-label { color: #059669; }
    .score-cell[data-score="good"] .score-label { color: #2563eb; }
    .score-cell[data-score="fair"] .score-label { color: #d97706; }
    .score-cell[data-score="poor"] .score-label { color: #dc2626; }

    .metric {
      font-weight: 500;
    }

    .metric.warning {
      color: #d97706;
    }

    .metric.danger {
      color: #dc2626;
    }

    .due-date {
      font-size: 13px;
      color: #6b7280;
    }

    .due-date.overdue {
      color: #dc2626;
      font-weight: 600;
    }

    .btn-assess {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      background: #1976d2;
      color: white;
      font-size: 13px;
      font-weight: 500;
      border-radius: 6px;
      text-decoration: none;
      transition: background 0.15s ease;
    }

    .btn-assess:hover {
      background: #1565c0;
    }

    .empty-state {
      text-align: center;
      padding: 60px 16px !important;
      color: #9ca3af;
    }

    .empty-state svg {
      margin-bottom: 12px;
    }

    .empty-state p {
      margin: 0;
      font-size: 14px;
    }
  `]
})
export class CreditAssessmentComponent implements OnInit {
  loading = signal(true);
  applications = signal<CreditApplication[]>([]);
  pendingCount = signal(0);
  overdueCount = signal(0);

  searchControl = new FormControl('');
  priorityControl = new FormControl('');

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    // Mock data
    setTimeout(() => {
      const apps: CreditApplication[] = [
        { id: 1, applicationNumber: 'HLMS-2024-001234', customerName: 'Rajesh Kumar', loanAmount: 5000000, loanType: 'Home Purchase', monthlyIncome: 150000, existingEMI: 15000, creditScore: 780, foir: 38, ltv: 67, status: 'PENDING', assignedDate: '2024-01-15', dueDate: '2024-01-18' },
        { id: 2, applicationNumber: 'HLMS-2024-001235', customerName: 'Priya Sharma', loanAmount: 3500000, loanType: 'Home Construction', monthlyIncome: 120000, existingEMI: 20000, creditScore: 720, foir: 45, ltv: 72, status: 'PENDING', assignedDate: '2024-01-14', dueDate: '2024-01-17' },
        { id: 3, applicationNumber: 'HLMS-2024-001236', customerName: 'Amit Patel', loanAmount: 7500000, loanType: 'Home Purchase', monthlyIncome: 200000, existingEMI: 30000, creditScore: 650, foir: 52, ltv: 78, status: 'PENDING', assignedDate: '2024-01-13', dueDate: '2024-01-16' },
        { id: 4, applicationNumber: 'HLMS-2024-001237', customerName: 'Sneha Reddy', loanAmount: 4200000, loanType: 'Balance Transfer', monthlyIncome: 100000, existingEMI: 25000, creditScore: 580, foir: 62, ltv: 85, status: 'PENDING', assignedDate: '2024-01-12', dueDate: '2024-01-15' }
      ];
      this.applications.set(apps);
      this.pendingCount.set(apps.length);
      this.overdueCount.set(apps.filter(a => this.isOverdue(a.dueDate)).length);
      this.loading.set(false);
    }, 500);
  }

  isOverdue(dateStr: string): boolean {
    return new Date(dateStr) < new Date();
  }

  getScoreLevel(score: number): string {
    if (score >= 750) return 'excellent';
    if (score >= 700) return 'good';
    if (score >= 650) return 'fair';
    return 'poor';
  }

  getScoreLabel(score: number): string {
    if (score >= 750) return 'Excellent';
    if (score >= 700) return 'Good';
    if (score >= 650) return 'Fair';
    return 'Poor';
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('en-IN');
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  }
}
