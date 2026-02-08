import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';

interface Customer {
  id: number;
  customerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  panNumber: string;
  city: string;
  status: string;
  createdDate: string;
}

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule
  ],
  template: `
    <div class="page-container">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <h1>Customers</h1>
          <p>Manage customer profiles and loan history</p>
        </div>
      </div>

      <!-- Search Box -->
      <div class="search-section">
        <div class="search-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
          <input
            type="text"
            [formControl]="searchControl"
            placeholder="Search by name, email, PAN, or phone..."
          >
          @if (searchControl.value) {
            <button type="button" class="clear-btn" (click)="searchControl.setValue('')">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          }
        </div>
      </div>

      <!-- Customer Table -->
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
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>PAN</th>
                  <th>City</th>
                  <th>Status</th>
                  <th class="actions-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (customer of customers(); track customer.id) {
                  <tr>
                    <td>
                      <div class="customer-cell">
                        <div class="avatar">{{ getInitials(customer.firstName, customer.lastName) }}</div>
                        <div class="customer-info">
                          <a [routerLink]="['/customers', customer.id]" class="customer-name">
                            {{ customer.firstName }} {{ customer.lastName }}
                          </a>
                          <span class="customer-id">{{ customer.customerId }}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="contact-cell">
                        <span class="email">{{ customer.email }}</span>
                        <span class="phone">{{ customer.phone }}</span>
                      </div>
                    </td>
                    <td class="pan-cell">{{ maskPan(customer.panNumber) }}</td>
                    <td>{{ customer.city }}</td>
                    <td>
                      <span class="status-badge" [attr.data-status]="customer.status.toLowerCase()">
                        {{ customer.status }}
                      </span>
                    </td>
                    <td class="actions-col">
                      <a [routerLink]="['/customers', customer.id]" class="action-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </a>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="6" class="empty-state">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <circle cx="19" cy="11" r="2.5"></circle>
                        <path d="m21.7 13.7-2.4 2.4"></path>
                      </svg>
                      <span>No customers found</span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Custom Pagination -->
          <div class="pagination">
            <div class="pagination-info">
              Showing {{ getStartIndex() }}-{{ getEndIndex() }} of {{ totalElements() }} customers
            </div>
            <div class="pagination-controls">
              <select [value]="pageSize()" (change)="onPageSizeChange($event)" class="page-size-select">
                <option value="10">10 per page</option>
                <option value="20">20 per page</option>
                <option value="50">50 per page</option>
              </select>
              <div class="page-buttons">
                <button
                  class="page-btn"
                  [disabled]="pageIndex() === 0"
                  (click)="goToPage(0)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="11 17 6 12 11 7"></polyline>
                    <polyline points="18 17 13 12 18 7"></polyline>
                  </svg>
                </button>
                <button
                  class="page-btn"
                  [disabled]="pageIndex() === 0"
                  (click)="goToPage(pageIndex() - 1)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                <span class="page-indicator">Page {{ pageIndex() + 1 }} of {{ getTotalPages() }}</span>
                <button
                  class="page-btn"
                  [disabled]="pageIndex() >= getTotalPages() - 1"
                  (click)="goToPage(pageIndex() + 1)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
                <button
                  class="page-btn"
                  [disabled]="pageIndex() >= getTotalPages() - 1"
                  (click)="goToPage(getTotalPages() - 1)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="13 17 18 12 13 7"></polyline>
                    <polyline points="6 17 11 12 6 7"></polyline>
                  </svg>
                </button>
              </div>
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

    .search-section {
      margin-bottom: 20px;
    }

    .search-box {
      position: relative;
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
      height: 48px;
      padding: 0 44px 0 44px;
      font-size: 14px;
      color: #1f2937;
      background: white;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      outline: none;
      transition: all 0.15s ease;
    }

    .search-box input::placeholder {
      color: #9ca3af;
    }

    .search-box input:focus {
      border-color: #1976d2;
      box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
    }

    .clear-btn {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      border-radius: 6px;
      color: #9ca3af;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .clear-btn:hover {
      background: #f3f4f6;
      color: #6b7280;
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
      letter-spacing: 0.05em;
      background: #f9fafb;
      border-bottom: 1px solid #e5e7eb;
    }

    td {
      padding: 14px 16px;
      font-size: 14px;
      color: #4b5563;
      border-bottom: 1px solid #f3f4f6;
      vertical-align: middle;
    }

    tr:hover td {
      background: #f9fafb;
    }

    .customer-cell {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .avatar {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #1976d2, #1565c0);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 14px;
      font-weight: 600;
      flex-shrink: 0;
    }

    .customer-info {
      display: flex;
      flex-direction: column;
    }

    .customer-name {
      font-weight: 600;
      color: #1976d2;
      text-decoration: none;
    }

    .customer-name:hover {
      text-decoration: underline;
    }

    .customer-id {
      font-size: 12px;
      color: #9ca3af;
    }

    .contact-cell {
      display: flex;
      flex-direction: column;
    }

    .email {
      color: #4b5563;
    }

    .phone {
      font-size: 12px;
      color: #9ca3af;
    }

    .pan-cell {
      font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
      font-size: 13px;
      color: #6b7280;
    }

    .status-badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-badge[data-status="active"] {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge[data-status="inactive"] {
      background: #f3f4f6;
      color: #6b7280;
    }

    .actions-col {
      width: 60px;
      text-align: center;
    }

    .action-btn {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #6b7280;
      transition: all 0.15s ease;
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

    /* Custom Pagination */
    .pagination {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border-top: 1px solid #e5e7eb;
      background: #f9fafb;
    }

    .pagination-info {
      font-size: 14px;
      color: #6b7280;
    }

    .pagination-controls {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .page-size-select {
      height: 36px;
      padding: 0 32px 0 12px;
      font-size: 14px;
      color: #4b5563;
      background: white;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      cursor: pointer;
      outline: none;
      appearance: none;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
      background-position: right 8px center;
      background-repeat: no-repeat;
      background-size: 16px;
    }

    .page-size-select:focus {
      border-color: #1976d2;
    }

    .page-buttons {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .page-btn {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      color: #4b5563;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .page-btn:hover:not(:disabled) {
      background: #f3f4f6;
      border-color: #9ca3af;
    }

    .page-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .page-indicator {
      font-size: 14px;
      color: #4b5563;
      padding: 0 12px;
      min-width: 120px;
      text-align: center;
    }
  `]
})
export class CustomerListComponent implements OnInit {
  customers = signal<Customer[]>([]);
  loading = signal(true);
  totalElements = signal(0);
  pageSize = signal(20);
  pageIndex = signal(0);

  searchControl = new FormControl('');

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadCustomers();

    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.pageIndex.set(0);
        this.loadCustomers();
      });
  }

  loadCustomers(): void {
    this.loading.set(true);
    const filters: Record<string, string> = {};
    if (this.searchControl.value) filters['search'] = this.searchControl.value;

    this.apiService.getPage<Customer>(
      '/customers',
      { page: this.pageIndex(), size: this.pageSize(), sort: 'createdDate,desc' },
      filters
    ).subscribe({
      next: (response) => {
        this.customers.set(response.content);
        this.totalElements.set(response.totalElements);
        this.loading.set(false);
      },
      error: () => {
        // Mock data
        this.customers.set([
          { id: 1, customerId: 'CUST-00001', firstName: 'Rajesh', lastName: 'Kumar', email: 'rajesh.kumar@email.com', phone: '+91 98765 43210', panNumber: 'ABCDE1234F', city: 'Mumbai', status: 'ACTIVE', createdDate: '2024-01-10' },
          { id: 2, customerId: 'CUST-00002', firstName: 'Priya', lastName: 'Sharma', email: 'priya.sharma@email.com', phone: '+91 98765 43211', panNumber: 'FGHIJ5678K', city: 'Delhi', status: 'ACTIVE', createdDate: '2024-01-09' },
          { id: 3, customerId: 'CUST-00003', firstName: 'Amit', lastName: 'Patel', email: 'amit.patel@email.com', phone: '+91 98765 43212', panNumber: 'KLMNO9012P', city: 'Ahmedabad', status: 'ACTIVE', createdDate: '2024-01-08' },
          { id: 4, customerId: 'CUST-00004', firstName: 'Sneha', lastName: 'Reddy', email: 'sneha.reddy@email.com', phone: '+91 98765 43213', panNumber: 'PQRST3456U', city: 'Hyderabad', status: 'ACTIVE', createdDate: '2024-01-07' },
          { id: 5, customerId: 'CUST-00005', firstName: 'Vikram', lastName: 'Singh', email: 'vikram.singh@email.com', phone: '+91 98765 43214', panNumber: 'UVWXY7890Z', city: 'Bangalore', status: 'INACTIVE', createdDate: '2024-01-06' }
        ]);
        this.totalElements.set(5);
        this.loading.set(false);
      }
    });
  }

  onPageSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.pageSize.set(parseInt(select.value, 10));
    this.pageIndex.set(0);
    this.loadCustomers();
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.getTotalPages()) {
      this.pageIndex.set(page);
      this.loadCustomers();
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.totalElements() / this.pageSize()) || 1;
  }

  getStartIndex(): number {
    return this.totalElements() === 0 ? 0 : this.pageIndex() * this.pageSize() + 1;
  }

  getEndIndex(): number {
    const end = (this.pageIndex() + 1) * this.pageSize();
    return Math.min(end, this.totalElements());
  }

  getInitials(firstName: string, lastName: string): string {
    return (firstName[0] + lastName[0]).toUpperCase();
  }

  maskPan(pan: string): string {
    if (!pan || pan.length < 10) return pan;
    return pan.substring(0, 4) + '****' + pan.substring(8);
  }
}
