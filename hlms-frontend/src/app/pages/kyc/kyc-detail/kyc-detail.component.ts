import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface VerificationResult {
  status: 'pending' | 'verifying' | 'verified' | 'failed';
  message?: string;
  verifiedAt?: string;
  data?: Record<string, string>;
}

@Component({
  selector: 'app-kyc-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-left">
          <a routerLink="/kyc" class="back-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to KYC Queue
          </a>
          <h1>KYC Verification - {{ applicationNumber }}</h1>
          <p>{{ customerName }}</p>
        </div>
        <div class="header-right">
          <span class="kyc-progress">
            <span class="progress-fill" [style.width]="getProgressPercent() + '%'"></span>
          </span>
          <span class="progress-text">{{ getVerifiedCount() }}/4 Verified</span>
        </div>
      </div>

      <!-- Customer Summary -->
      <div class="customer-summary">
        <div class="summary-item">
          <span class="label">Application</span>
          <span class="value">{{ applicationNumber }}</span>
        </div>
        <div class="summary-item">
          <span class="label">Customer</span>
          <span class="value">{{ customerName }}</span>
        </div>
        <div class="summary-item">
          <span class="label">Loan Amount</span>
          <span class="value">&#8377;45,00,000</span>
        </div>
        <div class="summary-item">
          <span class="label">Submitted</span>
          <span class="value">08 Feb 2024</span>
        </div>
      </div>

      <!-- Verification Panels -->
      <div class="verification-grid">
        <!-- PAN Verification -->
        <div class="verification-card" [class.verified]="panVerification().status === 'verified'" [class.failed]="panVerification().status === 'failed'">
          <div class="card-header">
            <div class="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="16" rx="2"/>
                <line x1="7" y1="8" x2="17" y2="8"/>
                <line x1="7" y1="12" x2="12" y2="12"/>
              </svg>
            </div>
            <div class="card-title">
              <h3>PAN Verification</h3>
              <span class="status-badge" [class]="panVerification().status">{{ panVerification().status | titlecase }}</span>
            </div>
          </div>
          <div class="card-body">
            <div class="input-row">
              <label>PAN Number</label>
              <input type="text" [(ngModel)]="panNumber" placeholder="ABCDE1234F" maxlength="10" [disabled]="panVerification().status === 'verified'">
            </div>
            @if (panVerification().status === 'verified' && panVerification().data) {
              <div class="verified-data">
                <div class="data-row">
                  <span class="label">Name as per PAN:</span>
                  <span class="value">{{ panVerification().data?.['name'] }}</span>
                </div>
                <div class="data-row">
                  <span class="label">Father's Name:</span>
                  <span class="value">{{ panVerification().data?.['fatherName'] }}</span>
                </div>
                <div class="data-row">
                  <span class="label">DOB:</span>
                  <span class="value">{{ panVerification().data?.['dob'] }}</span>
                </div>
                <div class="data-row match">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  Name matches application
                </div>
              </div>
            }
            @if (panVerification().status === 'failed') {
              <div class="error-message">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                {{ panVerification().message }}
              </div>
            }
          </div>
          <div class="card-footer">
            @if (panVerification().status !== 'verified') {
              <button class="btn-verify" (click)="verifyPan()" [disabled]="panVerification().status === 'verifying'">
                @if (panVerification().status === 'verifying') {
                  <span class="spinner"></span> Verifying...
                } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 12l2 2 4-4"/>
                    <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
                  </svg>
                  Verify PAN
                }
              </button>
            } @else {
              <span class="verified-tag">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                Verified at {{ panVerification().verifiedAt }}
              </span>
            }
          </div>
        </div>

        <!-- Aadhaar Verification -->
        <div class="verification-card" [class.verified]="aadhaarVerification().status === 'verified'" [class.failed]="aadhaarVerification().status === 'failed'">
          <div class="card-header">
            <div class="card-icon aadhaar">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="16" rx="2"/>
                <circle cx="9" cy="10" r="2"/>
                <path d="M15 8h2M15 12h2"/>
              </svg>
            </div>
            <div class="card-title">
              <h3>Aadhaar e-KYC</h3>
              <span class="status-badge" [class]="aadhaarVerification().status">{{ aadhaarVerification().status | titlecase }}</span>
            </div>
          </div>
          <div class="card-body">
            <div class="input-row">
              <label>Aadhaar Number</label>
              <input type="text" [(ngModel)]="aadhaarNumber" placeholder="1234 5678 9012" maxlength="14" [disabled]="aadhaarVerification().status === 'verified'">
            </div>
            @if (showOtpField()) {
              <div class="input-row otp-row">
                <label>Enter OTP sent to registered mobile</label>
                <div class="otp-input">
                  <input type="text" [(ngModel)]="aadhaarOtp" placeholder="Enter 6-digit OTP" maxlength="6">
                  <button class="btn-resend" (click)="resendOtp()">Resend</button>
                </div>
              </div>
            }
            @if (aadhaarVerification().status === 'verified' && aadhaarVerification().data) {
              <div class="verified-data">
                <div class="data-row">
                  <span class="label">Name:</span>
                  <span class="value">{{ aadhaarVerification().data?.['name'] }}</span>
                </div>
                <div class="data-row">
                  <span class="label">DOB:</span>
                  <span class="value">{{ aadhaarVerification().data?.['dob'] }}</span>
                </div>
                <div class="data-row">
                  <span class="label">Address:</span>
                  <span class="value">{{ aadhaarVerification().data?.['address'] }}</span>
                </div>
                <div class="data-row match">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  Address matches property location
                </div>
              </div>
            }
          </div>
          <div class="card-footer">
            @if (aadhaarVerification().status !== 'verified') {
              @if (!showOtpField()) {
                <button class="btn-verify" (click)="sendAadhaarOtp()" [disabled]="aadhaarVerification().status === 'verifying'">
                  @if (aadhaarVerification().status === 'verifying') {
                    <span class="spinner"></span> Sending OTP...
                  } @else {
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07"/>
                      <path d="M4 4h16a2 2 0 0 1 2 2v10"/>
                    </svg>
                    Send OTP
                  }
                </button>
              } @else {
                <button class="btn-verify" (click)="verifyAadhaarOtp()" [disabled]="aadhaarVerification().status === 'verifying'">
                  @if (aadhaarVerification().status === 'verifying') {
                    <span class="spinner"></span> Verifying...
                  } @else {
                    Verify OTP
                  }
                </button>
              }
            } @else {
              <span class="verified-tag">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                Verified at {{ aadhaarVerification().verifiedAt }}
              </span>
            }
          </div>
        </div>

        <!-- Bank Account Verification -->
        <div class="verification-card" [class.verified]="bankVerification().status === 'verified'" [class.failed]="bankVerification().status === 'failed'">
          <div class="card-header">
            <div class="card-icon bank">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 21h18"/>
                <path d="M3 10h18"/>
                <path d="M5 6l7-3 7 3"/>
                <path d="M4 10v11"/>
                <path d="M20 10v11"/>
                <path d="M8 14v3"/>
                <path d="M12 14v3"/>
                <path d="M16 14v3"/>
              </svg>
            </div>
            <div class="card-title">
              <h3>Bank Account Verification</h3>
              <span class="status-badge" [class]="bankVerification().status">{{ bankVerification().status | titlecase }}</span>
            </div>
          </div>
          <div class="card-body">
            <div class="input-row">
              <label>Account Number</label>
              <input type="text" [(ngModel)]="accountNumber" placeholder="Enter account number" [disabled]="bankVerification().status === 'verified'">
            </div>
            <div class="input-row">
              <label>IFSC Code</label>
              <input type="text" [(ngModel)]="ifscCode" placeholder="SBIN0001234" maxlength="11" [disabled]="bankVerification().status === 'verified'">
            </div>
            @if (bankVerification().status === 'verified' && bankVerification().data) {
              <div class="verified-data">
                <div class="data-row">
                  <span class="label">Account Holder:</span>
                  <span class="value">{{ bankVerification().data?.['accountHolder'] }}</span>
                </div>
                <div class="data-row">
                  <span class="label">Bank Name:</span>
                  <span class="value">{{ bankVerification().data?.['bankName'] }}</span>
                </div>
                <div class="data-row">
                  <span class="label">Branch:</span>
                  <span class="value">{{ bankVerification().data?.['branch'] }}</span>
                </div>
                <div class="data-row match">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  Account holder name matches PAN
                </div>
              </div>
            }
          </div>
          <div class="card-footer">
            @if (bankVerification().status !== 'verified') {
              <button class="btn-verify" (click)="verifyBank()" [disabled]="bankVerification().status === 'verifying'">
                @if (bankVerification().status === 'verifying') {
                  <span class="spinner"></span> Verifying...
                } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 12l2 2 4-4"/>
                    <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
                  </svg>
                  Verify Account
                }
              </button>
            } @else {
              <span class="verified-tag">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                Verified at {{ bankVerification().verifiedAt }}
              </span>
            }
          </div>
        </div>

        <!-- Photo/Face Match -->
        <div class="verification-card" [class.verified]="photoVerification().status === 'verified'" [class.failed]="photoVerification().status === 'failed'">
          <div class="card-header">
            <div class="card-icon photo">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div class="card-title">
              <h3>Photo Verification</h3>
              <span class="status-badge" [class]="photoVerification().status">{{ photoVerification().status | titlecase }}</span>
            </div>
          </div>
          <div class="card-body">
            <div class="photo-comparison">
              <div class="photo-box">
                <div class="photo-placeholder">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
                <span class="photo-label">Aadhaar Photo</span>
              </div>
              <div class="match-indicator">
                @if (photoVerification().status === 'verified') {
                  <div class="match-success">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    <span>98% Match</span>
                  </div>
                } @else {
                  <span class="vs">VS</span>
                }
              </div>
              <div class="photo-box">
                <div class="photo-placeholder">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
                <span class="photo-label">Live/Uploaded Photo</span>
              </div>
            </div>
            @if (photoVerification().status === 'verified') {
              <div class="verified-data">
                <div class="data-row match">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  Liveness check passed
                </div>
                <div class="data-row match">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  Face match confidence: 98%
                </div>
              </div>
            }
          </div>
          <div class="card-footer">
            @if (photoVerification().status !== 'verified') {
              <button class="btn-verify" (click)="verifyPhoto()" [disabled]="photoVerification().status === 'verifying'">
                @if (photoVerification().status === 'verifying') {
                  <span class="spinner"></span> Matching...
                } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                  Run Face Match
                }
              </button>
            } @else {
              <span class="verified-tag">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                Verified at {{ photoVerification().verifiedAt }}
              </span>
            }
          </div>
        </div>
      </div>

      <!-- Final Actions -->
      <div class="final-actions">
        <button class="btn-secondary" routerLink="/kyc">Cancel</button>
        <button class="btn-reject" (click)="rejectKyc()" [disabled]="!canComplete()">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          Reject KYC
        </button>
        <button class="btn-approve" (click)="approveKyc()" [disabled]="!allVerified()">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
          Approve KYC
        </button>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: #6b7280;
      text-decoration: none;
      font-size: 13px;
      margin-bottom: 8px;
    }

    .back-link:hover { color: #1976d2; }

    .header-left h1 {
      font-size: 24px;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 4px 0;
    }

    .header-left p {
      font-size: 14px;
      color: #6b7280;
      margin: 0;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .kyc-progress {
      width: 120px;
      height: 8px;
      background: #e5e7eb;
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #22c55e, #16a34a);
      transition: width 0.3s ease;
    }

    .progress-text {
      font-size: 13px;
      font-weight: 500;
      color: #6b7280;
    }

    .customer-summary {
      display: flex;
      gap: 32px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      padding: 16px 24px;
      margin-bottom: 24px;
    }

    .summary-item .label {
      display: block;
      font-size: 11px;
      color: #9ca3af;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .summary-item .value {
      font-size: 14px;
      font-weight: 600;
      color: #1f2937;
    }

    .verification-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-bottom: 24px;
    }

    .verification-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      overflow: hidden;
      transition: all 0.2s;
    }

    .verification-card.verified {
      border-color: #22c55e;
      box-shadow: 0 0 0 1px #22c55e;
    }

    .verification-card.failed {
      border-color: #ef4444;
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 16px 20px;
      background: #f9fafb;
      border-bottom: 1px solid #e5e7eb;
    }

    .card-icon {
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #eff6ff;
      color: #2563eb;
      border-radius: 10px;
    }

    .card-icon.aadhaar { background: #fef3c7; color: #d97706; }
    .card-icon.bank { background: #d1fae5; color: #059669; }
    .card-icon.photo { background: #fae8ff; color: #a855f7; }

    .card-title {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .card-title h3 {
      font-size: 15px;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }

    .status-badge {
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 500;
    }

    .status-badge.pending { background: #f3f4f6; color: #6b7280; }
    .status-badge.verifying { background: #dbeafe; color: #1e40af; }
    .status-badge.verified { background: #d1fae5; color: #065f46; }
    .status-badge.failed { background: #fee2e2; color: #991b1b; }

    .card-body {
      padding: 20px;
    }

    .input-row {
      margin-bottom: 16px;
    }

    .input-row:last-child { margin-bottom: 0; }

    .input-row label {
      display: block;
      font-size: 13px;
      font-weight: 500;
      color: #4b5563;
      margin-bottom: 6px;
    }

    .input-row input {
      width: 100%;
      padding: 10px 14px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
      outline: none;
    }

    .input-row input:focus {
      border-color: #1976d2;
      box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
    }

    .input-row input:disabled {
      background: #f9fafb;
      color: #6b7280;
    }

    .otp-input {
      display: flex;
      gap: 10px;
    }

    .otp-input input { flex: 1; }

    .btn-resend {
      padding: 10px 16px;
      background: white;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 13px;
      color: #1976d2;
      cursor: pointer;
    }

    .verified-data {
      background: #f0fdf4;
      border-radius: 8px;
      padding: 14px;
      margin-top: 16px;
    }

    .data-row {
      display: flex;
      gap: 8px;
      font-size: 13px;
      margin-bottom: 8px;
    }

    .data-row:last-child { margin-bottom: 0; }

    .data-row .label { color: #6b7280; }
    .data-row .value { color: #1f2937; font-weight: 500; }

    .data-row.match {
      color: #065f46;
      font-weight: 500;
      align-items: center;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      background: #fef2f2;
      border-radius: 8px;
      color: #991b1b;
      font-size: 13px;
      margin-top: 16px;
    }

    .card-footer {
      padding: 16px 20px;
      background: #f9fafb;
      border-top: 1px solid #e5e7eb;
    }

    .btn-verify {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: #1976d2;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
    }

    .btn-verify:hover:not(:disabled) { background: #1565c0; }
    .btn-verify:disabled { opacity: 0.6; cursor: not-allowed; }

    .spinner {
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    .verified-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: #065f46;
      font-weight: 500;
    }

    .photo-comparison {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 24px;
      padding: 20px 0;
    }

    .photo-box {
      text-align: center;
    }

    .photo-placeholder {
      width: 100px;
      height: 100px;
      border: 2px dashed #d1d5db;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #9ca3af;
      margin-bottom: 8px;
    }

    .photo-label {
      font-size: 12px;
      color: #6b7280;
    }

    .match-indicator .vs {
      font-size: 14px;
      font-weight: 600;
      color: #9ca3af;
    }

    .match-success {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      color: #22c55e;
    }

    .match-success span {
      font-size: 12px;
      font-weight: 600;
    }

    .final-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }

    .btn-secondary, .btn-reject, .btn-approve {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      border: none;
    }

    .btn-secondary {
      background: white;
      color: #6b7280;
      border: 1px solid #d1d5db;
    }

    .btn-reject {
      background: #fee2e2;
      color: #dc2626;
    }

    .btn-reject:hover:not(:disabled) { background: #fecaca; }

    .btn-approve {
      background: linear-gradient(135deg, #22c55e, #16a34a);
      color: white;
    }

    .btn-approve:hover:not(:disabled) { background: linear-gradient(135deg, #16a34a, #15803d); }

    .btn-reject:disabled, .btn-approve:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .verification-grid { grid-template-columns: 1fr; }
      .customer-summary { flex-wrap: wrap; gap: 16px; }
    }
  `]
})
export class KycDetailComponent implements OnInit {
  applicationNumber = 'APP-2024-1542';
  customerName = 'Rajesh Kumar';

  panNumber = 'ABCPK1234A';
  aadhaarNumber = '1234 5678 9012';
  aadhaarOtp = '';
  accountNumber = '1234567890123';
  ifscCode = 'SBIN0001234';

  panVerification = signal<VerificationResult>({ status: 'pending' });
  aadhaarVerification = signal<VerificationResult>({ status: 'pending' });
  bankVerification = signal<VerificationResult>({ status: 'pending' });
  photoVerification = signal<VerificationResult>({ status: 'pending' });
  showOtpField = signal(false);

  ngOnInit(): void {}

  verifyPan(): void {
    this.panVerification.set({ status: 'verifying' });
    setTimeout(() => {
      this.panVerification.set({
        status: 'verified',
        verifiedAt: new Date().toLocaleTimeString(),
        data: {
          name: 'RAJESH KUMAR',
          fatherName: 'MOHAN KUMAR',
          dob: '15-Aug-1985'
        }
      });
    }, 2000);
  }

  sendAadhaarOtp(): void {
    this.aadhaarVerification.set({ status: 'verifying' });
    setTimeout(() => {
      this.aadhaarVerification.set({ status: 'pending' });
      this.showOtpField.set(true);
    }, 1500);
  }

  verifyAadhaarOtp(): void {
    this.aadhaarVerification.set({ status: 'verifying' });
    setTimeout(() => {
      this.aadhaarVerification.set({
        status: 'verified',
        verifiedAt: new Date().toLocaleTimeString(),
        data: {
          name: 'Rajesh Kumar',
          dob: '15/08/1985',
          address: '123, MG Road, Bangalore - 560001, Karnataka'
        }
      });
    }, 2000);
  }

  resendOtp(): void {
    alert('OTP resent to registered mobile number');
  }

  verifyBank(): void {
    this.bankVerification.set({ status: 'verifying' });
    setTimeout(() => {
      this.bankVerification.set({
        status: 'verified',
        verifiedAt: new Date().toLocaleTimeString(),
        data: {
          accountHolder: 'RAJESH KUMAR',
          bankName: 'State Bank of India',
          branch: 'MG Road, Bangalore'
        }
      });
    }, 2000);
  }

  verifyPhoto(): void {
    this.photoVerification.set({ status: 'verifying' });
    setTimeout(() => {
      this.photoVerification.set({
        status: 'verified',
        verifiedAt: new Date().toLocaleTimeString()
      });
    }, 2500);
  }

  getVerifiedCount(): number {
    let count = 0;
    if (this.panVerification().status === 'verified') count++;
    if (this.aadhaarVerification().status === 'verified') count++;
    if (this.bankVerification().status === 'verified') count++;
    if (this.photoVerification().status === 'verified') count++;
    return count;
  }

  getProgressPercent(): number {
    return (this.getVerifiedCount() / 4) * 100;
  }

  allVerified(): boolean {
    return this.getVerifiedCount() === 4;
  }

  canComplete(): boolean {
    return this.getVerifiedCount() > 0;
  }

  approveKyc(): void {
    alert('KYC Approved! Application will proceed to Credit Assessment.');
  }

  rejectKyc(): void {
    alert('KYC Rejected. Application will be sent back to customer.');
  }
}
