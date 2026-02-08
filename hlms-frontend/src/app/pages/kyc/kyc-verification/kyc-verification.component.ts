import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface KycApplication {
  id: number;
  applicationNumber: string;
  customerName: string;
  panNumber: string;
  aadhaarNumber: string;
  kycStatus: 'pending' | 'in_progress' | 'verified' | 'rejected';
  panVerified: boolean;
  aadhaarVerified: boolean;
  bankVerified: boolean;
  photoMatched: boolean;
  submittedDate: string;
  assignedTo?: string;
}

@Component({
  selector: 'app-kyc-verification',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page-container">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <h1>KYC Verification</h1>
          <p>Verify customer identity documents and perform e-KYC</p>
        </div>
        <div class="header-stats">
          <div class="stat-badge pending">
            <span class="count">{{ getPendingCount() }}</span>
            <span class="label">Pending</span>
          </div>
          <div class="stat-badge in-progress">
            <span class="count">{{ getInProgressCount() }}</span>
            <span class="label">In Progress</span>
          </div>
          <div class="stat-badge verified">
            <span class="count">{{ getVerifiedCount() }}</span>
            <span class="label">Verified</span>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters-bar">
        <div class="search-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" placeholder="Search by name, PAN, or application..." [(ngModel)]="searchTerm" (input)="filterApplications()">
        </div>
        <div class="filter-tabs">
          <button [class.active]="activeFilter === 'all'" (click)="setFilter('all')">All</button>
          <button [class.active]="activeFilter === 'pending'" (click)="setFilter('pending')">Pending</button>
          <button [class.active]="activeFilter === 'in_progress'" (click)="setFilter('in_progress')">In Progress</button>
          <button [class.active]="activeFilter === 'verified'" (click)="setFilter('verified')">Verified</button>
          <button [class.active]="activeFilter === 'rejected'" (click)="setFilter('rejected')">Rejected</button>
        </div>
      </div>

      <!-- KYC Queue -->
      <div class="kyc-table">
        <table>
          <thead>
            <tr>
              <th>Application</th>
              <th>Customer</th>
              <th>PAN</th>
              <th>Aadhaar</th>
              <th>Verification Status</th>
              <th>Overall</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (app of filteredApplications(); track app.id) {
              <tr>
                <td>
                  <div class="app-info">
                    <span class="app-number">{{ app.applicationNumber }}</span>
                    <span class="app-date">{{ app.submittedDate }}</span>
                  </div>
                </td>
                <td>
                  <span class="customer-name">{{ app.customerName }}</span>
                </td>
                <td>
                  <span class="masked-id">{{ maskPan(app.panNumber) }}</span>
                </td>
                <td>
                  <span class="masked-id">{{ maskAadhaar(app.aadhaarNumber) }}</span>
                </td>
                <td>
                  <div class="verification-checks">
                    <span class="check-item" [class.verified]="app.panVerified" [class.pending]="!app.panVerified">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        @if (app.panVerified) {
                          <path d="M20 6L9 17l-5-5"/>
                        } @else {
                          <circle cx="12" cy="12" r="10"/>
                        }
                      </svg>
                      PAN
                    </span>
                    <span class="check-item" [class.verified]="app.aadhaarVerified" [class.pending]="!app.aadhaarVerified">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        @if (app.aadhaarVerified) {
                          <path d="M20 6L9 17l-5-5"/>
                        } @else {
                          <circle cx="12" cy="12" r="10"/>
                        }
                      </svg>
                      Aadhaar
                    </span>
                    <span class="check-item" [class.verified]="app.bankVerified" [class.pending]="!app.bankVerified">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        @if (app.bankVerified) {
                          <path d="M20 6L9 17l-5-5"/>
                        } @else {
                          <circle cx="12" cy="12" r="10"/>
                        }
                      </svg>
                      Bank
                    </span>
                    <span class="check-item" [class.verified]="app.photoMatched" [class.pending]="!app.photoMatched">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        @if (app.photoMatched) {
                          <path d="M20 6L9 17l-5-5"/>
                        } @else {
                          <circle cx="12" cy="12" r="10"/>
                        }
                      </svg>
                      Photo
                    </span>
                  </div>
                </td>
                <td>
                  <span class="status-badge" [class]="app.kycStatus">
                    {{ getStatusLabel(app.kycStatus) }}
                  </span>
                </td>
                <td>
                  <div class="action-buttons">
                    <a [routerLink]="['/kyc', app.id]" class="btn-verify">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 12l2 2 4-4"/>
                        <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
                      </svg>
                      Verify
                    </a>
                  </div>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="7" class="empty-state">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="9" y1="15" x2="15" y2="15"/>
                  </svg>
                  <p>No applications found</p>
                </td>
              </tr>
            }
          </tbody>
        </table>
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
      gap: 12px;
    }

    .stat-badge {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 12px 20px;
      border-radius: 10px;
      min-width: 80px;
    }

    .stat-badge.pending { background: #fef3c7; }
    .stat-badge.in-progress { background: #dbeafe; }
    .stat-badge.verified { background: #d1fae5; }

    .stat-badge .count {
      font-size: 20px;
      font-weight: 700;
      color: #1f2937;
    }

    .stat-badge .label {
      font-size: 11px;
      color: #6b7280;
      text-transform: uppercase;
    }

    .filters-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      gap: 16px;
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: 10px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 10px 14px;
      width: 320px;
    }

    .search-box svg { color: #9ca3af; }

    .search-box input {
      border: none;
      outline: none;
      font-size: 14px;
      width: 100%;
    }

    .filter-tabs {
      display: flex;
      gap: 8px;
    }

    .filter-tabs button {
      padding: 8px 16px;
      border: 1px solid #e5e7eb;
      background: white;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      color: #6b7280;
      cursor: pointer;
      transition: all 0.15s;
    }

    .filter-tabs button:hover {
      border-color: #d1d5db;
      color: #374151;
    }

    .filter-tabs button.active {
      background: #1976d2;
      border-color: #1976d2;
      color: white;
    }

    .kyc-table {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      overflow: hidden;
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
      padding: 16px;
      font-size: 14px;
      color: #374151;
      border-bottom: 1px solid #f3f4f6;
    }

    tr:last-child td { border-bottom: none; }

    .app-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .app-number {
      font-weight: 600;
      color: #1976d2;
    }

    .app-date {
      font-size: 12px;
      color: #9ca3af;
    }

    .customer-name {
      font-weight: 500;
    }

    .masked-id {
      font-family: monospace;
      font-size: 13px;
      color: #6b7280;
    }

    .verification-checks {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .check-item {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 500;
    }

    .check-item.verified {
      background: #d1fae5;
      color: #065f46;
    }

    .check-item.pending {
      background: #f3f4f6;
      color: #6b7280;
    }

    .status-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-badge.pending {
      background: #fef3c7;
      color: #92400e;
    }

    .status-badge.in_progress {
      background: #dbeafe;
      color: #1e40af;
    }

    .status-badge.verified {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge.rejected {
      background: #fee2e2;
      color: #991b1b;
    }

    .btn-verify {
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
      transition: background 0.15s;
    }

    .btn-verify:hover {
      background: #1565c0;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px !important;
      color: #9ca3af;
    }

    .empty-state svg {
      margin-bottom: 12px;
      opacity: 0.5;
    }

    .empty-state p {
      margin: 0;
      font-size: 14px;
    }

    @media (max-width: 1024px) {
      .page-header {
        flex-direction: column;
        gap: 16px;
      }

      .filters-bar {
        flex-direction: column;
        align-items: stretch;
      }

      .search-box {
        width: 100%;
      }

      .filter-tabs {
        overflow-x: auto;
      }
    }
  `]
})
export class KycVerificationComponent {
  searchTerm = '';
  activeFilter: 'all' | 'pending' | 'in_progress' | 'verified' | 'rejected' = 'all';

  applications: KycApplication[] = [
    { id: 1, applicationNumber: 'APP-2024-1542', customerName: 'Rajesh Kumar', panNumber: 'ABCPK1234A', aadhaarNumber: '123456789012', kycStatus: 'pending', panVerified: false, aadhaarVerified: false, bankVerified: false, photoMatched: false, submittedDate: '2024-02-08' },
    { id: 2, applicationNumber: 'APP-2024-1538', customerName: 'Priya Sharma', panNumber: 'DEFPS5678B', aadhaarNumber: '234567890123', kycStatus: 'in_progress', panVerified: true, aadhaarVerified: true, bankVerified: false, photoMatched: false, submittedDate: '2024-02-07' },
    { id: 3, applicationNumber: 'APP-2024-1535', customerName: 'Amit Patel', panNumber: 'GHIAP9012C', aadhaarNumber: '345678901234', kycStatus: 'verified', panVerified: true, aadhaarVerified: true, bankVerified: true, photoMatched: true, submittedDate: '2024-02-06' },
    { id: 4, applicationNumber: 'APP-2024-1530', customerName: 'Sneha Gupta', panNumber: 'JKLSG3456D', aadhaarNumber: '456789012345', kycStatus: 'in_progress', panVerified: true, aadhaarVerified: false, bankVerified: true, photoMatched: false, submittedDate: '2024-02-05' },
    { id: 5, applicationNumber: 'APP-2024-1525', customerName: 'Vikram Singh', panNumber: 'MNOVS7890E', aadhaarNumber: '567890123456', kycStatus: 'rejected', panVerified: true, aadhaarVerified: false, bankVerified: false, photoMatched: false, submittedDate: '2024-02-04' },
    { id: 6, applicationNumber: 'APP-2024-1520', customerName: 'Neha Verma', panNumber: 'PQRNV2345F', aadhaarNumber: '678901234567', kycStatus: 'pending', panVerified: false, aadhaarVerified: false, bankVerified: false, photoMatched: false, submittedDate: '2024-02-03' },
    { id: 7, applicationNumber: 'APP-2024-1515', customerName: 'Arjun Reddy', panNumber: 'STUAR6789G', aadhaarNumber: '789012345678', kycStatus: 'verified', panVerified: true, aadhaarVerified: true, bankVerified: true, photoMatched: true, submittedDate: '2024-02-02' },
  ];

  filteredApplications = signal<KycApplication[]>(this.applications);

  filterApplications(): void {
    let filtered = this.applications;

    if (this.activeFilter !== 'all') {
      filtered = filtered.filter(app => app.kycStatus === this.activeFilter);
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(app =>
        app.customerName.toLowerCase().includes(term) ||
        app.applicationNumber.toLowerCase().includes(term) ||
        app.panNumber.toLowerCase().includes(term)
      );
    }

    this.filteredApplications.set(filtered);
  }

  setFilter(filter: 'all' | 'pending' | 'in_progress' | 'verified' | 'rejected'): void {
    this.activeFilter = filter;
    this.filterApplications();
  }

  maskPan(pan: string): string {
    return pan.substring(0, 4) + '****' + pan.substring(8);
  }

  maskAadhaar(aadhaar: string): string {
    return '****-****-' + aadhaar.substring(8);
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'Pending',
      in_progress: 'In Progress',
      verified: 'Verified',
      rejected: 'Rejected'
    };
    return labels[status] || status;
  }

  getPendingCount(): number {
    return this.applications.filter(a => a.kycStatus === 'pending').length;
  }

  getInProgressCount(): number {
    return this.applications.filter(a => a.kycStatus === 'in_progress').length;
  }

  getVerifiedCount(): number {
    return this.applications.filter(a => a.kycStatus === 'verified').length;
  }
}
