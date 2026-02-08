import { Component, OnInit, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface LoanDetail {
  id: number;
  loanAccountNumber: string;
  applicationNumber: string;
  customer: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  loanType: string;
  sanctionedAmount: number;
  disbursedAmount: number;
  outstandingPrincipal: number;
  outstandingInterest: number;
  totalOutstanding: number;
  emi: number;
  interestRate: number;
  tenure: number;
  remainingTenure: number;
  disbursementDate: string;
  firstEmiDate: string;
  nextEmiDate: string;
  maturityDate: string;
  dpd: number;
  status: string;
  principalPaid: number;
  interestPaid: number;
  totalPaid: number;
}

interface EmiScheduleItem {
  installmentNo: number;
  dueDate: string;
  emiAmount: number;
  principal: number;
  interest: number;
  balance: number;
  status: 'PAID' | 'DUE' | 'OVERDUE' | 'UPCOMING';
  paidDate?: string;
}

interface PaymentHistory {
  id: number;
  date: string;
  amount: number;
  principal: number;
  interest: number;
  penalty: number;
  mode: string;
  reference: string;
}

@Component({
  selector: 'app-loan-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-container">
      @if (loading()) {
        <div class="loading-state">
          <div class="spinner"></div>
        </div>
      } @else {
        <!-- Header -->
        <div class="page-header">
          <div class="header-left">
            <a routerLink="/servicing/loans" class="back-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </a>
            <div>
              <div class="header-top">
                <h1>{{ loan()?.loanAccountNumber }}</h1>
                <span class="status-badge" [attr.data-status]="loan()?.status?.toLowerCase()">
                  {{ loan()?.status }}
                </span>
              </div>
              <p>{{ loan()?.loanType }} • {{ loan()?.customer?.name }}</p>
            </div>
          </div>
          <div class="header-actions">
            <button class="btn-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Statement
            </button>
            <button class="btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              Record Payment
            </button>
          </div>
        </div>

        <!-- Summary Cards -->
        <div class="summary-cards">
          <div class="summary-card">
            <span class="card-label">Total Outstanding</span>
            <span class="card-value primary">₹{{ formatCurrency(loan()?.totalOutstanding || 0) }}</span>
            <div class="card-breakdown">
              <span>Principal: ₹{{ formatCurrency(loan()?.outstandingPrincipal || 0) }}</span>
              <span>Interest: ₹{{ formatCurrency(loan()?.outstandingInterest || 0) }}</span>
            </div>
          </div>
          <div class="summary-card">
            <span class="card-label">EMI Amount</span>
            <span class="card-value">₹{{ formatCurrency(loan()?.emi || 0) }}</span>
            <span class="card-sub">Due on {{ formatDate(loan()?.nextEmiDate) }}</span>
          </div>
          <div class="summary-card">
            <span class="card-label">Interest Rate</span>
            <span class="card-value">{{ loan()?.interestRate }}%</span>
            <span class="card-sub">Per annum (floating)</span>
          </div>
          <div class="summary-card" [class.warning]="(loan()?.dpd || 0) > 0">
            <span class="card-label">Days Past Due</span>
            <span class="card-value">{{ loan()?.dpd }} days</span>
            @if ((loan()?.dpd || 0) > 0) {
              <span class="card-sub danger">Action required</span>
            } @else {
              <span class="card-sub success">Regular</span>
            }
          </div>
        </div>

        <!-- Tabs -->
        <div class="tabs-container">
          <div class="tabs-header">
            <button class="tab-btn" [class.active]="activeTab() === 'overview'" (click)="activeTab.set('overview')">Overview</button>
            <button class="tab-btn" [class.active]="activeTab() === 'schedule'" (click)="activeTab.set('schedule')">EMI Schedule</button>
            <button class="tab-btn" [class.active]="activeTab() === 'payments'" (click)="activeTab.set('payments')">Payment History</button>
          </div>

          <div class="tabs-content">
            <!-- Overview Tab -->
            @if (activeTab() === 'overview') {
              <div class="tab-panel">
                <div class="info-grid">
                  <div class="info-card">
                    <h4>Loan Details</h4>
                    <div class="info-rows">
                      <div class="info-row">
                        <span>Sanctioned Amount</span>
                        <strong>₹{{ formatCurrency(loan()?.sanctionedAmount || 0) }}</strong>
                      </div>
                      <div class="info-row">
                        <span>Disbursed Amount</span>
                        <strong>₹{{ formatCurrency(loan()?.disbursedAmount || 0) }}</strong>
                      </div>
                      <div class="info-row">
                        <span>Interest Rate</span>
                        <strong>{{ loan()?.interestRate }}% p.a.</strong>
                      </div>
                      <div class="info-row">
                        <span>Tenure</span>
                        <strong>{{ loan()?.tenure }} months</strong>
                      </div>
                      <div class="info-row">
                        <span>Remaining Tenure</span>
                        <strong>{{ loan()?.remainingTenure }} months</strong>
                      </div>
                    </div>
                  </div>

                  <div class="info-card">
                    <h4>Important Dates</h4>
                    <div class="info-rows">
                      <div class="info-row">
                        <span>Disbursement Date</span>
                        <strong>{{ formatDate(loan()?.disbursementDate) }}</strong>
                      </div>
                      <div class="info-row">
                        <span>First EMI Date</span>
                        <strong>{{ formatDate(loan()?.firstEmiDate) }}</strong>
                      </div>
                      <div class="info-row">
                        <span>Next EMI Date</span>
                        <strong class="highlight">{{ formatDate(loan()?.nextEmiDate) }}</strong>
                      </div>
                      <div class="info-row">
                        <span>Maturity Date</span>
                        <strong>{{ formatDate(loan()?.maturityDate) }}</strong>
                      </div>
                    </div>
                  </div>

                  <div class="info-card">
                    <h4>Repayment Summary</h4>
                    <div class="info-rows">
                      <div class="info-row">
                        <span>Principal Paid</span>
                        <strong class="success">₹{{ formatCurrency(loan()?.principalPaid || 0) }}</strong>
                      </div>
                      <div class="info-row">
                        <span>Interest Paid</span>
                        <strong>₹{{ formatCurrency(loan()?.interestPaid || 0) }}</strong>
                      </div>
                      <div class="info-row">
                        <span>Total Paid</span>
                        <strong class="success">₹{{ formatCurrency(loan()?.totalPaid || 0) }}</strong>
                      </div>
                    </div>
                    <div class="repayment-progress">
                      <div class="progress-bar">
                        <div class="progress-fill" [style.width.%]="getRepaymentPercent()"></div>
                      </div>
                      <span class="progress-label">{{ getRepaymentPercent() }}% Repaid</span>
                    </div>
                  </div>

                  <div class="info-card">
                    <h4>Customer Details</h4>
                    <div class="info-rows">
                      <div class="info-row">
                        <span>Name</span>
                        <strong>{{ loan()?.customer?.name }}</strong>
                      </div>
                      <div class="info-row">
                        <span>Email</span>
                        <strong>{{ loan()?.customer?.email }}</strong>
                      </div>
                      <div class="info-row">
                        <span>Phone</span>
                        <strong>{{ loan()?.customer?.phone }}</strong>
                      </div>
                    </div>
                    <a [routerLink]="['/customers', loan()?.customer?.id]" class="view-profile-link">View Customer Profile →</a>
                  </div>
                </div>
              </div>
            }

            <!-- EMI Schedule Tab -->
            @if (activeTab() === 'schedule') {
              <div class="tab-panel">
                <div class="schedule-table">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Due Date</th>
                        <th>EMI Amount</th>
                        <th>Principal</th>
                        <th>Interest</th>
                        <th>Balance</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (item of emiSchedule(); track item.installmentNo) {
                        <tr [class.paid]="item.status === 'PAID'" [class.overdue]="item.status === 'OVERDUE'">
                          <td>{{ item.installmentNo }}</td>
                          <td>{{ formatDate(item.dueDate) }}</td>
                          <td class="amount">₹{{ formatCurrency(item.emiAmount) }}</td>
                          <td>₹{{ formatCurrency(item.principal) }}</td>
                          <td>₹{{ formatCurrency(item.interest) }}</td>
                          <td>₹{{ formatCurrency(item.balance) }}</td>
                          <td>
                            <span class="emi-status" [attr.data-status]="item.status.toLowerCase()">
                              {{ item.status }}
                            </span>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            }

            <!-- Payment History Tab -->
            @if (activeTab() === 'payments') {
              <div class="tab-panel">
                <div class="payments-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Principal</th>
                        <th>Interest</th>
                        <th>Penalty</th>
                        <th>Mode</th>
                        <th>Reference</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (payment of payments(); track payment.id) {
                        <tr>
                          <td>{{ formatDate(payment.date) }}</td>
                          <td class="amount">₹{{ formatCurrency(payment.amount) }}</td>
                          <td>₹{{ formatCurrency(payment.principal) }}</td>
                          <td>₹{{ formatCurrency(payment.interest) }}</td>
                          <td>{{ payment.penalty > 0 ? '₹' + formatCurrency(payment.penalty) : '-' }}</td>
                          <td>{{ payment.mode }}</td>
                          <td class="reference">{{ payment.reference }}</td>
                        </tr>
                      } @empty {
                        <tr>
                          <td colspan="7" class="empty-state">
                            <p>No payment history available</p>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .loading-state {
      display: flex;
      justify-content: center;
      padding: 80px 0;
    }

    .spinner {
      width: 48px;
      height: 48px;
      border: 3px solid #e5e7eb;
      border-top-color: #1976d2;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
    }

    .header-left {
      display: flex;
      align-items: flex-start;
      gap: 16px;
    }

    .back-btn {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      color: #6b7280;
    }

    .header-top {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .header-left h1 {
      font-size: 24px;
      font-weight: 700;
      color: #1f2937;
      margin: 0;
    }

    .header-left p {
      font-size: 14px;
      color: #6b7280;
      margin: 4px 0 0 0;
    }

    .status-badge {
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
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

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .btn-primary, .btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      font-size: 14px;
      font-weight: 500;
      border-radius: 8px;
      border: none;
      cursor: pointer;
    }

    .btn-primary {
      background: #1976d2;
      color: white;
    }

    .btn-secondary {
      background: white;
      color: #4b5563;
      border: 1px solid #d1d5db;
    }

    .summary-cards {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }

    .summary-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 20px;
    }

    .summary-card.warning {
      border-color: #fbbf24;
      background: #fffbeb;
    }

    .card-label {
      display: block;
      font-size: 13px;
      color: #6b7280;
      margin-bottom: 8px;
    }

    .card-value {
      display: block;
      font-size: 24px;
      font-weight: 700;
      color: #1f2937;
    }

    .card-value.primary {
      color: #1976d2;
    }

    .card-breakdown {
      display: flex;
      gap: 16px;
      margin-top: 8px;
      font-size: 12px;
      color: #6b7280;
    }

    .card-sub {
      display: block;
      font-size: 12px;
      color: #6b7280;
      margin-top: 4px;
    }

    .card-sub.success { color: #16a34a; }
    .card-sub.danger { color: #dc2626; }

    .tabs-container {
      background: white;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
    }

    .tabs-header {
      display: flex;
      border-bottom: 1px solid #e5e7eb;
      background: #f9fafb;
    }

    .tab-btn {
      padding: 16px 24px;
      font-size: 14px;
      font-weight: 500;
      color: #6b7280;
      background: transparent;
      border: none;
      cursor: pointer;
      position: relative;
    }

    .tab-btn.active {
      color: #1976d2;
      background: white;
    }

    .tab-btn.active::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 2px;
      background: #1976d2;
    }

    .tab-panel {
      padding: 24px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    .info-card {
      background: #f9fafb;
      border-radius: 10px;
      padding: 20px;
    }

    .info-card h4 {
      font-size: 14px;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 16px 0;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      font-size: 14px;
      border-bottom: 1px solid #e5e7eb;
    }

    .info-row:last-child {
      border-bottom: none;
    }

    .info-row span {
      color: #6b7280;
    }

    .info-row strong {
      color: #1f2937;
    }

    .info-row strong.highlight {
      color: #1976d2;
    }

    .info-row strong.success {
      color: #16a34a;
    }

    .repayment-progress {
      margin-top: 16px;
    }

    .progress-bar {
      height: 8px;
      background: #e5e7eb;
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: #16a34a;
      border-radius: 4px;
    }

    .progress-label {
      display: block;
      font-size: 12px;
      color: #6b7280;
      margin-top: 8px;
    }

    .view-profile-link {
      display: inline-block;
      margin-top: 16px;
      font-size: 13px;
      color: #1976d2;
      text-decoration: none;
    }

    .schedule-table, .payments-table {
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
      background: #f9fafb;
      border-bottom: 1px solid #e5e7eb;
    }

    td {
      padding: 12px 16px;
      font-size: 14px;
      color: #4b5563;
      border-bottom: 1px solid #f3f4f6;
    }

    tr.paid td {
      background: #f0fdf4;
    }

    tr.overdue td {
      background: #fef2f2;
    }

    .amount {
      font-weight: 600;
      font-family: 'SF Mono', monospace;
    }

    .reference {
      font-family: 'SF Mono', monospace;
      font-size: 12px;
      color: #6b7280;
    }

    .emi-status {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 500;
    }

    .emi-status[data-status="paid"] {
      background: #d1fae5;
      color: #065f46;
    }

    .emi-status[data-status="due"] {
      background: #fef3c7;
      color: #92400e;
    }

    .emi-status[data-status="overdue"] {
      background: #fee2e2;
      color: #991b1b;
    }

    .emi-status[data-status="upcoming"] {
      background: #f3f4f6;
      color: #6b7280;
    }

    .empty-state {
      text-align: center;
      padding: 40px !important;
      color: #9ca3af;
    }

    @media (max-width: 1024px) {
      .summary-cards {
        grid-template-columns: repeat(2, 1fr);
      }
      .info-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class LoanDetailComponent implements OnInit {
  @Input() id!: string;

  loading = signal(true);
  loan = signal<LoanDetail | null>(null);
  emiSchedule = signal<EmiScheduleItem[]>([]);
  payments = signal<PaymentHistory[]>([]);
  activeTab = signal('overview');

  ngOnInit(): void {
    this.loadLoanDetail();
  }

  loadLoanDetail(): void {
    setTimeout(() => {
      this.loan.set({
        id: parseInt(this.id),
        loanAccountNumber: 'LN-2024-000123',
        applicationNumber: 'HLMS-2024-001220',
        customer: {
          id: 1,
          name: 'Rajesh Kumar',
          email: 'rajesh.kumar@email.com',
          phone: '+91 98765 43210'
        },
        loanType: 'Home Purchase',
        sanctionedAmount: 5000000,
        disbursedAmount: 5000000,
        outstandingPrincipal: 4850000,
        outstandingInterest: 12500,
        totalOutstanding: 4862500,
        emi: 43391,
        interestRate: 8.5,
        tenure: 240,
        remainingTenure: 238,
        disbursementDate: '2024-01-10',
        firstEmiDate: '2024-02-05',
        nextEmiDate: '2024-02-05',
        maturityDate: '2044-01-05',
        dpd: 0,
        status: 'REGULAR',
        principalPaid: 150000,
        interestPaid: 35000,
        totalPaid: 185000
      });

      this.emiSchedule.set([
        { installmentNo: 1, dueDate: '2024-02-05', emiAmount: 43391, principal: 8141, interest: 35250, balance: 4991859, status: 'DUE' },
        { installmentNo: 2, dueDate: '2024-03-05', emiAmount: 43391, principal: 8199, interest: 35192, balance: 4983660, status: 'UPCOMING' },
        { installmentNo: 3, dueDate: '2024-04-05', emiAmount: 43391, principal: 8257, interest: 35134, balance: 4975403, status: 'UPCOMING' },
        { installmentNo: 4, dueDate: '2024-05-05', emiAmount: 43391, principal: 8315, interest: 35076, balance: 4967088, status: 'UPCOMING' },
        { installmentNo: 5, dueDate: '2024-06-05', emiAmount: 43391, principal: 8374, interest: 35017, balance: 4958714, status: 'UPCOMING' }
      ]);

      this.payments.set([]);

      this.loading.set(false);
    }, 500);
  }

  getRepaymentPercent(): number {
    const l = this.loan();
    if (!l) return 0;
    return Math.round((l.principalPaid / l.sanctionedAmount) * 100);
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('en-IN');
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
