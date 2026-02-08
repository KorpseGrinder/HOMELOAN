import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

interface OverdueAccount {
  id: number;
  loanAccountNumber: string;
  customerName: string;
  customerPhone: string;
  loanAmount: number;
  outstandingAmount: number;
  overdueAmount: number;
  dpd: number;
  bucket: string;
  lastPaymentDate: string;
  nextActionDate: string;
  assignedTo: string;
  lastAction: string;
}

@Component({
  selector: 'app-overdue-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="page-container">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <h1>Collections Management</h1>
          <p>Track and manage overdue loan accounts</p>
        </div>
        <div class="header-stats">
          <div class="stat-card danger">
            <span class="stat-value">{{ totalOverdue() }}</span>
            <span class="stat-label">Overdue Accounts</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">₹{{ formatCrores(totalOverdueAmount()) }} Cr</span>
            <span class="stat-label">Total Overdue</span>
          </div>
        </div>
      </div>

      <!-- DPD Buckets -->
      <div class="bucket-tabs">
        @for (bucket of buckets; track bucket.id) {
          <button
            class="bucket-tab"
            [class.active]="activeBucket() === bucket.id"
            [attr.data-bucket]="bucket.id"
            (click)="activeBucket.set(bucket.id)"
          >
            <span class="bucket-label">{{ bucket.label }}</span>
            <span class="bucket-count">{{ bucket.count }}</span>
          </button>
        }
      </div>

      <!-- Filters -->
      <div class="filters-section">
        <div class="search-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
          <input type="text" [formControl]="searchControl" placeholder="Search by loan account or customer...">
        </div>
        <select [formControl]="assigneeControl" class="filter-select">
          <option value="">All Assignees</option>
          <option value="priya">Priya Sharma</option>
          <option value="amit">Amit Verma</option>
          <option value="suresh">Suresh Menon</option>
        </select>
      </div>

      <!-- Overdue Table -->
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
                  <th>Account</th>
                  <th>Customer</th>
                  <th>Outstanding</th>
                  <th>Overdue</th>
                  <th>DPD</th>
                  <th>Last Payment</th>
                  <th>Assigned To</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                @for (account of filteredAccounts(); track account.id) {
                  <tr>
                    <td>
                      <a [routerLink]="['/servicing/loans', account.id]" class="account-link">
                        {{ account.loanAccountNumber }}
                      </a>
                    </td>
                    <td>
                      <div class="customer-cell">
                        <span class="customer-name">{{ account.customerName }}</span>
                        <span class="customer-phone">{{ account.customerPhone }}</span>
                      </div>
                    </td>
                    <td class="amount">₹{{ formatCurrency(account.outstandingAmount) }}</td>
                    <td class="amount danger">₹{{ formatCurrency(account.overdueAmount) }}</td>
                    <td>
                      <span class="dpd-badge" [attr.data-bucket]="account.bucket">
                        {{ account.dpd }} days
                      </span>
                    </td>
                    <td>{{ formatDate(account.lastPaymentDate) }}</td>
                    <td>{{ account.assignedTo }}</td>
                    <td>
                      <div class="action-buttons">
                        <button class="btn-call" title="Call Customer">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                          </svg>
                        </button>
                        <button class="btn-action" (click)="openActionModal(account)">
                          Log Action
                        </button>
                      </div>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="8" class="empty-state">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M9 12l2 2 4-4"/>
                        <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
                      </svg>
                      <p>No overdue accounts in this bucket</p>
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

    .stat-card.danger {
      border-color: #fca5a5;
      background: #fef2f2;
    }

    .stat-value {
      display: block;
      font-size: 20px;
      font-weight: 700;
      color: #1f2937;
    }

    .stat-card.danger .stat-value {
      color: #dc2626;
    }

    .stat-label {
      font-size: 12px;
      color: #6b7280;
    }

    .bucket-tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
    }

    .bucket-tab {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 12px 24px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .bucket-tab:hover {
      background: #f9fafb;
    }

    .bucket-tab.active {
      border-color: #1976d2;
      background: #eff6ff;
    }

    .bucket-tab[data-bucket="0-30"].active { border-color: #f59e0b; background: #fffbeb; }
    .bucket-tab[data-bucket="31-60"].active { border-color: #f97316; background: #fff7ed; }
    .bucket-tab[data-bucket="61-90"].active { border-color: #ef4444; background: #fef2f2; }
    .bucket-tab[data-bucket="90+"].active { border-color: #dc2626; background: #fef2f2; }

    .bucket-label {
      font-size: 13px;
      font-weight: 500;
      color: #4b5563;
    }

    .bucket-count {
      font-size: 20px;
      font-weight: 700;
      color: #1f2937;
    }

    .bucket-tab[data-bucket="0-30"] .bucket-count { color: #f59e0b; }
    .bucket-tab[data-bucket="31-60"] .bucket-count { color: #f97316; }
    .bucket-tab[data-bucket="61-90"] .bucket-count { color: #ef4444; }
    .bucket-tab[data-bucket="90+"] .bucket-count { color: #dc2626; }

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

    .account-link {
      font-weight: 600;
      color: #1976d2;
      text-decoration: none;
    }

    .account-link:hover {
      text-decoration: underline;
    }

    .customer-cell {
      display: flex;
      flex-direction: column;
    }

    .customer-name {
      font-weight: 500;
      color: #1f2937;
    }

    .customer-phone {
      font-size: 12px;
      color: #9ca3af;
    }

    .amount {
      font-weight: 600;
      font-family: 'SF Mono', monospace;
    }

    .amount.danger {
      color: #dc2626;
    }

    .dpd-badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
    }

    .dpd-badge[data-bucket="0-30"] {
      background: #fef3c7;
      color: #92400e;
    }

    .dpd-badge[data-bucket="31-60"] {
      background: #ffedd5;
      color: #9a3412;
    }

    .dpd-badge[data-bucket="61-90"] {
      background: #fee2e2;
      color: #991b1b;
    }

    .dpd-badge[data-bucket="90+"] {
      background: #fecaca;
      color: #7f1d1d;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
    }

    .btn-call {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #d1fae5;
      border: none;
      border-radius: 6px;
      color: #16a34a;
      cursor: pointer;
    }

    .btn-call:hover {
      background: #bbf7d0;
    }

    .btn-action {
      padding: 8px 14px;
      font-size: 13px;
      font-weight: 500;
      background: #1976d2;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }

    .btn-action:hover {
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
export class OverdueListComponent implements OnInit {
  loading = signal(true);
  accounts = signal<OverdueAccount[]>([]);
  activeBucket = signal('all');
  totalOverdue = signal(0);
  totalOverdueAmount = signal(0);

  searchControl = new FormControl('');
  assigneeControl = new FormControl('');

  buckets = [
    { id: 'all', label: 'All', count: 0 },
    { id: '0-30', label: '0-30 DPD', count: 0 },
    { id: '31-60', label: '31-60 DPD', count: 0 },
    { id: '61-90', label: '61-90 DPD', count: 0 },
    { id: '90+', label: '90+ DPD', count: 0 }
  ];

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    setTimeout(() => {
      const overdueAccounts: OverdueAccount[] = [
        { id: 1, loanAccountNumber: 'LN-2023-000098', customerName: 'Amit Patel', customerPhone: '+91 98765 43212', loanAmount: 7500000, outstandingAmount: 7200000, overdueAmount: 129782, dpd: 35, bucket: '31-60', lastPaymentDate: '2023-12-05', nextActionDate: '2024-01-20', assignedTo: 'Priya Sharma', lastAction: 'Phone call - No answer' },
        { id: 2, loanAccountNumber: 'LN-2023-000056', customerName: 'Sneha Reddy', customerPhone: '+91 98765 43213', loanAmount: 4200000, outstandingAmount: 3950000, overdueAmount: 254373, dpd: 95, bucket: '90+', lastPaymentDate: '2023-10-10', nextActionDate: '2024-01-18', assignedTo: 'Amit Verma', lastAction: 'Legal notice sent' },
        { id: 3, loanAccountNumber: 'LN-2023-000112', customerName: 'Rahul Mehta', customerPhone: '+91 98765 43215', loanAmount: 3000000, outstandingAmount: 2850000, overdueAmount: 52000, dpd: 15, bucket: '0-30', lastPaymentDate: '2024-01-05', nextActionDate: '2024-01-22', assignedTo: 'Suresh Menon', lastAction: 'SMS reminder sent' },
        { id: 4, loanAccountNumber: 'LN-2023-000089', customerName: 'Kavitha Nair', customerPhone: '+91 98765 43216', loanAmount: 5500000, outstandingAmount: 5100000, overdueAmount: 175000, dpd: 68, bucket: '61-90', lastPaymentDate: '2023-11-15', nextActionDate: '2024-01-19', assignedTo: 'Priya Sharma', lastAction: 'Field visit scheduled' }
      ];
      this.accounts.set(overdueAccounts);
      this.totalOverdue.set(overdueAccounts.length);
      this.totalOverdueAmount.set(overdueAccounts.reduce((sum, a) => sum + a.overdueAmount, 0));

      this.buckets = [
        { id: 'all', label: 'All', count: overdueAccounts.length },
        { id: '0-30', label: '0-30 DPD', count: overdueAccounts.filter(a => a.bucket === '0-30').length },
        { id: '31-60', label: '31-60 DPD', count: overdueAccounts.filter(a => a.bucket === '31-60').length },
        { id: '61-90', label: '61-90 DPD', count: overdueAccounts.filter(a => a.bucket === '61-90').length },
        { id: '90+', label: '90+ DPD', count: overdueAccounts.filter(a => a.bucket === '90+').length }
      ];

      this.loading.set(false);
    }, 500);
  }

  filteredAccounts(): OverdueAccount[] {
    const bucket = this.activeBucket();
    if (bucket === 'all') return this.accounts();
    return this.accounts().filter(a => a.bucket === bucket);
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

  openActionModal(account: OverdueAccount): void {
    console.log('Open action modal for:', account.loanAccountNumber);
  }
}
