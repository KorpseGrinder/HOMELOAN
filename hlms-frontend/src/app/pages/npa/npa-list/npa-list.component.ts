import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

interface NpaAccount {
  id: number;
  loanAccountNumber: string;
  customerName: string;
  loanAmount: number;
  outstandingAmount: number;
  npaAmount: number;
  dpd: number;
  npaDate: string;
  npaCategory: 'SUB_STANDARD' | 'DOUBTFUL' | 'LOSS';
  provisionAmount: number;
  provisionPercent: number;
  recoveryStatus: string;
  lastAction: string;
  assignedTo: string;
}

@Component({
  selector: 'app-npa-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="page-container">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <h1>NPA Management</h1>
          <p>Track and manage Non-Performing Assets as per IRAC norms</p>
        </div>
        <div class="header-stats">
          <div class="stat-card">
            <span class="stat-value">{{ totalNpa() }}</span>
            <span class="stat-label">NPA Accounts</span>
          </div>
          <div class="stat-card danger">
            <span class="stat-value">₹{{ formatCrores(totalNpaAmount()) }} Cr</span>
            <span class="stat-label">Total NPA</span>
          </div>
          <div class="stat-card warning">
            <span class="stat-value">₹{{ formatCrores(totalProvision()) }} Cr</span>
            <span class="stat-label">Provisioning</span>
          </div>
        </div>
      </div>

      <!-- Category Cards -->
      <div class="category-cards">
        <div class="category-card" [class.active]="activeCategory() === 'all'" (click)="activeCategory.set('all')">
          <div class="category-header">
            <span class="category-title">All NPA</span>
            <span class="category-count">{{ npaAccounts().length }}</span>
          </div>
          <span class="category-amount">₹{{ formatCrores(totalNpaAmount()) }} Cr</span>
        </div>
        <div class="category-card sub-standard" [class.active]="activeCategory() === 'SUB_STANDARD'" (click)="activeCategory.set('SUB_STANDARD')">
          <div class="category-header">
            <span class="category-title">Sub-Standard</span>
            <span class="category-count">{{ getCountByCategory('SUB_STANDARD') }}</span>
          </div>
          <span class="category-desc">90-365 DPD • 15% provision</span>
        </div>
        <div class="category-card doubtful" [class.active]="activeCategory() === 'DOUBTFUL'" (click)="activeCategory.set('DOUBTFUL')">
          <div class="category-header">
            <span class="category-title">Doubtful</span>
            <span class="category-count">{{ getCountByCategory('DOUBTFUL') }}</span>
          </div>
          <span class="category-desc">1-3 years • 25-100% provision</span>
        </div>
        <div class="category-card loss" [class.active]="activeCategory() === 'LOSS'" (click)="activeCategory.set('LOSS')">
          <div class="category-header">
            <span class="category-title">Loss</span>
            <span class="category-count">{{ getCountByCategory('LOSS') }}</span>
          </div>
          <span class="category-desc">&gt;3 years • 100% provision</span>
        </div>
      </div>

      <!-- Search -->
      <div class="filters-section">
        <div class="search-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
          <input type="text" [formControl]="searchControl" placeholder="Search by loan account or customer...">
        </div>
      </div>

      <!-- NPA Table -->
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
                  <th>NPA Amount</th>
                  <th>DPD</th>
                  <th>Category</th>
                  <th>Provision</th>
                  <th>Recovery Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                @for (account of filteredAccounts(); track account.id) {
                  <tr>
                    <td>
                      <div class="account-cell">
                        <a [routerLink]="['/servicing/loans', account.id]" class="account-link">
                          {{ account.loanAccountNumber }}
                        </a>
                        <span class="npa-date">NPA since {{ formatDate(account.npaDate) }}</span>
                      </div>
                    </td>
                    <td>{{ account.customerName }}</td>
                    <td class="amount">₹{{ formatCurrency(account.outstandingAmount) }}</td>
                    <td class="amount danger">₹{{ formatCurrency(account.npaAmount) }}</td>
                    <td>
                      <span class="dpd">{{ account.dpd }} days</span>
                    </td>
                    <td>
                      <span class="category-badge" [attr.data-category]="account.npaCategory.toLowerCase()">
                        {{ formatCategory(account.npaCategory) }}
                      </span>
                    </td>
                    <td>
                      <div class="provision-cell">
                        <span class="provision-amount">₹{{ formatCurrency(account.provisionAmount) }}</span>
                        <span class="provision-percent">({{ account.provisionPercent }}%)</span>
                      </div>
                    </td>
                    <td>
                      <span class="recovery-status" [attr.data-status]="account.recoveryStatus.toLowerCase()">
                        {{ account.recoveryStatus }}
                      </span>
                    </td>
                    <td>
                      <button class="btn-view" (click)="viewDetails(account)">
                        View Details
                      </button>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="9" class="empty-state">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M9 12l2 2 4-4"/>
                        <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
                      </svg>
                      <p>No NPA accounts found</p>
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
      padding: 14px 20px;
      text-align: center;
    }

    .stat-card.danger {
      border-color: #fca5a5;
      background: #fef2f2;
    }

    .stat-card.warning {
      border-color: #fcd34d;
      background: #fffbeb;
    }

    .stat-value {
      display: block;
      font-size: 18px;
      font-weight: 700;
      color: #1f2937;
    }

    .stat-card.danger .stat-value {
      color: #dc2626;
    }

    .stat-card.warning .stat-value {
      color: #d97706;
    }

    .stat-label {
      font-size: 11px;
      color: #6b7280;
    }

    .category-cards {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }

    .category-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      padding: 16px;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .category-card:hover {
      border-color: #d1d5db;
    }

    .category-card.active {
      border-color: #1976d2;
      box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
    }

    .category-card.sub-standard.active {
      border-color: #f59e0b;
      box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
    }

    .category-card.doubtful.active {
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }

    .category-card.loss.active {
      border-color: #7f1d1d;
      box-shadow: 0 0 0 3px rgba(127, 29, 29, 0.1);
    }

    .category-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }

    .category-title {
      font-size: 14px;
      font-weight: 600;
      color: #1f2937;
    }

    .category-count {
      font-size: 20px;
      font-weight: 700;
      color: #1976d2;
    }

    .category-card.sub-standard .category-count { color: #f59e0b; }
    .category-card.doubtful .category-count { color: #ef4444; }
    .category-card.loss .category-count { color: #7f1d1d; }

    .category-amount {
      font-size: 14px;
      font-weight: 500;
      color: #1976d2;
    }

    .category-desc {
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

    .account-cell {
      display: flex;
      flex-direction: column;
    }

    .account-link {
      font-weight: 600;
      color: #1976d2;
      text-decoration: none;
    }

    .npa-date {
      font-size: 11px;
      color: #9ca3af;
    }

    .amount {
      font-weight: 600;
      font-family: 'SF Mono', monospace;
    }

    .amount.danger {
      color: #dc2626;
    }

    .dpd {
      font-weight: 600;
      color: #dc2626;
    }

    .category-badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
    }

    .category-badge[data-category="sub_standard"] {
      background: #fef3c7;
      color: #92400e;
    }

    .category-badge[data-category="doubtful"] {
      background: #fee2e2;
      color: #991b1b;
    }

    .category-badge[data-category="loss"] {
      background: #450a0a;
      color: #fef2f2;
    }

    .provision-cell {
      display: flex;
      flex-direction: column;
    }

    .provision-amount {
      font-weight: 500;
      color: #d97706;
    }

    .provision-percent {
      font-size: 11px;
      color: #9ca3af;
    }

    .recovery-status {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 500;
    }

    .recovery-status[data-status="active"] {
      background: #dbeafe;
      color: #1e40af;
    }

    .recovery-status[data-status="legal"] {
      background: #fef3c7;
      color: #92400e;
    }

    .recovery-status[data-status="sarfaesi"] {
      background: #fee2e2;
      color: #991b1b;
    }

    .btn-view {
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 500;
      color: #1976d2;
      background: #eff6ff;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }

    .btn-view:hover {
      background: #dbeafe;
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

    @media (max-width: 1024px) {
      .category-cards {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class NpaListComponent implements OnInit {
  loading = signal(true);
  npaAccounts = signal<NpaAccount[]>([]);
  activeCategory = signal('all');
  totalNpa = signal(0);
  totalNpaAmount = signal(0);
  totalProvision = signal(0);

  searchControl = new FormControl('');

  ngOnInit(): void {
    this.loadNpaAccounts();
  }

  loadNpaAccounts(): void {
    setTimeout(() => {
      const accounts: NpaAccount[] = [
        { id: 1, loanAccountNumber: 'LN-2023-000056', customerName: 'Sneha Reddy', loanAmount: 4200000, outstandingAmount: 3950000, npaAmount: 3950000, dpd: 125, npaDate: '2023-10-10', npaCategory: 'SUB_STANDARD', provisionAmount: 592500, provisionPercent: 15, recoveryStatus: 'ACTIVE', lastAction: 'Legal notice sent', assignedTo: 'Amit Verma' },
        { id: 2, loanAccountNumber: 'LN-2022-000034', customerName: 'Ravi Menon', loanAmount: 6500000, outstandingAmount: 5800000, npaAmount: 5800000, dpd: 450, npaDate: '2022-09-15', npaCategory: 'DOUBTFUL', provisionAmount: 2900000, provisionPercent: 50, recoveryStatus: 'LEGAL', lastAction: 'Court case filed', assignedTo: 'Priya Sharma' },
        { id: 3, loanAccountNumber: 'LN-2021-000012', customerName: 'Kiran Das', loanAmount: 3200000, outstandingAmount: 2900000, npaAmount: 2900000, dpd: 1200, npaDate: '2021-03-20', npaCategory: 'LOSS', provisionAmount: 2900000, provisionPercent: 100, recoveryStatus: 'SARFAESI', lastAction: 'Property auction scheduled', assignedTo: 'Amit Verma' }
      ];
      this.npaAccounts.set(accounts);
      this.totalNpa.set(accounts.length);
      this.totalNpaAmount.set(accounts.reduce((sum, a) => sum + a.npaAmount, 0));
      this.totalProvision.set(accounts.reduce((sum, a) => sum + a.provisionAmount, 0));
      this.loading.set(false);
    }, 500);
  }

  filteredAccounts(): NpaAccount[] {
    const category = this.activeCategory();
    if (category === 'all') return this.npaAccounts();
    return this.npaAccounts().filter(a => a.npaCategory === category);
  }

  getCountByCategory(category: string): number {
    return this.npaAccounts().filter(a => a.npaCategory === category).length;
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('en-IN');
  }

  formatCrores(value: number): string {
    return (value / 10000000).toFixed(2);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  formatCategory(category: string): string {
    return category.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  viewDetails(account: NpaAccount): void {
    console.log('View NPA details:', account.loanAccountNumber);
  }
}
