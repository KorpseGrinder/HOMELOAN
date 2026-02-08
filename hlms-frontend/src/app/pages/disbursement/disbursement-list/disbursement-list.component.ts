import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

interface Disbursement {
  id: number;
  applicationNumber: string;
  customerName: string;
  loanAmount: number;
  sanctionedAmount: number;
  disbursedAmount: number;
  pendingAmount: number;
  installments: number;
  completedInstallments: number;
  status: 'PENDING' | 'PARTIAL' | 'COMPLETED';
  sanctionDate: string;
  lastDisbursementDate?: string;
  nextScheduledDate?: string;
}

@Component({
  selector: 'app-disbursement-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="page-container">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <h1>Disbursement Management</h1>
          <p>Track and process loan disbursements</p>
        </div>
        <div class="header-stats">
          <div class="stat-card">
            <span class="stat-value">₹{{ formatCrores(totalPending()) }} Cr</span>
            <span class="stat-label">Pending Disbursement</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{{ scheduledToday() }}</span>
            <span class="stat-label">Scheduled Today</span>
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
          <input type="text" [formControl]="searchControl" placeholder="Search by application or customer...">
        </div>
        <select [formControl]="statusControl" class="filter-select">
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="PARTIAL">Partially Disbursed</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      <!-- Disbursement Table -->
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
                  <th>Sanctioned</th>
                  <th>Disbursed</th>
                  <th>Pending</th>
                  <th>Progress</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                @for (item of disbursements(); track item.id) {
                  <tr>
                    <td>
                      <a [routerLink]="['/applications', item.id]" class="app-link">
                        {{ item.applicationNumber }}
                      </a>
                    </td>
                    <td>{{ item.customerName }}</td>
                    <td class="amount">₹{{ formatCurrency(item.sanctionedAmount) }}</td>
                    <td class="amount success">₹{{ formatCurrency(item.disbursedAmount) }}</td>
                    <td class="amount warning">₹{{ formatCurrency(item.pendingAmount) }}</td>
                    <td>
                      <div class="progress-cell">
                        <div class="progress-bar">
                          <div class="progress-fill" [style.width.%]="getProgressPercent(item)"></div>
                        </div>
                        <span class="progress-text">{{ item.completedInstallments }}/{{ item.installments }}</span>
                      </div>
                    </td>
                    <td>
                      <span class="status-badge" [attr.data-status]="item.status.toLowerCase()">
                        {{ formatStatus(item.status) }}
                      </span>
                    </td>
                    <td>
                      @if (item.status !== 'COMPLETED') {
                        <button class="btn-disburse" (click)="openDisbursementModal(item)">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="1" x2="12" y2="23"/>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                          </svg>
                          Disburse
                        </button>
                      } @else {
                        <span class="completed-text">✓ Completed</span>
                      }
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="8" class="empty-state">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <rect x="2" y="5" width="20" height="14" rx="2"/>
                        <line x1="2" y1="10" x2="22" y2="10"/>
                      </svg>
                      <p>No disbursements found</p>
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
      gap: 16px;
    }

    .stat-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      padding: 16px 24px;
      text-align: center;
    }

    .stat-value {
      display: block;
      font-size: 20px;
      font-weight: 700;
      color: #1976d2;
    }

    .stat-label {
      font-size: 12px;
      color: #6b7280;
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

    .app-link {
      font-weight: 600;
      color: #1976d2;
      text-decoration: none;
    }

    .app-link:hover {
      text-decoration: underline;
    }

    .amount {
      font-weight: 600;
      font-family: 'SF Mono', monospace;
    }

    .amount.success {
      color: #16a34a;
    }

    .amount.warning {
      color: #d97706;
    }

    .progress-cell {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .progress-bar {
      width: 80px;
      height: 6px;
      background: #e5e7eb;
      border-radius: 3px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: #1976d2;
      border-radius: 3px;
      transition: width 0.3s ease;
    }

    .progress-text {
      font-size: 12px;
      color: #6b7280;
    }

    .status-badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-badge[data-status="pending"] {
      background: #fef3c7;
      color: #92400e;
    }

    .status-badge[data-status="partial"] {
      background: #dbeafe;
      color: #1e40af;
    }

    .status-badge[data-status="completed"] {
      background: #d1fae5;
      color: #065f46;
    }

    .btn-disburse {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: #16a34a;
      color: white;
      font-size: 12px;
      font-weight: 500;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }

    .btn-disburse:hover {
      background: #15803d;
    }

    .completed-text {
      color: #16a34a;
      font-size: 13px;
      font-weight: 500;
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
export class DisbursementListComponent implements OnInit {
  loading = signal(true);
  disbursements = signal<Disbursement[]>([]);
  totalPending = signal(0);
  scheduledToday = signal(0);

  searchControl = new FormControl('');
  statusControl = new FormControl('');

  ngOnInit(): void {
    this.loadDisbursements();
  }

  loadDisbursements(): void {
    setTimeout(() => {
      const items: Disbursement[] = [
        { id: 1, applicationNumber: 'HLMS-2024-001234', customerName: 'Rajesh Kumar', loanAmount: 5000000, sanctionedAmount: 5000000, disbursedAmount: 3000000, pendingAmount: 2000000, installments: 3, completedInstallments: 2, status: 'PARTIAL', sanctionDate: '2024-01-15', lastDisbursementDate: '2024-01-20', nextScheduledDate: '2024-02-01' },
        { id: 2, applicationNumber: 'HLMS-2024-001235', customerName: 'Priya Sharma', loanAmount: 3500000, sanctionedAmount: 3500000, disbursedAmount: 0, pendingAmount: 3500000, installments: 1, completedInstallments: 0, status: 'PENDING', sanctionDate: '2024-01-18' },
        { id: 3, applicationNumber: 'HLMS-2024-001220', customerName: 'Amit Patel', loanAmount: 7500000, sanctionedAmount: 7500000, disbursedAmount: 7500000, pendingAmount: 0, installments: 2, completedInstallments: 2, status: 'COMPLETED', sanctionDate: '2024-01-05', lastDisbursementDate: '2024-01-15' },
        { id: 4, applicationNumber: 'HLMS-2024-001218', customerName: 'Sneha Reddy', loanAmount: 4200000, sanctionedAmount: 4200000, disbursedAmount: 2100000, pendingAmount: 2100000, installments: 2, completedInstallments: 1, status: 'PARTIAL', sanctionDate: '2024-01-08', lastDisbursementDate: '2024-01-12', nextScheduledDate: '2024-01-25' }
      ];
      this.disbursements.set(items);
      this.totalPending.set(items.reduce((sum, d) => sum + d.pendingAmount, 0));
      this.scheduledToday.set(2);
      this.loading.set(false);
    }, 500);
  }

  getProgressPercent(item: Disbursement): number {
    return (item.completedInstallments / item.installments) * 100;
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('en-IN');
  }

  formatCrores(value: number): string {
    return (value / 10000000).toFixed(2);
  }

  formatStatus(status: string): string {
    if (status === 'PARTIAL') return 'Partial';
    return status.charAt(0) + status.slice(1).toLowerCase();
  }

  openDisbursementModal(item: Disbursement): void {
    console.log('Open disbursement modal for:', item.applicationNumber);
  }
}
