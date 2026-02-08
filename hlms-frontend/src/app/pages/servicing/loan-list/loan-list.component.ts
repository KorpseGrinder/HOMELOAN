import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

interface ActiveLoan {
  id: number;
  loanAccountNumber: string;
  applicationNumber: string;
  customerName: string;
  loanType: string;
  sanctionedAmount: number;
  disbursedAmount: number;
  outstandingPrincipal: number;
  emi: number;
  interestRate: number;
  tenure: number;
  remainingTenure: number;
  nextEmiDate: string;
  dpd: number;
  status: 'REGULAR' | 'OVERDUE' | 'NPA';
  disbursementDate: string;
}

@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="page-container">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <h1>Active Loans</h1>
          <p>Monitor and manage disbursed loan accounts</p>
        </div>
        <div class="header-stats">
          <div class="stat-item">
            <span class="stat-value">{{ totalLoans() }}</span>
            <span class="stat-label">Total Loans</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">₹{{ formatCrores(totalOutstanding()) }} Cr</span>
            <span class="stat-label">Outstanding</span>
          </div>
          <div class="stat-item warning">
            <span class="stat-value">{{ overdueCount() }}</span>
            <span class="stat-label">Overdue</span>
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
          <input type="text" [formControl]="searchControl" placeholder="Search by loan account or customer...">
        </div>
        <select [formControl]="statusControl" class="filter-select">
          <option value="">All Status</option>
          <option value="REGULAR">Regular</option>
          <option value="OVERDUE">Overdue</option>
          <option value="NPA">NPA</option>
        </select>
        <select [formControl]="loanTypeControl" class="filter-select">
          <option value="">All Loan Types</option>
          <option value="Home Purchase">Home Purchase</option>
          <option value="Home Construction">Home Construction</option>
          <option value="Balance Transfer">Balance Transfer</option>
          <option value="Home Improvement">Home Improvement</option>
        </select>
      </div>

      <!-- Loans Table -->
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
                  <th>Loan Account</th>
                  <th>Customer</th>
                  <th>Loan Type</th>
                  <th>Outstanding</th>
                  <th>EMI</th>
                  <th>Next EMI Date</th>
                  <th>DPD</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                @for (loan of loans(); track loan.id) {
                  <tr [class.overdue]="loan.status === 'OVERDUE'" [class.npa]="loan.status === 'NPA'">
                    <td>
                      <div class="loan-cell">
                        <a [routerLink]="['/servicing/loans', loan.id]" class="loan-number">
                          {{ loan.loanAccountNumber }}
                        </a>
                        <span class="app-ref">{{ loan.applicationNumber }}</span>
                      </div>
                    </td>
                    <td>{{ loan.customerName }}</td>
                    <td>{{ loan.loanType }}</td>
                    <td class="amount">₹{{ formatCurrency(loan.outstandingPrincipal) }}</td>
                    <td class="amount">₹{{ formatCurrency(loan.emi) }}</td>
                    <td>{{ formatDate(loan.nextEmiDate) }}</td>
                    <td>
                      <span class="dpd" [class.warning]="loan.dpd > 0 && loan.dpd < 90" [class.danger]="loan.dpd >= 90">
                        {{ loan.dpd }} days
                      </span>
                    </td>
                    <td>
                      <span class="status-badge" [attr.data-status]="loan.status.toLowerCase()">
                        {{ loan.status }}
                      </span>
                    </td>
                    <td>
                      <a [routerLink]="['/servicing/loans', loan.id]" class="btn-view">
                        View
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </a>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="9" class="empty-state">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
                        <path d="M9 12h6"/>
                      </svg>
                      <p>No active loans found</p>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="pagination">
            <span class="pagination-info">Showing 1-{{ loans().length }} of {{ totalLoans() }} loans</span>
            <div class="pagination-controls">
              <button class="page-btn" disabled>Previous</button>
              <button class="page-btn active">1</button>
              <button class="page-btn">2</button>
              <button class="page-btn">3</button>
              <button class="page-btn">Next</button>
            </div>
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
      padding: 0 16px;
      border-right: 1px solid #e5e7eb;
    }

    .stat-item:last-child {
      border-right: none;
    }

    .stat-value {
      display: block;
      font-size: 24px;
      font-weight: 700;
      color: #1976d2;
    }

    .stat-item.warning .stat-value {
      color: #dc2626;
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

    tr.overdue td {
      background: #fffbeb;
    }

    tr.npa td {
      background: #fef2f2;
    }

    .loan-cell {
      display: flex;
      flex-direction: column;
    }

    .loan-number {
      font-weight: 600;
      color: #1976d2;
      text-decoration: none;
    }

    .loan-number:hover {
      text-decoration: underline;
    }

    .app-ref {
      font-size: 12px;
      color: #9ca3af;
    }

    .amount {
      font-weight: 600;
      font-family: 'SF Mono', monospace;
      color: #1f2937;
    }

    .dpd {
      font-weight: 500;
    }

    .dpd.warning {
      color: #d97706;
    }

    .dpd.danger {
      color: #dc2626;
      font-weight: 600;
    }

    .status-badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-badge[data-status="regular"] {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge[data-status="overdue"] {
      background: #fef3c7;
      color: #92400e;
    }

    .status-badge[data-status="npa"] {
      background: #fee2e2;
      color: #991b1b;
    }

    .btn-view {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 6px 12px;
      font-size: 13px;
      font-weight: 500;
      color: #1976d2;
      background: #eff6ff;
      border-radius: 6px;
      text-decoration: none;
    }

    .btn-view:hover {
      background: #dbeafe;
    }

    .pagination {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border-top: 1px solid #e5e7eb;
    }

    .pagination-info {
      font-size: 14px;
      color: #6b7280;
    }

    .pagination-controls {
      display: flex;
      gap: 4px;
    }

    .page-btn {
      padding: 8px 14px;
      font-size: 13px;
      font-weight: 500;
      color: #4b5563;
      background: white;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      cursor: pointer;
    }

    .page-btn:hover:not(:disabled) {
      background: #f3f4f6;
    }

    .page-btn.active {
      background: #1976d2;
      color: white;
      border-color: #1976d2;
    }

    .page-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
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
export class LoanListComponent implements OnInit {
  loading = signal(true);
  loans = signal<ActiveLoan[]>([]);
  totalLoans = signal(0);
  totalOutstanding = signal(0);
  overdueCount = signal(0);

  searchControl = new FormControl('');
  statusControl = new FormControl('');
  loanTypeControl = new FormControl('');

  ngOnInit(): void {
    this.loadLoans();
  }

  loadLoans(): void {
    setTimeout(() => {
      const loanList: ActiveLoan[] = [
        { id: 1, loanAccountNumber: 'LN-2024-000123', applicationNumber: 'HLMS-2024-001220', customerName: 'Rajesh Kumar', loanType: 'Home Purchase', sanctionedAmount: 5000000, disbursedAmount: 5000000, outstandingPrincipal: 4850000, emi: 43391, interestRate: 8.5, tenure: 240, remainingTenure: 238, nextEmiDate: '2024-02-05', dpd: 0, status: 'REGULAR', disbursementDate: '2024-01-10' },
        { id: 2, loanAccountNumber: 'LN-2024-000124', applicationNumber: 'HLMS-2024-001221', customerName: 'Priya Sharma', loanType: 'Home Construction', sanctionedAmount: 3500000, disbursedAmount: 3500000, outstandingPrincipal: 3400000, emi: 30274, interestRate: 8.75, tenure: 240, remainingTenure: 237, nextEmiDate: '2024-02-08', dpd: 0, status: 'REGULAR', disbursementDate: '2024-01-12' },
        { id: 3, loanAccountNumber: 'LN-2023-000098', applicationNumber: 'HLMS-2023-000890', customerName: 'Amit Patel', loanType: 'Home Purchase', sanctionedAmount: 7500000, disbursedAmount: 7500000, outstandingPrincipal: 7200000, emi: 64891, interestRate: 8.5, tenure: 240, remainingTenure: 228, nextEmiDate: '2024-01-05', dpd: 35, status: 'OVERDUE', disbursementDate: '2023-03-15' },
        { id: 4, loanAccountNumber: 'LN-2023-000056', applicationNumber: 'HLMS-2023-000567', customerName: 'Sneha Reddy', loanType: 'Balance Transfer', sanctionedAmount: 4200000, disbursedAmount: 4200000, outstandingPrincipal: 3950000, emi: 36339, interestRate: 8.25, tenure: 240, remainingTenure: 220, nextEmiDate: '2023-10-10', dpd: 95, status: 'NPA', disbursementDate: '2023-01-10' },
        { id: 5, loanAccountNumber: 'LN-2024-000125', applicationNumber: 'HLMS-2024-001225', customerName: 'Vikram Singh', loanType: 'Home Improvement', sanctionedAmount: 1500000, disbursedAmount: 1500000, outstandingPrincipal: 1480000, emi: 13017, interestRate: 9.0, tenure: 180, remainingTenure: 178, nextEmiDate: '2024-02-15', dpd: 0, status: 'REGULAR', disbursementDate: '2024-01-18' }
      ];
      this.loans.set(loanList);
      this.totalLoans.set(loanList.length);
      this.totalOutstanding.set(loanList.reduce((sum, l) => sum + l.outstandingPrincipal, 0));
      this.overdueCount.set(loanList.filter(l => l.status !== 'REGULAR').length);
      this.loading.set(false);
    }, 500);
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
}
