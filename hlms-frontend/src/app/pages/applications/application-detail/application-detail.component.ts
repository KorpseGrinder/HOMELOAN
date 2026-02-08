import { Component, OnInit, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

interface ApplicationDetail {
  id: number;
  applicationNumber: string;
  status: string;
  stage: string;
  loanType: string;
  loanAmount: number;
  tenure: number;
  interestRate: number;
  emi: number;
  processingFee: number;
  customer: {
    id: number;
    customerId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    panNumber: string;
    employmentType: string;
    monthlyIncome: number;
  };
  property: {
    type: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    marketValue: number;
    registrationNumber?: string;
  };
  coApplicant?: {
    name: string;
    relationship: string;
    income: number;
  };
  documents: Document[];
  timeline: TimelineEvent[];
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string;
  sanctionDate?: string;
  disbursementDate?: string;
  remarks?: string;
}

interface Document {
  id: number;
  name: string;
  type: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  uploadedDate: string;
  verifiedBy?: string;
  verifiedDate?: string;
  remarks?: string;
}

interface TimelineEvent {
  id: number;
  action: string;
  description: string;
  performedBy: string;
  performedDate: string;
  remarks?: string;
}

@Component({
  selector: 'app-application-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-container">
      @if (loading()) {
        <div class="loading-state">
          <div class="spinner"></div>
        </div>
      } @else if (application()) {
        <!-- Header -->
        <div class="page-header">
          <div class="header-left">
            <a routerLink="/applications" class="back-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </a>
            <div class="header-info">
              <div class="header-top">
                <h1>{{ application()?.applicationNumber }}</h1>
                <span class="status-badge" [attr.data-status]="application()?.status?.toLowerCase()">
                  {{ formatStatus(application()?.status) }}
                </span>
              </div>
              <p class="header-sub">
                {{ application()?.loanType }} Loan • Created {{ formatDate(application()?.createdDate) }}
              </p>
            </div>
          </div>
          <div class="header-actions">
            @if (canEdit()) {
              <button class="btn-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Edit
              </button>
            }
            @if (canApprove()) {
              <button class="btn-primary" (click)="openApprovalModal()">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 11l3 3L22 4"/>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
                Review & Approve
              </button>
            }
          </div>
        </div>

        <!-- Workflow Progress -->
        <div class="workflow-progress">
          @for (stage of workflowStages; track stage.id; let i = $index) {
            <div class="stage" [class.completed]="isStageCompleted(stage.id)" [class.current]="isCurrentStage(stage.id)">
              <div class="stage-dot">
                @if (isStageCompleted(stage.id)) {
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                } @else {
                  <span>{{ i + 1 }}</span>
                }
              </div>
              <span class="stage-label">{{ stage.label }}</span>
            </div>
          }
        </div>

        <!-- Tabs -->
        <div class="tabs-container">
          <div class="tabs-header">
            @for (tab of tabs; track tab.id) {
              <button
                class="tab-btn"
                [class.active]="activeTab() === tab.id"
                (click)="activeTab.set(tab.id)"
              >
                {{ tab.label }}
                @if (tab.badge) {
                  <span class="tab-badge">{{ tab.badge }}</span>
                }
              </button>
            }
          </div>

          <div class="tabs-content">
            <!-- Overview Tab -->
            @if (activeTab() === 'overview') {
              <div class="tab-panel">
                <div class="info-grid">
                  <!-- Loan Details Card -->
                  <div class="info-card">
                    <div class="card-header">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="2" y="5" width="20" height="14" rx="2"/>
                        <line x1="2" y1="10" x2="22" y2="10"/>
                      </svg>
                      <span>Loan Details</span>
                    </div>
                    <div class="card-content">
                      <div class="info-row">
                        <span>Loan Type</span>
                        <strong>{{ application()?.loanType }}</strong>
                      </div>
                      <div class="info-row">
                        <span>Loan Amount</span>
                        <strong class="amount">₹{{ formatCurrency(application()?.loanAmount) }}</strong>
                      </div>
                      <div class="info-row">
                        <span>Tenure</span>
                        <strong>{{ application()?.tenure }} months</strong>
                      </div>
                      <div class="info-row">
                        <span>Interest Rate</span>
                        <strong>{{ application()?.interestRate }}% p.a.</strong>
                      </div>
                      <div class="info-row highlight">
                        <span>Monthly EMI</span>
                        <strong>₹{{ formatCurrency(application()?.emi) }}</strong>
                      </div>
                    </div>
                  </div>

                  <!-- Customer Summary Card -->
                  <div class="info-card">
                    <div class="card-header">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      <span>Applicant</span>
                      <a [routerLink]="['/customers', application()?.customer?.id]" class="card-link">View Profile →</a>
                    </div>
                    <div class="card-content">
                      <div class="info-row">
                        <span>Name</span>
                        <strong>{{ application()?.customer?.firstName }} {{ application()?.customer?.lastName }}</strong>
                      </div>
                      <div class="info-row">
                        <span>PAN</span>
                        <strong class="mono">{{ application()?.customer?.panNumber }}</strong>
                      </div>
                      <div class="info-row">
                        <span>Employment</span>
                        <strong>{{ application()?.customer?.employmentType }}</strong>
                      </div>
                      <div class="info-row">
                        <span>Monthly Income</span>
                        <strong>₹{{ formatCurrency(application()?.customer?.monthlyIncome) }}</strong>
                      </div>
                    </div>
                  </div>

                  <!-- Property Card -->
                  <div class="info-card">
                    <div class="card-header">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9 22 9 12 15 12 15 22"/>
                      </svg>
                      <span>Property</span>
                    </div>
                    <div class="card-content">
                      <div class="info-row">
                        <span>Type</span>
                        <strong>{{ application()?.property?.type }}</strong>
                      </div>
                      <div class="info-row">
                        <span>Location</span>
                        <strong>{{ application()?.property?.city }}, {{ application()?.property?.state }}</strong>
                      </div>
                      <div class="info-row">
                        <span>Market Value</span>
                        <strong>₹{{ formatCurrency(application()?.property?.marketValue) }}</strong>
                      </div>
                      <div class="info-row">
                        <span>LTV Ratio</span>
                        <strong>{{ calculateLTV() }}%</strong>
                      </div>
                    </div>
                  </div>

                  <!-- Financial Summary -->
                  <div class="info-card">
                    <div class="card-header">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="1" x2="12" y2="23"/>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                      </svg>
                      <span>Financial Summary</span>
                    </div>
                    <div class="card-content">
                      <div class="info-row">
                        <span>Processing Fee</span>
                        <strong>₹{{ formatCurrency(application()?.processingFee) }}</strong>
                      </div>
                      <div class="info-row">
                        <span>Total Interest</span>
                        <strong>₹{{ formatCurrency(calculateTotalInterest()) }}</strong>
                      </div>
                      <div class="info-row">
                        <span>Total Payable</span>
                        <strong>₹{{ formatCurrency(calculateTotalPayable()) }}</strong>
                      </div>
                      <div class="info-row">
                        <span>FOIR</span>
                        <strong [class.warning]="calculateFOIR() > 50">{{ calculateFOIR() }}%</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }

            <!-- Documents Tab -->
            @if (activeTab() === 'documents') {
              <div class="tab-panel">
                <div class="documents-grid">
                  @for (doc of application()?.documents; track doc.id) {
                    <div class="document-card" [attr.data-status]="doc.status.toLowerCase()">
                      <div class="doc-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                        </svg>
                      </div>
                      <div class="doc-info">
                        <h4>{{ doc.name }}</h4>
                        <p>{{ doc.type }} • Uploaded {{ formatDate(doc.uploadedDate) }}</p>
                      </div>
                      <div class="doc-status">
                        <span class="status-badge small" [attr.data-status]="doc.status.toLowerCase()">
                          {{ doc.status }}
                        </span>
                      </div>
                      <div class="doc-actions">
                        <button class="icon-btn" title="View">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        </button>
                        <button class="icon-btn" title="Download">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                          </svg>
                        </button>
                        @if (doc.status === 'PENDING') {
                          <button class="icon-btn success" title="Verify">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          </button>
                          <button class="icon-btn danger" title="Reject">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <line x1="18" y1="6" x2="6" y2="18"/>
                              <line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                          </button>
                        }
                      </div>
                    </div>
                  } @empty {
                    <div class="empty-state">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                      <p>No documents uploaded yet</p>
                    </div>
                  }
                </div>
                <button class="btn-secondary upload-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  Upload Document
                </button>
              </div>
            }

            <!-- Timeline Tab -->
            @if (activeTab() === 'timeline') {
              <div class="tab-panel">
                <div class="timeline">
                  @for (event of application()?.timeline; track event.id; let isLast = $last) {
                    <div class="timeline-item" [class.last]="isLast">
                      <div class="timeline-dot"></div>
                      <div class="timeline-content">
                        <div class="timeline-header">
                          <h4>{{ event.action }}</h4>
                          <span class="timeline-date">{{ formatDateTime(event.performedDate) }}</span>
                        </div>
                        <p class="timeline-desc">{{ event.description }}</p>
                        <span class="timeline-user">By {{ event.performedBy }}</span>
                        @if (event.remarks) {
                          <p class="timeline-remarks">"{{ event.remarks }}"</p>
                        }
                      </div>
                    </div>
                  } @empty {
                    <div class="empty-state">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      <p>No activity recorded yet</p>
                    </div>
                  }
                </div>
              </div>
            }

            <!-- Approval Tab -->
            @if (activeTab() === 'approval') {
              <div class="tab-panel">
                <div class="approval-section">
                  <h3>Approval Workflow</h3>
                  <div class="approval-steps">
                    <div class="approval-step completed">
                      <div class="step-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                      <div class="step-info">
                        <h4>Application Created</h4>
                        <p>Maker: {{ application()?.createdBy }}</p>
                        <span class="step-date">{{ formatDateTime(application()?.createdDate) }}</span>
                      </div>
                    </div>
                    <div class="approval-step" [class.completed]="isStageCompleted('VERIFICATION')" [class.current]="isCurrentStage('VERIFICATION')">
                      <div class="step-icon">
                        @if (isStageCompleted('VERIFICATION')) {
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        } @else {
                          <span>2</span>
                        }
                      </div>
                      <div class="step-info">
                        <h4>Document Verification</h4>
                        <p>Checker: Document Verification Officer</p>
                        @if (isCurrentStage('VERIFICATION')) {
                          <span class="step-pending">Pending verification</span>
                        }
                      </div>
                    </div>
                    <div class="approval-step" [class.completed]="isStageCompleted('CREDIT_CHECK')" [class.current]="isCurrentStage('CREDIT_CHECK')">
                      <div class="step-icon">
                        @if (isStageCompleted('CREDIT_CHECK')) {
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        } @else {
                          <span>3</span>
                        }
                      </div>
                      <div class="step-info">
                        <h4>Credit Assessment</h4>
                        <p>Credit Officer</p>
                      </div>
                    </div>
                    <div class="approval-step" [class.completed]="isStageCompleted('SANCTIONED')" [class.current]="isCurrentStage('SANCTION')">
                      <div class="step-icon">
                        @if (isStageCompleted('SANCTIONED')) {
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        } @else {
                          <span>4</span>
                        }
                      </div>
                      <div class="step-info">
                        <h4>Sanction Approval</h4>
                        <p>Branch Manager / Credit Head</p>
                      </div>
                    </div>
                    <div class="approval-step" [class.completed]="isStageCompleted('DISBURSED')">
                      <div class="step-icon">
                        @if (isStageCompleted('DISBURSED')) {
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        } @else {
                          <span>5</span>
                        }
                      </div>
                      <div class="step-info">
                        <h4>Disbursement</h4>
                        <p>Operations Team</p>
                      </div>
                    </div>
                  </div>
                </div>

                @if (canApprove()) {
                  <div class="approval-action-card">
                    <h3>Your Action Required</h3>
                    <p>Please review the application details and documents before making a decision.</p>
                    <div class="approval-form">
                      <div class="form-group">
                        <label>Remarks</label>
                        <textarea placeholder="Enter your remarks..." rows="3"></textarea>
                      </div>
                      <div class="approval-buttons">
                        <button class="btn-danger">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                          Reject
                        </button>
                        <button class="btn-warning">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                          </svg>
                          Return for Clarification
                        </button>
                        <button class="btn-success">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                          Approve & Forward
                        </button>
                      </div>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      } @else {
        <div class="not-found">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="9" y1="15" x2="15" y2="15"/>
          </svg>
          <h2>Application Not Found</h2>
          <p>The application you're looking for doesn't exist.</p>
          <a routerLink="/applications" class="btn-primary">Back to Applications</a>
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

    /* Header */
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
      transition: all 0.15s ease;
    }

    .back-btn:hover {
      background: #f3f4f6;
      color: #1f2937;
    }

    .header-top {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .header-info h1 {
      font-size: 24px;
      font-weight: 700;
      color: #1f2937;
      margin: 0;
    }

    .header-sub {
      font-size: 14px;
      color: #6b7280;
      margin: 4px 0 0 0;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .btn-primary, .btn-secondary, .btn-success, .btn-warning, .btn-danger {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      font-size: 14px;
      font-weight: 500;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .btn-primary {
      background: linear-gradient(135deg, #1976d2, #1565c0);
      color: white;
      box-shadow: 0 2px 8px rgba(25, 118, 210, 0.3);
    }

    .btn-primary:hover {
      box-shadow: 0 4px 12px rgba(25, 118, 210, 0.4);
    }

    .btn-secondary {
      background: white;
      color: #4b5563;
      border: 1px solid #d1d5db;
    }

    .btn-secondary:hover {
      background: #f9fafb;
      border-color: #9ca3af;
    }

    .btn-success {
      background: #16a34a;
      color: white;
    }

    .btn-success:hover {
      background: #15803d;
    }

    .btn-warning {
      background: #f59e0b;
      color: white;
    }

    .btn-warning:hover {
      background: #d97706;
    }

    .btn-danger {
      background: #dc2626;
      color: white;
    }

    .btn-danger:hover {
      background: #b91c1c;
    }

    /* Status Badge */
    .status-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-badge.small {
      padding: 4px 8px;
      font-size: 11px;
    }

    .status-badge[data-status="pending"],
    .status-badge[data-status="under_review"],
    .status-badge[data-status="verification"] {
      background: #fef3c7;
      color: #92400e;
    }

    .status-badge[data-status="approved"],
    .status-badge[data-status="sanctioned"],
    .status-badge[data-status="disbursed"],
    .status-badge[data-status="verified"] {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge[data-status="rejected"] {
      background: #fee2e2;
      color: #991b1b;
    }

    /* Workflow Progress */
    .workflow-progress {
      display: flex;
      justify-content: space-between;
      background: white;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      padding: 20px 32px;
      margin-bottom: 24px;
      position: relative;
    }

    .workflow-progress::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 60px;
      right: 60px;
      height: 2px;
      background: #e5e7eb;
      transform: translateY(-50%);
      z-index: 0;
    }

    .stage {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      position: relative;
      z-index: 1;
    }

    .stage-dot {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: white;
      border: 2px solid #d1d5db;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
      color: #9ca3af;
    }

    .stage.completed .stage-dot {
      background: #16a34a;
      border-color: #16a34a;
      color: white;
    }

    .stage.current .stage-dot {
      background: #1976d2;
      border-color: #1976d2;
      color: white;
    }

    .stage-label {
      font-size: 12px;
      font-weight: 500;
      color: #6b7280;
    }

    .stage.completed .stage-label,
    .stage.current .stage-label {
      color: #1f2937;
    }

    /* Tabs */
    .tabs-container {
      background: white;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      overflow: hidden;
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
      transition: all 0.15s ease;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .tab-btn:hover {
      color: #1f2937;
      background: #f3f4f6;
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

    .tab-badge {
      background: #ef4444;
      color: white;
      font-size: 11px;
      padding: 2px 6px;
      border-radius: 10px;
    }

    .tabs-content {
      padding: 0;
    }

    .tab-panel {
      padding: 24px;
    }

    /* Info Grid */
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

    .card-header svg {
      color: #6b7280;
    }

    .card-link {
      margin-left: auto;
      font-size: 12px;
      font-weight: 500;
      color: #1976d2;
      text-decoration: none;
    }

    .card-link:hover {
      text-decoration: underline;
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
    }

    .info-row strong.amount {
      color: #1976d2;
      font-size: 16px;
    }

    .info-row strong.mono {
      font-family: 'SF Mono', monospace;
      font-size: 13px;
    }

    .info-row strong.warning {
      color: #dc2626;
    }

    .info-row.highlight {
      background: #eff6ff;
      margin: 10px -16px -16px;
      padding: 14px 16px;
      border-radius: 0 0 10px 10px;
    }

    .info-row.highlight strong {
      color: #1976d2;
      font-size: 18px;
    }

    /* Documents */
    .documents-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 20px;
    }

    .document-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: #f9fafb;
      border-radius: 10px;
      border: 1px solid #e5e7eb;
    }

    .doc-icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      border-radius: 8px;
      color: #6b7280;
    }

    .doc-info {
      flex: 1;
    }

    .doc-info h4 {
      font-size: 14px;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 4px 0;
    }

    .doc-info p {
      font-size: 12px;
      color: #6b7280;
      margin: 0;
    }

    .doc-actions {
      display: flex;
      gap: 8px;
    }

    .icon-btn {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      color: #6b7280;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .icon-btn:hover {
      background: #f3f4f6;
      color: #1f2937;
    }

    .icon-btn.success:hover {
      background: #d1fae5;
      color: #16a34a;
      border-color: #16a34a;
    }

    .icon-btn.danger:hover {
      background: #fee2e2;
      color: #dc2626;
      border-color: #dc2626;
    }

    .upload-btn {
      margin-top: 16px;
    }

    /* Timeline */
    .timeline {
      position: relative;
      padding-left: 32px;
    }

    .timeline-item {
      position: relative;
      padding-bottom: 24px;
      padding-left: 24px;
      border-left: 2px solid #e5e7eb;
    }

    .timeline-item.last {
      border-left-color: transparent;
    }

    .timeline-dot {
      position: absolute;
      left: -7px;
      top: 0;
      width: 12px;
      height: 12px;
      background: #1976d2;
      border-radius: 50%;
    }

    .timeline-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }

    .timeline-header h4 {
      font-size: 14px;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }

    .timeline-date {
      font-size: 12px;
      color: #9ca3af;
    }

    .timeline-desc {
      font-size: 14px;
      color: #4b5563;
      margin: 0 0 4px 0;
    }

    .timeline-user {
      font-size: 12px;
      color: #6b7280;
    }

    .timeline-remarks {
      font-size: 13px;
      color: #6b7280;
      font-style: italic;
      margin: 8px 0 0 0;
      padding: 8px 12px;
      background: #f3f4f6;
      border-radius: 6px;
    }

    /* Approval */
    .approval-section h3 {
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 20px 0;
    }

    .approval-steps {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 32px;
    }

    .approval-step {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 16px;
      background: #f9fafb;
      border-radius: 10px;
    }

    .approval-step.completed {
      background: #f0fdf4;
    }

    .approval-step.current {
      background: #eff6ff;
      border: 2px solid #1976d2;
    }

    .step-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      border: 2px solid #d1d5db;
      border-radius: 50%;
      font-size: 14px;
      font-weight: 600;
      color: #6b7280;
      flex-shrink: 0;
    }

    .approval-step.completed .step-icon {
      background: #16a34a;
      border-color: #16a34a;
      color: white;
    }

    .approval-step.current .step-icon {
      background: #1976d2;
      border-color: #1976d2;
      color: white;
    }

    .step-info h4 {
      font-size: 14px;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 4px 0;
    }

    .step-info p {
      font-size: 13px;
      color: #6b7280;
      margin: 0;
    }

    .step-date {
      font-size: 12px;
      color: #16a34a;
    }

    .step-pending {
      font-size: 12px;
      color: #1976d2;
      font-weight: 500;
    }

    .approval-action-card {
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-radius: 10px;
      padding: 20px;
    }

    .approval-action-card h3 {
      color: #92400e;
      margin-bottom: 8px;
    }

    .approval-action-card > p {
      font-size: 14px;
      color: #78350f;
      margin: 0 0 16px 0;
    }

    .approval-form .form-group {
      margin-bottom: 16px;
    }

    .approval-form label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: #4b5563;
      margin-bottom: 6px;
    }

    .approval-form textarea {
      width: 100%;
      padding: 12px;
      font-size: 14px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      resize: vertical;
      font-family: inherit;
    }

    .approval-form textarea:focus {
      outline: none;
      border-color: #1976d2;
      box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
    }

    .approval-buttons {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 40px;
      color: #9ca3af;
    }

    .empty-state svg {
      margin-bottom: 12px;
    }

    .empty-state p {
      margin: 0;
      font-size: 14px;
    }

    /* Not Found */
    .not-found {
      text-align: center;
      padding: 80px 20px;
    }

    .not-found svg {
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
export class ApplicationDetailComponent implements OnInit {
  @Input() id!: string;

  loading = signal(true);
  application = signal<ApplicationDetail | null>(null);
  activeTab = signal('overview');

  workflowStages = [
    { id: 'SUBMITTED', label: 'Submitted' },
    { id: 'VERIFICATION', label: 'Verification' },
    { id: 'CREDIT_CHECK', label: 'Credit Check' },
    { id: 'SANCTION', label: 'Sanction' },
    { id: 'DISBURSEMENT', label: 'Disbursement' }
  ];

  tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'documents', label: 'Documents', badge: 0 },
    { id: 'timeline', label: 'Timeline' },
    { id: 'approval', label: 'Approval' }
  ];

  private stageOrder = ['SUBMITTED', 'VERIFICATION', 'CREDIT_CHECK', 'SANCTION', 'SANCTIONED', 'DISBURSEMENT', 'DISBURSED'];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadApplication();
  }

  loadApplication(): void {
    this.apiService.get<ApplicationDetail>(`/applications/${this.id}`).subscribe({
      next: (data) => {
        this.application.set(data);
        this.updateDocumentBadge();
        this.loading.set(false);
      },
      error: () => {
        // Mock data
        this.application.set({
          id: parseInt(this.id),
          applicationNumber: 'HLMS-2024-001234',
          status: 'UNDER_REVIEW',
          stage: 'VERIFICATION',
          loanType: 'Home Purchase',
          loanAmount: 5000000,
          tenure: 240,
          interestRate: 8.5,
          emi: 43391,
          processingFee: 25000,
          customer: {
            id: 1,
            customerId: 'CUST-00001',
            firstName: 'Rajesh',
            lastName: 'Kumar',
            email: 'rajesh.kumar@email.com',
            phone: '+91 98765 43210',
            panNumber: 'ABCDE1234F',
            employmentType: 'Salaried',
            monthlyIncome: 150000
          },
          property: {
            type: 'Apartment',
            address: '123, ABC Towers, Andheri West',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400058',
            marketValue: 7500000
          },
          documents: [
            { id: 1, name: 'PAN Card', type: 'Identity Proof', status: 'VERIFIED', uploadedDate: '2024-01-10T10:00:00', verifiedBy: 'Amit Verma', verifiedDate: '2024-01-11T14:30:00' },
            { id: 2, name: 'Aadhaar Card', type: 'Address Proof', status: 'VERIFIED', uploadedDate: '2024-01-10T10:05:00', verifiedBy: 'Amit Verma', verifiedDate: '2024-01-11T14:32:00' },
            { id: 3, name: 'Salary Slips (3 months)', type: 'Income Proof', status: 'PENDING', uploadedDate: '2024-01-10T10:10:00' },
            { id: 4, name: 'Bank Statements (6 months)', type: 'Financial Document', status: 'PENDING', uploadedDate: '2024-01-10T10:15:00' },
            { id: 5, name: 'Property Documents', type: 'Property Proof', status: 'PENDING', uploadedDate: '2024-01-12T09:00:00' }
          ],
          timeline: [
            { id: 1, action: 'Application Submitted', description: 'Loan application submitted for processing', performedBy: 'Rajesh Kumar (Customer)', performedDate: '2024-01-10T10:00:00' },
            { id: 2, action: 'Documents Uploaded', description: '5 documents uploaded for verification', performedBy: 'System', performedDate: '2024-01-10T10:15:00' },
            { id: 3, action: 'Assigned for Verification', description: 'Application assigned to document verification queue', performedBy: 'System', performedDate: '2024-01-10T10:30:00' },
            { id: 4, action: 'Documents Partially Verified', description: '2 of 5 documents verified successfully', performedBy: 'Amit Verma (Verifier)', performedDate: '2024-01-11T14:32:00', remarks: 'PAN and Aadhaar verified. Salary slips pending employer verification.' }
          ],
          createdDate: '2024-01-10T10:00:00',
          createdBy: 'Suresh Menon (RM)',
          lastModifiedDate: '2024-01-11T14:32:00'
        });
        this.updateDocumentBadge();
        this.loading.set(false);
      }
    });
  }

  updateDocumentBadge(): void {
    const pendingDocs = this.application()?.documents?.filter(d => d.status === 'PENDING').length || 0;
    this.tabs = this.tabs.map(t => t.id === 'documents' ? { ...t, badge: pendingDocs } : t);
  }

  isStageCompleted(stageId: string): boolean {
    const app = this.application();
    if (!app) return false;
    const currentIndex = this.stageOrder.indexOf(app.stage);
    const stageIndex = this.stageOrder.indexOf(stageId);
    return stageIndex < currentIndex || app.stage === stageId && ['SANCTIONED', 'DISBURSED'].includes(stageId);
  }

  isCurrentStage(stageId: string): boolean {
    return this.application()?.stage === stageId;
  }

  canEdit(): boolean {
    const status = this.application()?.status;
    return status === 'PENDING' || status === 'UNDER_REVIEW';
  }

  canApprove(): boolean {
    const stage = this.application()?.stage;
    return stage === 'VERIFICATION' || stage === 'CREDIT_CHECK' || stage === 'SANCTION';
  }

  openApprovalModal(): void {
    this.activeTab.set('approval');
  }

  calculateLTV(): number {
    const app = this.application();
    if (!app?.property?.marketValue) return 0;
    return Math.round((app.loanAmount / app.property.marketValue) * 100);
  }

  calculateFOIR(): number {
    const app = this.application();
    if (!app?.customer?.monthlyIncome || !app?.emi) return 0;
    return Math.round((app.emi / app.customer.monthlyIncome) * 100);
  }

  calculateTotalInterest(): number {
    const app = this.application();
    if (!app) return 0;
    return (app.emi * app.tenure) - app.loanAmount;
  }

  calculateTotalPayable(): number {
    const app = this.application();
    if (!app) return 0;
    return app.emi * app.tenure;
  }

  formatCurrency(value?: number): string {
    if (!value) return '0';
    return value.toLocaleString('en-IN');
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  formatDateTime(dateStr?: string): string {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatStatus(status?: string): string {
    if (!status) return '';
    return status.replace(/_/g, ' ');
  }
}
