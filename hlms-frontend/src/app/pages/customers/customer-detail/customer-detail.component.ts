import { Component, OnInit, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule } from '@angular/material/core';
import { ApiService } from '../../../core/services/api.service';

interface CustomerDetail {
  id: number;
  customerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  panNumber: string;
  aadhaarNumber?: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  employmentType: string;
  employerName?: string;
  monthlyIncome: number;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  status: string;
  createdDate: string;
}

interface LoanSummary {
  id: number;
  applicationNumber: string;
  loanAmount: number;
  status: string;
  sanctionDate?: string;
  outstandingAmount?: number;
}

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatRippleModule
  ],
  template: `
    <div class="page-container">
      @if (loading()) {
        <div class="loading-state">
          <mat-spinner diameter="48"></mat-spinner>
        </div>
      } @else if (customer()) {
        <!-- Header -->
        <div class="page-header">
          <a routerLink="/customers" class="back-btn" matRipple>
            <mat-icon>arrow_back</mat-icon>
          </a>
          <div class="customer-header">
            <div class="avatar-large">{{ getInitials() }}</div>
            <div class="customer-meta">
              <h1>{{ customer()?.firstName }} {{ customer()?.lastName }}</h1>
              <span class="customer-id">{{ customer()?.customerId }}</span>
            </div>
          </div>
          <span class="status-badge" [attr.data-status]="customer()?.status?.toLowerCase()">
            {{ customer()?.status }}
          </span>
        </div>

        <!-- Tabs -->
        <mat-tab-group animationDuration="200ms" class="detail-tabs">
          <!-- Personal Info Tab -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>person</mat-icon>
              <span>Personal Info</span>
            </ng-template>

            <div class="tab-content">
              <div class="info-grid">
                <!-- Basic Info -->
                <div class="info-card">
                  <div class="card-header">
                    <mat-icon>badge</mat-icon>
                    <span>Basic Information</span>
                  </div>
                  <div class="card-content">
                    <div class="info-row">
                      <span>Full Name</span>
                      <strong>{{ customer()?.firstName }} {{ customer()?.lastName }}</strong>
                    </div>
                    <div class="info-row">
                      <span>Date of Birth</span>
                      <strong>{{ formatDate(customer()?.dateOfBirth) }}</strong>
                    </div>
                    <div class="info-row">
                      <span>Gender</span>
                      <strong>{{ customer()?.gender }}</strong>
                    </div>
                    <div class="info-row">
                      <span>Marital Status</span>
                      <strong>{{ customer()?.maritalStatus }}</strong>
                    </div>
                  </div>
                </div>

                <!-- Contact Info -->
                <div class="info-card">
                  <div class="card-header">
                    <mat-icon>contact_phone</mat-icon>
                    <span>Contact Information</span>
                  </div>
                  <div class="card-content">
                    <div class="info-row">
                      <span>Email</span>
                      <strong>{{ customer()?.email }}</strong>
                    </div>
                    <div class="info-row">
                      <span>Phone</span>
                      <strong>{{ customer()?.phone }}</strong>
                    </div>
                    @if (customer()?.alternatePhone) {
                      <div class="info-row">
                        <span>Alternate Phone</span>
                        <strong>{{ customer()?.alternatePhone }}</strong>
                      </div>
                    }
                  </div>
                </div>

                <!-- KYC Info -->
                <div class="info-card">
                  <div class="card-header">
                    <mat-icon>verified_user</mat-icon>
                    <span>KYC Details</span>
                  </div>
                  <div class="card-content">
                    <div class="info-row">
                      <span>PAN Number</span>
                      <strong class="mono">{{ customer()?.panNumber }}</strong>
                    </div>
                    @if (customer()?.aadhaarNumber) {
                      <div class="info-row">
                        <span>Aadhaar Number</span>
                        <strong class="mono">{{ maskAadhaar(customer()?.aadhaarNumber) }}</strong>
                      </div>
                    }
                  </div>
                </div>

                <!-- Employment Info -->
                <div class="info-card">
                  <div class="card-header">
                    <mat-icon>work</mat-icon>
                    <span>Employment Details</span>
                  </div>
                  <div class="card-content">
                    <div class="info-row">
                      <span>Employment Type</span>
                      <strong>{{ customer()?.employmentType }}</strong>
                    </div>
                    @if (customer()?.employerName) {
                      <div class="info-row">
                        <span>Employer</span>
                        <strong>{{ customer()?.employerName }}</strong>
                      </div>
                    }
                    <div class="info-row highlight">
                      <span>Monthly Income</span>
                      <strong>₹{{ formatCurrency(customer()?.monthlyIncome) }}</strong>
                    </div>
                  </div>
                </div>

                <!-- Address -->
                <div class="info-card wide">
                  <div class="card-header">
                    <mat-icon>location_on</mat-icon>
                    <span>Address</span>
                  </div>
                  <div class="card-content">
                    <p class="address-text">
                      {{ customer()?.address?.line1 }}
                      @if (customer()?.address?.line2) {, {{ customer()?.address?.line2 }}}
                      <br>
                      {{ customer()?.address?.city }}, {{ customer()?.address?.state }} - {{ customer()?.address?.pincode }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </mat-tab>

          <!-- Loans Tab -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>account_balance</mat-icon>
              <span>Loan History</span>
            </ng-template>

            <div class="tab-content">
              <div class="loans-table">
                <table>
                  <thead>
                    <tr>
                      <th>Application #</th>
                      <th>Loan Amount</th>
                      <th>Status</th>
                      <th>Sanction Date</th>
                      <th>Outstanding</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (loan of loans(); track loan.id) {
                      <tr>
                        <td>
                          <a [routerLink]="['/applications', loan.id]" class="loan-link">
                            {{ loan.applicationNumber }}
                          </a>
                        </td>
                        <td class="amount">₹{{ formatCurrency(loan.loanAmount) }}</td>
                        <td>
                          <span class="status-badge small" [attr.data-status]="loan.status.toLowerCase()">
                            {{ loan.status }}
                          </span>
                        </td>
                        <td>{{ loan.sanctionDate ? formatDate(loan.sanctionDate) : '-' }}</td>
                        <td class="amount">
                          {{ loan.outstandingAmount ? '₹' + formatCurrency(loan.outstandingAmount) : '-' }}
                        </td>
                      </tr>
                    } @empty {
                      <tr>
                        <td colspan="5" class="empty-state">
                          <mat-icon>folder_open</mat-icon>
                          <span>No loan applications found</span>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </mat-tab>
        </mat-tab-group>
      } @else {
        <div class="not-found">
          <mat-icon>person_off</mat-icon>
          <h2>Customer Not Found</h2>
          <p>The customer you're looking for doesn't exist or has been removed.</p>
          <a mat-flat-button color="primary" routerLink="/customers">
            <mat-icon>arrow_back</mat-icon>
            Back to Customers
          </a>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .loading-state {
      display: flex;
      justify-content: center;
      padding: 80px 0;
    }

    .page-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }

    .back-btn {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6b7280;
      background: white;
      border: 1px solid #e5e7eb;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .back-btn:hover {
      background: #f3f4f6;
      color: #1f2937;
    }

    .customer-header {
      display: flex;
      align-items: center;
      gap: 16px;
      flex: 1;
    }

    .avatar-large {
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, #1976d2, #1565c0);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 20px;
      font-weight: 700;
    }

    .customer-meta h1 {
      font-size: 24px;
      font-weight: 700;
      color: #1f2937;
      margin: 0;
    }

    .customer-id {
      font-size: 14px;
      color: #6b7280;
    }

    .status-badge {
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
    }

    .status-badge[data-status="active"] {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge[data-status="inactive"] {
      background: #f3f4f6;
      color: #6b7280;
    }

    .status-badge.small {
      padding: 4px 8px;
      font-size: 11px;
    }

    .status-badge[data-status="disbursed"],
    .status-badge[data-status="closed"] {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge[data-status="pending"],
    .status-badge[data-status="under_review"] {
      background: #fef3c7;
      color: #92400e;
    }

    .status-badge[data-status="rejected"] {
      background: #fee2e2;
      color: #991b1b;
    }

    ::ng-deep .detail-tabs {
      background: white;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      overflow: hidden;
    }

    ::ng-deep .detail-tabs .mat-mdc-tab-labels {
      background: #f9fafb;
      border-bottom: 1px solid #e5e7eb;
    }

    ::ng-deep .detail-tabs .mat-mdc-tab {
      min-width: 120px;
    }

    ::ng-deep .detail-tabs .mat-mdc-tab .mdc-tab__content {
      gap: 8px;
    }

    ::ng-deep .detail-tabs .mat-mdc-tab mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .tab-content {
      padding: 24px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    @media (max-width: 768px) {
      .info-grid {
        grid-template-columns: 1fr;
      }
    }

    .info-card {
      background: #f9fafb;
      border-radius: 10px;
      overflow: hidden;
    }

    .info-card.wide {
      grid-column: 1 / -1;
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: #f3f4f6;
      font-size: 14px;
      font-weight: 600;
      color: #4b5563;
    }

    .card-header mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #6b7280;
    }

    .card-content {
      padding: 16px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      font-size: 14px;
    }

    .info-row:not(:last-child) {
      border-bottom: 1px solid #e5e7eb;
    }

    .info-row span {
      color: #6b7280;
    }

    .info-row strong {
      color: #1f2937;
      text-align: right;
    }

    .info-row strong.mono {
      font-family: 'SF Mono', 'Monaco', monospace;
      font-size: 13px;
    }

    .info-row.highlight {
      background: #eff6ff;
      margin: 10px -16px -16px;
      padding: 12px 16px;
      border-radius: 0 0 10px 10px;
    }

    .info-row.highlight strong {
      color: #1976d2;
      font-size: 16px;
    }

    .address-text {
      color: #4b5563;
      line-height: 1.6;
      margin: 0;
    }

    .loans-table {
      background: white;
      border-radius: 8px;
      overflow: hidden;
    }

    .loans-table table {
      width: 100%;
      border-collapse: collapse;
    }

    .loans-table th {
      text-align: left;
      padding: 12px 16px;
      font-size: 12px;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      background: #f9fafb;
      border-bottom: 1px solid #e5e7eb;
    }

    .loans-table td {
      padding: 14px 16px;
      font-size: 14px;
      color: #4b5563;
      border-bottom: 1px solid #f3f4f6;
    }

    .loan-link {
      font-weight: 600;
      color: #1976d2;
      text-decoration: none;
    }

    .loan-link:hover {
      text-decoration: underline;
    }

    .amount {
      font-weight: 500;
      color: #1f2937;
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

    .not-found {
      text-align: center;
      padding: 80px 20px;
    }

    .not-found mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #d1d5db;
      margin-bottom: 16px;
    }

    .not-found h2 {
      font-size: 20px;
      font-weight: 600;
      color: #4b5563;
      margin: 0 0 8px 0;
    }

    .not-found p {
      color: #9ca3af;
      margin: 0 0 24px 0;
    }
  `]
})
export class CustomerDetailComponent implements OnInit {
  @Input() id!: string;

  customer = signal<CustomerDetail | null>(null);
  loans = signal<LoanSummary[]>([]);
  loading = signal(true);

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadCustomer();
  }

  loadCustomer(): void {
    this.apiService.get<CustomerDetail>(`/customers/${this.id}`).subscribe({
      next: (data) => {
        this.customer.set(data);
        this.loadLoans();
      },
      error: () => {
        // Mock data
        this.customer.set({
          id: parseInt(this.id),
          customerId: 'CUST-00001',
          firstName: 'Rajesh',
          lastName: 'Kumar',
          email: 'rajesh.kumar@email.com',
          phone: '+91 98765 43210',
          panNumber: 'ABCDE1234F',
          aadhaarNumber: '123456789012',
          dateOfBirth: '1985-06-15',
          gender: 'Male',
          maritalStatus: 'Married',
          employmentType: 'Salaried',
          employerName: 'Tech Solutions Pvt Ltd',
          monthlyIncome: 150000,
          address: {
            line1: '123, ABC Apartments',
            line2: 'Near City Mall, Andheri West',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400058'
          },
          status: 'ACTIVE',
          createdDate: '2024-01-10T10:00:00'
        });
        this.loans.set([
          { id: 1, applicationNumber: 'HLMS-2024-001234', loanAmount: 5000000, status: 'DISBURSED', sanctionDate: '2024-01-15', outstandingAmount: 4800000 },
          { id: 2, applicationNumber: 'HLMS-2023-000456', loanAmount: 2000000, status: 'CLOSED', sanctionDate: '2023-03-10', outstandingAmount: 0 }
        ]);
        this.loading.set(false);
      }
    });
  }

  loadLoans(): void {
    this.apiService.get<LoanSummary[]>(`/customers/${this.id}/loans`).subscribe({
      next: (data) => {
        this.loans.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  getInitials(): string {
    const c = this.customer();
    if (!c) return 'U';
    return (c.firstName[0] + c.lastName[0]).toUpperCase();
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  formatCurrency(value?: number): string {
    if (!value) return '0';
    return value.toLocaleString('en-IN');
  }

  maskAadhaar(aadhaar?: string): string {
    if (!aadhaar || aadhaar.length < 12) return aadhaar || '';
    return 'XXXX XXXX ' + aadhaar.substring(8);
  }
}
