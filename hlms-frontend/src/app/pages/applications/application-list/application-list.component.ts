import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';

interface Application {
  id: number;
  applicationNumber: string;
  customerName: string;
  customerId: string;
  loanType: string;
  loanAmount: number;
  tenure: number;
  interestRate: number;
  status: string;
  stage: string;
  createdDate: string;
  lastUpdated: string;
}

@Component({
  selector: 'app-application-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="page-container">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1>Loan Applications</h1>
          <p>Track and manage loan applications through their lifecycle</p>
        </div>
        <a routerLink="/applications/new" class="btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          New Application
        </a>
      </div>

      <!-- Filters -->
      <div class="filters-section">
        <div class="search-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" [formControl]="searchControl" placeholder="Search applications...">
        </div>

        <select [formControl]="statusControl" class="filter-select">
          <option value="">All Statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="PENDING">Pending</option>
          <option value="UNDER_REVIEW">Under Review</option>
          <option value="APPROVED">Approved</option>
          <option value="SANCTIONED">Sanctioned</option>
          <option value="DISBURSED">Disbursed</option>
          <option value="REJECTED">Rejected</option>
        </select>

        <select [formControl]="loanTypeControl" class="filter-select">
          <option value="">All Types</option>
          <option value="HOME_LOAN">Home Loan</option>
          <option value="HOME_CONSTRUCTION">Home Construction</option>
          <option value="HOME_IMPROVEMENT">Home Improvement</option>
          <option value="LAND_PURCHASE">Land Purchase</option>
        </select>
      </div>

      <!-- Table -->
      <div class="table-card">
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
                  <th>Loan Details</th>
                  <th>Status</th>
                  <th>Stage</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (app of applications(); track app.id) {
                  <tr>
                    <td>
                      <a [routerLink]="['/applications', app.id]" class="app-link">{{ app.applicationNumber }}</a>
                      <span class="sub-text">{{ formatDate(app.createdDate) }}</span>
                    </td>
                    <td>
                      <span class="customer-name">{{ app.customerName }}</span>
                      <span class="sub-text">{{ app.customerId }}</span>
                    </td>
                    <td>
                      <span class="amount">₹{{ formatCurrency(app.loanAmount) }}</span>
                      <span class="sub-text">{{ app.tenure }}mo &#64; {{ app.interestRate }}%</span>
                    </td>
                    <td>
                      <span class="status-badge" [attr.data-status]="app.status.toLowerCase()">
                        {{ formatStatus(app.status) }}
                      </span>
                    </td>
                    <td class="stage-cell">{{ formatStage(app.stage) }}</td>
                    <td class="date-cell">{{ formatDate(app.lastUpdated) }}</td>
                    <td>
                      <div class="actions">
                        <a [routerLink]="['/applications', app.id]" class="action-btn" title="View">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        </a>
                        @if (app.status === 'DRAFT' || app.status === 'PENDING') {
                          <a [routerLink]="['/applications', app.id]" class="action-btn" title="Edit">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                          </a>
                        }
                      </div>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="7" class="empty-state">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                        <polyline points="13 2 13 9 20 9"></polyline>
                      </svg>
                      <span>No applications found</span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="pagination">
            <span class="pagination-info">
              Showing {{ applications().length }} of {{ totalElements() }} applications
            </span>
            <div class="pagination-controls">
              <button (click)="prevPage()" [disabled]="pageIndex() === 0" class="page-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <span class="page-number">Page {{ pageIndex() + 1 }}</span>
              <button (click)="nextPage()" [disabled]="(pageIndex() + 1) * pageSize() >= totalElements()" class="page-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
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

    .page-header h1 {
      font-size: 24px;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 4px;
    }

    .page-header p {
      font-size: 14px;
      color: #6b7280;
      margin: 0;
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      height: 42px;
      padding: 0 18px;
      background: linear-gradient(135deg, #1976d2, #1565c0);
      color: white;
      font-size: 14px;
      font-weight: 500;
      border-radius: 8px;
      text-decoration: none;
      box-shadow: 0 2px 8px rgba(25, 118, 210, 0.3);
      transition: all 0.15s;
    }

    .btn-primary:hover {
      box-shadow: 0 4px 12px rgba(25, 118, 210, 0.4);
      transform: translateY(-1px);
    }

    .filters-section {
      display: flex;
      gap: 12px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
      min-width: 250px;
      max-width: 350px;
      height: 42px;
      padding: 0 14px;
      background: white;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      transition: all 0.15s;
    }

    .search-box:focus-within {
      border-color: #1976d2;
      box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
    }

    .search-box svg {
      color: #9ca3af;
      flex-shrink: 0;
    }

    .search-box input {
      flex: 1;
      height: 100%;
      border: none;
      outline: none;
      font-size: 14px;
      color: #1f2937;
      background: transparent;
    }

    .search-box input::placeholder {
      color: #9ca3af;
    }

    .filter-select {
      height: 42px;
      padding: 0 12px;
      min-width: 150px;
      font-size: 14px;
      color: #1f2937;
      background: white;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      outline: none;
      cursor: pointer;
      transition: all 0.15s;
    }

    .filter-select:focus {
      border-color: #1976d2;
      box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
    }

    .table-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      overflow: hidden;
    }

    .loading-state {
      display: flex;
      justify-content: center;
      padding: 60px;
    }

    .spinner {
      width: 32px;
      height: 32px;
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
      letter-spacing: 0.05em;
      background: #f9fafb;
      border-bottom: 1px solid #e5e7eb;
      white-space: nowrap;
    }

    td {
      padding: 14px 16px;
      font-size: 14px;
      color: #4b5563;
      border-bottom: 1px solid #f3f4f6;
      vertical-align: top;
    }

    tr:hover td {
      background: #f9fafb;
    }

    .app-link {
      font-weight: 600;
      color: #1976d2;
      text-decoration: none;
      display: block;
    }

    .app-link:hover {
      text-decoration: underline;
    }

    .sub-text {
      font-size: 12px;
      color: #9ca3af;
      display: block;
      margin-top: 2px;
    }

    .customer-name {
      font-weight: 500;
      color: #1f2937;
      display: block;
    }

    .amount {
      font-weight: 600;
      color: #1f2937;
      display: block;
    }

    .status-badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
    }

    .status-badge[data-status="pending"],
    .status-badge[data-status="under_review"],
    .status-badge[data-status="draft"] {
      background: #fef3c7;
      color: #92400e;
    }

    .status-badge[data-status="approved"],
    .status-badge[data-status="sanctioned"],
    .status-badge[data-status="disbursed"] {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge[data-status="rejected"] {
      background: #fee2e2;
      color: #991b1b;
    }

    .stage-cell {
      font-size: 13px;
      color: #6b7280;
    }

    .date-cell {
      white-space: nowrap;
      color: #6b7280;
    }

    .actions {
      display: flex;
      gap: 4px;
    }

    .action-btn {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      color: #6b7280;
      transition: all 0.15s;
    }

    .action-btn:hover {
      background: #f3f4f6;
      color: #1976d2;
    }

    .empty-state {
      text-align: center;
      padding: 60px 16px !important;
      color: #9ca3af;
    }

    .empty-state svg {
      margin-bottom: 12px;
    }

    .empty-state span {
      display: block;
      font-size: 14px;
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
      align-items: center;
      gap: 8px;
    }

    .page-btn {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      color: #6b7280;
      cursor: pointer;
      transition: all 0.15s;
    }

    .page-btn:hover:not(:disabled) {
      background: #f9fafb;
      color: #1f2937;
    }

    .page-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .page-number {
      font-size: 14px;
      color: #4b5563;
      padding: 0 8px;
    }
  `]
})
export class ApplicationListComponent implements OnInit {
  applications = signal<Application[]>([]);
  loading = signal(true);
  totalElements = signal(0);
  pageSize = signal(20);
  pageIndex = signal(0);

  searchControl = new FormControl('');
  statusControl = new FormControl('');
  loanTypeControl = new FormControl('');

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadApplications();

    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.resetAndLoad());

    this.statusControl.valueChanges.subscribe(() => this.resetAndLoad());
    this.loanTypeControl.valueChanges.subscribe(() => this.resetAndLoad());
  }

  resetAndLoad(): void {
    this.pageIndex.set(0);
    this.loadApplications();
  }

  loadApplications(): void {
    this.loading.set(true);

    const filters: Record<string, string> = {};
    if (this.searchControl.value) filters['search'] = this.searchControl.value;
    if (this.statusControl.value) filters['status'] = this.statusControl.value;
    if (this.loanTypeControl.value) filters['loanType'] = this.loanTypeControl.value;

    this.apiService.getPage<Application>(
      '/applications',
      { page: this.pageIndex(), size: this.pageSize(), sort: 'createdDate,desc' },
      filters
    ).subscribe({
      next: (response) => {
        this.applications.set(response.content);
        this.totalElements.set(response.totalElements);
        this.loading.set(false);
      },
      error: () => {
        // Mock data
        this.applications.set([
          { id: 1, applicationNumber: 'HLMS-2024-001234', customerName: 'Rajesh Kumar', customerId: 'CUST-00001', loanType: 'HOME_LOAN', loanAmount: 5000000, tenure: 240, interestRate: 8.5, status: 'PENDING', stage: 'CREDIT_APPRAISAL', createdDate: '2024-01-15T10:30:00', lastUpdated: '2024-01-16T14:20:00' },
          { id: 2, applicationNumber: 'HLMS-2024-001233', customerName: 'Priya Sharma', customerId: 'CUST-00002', loanType: 'HOME_LOAN', loanAmount: 3500000, tenure: 180, interestRate: 8.25, status: 'APPROVED', stage: 'SANCTION', createdDate: '2024-01-14T14:20:00', lastUpdated: '2024-01-17T09:00:00' },
          { id: 3, applicationNumber: 'HLMS-2024-001232', customerName: 'Amit Patel', customerId: 'CUST-00003', loanType: 'HOME_CONSTRUCTION', loanAmount: 7500000, tenure: 240, interestRate: 8.75, status: 'DISBURSED', stage: 'DISBURSEMENT', createdDate: '2024-01-13T09:15:00', lastUpdated: '2024-01-18T11:30:00' },
          { id: 4, applicationNumber: 'HLMS-2024-001231', customerName: 'Sneha Reddy', customerId: 'CUST-00004', loanType: 'HOME_LOAN', loanAmount: 4200000, tenure: 180, interestRate: 8.5, status: 'UNDER_REVIEW', stage: 'LEGAL_VERIFICATION', createdDate: '2024-01-12T16:45:00', lastUpdated: '2024-01-15T10:00:00' },
          { id: 5, applicationNumber: 'HLMS-2024-001230', customerName: 'Vikram Singh', customerId: 'CUST-00005', loanType: 'HOME_IMPROVEMENT', loanAmount: 1500000, tenure: 120, interestRate: 9.0, status: 'REJECTED', stage: 'CREDIT_APPRAISAL', createdDate: '2024-01-11T11:00:00', lastUpdated: '2024-01-14T15:30:00' }
        ]);
        this.totalElements.set(5);
        this.loading.set(false);
      }
    });
  }

  prevPage(): void {
    if (this.pageIndex() > 0) {
      this.pageIndex.update(p => p - 1);
      this.loadApplications();
    }
  }

  nextPage(): void {
    if ((this.pageIndex() + 1) * this.pageSize() < this.totalElements()) {
      this.pageIndex.update(p => p + 1);
      this.loadApplications();
    }
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

  formatStage(stage: string): string {
    return stage.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }
}
