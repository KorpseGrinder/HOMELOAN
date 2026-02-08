import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

interface User {
  id: number;
  employeeId: string;
  name: string;
  email: string;
  role: string;
  branch: string;
  department: string;
  status: 'ACTIVE' | 'INACTIVE' | 'LOCKED';
  lastLogin: string;
  createdDate: string;
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page-container">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <h1>User Management</h1>
          <p>Manage system users and their access</p>
        </div>
        <button class="btn-primary" (click)="openAddUserModal()">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <line x1="19" y1="8" x2="19" y2="14"/>
            <line x1="22" y1="11" x2="16" y2="11"/>
          </svg>
          Add User
        </button>
      </div>

      <!-- Filters -->
      <div class="filters-section">
        <div class="search-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
          <input type="text" [formControl]="searchControl" placeholder="Search by name or email...">
        </div>
        <select [formControl]="roleControl" class="filter-select">
          <option value="">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="BRANCH_MANAGER">Branch Manager</option>
          <option value="CREDIT_OFFICER">Credit Officer</option>
          <option value="RELATIONSHIP_MANAGER">Relationship Manager</option>
          <option value="VERIFIER">Verifier</option>
          <option value="COLLECTION_OFFICER">Collection Officer</option>
        </select>
        <select [formControl]="statusControl" class="filter-select">
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="LOCKED">Locked</option>
        </select>
      </div>

      <!-- Users Table -->
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
                  <th>User</th>
                  <th>Role</th>
                  <th>Branch</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (user of users(); track user.id) {
                  <tr>
                    <td>
                      <div class="user-cell">
                        <div class="avatar">{{ getInitials(user.name) }}</div>
                        <div class="user-info">
                          <span class="user-name">{{ user.name }}</span>
                          <span class="user-email">{{ user.email }}</span>
                          <span class="user-id">{{ user.employeeId }}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="role-badge">{{ formatRole(user.role) }}</span>
                    </td>
                    <td>{{ user.branch }}</td>
                    <td>{{ user.department }}</td>
                    <td>
                      <span class="status-badge" [attr.data-status]="user.status.toLowerCase()">
                        {{ user.status }}
                      </span>
                    </td>
                    <td class="date-cell">{{ formatDate(user.lastLogin) }}</td>
                    <td>
                      <div class="action-buttons">
                        <button class="icon-btn" title="Edit" (click)="editUser(user)">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        @if (user.status === 'ACTIVE') {
                          <button class="icon-btn warning" title="Deactivate" (click)="toggleStatus(user)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <circle cx="12" cy="12" r="10"/>
                              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                            </svg>
                          </button>
                        } @else {
                          <button class="icon-btn success" title="Activate" (click)="toggleStatus(user)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          </button>
                        }
                        <button class="icon-btn" title="Reset Password" (click)="resetPassword(user)">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="7" class="empty-state">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                      </svg>
                      <p>No users found</p>
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

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: linear-gradient(135deg, #1976d2, #1565c0);
      color: white;
      font-size: 14px;
      font-weight: 500;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }

    .btn-primary:hover {
      box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
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

    .user-cell {
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

    .user-info {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-weight: 600;
      color: #1f2937;
    }

    .user-email {
      font-size: 13px;
      color: #6b7280;
    }

    .user-id {
      font-size: 11px;
      color: #9ca3af;
    }

    .role-badge {
      display: inline-block;
      padding: 4px 10px;
      background: #eff6ff;
      color: #1e40af;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
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

    .status-badge[data-status="locked"] {
      background: #fee2e2;
      color: #991b1b;
    }

    .date-cell {
      font-size: 13px;
      color: #6b7280;
    }

    .action-buttons {
      display: flex;
      gap: 6px;
    }

    .icon-btn {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f3f4f6;
      border: none;
      border-radius: 6px;
      color: #6b7280;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .icon-btn:hover {
      background: #e5e7eb;
      color: #1f2937;
    }

    .icon-btn.success:hover {
      background: #d1fae5;
      color: #16a34a;
    }

    .icon-btn.warning:hover {
      background: #fee2e2;
      color: #dc2626;
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
export class UserManagementComponent implements OnInit {
  loading = signal(true);
  users = signal<User[]>([]);

  searchControl = new FormControl('');
  roleControl = new FormControl('');
  statusControl = new FormControl('');

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    setTimeout(() => {
      this.users.set([
        { id: 1, employeeId: 'EMP001', name: 'Admin User', email: 'admin@hlms.com', role: 'ADMIN', branch: 'Head Office', department: 'IT', status: 'ACTIVE', lastLogin: '2024-01-20T10:30:00', createdDate: '2023-01-01' },
        { id: 2, employeeId: 'EMP002', name: 'Suresh Menon', email: 'suresh.menon@hlms.com', role: 'BRANCH_MANAGER', branch: 'Mumbai Main', department: 'Operations', status: 'ACTIVE', lastLogin: '2024-01-20T09:15:00', createdDate: '2023-02-15' },
        { id: 3, employeeId: 'EMP003', name: 'Priya Sharma', email: 'priya.sharma@hlms.com', role: 'CREDIT_OFFICER', branch: 'Mumbai Main', department: 'Credit', status: 'ACTIVE', lastLogin: '2024-01-19T16:45:00', createdDate: '2023-03-20' },
        { id: 4, employeeId: 'EMP004', name: 'Amit Verma', email: 'amit.verma@hlms.com', role: 'VERIFIER', branch: 'Delhi Central', department: 'Verification', status: 'ACTIVE', lastLogin: '2024-01-20T08:00:00', createdDate: '2023-04-10' },
        { id: 5, employeeId: 'EMP005', name: 'Kavitha Nair', email: 'kavitha.nair@hlms.com', role: 'RELATIONSHIP_MANAGER', branch: 'Bangalore Tech', department: 'Sales', status: 'INACTIVE', lastLogin: '2024-01-10T12:00:00', createdDate: '2023-05-01' },
        { id: 6, employeeId: 'EMP006', name: 'Ravi Kumar', email: 'ravi.kumar@hlms.com', role: 'COLLECTION_OFFICER', branch: 'Chennai South', department: 'Collections', status: 'LOCKED', lastLogin: '2024-01-05T14:30:00', createdDate: '2023-06-15' }
      ]);
      this.loading.set(false);
    }, 500);
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  formatRole(role: string): string {
    return role.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  }

  openAddUserModal(): void {
    console.log('Open add user modal');
  }

  editUser(user: User): void {
    console.log('Edit user:', user.name);
  }

  toggleStatus(user: User): void {
    console.log('Toggle status for:', user.name);
  }

  resetPassword(user: User): void {
    console.log('Reset password for:', user.name);
  }
}
