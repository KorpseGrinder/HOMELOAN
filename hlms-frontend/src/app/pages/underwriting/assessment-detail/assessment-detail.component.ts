import { Component, OnInit, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface AssessmentData {
  id: number;
  applicationNumber: string;
  customer: {
    name: string;
    age: number;
    employmentType: string;
    employer: string;
    designation: string;
    experience: number;
    monthlyIncome: number;
    otherIncome: number;
  };
  loan: {
    type: string;
    amount: number;
    tenure: number;
    interestRate: number;
    emi: number;
  };
  creditBureau: {
    score: number;
    reportDate: string;
    activeAccounts: number;
    closedAccounts: number;
    overdueAccounts: number;
    totalOutstanding: number;
    monthlyObligations: number;
  };
  property: {
    type: string;
    location: string;
    marketValue: number;
    builderName?: string;
  };
}

@Component({
  selector: 'app-assessment-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
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
            <a routerLink="/underwriting" class="back-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </a>
            <div>
              <h1>Credit Assessment</h1>
              <p>{{ data()?.applicationNumber }}</p>
            </div>
          </div>
          <div class="header-actions">
            <button class="btn-secondary">Save Draft</button>
            <button class="btn-primary" (click)="submitAssessment()">Submit Assessment</button>
          </div>
        </div>

        <div class="assessment-grid">
          <!-- Left Column - Data -->
          <div class="data-column">
            <!-- Customer Profile -->
            <div class="section-card">
              <div class="section-header">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <h3>Customer Profile</h3>
              </div>
              <div class="section-content">
                <div class="info-grid">
                  <div class="info-item">
                    <span class="label">Name</span>
                    <span class="value">{{ data()?.customer?.name }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Age</span>
                    <span class="value">{{ data()?.customer?.age }} years</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Employment</span>
                    <span class="value">{{ data()?.customer?.employmentType }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Employer</span>
                    <span class="value">{{ data()?.customer?.employer }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Designation</span>
                    <span class="value">{{ data()?.customer?.designation }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Experience</span>
                    <span class="value">{{ data()?.customer?.experience }} years</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Credit Bureau Report -->
            <div class="section-card">
              <div class="section-header">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
                <h3>Credit Bureau Report</h3>
                <span class="report-date">as of {{ formatDate(data()?.creditBureau?.reportDate) }}</span>
              </div>
              <div class="section-content">
                <div class="credit-score-display">
                  <div class="score-ring" [attr.data-level]="getScoreLevel(data()?.creditBureau?.score || 0)">
                    <span class="score-number">{{ data()?.creditBureau?.score }}</span>
                    <span class="score-label">{{ getScoreLabel(data()?.creditBureau?.score || 0) }}</span>
                  </div>
                  <div class="score-breakdown">
                    <div class="breakdown-item">
                      <span class="breakdown-label">Active Accounts</span>
                      <span class="breakdown-value">{{ data()?.creditBureau?.activeAccounts }}</span>
                    </div>
                    <div class="breakdown-item">
                      <span class="breakdown-label">Closed Accounts</span>
                      <span class="breakdown-value">{{ data()?.creditBureau?.closedAccounts }}</span>
                    </div>
                    <div class="breakdown-item warning">
                      <span class="breakdown-label">Overdue Accounts</span>
                      <span class="breakdown-value">{{ data()?.creditBureau?.overdueAccounts }}</span>
                    </div>
                    <div class="breakdown-item">
                      <span class="breakdown-label">Total Outstanding</span>
                      <span class="breakdown-value">₹{{ formatCurrency(data()?.creditBureau?.totalOutstanding || 0) }}</span>
                    </div>
                    <div class="breakdown-item">
                      <span class="breakdown-label">Monthly Obligations</span>
                      <span class="breakdown-value">₹{{ formatCurrency(data()?.creditBureau?.monthlyObligations || 0) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Loan Details -->
            <div class="section-card">
              <div class="section-header">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="5" width="20" height="14" rx="2"/>
                  <line x1="2" y1="10" x2="22" y2="10"/>
                </svg>
                <h3>Loan Request</h3>
              </div>
              <div class="section-content">
                <div class="info-grid">
                  <div class="info-item">
                    <span class="label">Loan Type</span>
                    <span class="value">{{ data()?.loan?.type }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Loan Amount</span>
                    <span class="value highlight">₹{{ formatCurrency(data()?.loan?.amount || 0) }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Tenure</span>
                    <span class="value">{{ data()?.loan?.tenure }} months</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Interest Rate</span>
                    <span class="value">{{ data()?.loan?.interestRate }}% p.a.</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Proposed EMI</span>
                    <span class="value highlight">₹{{ formatCurrency(data()?.loan?.emi || 0) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column - Assessment -->
          <div class="assessment-column">
            <!-- Eligibility Calculator -->
            <div class="section-card calculator">
              <div class="section-header">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="4" y="2" width="16" height="20" rx="2"/>
                  <line x1="8" y1="6" x2="16" y2="6"/>
                  <line x1="8" y1="10" x2="16" y2="10"/>
                  <line x1="8" y1="14" x2="12" y2="14"/>
                </svg>
                <h3>Eligibility Assessment</h3>
              </div>
              <div class="section-content">
                <!-- Income Analysis -->
                <div class="calc-section">
                  <h4>Income Analysis</h4>
                  <div class="calc-row">
                    <span>Monthly Salary</span>
                    <span>₹{{ formatCurrency(data()?.customer?.monthlyIncome || 0) }}</span>
                  </div>
                  <div class="calc-row">
                    <span>Other Income</span>
                    <span>₹{{ formatCurrency(data()?.customer?.otherIncome || 0) }}</span>
                  </div>
                  <div class="calc-row total">
                    <span>Gross Monthly Income</span>
                    <span>₹{{ formatCurrency(getGrossIncome()) }}</span>
                  </div>
                </div>

                <!-- Obligation Analysis -->
                <div class="calc-section">
                  <h4>Obligation Analysis</h4>
                  <div class="calc-row">
                    <span>Existing EMIs</span>
                    <span>₹{{ formatCurrency(data()?.creditBureau?.monthlyObligations || 0) }}</span>
                  </div>
                  <div class="calc-row">
                    <span>Proposed EMI</span>
                    <span>₹{{ formatCurrency(data()?.loan?.emi || 0) }}</span>
                  </div>
                  <div class="calc-row total">
                    <span>Total Obligations</span>
                    <span>₹{{ formatCurrency(getTotalObligations()) }}</span>
                  </div>
                </div>

                <!-- FOIR Calculation -->
                <div class="calc-section">
                  <h4>FOIR Calculation</h4>
                  <div class="foir-display" [class.warning]="calculateFOIR() > 50" [class.danger]="calculateFOIR() > 60">
                    <div class="foir-value">{{ calculateFOIR() }}%</div>
                    <div class="foir-bar">
                      <div class="foir-fill" [style.width.%]="calculateFOIR()"></div>
                      <div class="foir-limit" style="left: 50%"></div>
                    </div>
                    <div class="foir-labels">
                      <span>0%</span>
                      <span class="limit-label">Max 50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                  <div class="foir-result" [class.pass]="calculateFOIR() <= 50" [class.fail]="calculateFOIR() > 50">
                    @if (calculateFOIR() <= 50) {
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      FOIR within acceptable limits
                    } @else {
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                      FOIR exceeds recommended limit
                    }
                  </div>
                </div>

                <!-- LTV Calculation -->
                <div class="calc-section">
                  <h4>LTV Ratio</h4>
                  <div class="calc-row">
                    <span>Property Value</span>
                    <span>₹{{ formatCurrency(data()?.property?.marketValue || 0) }}</span>
                  </div>
                  <div class="calc-row">
                    <span>Loan Amount</span>
                    <span>₹{{ formatCurrency(data()?.loan?.amount || 0) }}</span>
                  </div>
                  <div class="calc-row total">
                    <span>LTV Ratio</span>
                    <span [class.warning]="calculateLTV() > 75" [class.danger]="calculateLTV() > 80">{{ calculateLTV() }}%</span>
                  </div>
                  <div class="foir-result" [class.pass]="calculateLTV() <= 80" [class.fail]="calculateLTV() > 80">
                    @if (calculateLTV() <= 80) {
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      LTV within policy limit (80%)
                    } @else {
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                      LTV exceeds policy limit
                    }
                  </div>
                </div>

                <!-- Eligible Amount -->
                <div class="calc-section eligible">
                  <h4>Eligible Loan Amount</h4>
                  <div class="eligible-amount">
                    ₹{{ formatCurrency(calculateEligibleAmount()) }}
                  </div>
                  @if (calculateEligibleAmount() < (data()?.loan?.amount || 0)) {
                    <p class="eligible-note">
                      Requested amount exceeds eligibility by ₹{{ formatCurrency((data()?.loan?.amount || 0) - calculateEligibleAmount()) }}
                    </p>
                  }
                </div>
              </div>
            </div>

            <!-- Assessment Decision -->
            <div class="section-card decision">
              <div class="section-header">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 11l3 3L22 4"/>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
                <h3>Assessment Decision</h3>
              </div>
              <div class="section-content">
                <div class="form-group">
                  <label>Recommendation</label>
                  <div class="radio-group">
                    <label class="radio-option approve">
                      <input type="radio" name="recommendation" value="approve" [(ngModel)]="recommendation">
                      <span class="radio-label">Recommend Approval</span>
                    </label>
                    <label class="radio-option conditional">
                      <input type="radio" name="recommendation" value="conditional" [(ngModel)]="recommendation">
                      <span class="radio-label">Conditional Approval</span>
                    </label>
                    <label class="radio-option reject">
                      <input type="radio" name="recommendation" value="reject" [(ngModel)]="recommendation">
                      <span class="radio-label">Recommend Rejection</span>
                    </label>
                  </div>
                </div>

                @if (recommendation === 'conditional') {
                  <div class="form-group">
                    <label>Conditions</label>
                    <textarea placeholder="Enter conditions for approval..." rows="3"></textarea>
                  </div>
                }

                <div class="form-group">
                  <label>Assessment Remarks</label>
                  <textarea placeholder="Enter your assessment remarks..." rows="4"></textarea>
                </div>

                <div class="decision-actions">
                  <button class="btn-secondary">Save Draft</button>
                  <button class="btn-primary" [disabled]="!recommendation">
                    Submit Assessment
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-container {
      padding: 24px;
      max-width: 1600px;
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
      align-items: center;
      margin-bottom: 24px;
    }

    .header-left {
      display: flex;
      align-items: center;
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

    .back-btn:hover {
      background: #f3f4f6;
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

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .btn-primary, .btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      font-size: 14px;
      font-weight: 500;
      border-radius: 8px;
      border: none;
      cursor: pointer;
    }

    .btn-primary {
      background: linear-gradient(135deg, #1976d2, #1565c0);
      color: white;
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: white;
      color: #4b5563;
      border: 1px solid #d1d5db;
    }

    .assessment-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    @media (max-width: 1200px) {
      .assessment-grid {
        grid-template-columns: 1fr;
      }
    }

    .section-card {
      background: white;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      margin-bottom: 20px;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 16px 20px;
      border-bottom: 1px solid #e5e7eb;
      background: #f9fafb;
    }

    .section-header svg {
      color: #6b7280;
    }

    .section-header h3 {
      font-size: 15px;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }

    .report-date {
      margin-left: auto;
      font-size: 12px;
      color: #9ca3af;
    }

    .section-content {
      padding: 20px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .info-item .label {
      font-size: 12px;
      color: #6b7280;
    }

    .info-item .value {
      font-size: 14px;
      font-weight: 500;
      color: #1f2937;
    }

    .info-item .value.highlight {
      color: #1976d2;
      font-size: 16px;
      font-weight: 600;
    }

    /* Credit Score */
    .credit-score-display {
      display: flex;
      gap: 24px;
      align-items: flex-start;
    }

    .score-ring {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .score-ring[data-level="excellent"] { background: #d1fae5; }
    .score-ring[data-level="good"] { background: #dbeafe; }
    .score-ring[data-level="fair"] { background: #fef3c7; }
    .score-ring[data-level="poor"] { background: #fee2e2; }

    .score-number {
      font-size: 28px;
      font-weight: 700;
    }

    .score-ring[data-level="excellent"] .score-number { color: #065f46; }
    .score-ring[data-level="good"] .score-number { color: #1e40af; }
    .score-ring[data-level="fair"] .score-number { color: #92400e; }
    .score-ring[data-level="poor"] .score-number { color: #991b1b; }

    .score-label {
      font-size: 11px;
      font-weight: 500;
      text-transform: uppercase;
    }

    .score-breakdown {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .breakdown-item {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
    }

    .breakdown-label {
      color: #6b7280;
    }

    .breakdown-value {
      font-weight: 500;
      color: #1f2937;
    }

    .breakdown-item.warning .breakdown-value {
      color: #dc2626;
    }

    /* Calculator */
    .calc-section {
      margin-bottom: 24px;
      padding-bottom: 20px;
      border-bottom: 1px solid #e5e7eb;
    }

    .calc-section:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }

    .calc-section h4 {
      font-size: 13px;
      font-weight: 600;
      color: #4b5563;
      margin: 0 0 12px 0;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .calc-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 14px;
      color: #4b5563;
    }

    .calc-row.total {
      border-top: 1px solid #e5e7eb;
      margin-top: 8px;
      padding-top: 12px;
      font-weight: 600;
      color: #1f2937;
    }

    .calc-row .warning {
      color: #d97706;
    }

    .calc-row .danger {
      color: #dc2626;
    }

    /* FOIR Display */
    .foir-display {
      margin: 16px 0;
    }

    .foir-value {
      font-size: 32px;
      font-weight: 700;
      color: #16a34a;
      margin-bottom: 8px;
    }

    .foir-display.warning .foir-value {
      color: #d97706;
    }

    .foir-display.danger .foir-value {
      color: #dc2626;
    }

    .foir-bar {
      height: 8px;
      background: #e5e7eb;
      border-radius: 4px;
      position: relative;
      overflow: visible;
    }

    .foir-fill {
      height: 100%;
      background: #16a34a;
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    .foir-display.warning .foir-fill {
      background: #d97706;
    }

    .foir-display.danger .foir-fill {
      background: #dc2626;
    }

    .foir-limit {
      position: absolute;
      top: -4px;
      bottom: -4px;
      width: 2px;
      background: #dc2626;
    }

    .foir-labels {
      display: flex;
      justify-content: space-between;
      margin-top: 4px;
      font-size: 11px;
      color: #9ca3af;
    }

    .limit-label {
      color: #dc2626;
    }

    .foir-result {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      margin-top: 12px;
    }

    .foir-result.pass {
      background: #d1fae5;
      color: #065f46;
    }

    .foir-result.fail {
      background: #fee2e2;
      color: #991b1b;
    }

    /* Eligible Amount */
    .calc-section.eligible {
      background: #eff6ff;
      margin: 0 -20px -20px;
      padding: 20px;
      border-radius: 0 0 12px 12px;
      border-top: 1px solid #dbeafe;
    }

    .eligible-amount {
      font-size: 32px;
      font-weight: 700;
      color: #1976d2;
    }

    .eligible-note {
      font-size: 13px;
      color: #dc2626;
      margin: 8px 0 0 0;
    }

    /* Decision Form */
    .section-card.decision {
      position: sticky;
      top: 24px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      font-size: 13px;
      font-weight: 500;
      color: #4b5563;
      margin-bottom: 8px;
    }

    .radio-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .radio-option {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 14px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .radio-option:hover {
      background: #f9fafb;
    }

    .radio-option input {
      accent-color: #1976d2;
    }

    .radio-option.approve input:checked + .radio-label {
      color: #16a34a;
    }

    .radio-option.conditional input:checked + .radio-label {
      color: #d97706;
    }

    .radio-option.reject input:checked + .radio-label {
      color: #dc2626;
    }

    .form-group textarea {
      width: 100%;
      padding: 12px;
      font-size: 14px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      resize: vertical;
      font-family: inherit;
    }

    .form-group textarea:focus {
      outline: none;
      border-color: #1976d2;
      box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
    }

    .decision-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }
  `]
})
export class AssessmentDetailComponent implements OnInit {
  @Input() id!: string;

  loading = signal(true);
  data = signal<AssessmentData | null>(null);
  recommendation: string = '';

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    setTimeout(() => {
      this.data.set({
        id: parseInt(this.id),
        applicationNumber: 'HLMS-2024-001234',
        customer: {
          name: 'Rajesh Kumar',
          age: 35,
          employmentType: 'Salaried',
          employer: 'Tech Solutions Pvt Ltd',
          designation: 'Senior Manager',
          experience: 12,
          monthlyIncome: 150000,
          otherIncome: 10000
        },
        loan: {
          type: 'Home Purchase',
          amount: 5000000,
          tenure: 240,
          interestRate: 8.5,
          emi: 43391
        },
        creditBureau: {
          score: 780,
          reportDate: '2024-01-10',
          activeAccounts: 3,
          closedAccounts: 5,
          overdueAccounts: 0,
          totalOutstanding: 250000,
          monthlyObligations: 15000
        },
        property: {
          type: 'Apartment',
          location: 'Mumbai, Maharashtra',
          marketValue: 7500000,
          builderName: 'ABC Developers'
        }
      });
      this.loading.set(false);
    }, 500);
  }

  getGrossIncome(): number {
    const d = this.data();
    return (d?.customer?.monthlyIncome || 0) + (d?.customer?.otherIncome || 0);
  }

  getTotalObligations(): number {
    const d = this.data();
    return (d?.creditBureau?.monthlyObligations || 0) + (d?.loan?.emi || 0);
  }

  calculateFOIR(): number {
    const gross = this.getGrossIncome();
    if (!gross) return 0;
    return Math.round((this.getTotalObligations() / gross) * 100);
  }

  calculateLTV(): number {
    const d = this.data();
    if (!d?.property?.marketValue) return 0;
    return Math.round((d.loan.amount / d.property.marketValue) * 100);
  }

  calculateEligibleAmount(): number {
    const gross = this.getGrossIncome();
    const existingEMI = this.data()?.creditBureau?.monthlyObligations || 0;
    const maxFOIR = 0.5;
    const availableForEMI = (gross * maxFOIR) - existingEMI;
    const rate = (this.data()?.loan?.interestRate || 8.5) / 100 / 12;
    const tenure = this.data()?.loan?.tenure || 240;
    const pvFactor = (1 - Math.pow(1 + rate, -tenure)) / rate;
    return Math.round(availableForEMI * pvFactor);
  }

  getScoreLevel(score: number): string {
    if (score >= 750) return 'excellent';
    if (score >= 700) return 'good';
    if (score >= 650) return 'fair';
    return 'poor';
  }

  getScoreLabel(score: number): string {
    if (score >= 750) return 'Excellent';
    if (score >= 700) return 'Good';
    if (score >= 650) return 'Fair';
    return 'Poor';
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('en-IN');
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  submitAssessment(): void {
    console.log('Submitting assessment with recommendation:', this.recommendation);
  }
}
