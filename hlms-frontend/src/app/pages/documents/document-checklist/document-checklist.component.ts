import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Document {
  id: number;
  name: string;
  category: string;
  required: boolean;
  status: 'pending' | 'uploaded' | 'verified' | 'rejected';
  uploadedAt?: string;
  verifiedAt?: string;
  fileName?: string;
  fileSize?: string;
  remarks?: string;
  expiryDate?: string;
}

interface Application {
  id: number;
  applicationNumber: string;
  customerName: string;
  completionPercent: number;
}

@Component({
  selector: 'app-document-checklist',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page-container">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <h1>Document Management</h1>
          <p>Upload, verify and manage loan application documents</p>
        </div>
        <div class="header-actions">
          <div class="search-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" placeholder="Search application..." [(ngModel)]="searchTerm">
          </div>
        </div>
      </div>

      <!-- Application Selector -->
      <div class="application-cards">
        @for (app of applications; track app.id) {
          <div class="app-card" [class.selected]="selectedApp()?.id === app.id" (click)="selectApp(app)">
            <div class="app-info">
              <span class="app-number">{{ app.applicationNumber }}</span>
              <span class="app-customer">{{ app.customerName }}</span>
            </div>
            <div class="completion-ring">
              <svg viewBox="0 0 36 36">
                <path class="bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                <path class="fill" [attr.stroke-dasharray]="app.completionPercent + ', 100'" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
              </svg>
              <span class="percent">{{ app.completionPercent }}%</span>
            </div>
          </div>
        }
      </div>

      @if (selectedApp()) {
        <!-- Document Checklist -->
        <div class="document-section">
          <div class="section-header">
            <h2>Document Checklist - {{ selectedApp()?.applicationNumber }}</h2>
            <div class="section-stats">
              <span class="stat uploaded">{{ getUploadedCount() }} Uploaded</span>
              <span class="stat verified">{{ getVerifiedCount() }} Verified</span>
              <span class="stat pending">{{ getPendingCount() }} Pending</span>
            </div>
          </div>

          <!-- Document Categories -->
          @for (category of getCategories(); track category) {
            <div class="category-block">
              <h3 class="category-title">{{ category }}</h3>
              <div class="documents-list">
                @for (doc of getDocumentsByCategory(category); track doc.id) {
                  <div class="document-row" [class]="doc.status">
                    <div class="doc-info">
                      <div class="doc-icon" [class]="doc.status">
                        @switch (doc.status) {
                          @case ('verified') {
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M20 6L9 17l-5-5"/>
                            </svg>
                          }
                          @case ('rejected') {
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <circle cx="12" cy="12" r="10"/>
                              <line x1="15" y1="9" x2="9" y2="15"/>
                              <line x1="9" y1="9" x2="15" y2="15"/>
                            </svg>
                          }
                          @case ('uploaded') {
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                              <polyline points="14 2 14 8 20 8"/>
                            </svg>
                          }
                          @default {
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <circle cx="12" cy="12" r="10"/>
                            </svg>
                          }
                        }
                      </div>
                      <div class="doc-details">
                        <span class="doc-name">
                          {{ doc.name }}
                          @if (doc.required) {
                            <span class="required-tag">Required</span>
                          }
                        </span>
                        @if (doc.fileName) {
                          <span class="file-info">{{ doc.fileName }} ({{ doc.fileSize }})</span>
                        }
                      </div>
                    </div>
                    <div class="doc-status">
                      @if (doc.status === 'verified') {
                        <span class="status-badge verified">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 6L9 17l-5-5"/>
                          </svg>
                          Verified
                        </span>
                      } @else if (doc.status === 'rejected') {
                        <span class="status-badge rejected">Rejected</span>
                      } @else if (doc.status === 'uploaded') {
                        <span class="status-badge uploaded">Awaiting Review</span>
                      } @else {
                        <span class="status-badge pending">Pending</span>
                      }
                    </div>
                    <div class="doc-actions">
                      @if (doc.status === 'pending') {
                        <label class="btn-upload">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="17 8 12 3 7 8"/>
                            <line x1="12" y1="3" x2="12" y2="15"/>
                          </svg>
                          Upload
                          <input type="file" hidden (change)="uploadDocument(doc, $event)">
                        </label>
                      } @else if (doc.status === 'uploaded') {
                        <button class="btn-view" (click)="viewDocument(doc)">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                          View
                        </button>
                        <button class="btn-verify" (click)="verifyDocument(doc)">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 6L9 17l-5-5"/>
                          </svg>
                          Verify
                        </button>
                        <button class="btn-reject" (click)="rejectDocument(doc)">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      } @else if (doc.status === 'verified') {
                        <button class="btn-view" (click)="viewDocument(doc)">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                          View
                        </button>
                        <button class="btn-download" (click)="downloadDocument(doc)">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                          </svg>
                        </button>
                      } @else if (doc.status === 'rejected') {
                        <label class="btn-reupload">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="23 4 23 10 17 10"/>
                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                          </svg>
                          Re-upload
                          <input type="file" hidden (change)="uploadDocument(doc, $event)">
                        </label>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>
          }

          <!-- OCR Auto-Extract Feature -->
          <div class="ocr-section">
            <div class="ocr-header">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M7 7h.01M17 7h.01M7 17h.01M17 17h.01"/>
                <path d="M7 12h10"/>
              </svg>
              <div class="ocr-info">
                <h3>Smart Document Extraction</h3>
                <p>Automatically extract data from uploaded documents using OCR</p>
              </div>
            </div>
            <div class="ocr-results">
              <div class="extracted-item">
                <span class="label">Name (from PAN):</span>
                <span class="value">RAJESH KUMAR</span>
                <span class="match">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  Matched
                </span>
              </div>
              <div class="extracted-item">
                <span class="label">Address (from Aadhaar):</span>
                <span class="value">123, MG Road, Bangalore</span>
                <span class="match">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  Matched
                </span>
              </div>
              <div class="extracted-item">
                <span class="label">Salary (from Payslip):</span>
                <span class="value">&#8377;1,25,000/month</span>
                <span class="match pending">Pending Verification</span>
              </div>
            </div>
          </div>
        </div>
      } @else {
        <div class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <h3>Select an Application</h3>
          <p>Choose an application from above to manage its documents</p>
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

    .search-box {
      display: flex;
      align-items: center;
      gap: 10px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 10px 14px;
      width: 280px;
    }

    .search-box svg { color: #9ca3af; }
    .search-box input { border: none; outline: none; font-size: 14px; width: 100%; }

    .application-cards {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      overflow-x: auto;
      padding-bottom: 8px;
    }

    .app-card {
      display: flex;
      align-items: center;
      gap: 16px;
      background: white;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      padding: 16px 20px;
      min-width: 240px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .app-card:hover { border-color: #d1d5db; }

    .app-card.selected {
      border-color: #1976d2;
      background: #eff6ff;
    }

    .app-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .app-number {
      font-size: 14px;
      font-weight: 600;
      color: #1976d2;
    }

    .app-customer {
      font-size: 13px;
      color: #6b7280;
    }

    .completion-ring {
      position: relative;
      width: 48px;
      height: 48px;
    }

    .completion-ring svg {
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }

    .completion-ring .bg {
      fill: none;
      stroke: #e5e7eb;
      stroke-width: 3;
    }

    .completion-ring .fill {
      fill: none;
      stroke: #22c55e;
      stroke-width: 3;
      stroke-linecap: round;
    }

    .completion-ring .percent {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 11px;
      font-weight: 600;
      color: #1f2937;
    }

    .document-section {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      overflow: hidden;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      background: #f9fafb;
      border-bottom: 1px solid #e5e7eb;
    }

    .section-header h2 {
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }

    .section-stats {
      display: flex;
      gap: 16px;
    }

    .section-stats .stat {
      font-size: 12px;
      font-weight: 500;
      padding: 4px 10px;
      border-radius: 12px;
    }

    .stat.uploaded { background: #dbeafe; color: #1e40af; }
    .stat.verified { background: #d1fae5; color: #065f46; }
    .stat.pending { background: #fef3c7; color: #92400e; }

    .category-block {
      padding: 20px 24px;
      border-bottom: 1px solid #f3f4f6;
    }

    .category-block:last-child { border-bottom: none; }

    .category-title {
      font-size: 13px;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0 0 16px 0;
    }

    .documents-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .document-row {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 14px 16px;
      background: #f9fafb;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
    }

    .document-row.verified {
      background: #f0fdf4;
      border-color: #bbf7d0;
    }

    .document-row.rejected {
      background: #fef2f2;
      border-color: #fecaca;
    }

    .doc-info {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
    }

    .doc-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      background: #e5e7eb;
      color: #6b7280;
    }

    .doc-icon.verified { background: #d1fae5; color: #059669; }
    .doc-icon.rejected { background: #fee2e2; color: #dc2626; }
    .doc-icon.uploaded { background: #dbeafe; color: #2563eb; }

    .doc-details {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .doc-name {
      font-size: 14px;
      font-weight: 500;
      color: #1f2937;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .required-tag {
      font-size: 10px;
      padding: 2px 6px;
      background: #fef2f2;
      color: #dc2626;
      border-radius: 4px;
    }

    .file-info {
      font-size: 12px;
      color: #9ca3af;
    }

    .doc-status {
      min-width: 120px;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-badge.pending { background: #f3f4f6; color: #6b7280; }
    .status-badge.uploaded { background: #dbeafe; color: #1e40af; }
    .status-badge.verified { background: #d1fae5; color: #065f46; }
    .status-badge.rejected { background: #fee2e2; color: #991b1b; }

    .doc-actions {
      display: flex;
      gap: 8px;
    }

    .btn-upload, .btn-reupload, .btn-view, .btn-verify, .btn-reject, .btn-download {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      border: none;
      cursor: pointer;
      transition: all 0.15s;
    }

    .btn-upload, .btn-reupload {
      background: #1976d2;
      color: white;
    }

    .btn-upload:hover, .btn-reupload:hover { background: #1565c0; }

    .btn-view {
      background: white;
      color: #4b5563;
      border: 1px solid #d1d5db;
    }

    .btn-verify {
      background: #22c55e;
      color: white;
    }

    .btn-verify:hover { background: #16a34a; }

    .btn-reject {
      background: #fee2e2;
      color: #dc2626;
      padding: 8px 10px;
    }

    .btn-reject:hover { background: #fecaca; }

    .btn-download {
      background: white;
      color: #4b5563;
      border: 1px solid #d1d5db;
      padding: 8px 10px;
    }

    .ocr-section {
      margin: 24px;
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-radius: 10px;
      padding: 20px;
    }

    .ocr-header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 16px;
      color: #92400e;
    }

    .ocr-info h3 {
      font-size: 15px;
      font-weight: 600;
      margin: 0 0 2px 0;
      color: #92400e;
    }

    .ocr-info p {
      font-size: 13px;
      margin: 0;
      color: #a16207;
    }

    .ocr-results {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .extracted-item {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 13px;
    }

    .extracted-item .label { color: #6b7280; min-width: 150px; }
    .extracted-item .value { color: #1f2937; font-weight: 500; flex: 1; }

    .extracted-item .match {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #059669;
      font-weight: 500;
    }

    .extracted-item .match.pending { color: #d97706; }

    .empty-state {
      text-align: center;
      padding: 80px 40px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
    }

    .empty-state svg {
      color: #d1d5db;
      margin-bottom: 16px;
    }

    .empty-state h3 {
      font-size: 18px;
      font-weight: 600;
      color: #4b5563;
      margin: 0 0 8px 0;
    }

    .empty-state p {
      font-size: 14px;
      color: #9ca3af;
      margin: 0;
    }
  `]
})
export class DocumentChecklistComponent {
  searchTerm = '';
  selectedApp = signal<Application | null>(null);

  applications: Application[] = [
    { id: 1, applicationNumber: 'APP-2024-1542', customerName: 'Rajesh Kumar', completionPercent: 75 },
    { id: 2, applicationNumber: 'APP-2024-1538', customerName: 'Priya Sharma', completionPercent: 100 },
    { id: 3, applicationNumber: 'APP-2024-1535', customerName: 'Amit Patel', completionPercent: 50 },
    { id: 4, applicationNumber: 'APP-2024-1530', customerName: 'Sneha Gupta', completionPercent: 25 },
  ];

  documents: Document[] = [
    // Identity Documents
    { id: 1, name: 'PAN Card', category: 'Identity Documents', required: true, status: 'verified', fileName: 'pan_rajesh.pdf', fileSize: '245 KB', verifiedAt: '08 Feb 2024' },
    { id: 2, name: 'Aadhaar Card', category: 'Identity Documents', required: true, status: 'verified', fileName: 'aadhaar_rajesh.pdf', fileSize: '312 KB', verifiedAt: '08 Feb 2024' },
    { id: 3, name: 'Passport (if available)', category: 'Identity Documents', required: false, status: 'pending' },

    // Income Documents
    { id: 4, name: 'Latest 3 Months Salary Slips', category: 'Income Documents', required: true, status: 'uploaded', fileName: 'salary_slips.pdf', fileSize: '1.2 MB', uploadedAt: '07 Feb 2024' },
    { id: 5, name: 'Form 16 / ITR (Last 2 Years)', category: 'Income Documents', required: true, status: 'uploaded', fileName: 'itr_2023_2024.pdf', fileSize: '890 KB', uploadedAt: '07 Feb 2024' },
    { id: 6, name: 'Bank Statements (6 Months)', category: 'Income Documents', required: true, status: 'verified', fileName: 'bank_stmt.pdf', fileSize: '2.1 MB', verifiedAt: '08 Feb 2024' },

    // Property Documents
    { id: 7, name: 'Sale Agreement / Allotment Letter', category: 'Property Documents', required: true, status: 'uploaded', fileName: 'sale_agreement.pdf', fileSize: '3.5 MB', uploadedAt: '06 Feb 2024' },
    { id: 8, name: 'Property Title Deed', category: 'Property Documents', required: true, status: 'pending' },
    { id: 9, name: 'NOC from Builder/Society', category: 'Property Documents', required: true, status: 'pending' },
    { id: 10, name: 'Approved Building Plan', category: 'Property Documents', required: true, status: 'rejected', remarks: 'Plan not clearly visible, please re-upload' },

    // Employment Documents
    { id: 11, name: 'Employment Certificate', category: 'Employment Documents', required: true, status: 'verified', fileName: 'emp_cert.pdf', fileSize: '156 KB', verifiedAt: '08 Feb 2024' },
    { id: 12, name: 'Appointment Letter', category: 'Employment Documents', required: false, status: 'pending' },
  ];

  selectApp(app: Application): void {
    this.selectedApp.set(app);
  }

  getCategories(): string[] {
    return [...new Set(this.documents.map(d => d.category))];
  }

  getDocumentsByCategory(category: string): Document[] {
    return this.documents.filter(d => d.category === category);
  }

  getUploadedCount(): number {
    return this.documents.filter(d => d.status === 'uploaded').length;
  }

  getVerifiedCount(): number {
    return this.documents.filter(d => d.status === 'verified').length;
  }

  getPendingCount(): number {
    return this.documents.filter(d => d.status === 'pending' || d.status === 'rejected').length;
  }

  uploadDocument(doc: Document, event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      doc.status = 'uploaded';
      doc.fileName = file.name;
      doc.fileSize = (file.size / 1024).toFixed(0) + ' KB';
      doc.uploadedAt = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }
  }

  viewDocument(doc: Document): void {
    alert(`Viewing document: ${doc.fileName}`);
  }

  verifyDocument(doc: Document): void {
    doc.status = 'verified';
    doc.verifiedAt = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  rejectDocument(doc: Document): void {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      doc.status = 'rejected';
      doc.remarks = reason;
    }
  }

  downloadDocument(doc: Document): void {
    alert(`Downloading: ${doc.fileName}`);
  }
}
