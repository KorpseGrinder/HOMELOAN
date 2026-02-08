import { Component, OnInit, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-application-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, MatSnackBarModule],
  template: `
    <div class="page-container">
      <!-- Page Header -->
      <div class="page-header">
        <a routerLink="/applications" class="back-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </a>
        <div>
          <h1>{{ id ? 'Edit Application' : 'New Loan Application' }}</h1>
          <p>Complete all steps to submit the application</p>
        </div>
      </div>

      <!-- Stepper -->
      <div class="stepper-container">
        <div class="stepper">
          @for (step of steps; track step.id; let i = $index) {
            <div class="step" [class.active]="currentStep() === i" [class.completed]="currentStep() > i">
              <div class="step-number">
                @if (currentStep() > i) {
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                } @else {
                  {{ i + 1 }}
                }
              </div>
              <span class="step-label">{{ step.label }}</span>
            </div>
          }
        </div>
      </div>

      <!-- Form Content -->
      <div class="form-card">
        <!-- Step 1: Customer -->
        @if (currentStep() === 0) {
          <form [formGroup]="customerForm">
            <h3>Personal Information</h3>

            <div class="form-grid">
              <div class="form-group">
                <label for="firstName">First Name <span class="required">*</span></label>
                <input type="text" id="firstName" formControlName="firstName" placeholder="Enter first name">
                @if (customerForm.get('firstName')?.invalid && customerForm.get('firstName')?.touched) {
                  <span class="error">First name is required</span>
                }
              </div>

              <div class="form-group">
                <label for="lastName">Last Name <span class="required">*</span></label>
                <input type="text" id="lastName" formControlName="lastName" placeholder="Enter last name">
                @if (customerForm.get('lastName')?.invalid && customerForm.get('lastName')?.touched) {
                  <span class="error">Last name is required</span>
                }
              </div>

              <div class="form-group">
                <label for="email">Email <span class="required">*</span></label>
                <input type="email" id="email" formControlName="email" placeholder="Enter email address">
                @if (customerForm.get('email')?.hasError('email')) {
                  <span class="error">Invalid email format</span>
                }
              </div>

              <div class="form-group">
                <label for="phone">Phone Number <span class="required">*</span></label>
                <input type="tel" id="phone" formControlName="phone" placeholder="10-digit mobile number">
                @if (customerForm.get('phone')?.hasError('pattern')) {
                  <span class="error">Invalid phone number</span>
                }
              </div>

              <div class="form-group">
                <label for="panNumber">PAN Number <span class="required">*</span></label>
                <input type="text" id="panNumber" formControlName="panNumber" placeholder="ABCDE1234F" class="uppercase">
                @if (customerForm.get('panNumber')?.hasError('pattern')) {
                  <span class="error">Invalid PAN format</span>
                }
              </div>

              <div class="form-group">
                <label for="dateOfBirth">Date of Birth <span class="required">*</span></label>
                <input type="date" id="dateOfBirth" formControlName="dateOfBirth">
              </div>

              <div class="form-group">
                <label for="employmentType">Employment Type <span class="required">*</span></label>
                <select id="employmentType" formControlName="employmentType">
                  <option value="">Select employment type</option>
                  <option value="SALARIED">Salaried</option>
                  <option value="SELF_EMPLOYED">Self Employed</option>
                  <option value="BUSINESS">Business Owner</option>
                  <option value="PROFESSIONAL">Professional</option>
                </select>
              </div>

              <div class="form-group">
                <label for="monthlyIncome">Monthly Income (₹) <span class="required">*</span></label>
                <input type="number" id="monthlyIncome" formControlName="monthlyIncome" placeholder="Enter monthly income">
              </div>
            </div>

            <div class="form-actions">
              <span></span>
              <button type="button" class="btn-primary" (click)="nextStep()" [disabled]="customerForm.invalid">
                Next: Loan Details
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </form>
        }

        <!-- Step 2: Loan Details -->
        @if (currentStep() === 1) {
          <form [formGroup]="loanForm">
            <h3>Loan Information</h3>

            <div class="form-grid">
              <div class="form-group">
                <label for="loanType">Loan Type <span class="required">*</span></label>
                <select id="loanType" formControlName="loanType">
                  <option value="">Select loan type</option>
                  <option value="HOME_LOAN">Home Loan</option>
                  <option value="HOME_CONSTRUCTION">Home Construction</option>
                  <option value="HOME_IMPROVEMENT">Home Improvement</option>
                  <option value="LAND_PURCHASE">Land Purchase</option>
                  <option value="BALANCE_TRANSFER">Balance Transfer</option>
                </select>
              </div>

              <div class="form-group">
                <label for="loanPurpose">Loan Purpose <span class="required">*</span></label>
                <select id="loanPurpose" formControlName="loanPurpose">
                  <option value="">Select purpose</option>
                  <option value="PURCHASE">Purchase</option>
                  <option value="CONSTRUCTION">Construction</option>
                  <option value="RENOVATION">Renovation</option>
                  <option value="EXTENSION">Extension</option>
                </select>
              </div>

              <div class="form-group">
                <label for="loanAmount">Loan Amount (₹) <span class="required">*</span></label>
                <input type="number" id="loanAmount" formControlName="loanAmount" placeholder="Enter loan amount">
                @if (loanForm.get('loanAmount')?.hasError('min')) {
                  <span class="error">Minimum ₹1,00,000</span>
                }
                @if (loanForm.get('loanAmount')?.hasError('max')) {
                  <span class="error">Maximum ₹10,00,00,000</span>
                }
              </div>

              <div class="form-group">
                <label for="tenure">Tenure <span class="required">*</span></label>
                <select id="tenure" formControlName="tenure">
                  <option value="">Select tenure</option>
                  <option [value]="60">5 Years (60 months)</option>
                  <option [value]="120">10 Years (120 months)</option>
                  <option [value]="180">15 Years (180 months)</option>
                  <option [value]="240">20 Years (240 months)</option>
                  <option [value]="300">25 Years (300 months)</option>
                  <option [value]="360">30 Years (360 months)</option>
                </select>
              </div>
            </div>

            @if (loanForm.get('loanAmount')?.value && loanForm.get('tenure')?.value) {
              <div class="emi-card">
                <div class="emi-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="M12 9v6M9 12h6"/>
                  </svg>
                </div>
                <div class="emi-details">
                  <span class="emi-label">Estimated EMI</span>
                  <span class="emi-value">₹{{ calculateEMI() }}</span>
                  <span class="emi-note">&#64; 8.5% p.a. (indicative rate)</span>
                </div>
              </div>
            }

            <div class="form-actions">
              <button type="button" class="btn-secondary" (click)="prevStep()">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back
              </button>
              <button type="button" class="btn-primary" (click)="nextStep()" [disabled]="loanForm.invalid">
                Next: Property
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </form>
        }

        <!-- Step 3: Property -->
        @if (currentStep() === 2) {
          <form [formGroup]="propertyForm">
            <h3>Property Information</h3>

            <div class="form-grid">
              <div class="form-group">
                <label for="propertyType">Property Type <span class="required">*</span></label>
                <select id="propertyType" formControlName="propertyType">
                  <option value="">Select property type</option>
                  <option value="FLAT">Flat / Apartment</option>
                  <option value="INDEPENDENT_HOUSE">Independent House</option>
                  <option value="VILLA">Villa</option>
                  <option value="ROW_HOUSE">Row House</option>
                  <option value="PLOT">Plot / Land</option>
                </select>
              </div>

              <div class="form-group">
                <label for="propertyValue">Property Value (₹) <span class="required">*</span></label>
                <input type="number" id="propertyValue" formControlName="propertyValue" placeholder="Enter property value">
              </div>

              <div class="form-group full-width">
                <label for="addressLine1">Address Line 1 <span class="required">*</span></label>
                <input type="text" id="addressLine1" formControlName="addressLine1" placeholder="Flat/House No, Building Name">
              </div>

              <div class="form-group full-width">
                <label for="addressLine2">Address Line 2</label>
                <input type="text" id="addressLine2" formControlName="addressLine2" placeholder="Street, Area, Landmark">
              </div>

              <div class="form-group">
                <label for="city">City <span class="required">*</span></label>
                <input type="text" id="city" formControlName="city" placeholder="Enter city">
              </div>

              <div class="form-group">
                <label for="state">State <span class="required">*</span></label>
                <select id="state" formControlName="state">
                  <option value="">Select state</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Telangana">Telangana</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Kerala">Kerala</option>
                </select>
              </div>

              <div class="form-group">
                <label for="pincode">PIN Code <span class="required">*</span></label>
                <input type="text" id="pincode" formControlName="pincode" placeholder="6-digit PIN code">
                @if (propertyForm.get('pincode')?.hasError('pattern')) {
                  <span class="error">Invalid PIN code</span>
                }
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="btn-secondary" (click)="prevStep()">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back
              </button>
              <button type="button" class="btn-primary" (click)="nextStep()" [disabled]="propertyForm.invalid">
                Next: Review
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </form>
        }

        <!-- Step 4: Review -->
        @if (currentStep() === 3) {
          <div>
            <h3>Application Summary</h3>

            <div class="summary-grid">
              <div class="summary-card">
                <div class="summary-header">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  Customer Details
                </div>
                <div class="summary-body">
                  <div class="summary-row"><span>Name</span><strong>{{ customerForm.value.firstName }} {{ customerForm.value.lastName }}</strong></div>
                  <div class="summary-row"><span>Email</span><strong>{{ customerForm.value.email }}</strong></div>
                  <div class="summary-row"><span>Phone</span><strong>{{ customerForm.value.phone }}</strong></div>
                  <div class="summary-row"><span>PAN</span><strong>{{ customerForm.value.panNumber }}</strong></div>
                  <div class="summary-row"><span>Income</span><strong>₹{{ formatCurrency(customerForm.value.monthlyIncome) }}/month</strong></div>
                </div>
              </div>

              <div class="summary-card">
                <div class="summary-header">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="M12 9v6M9 12h6"/>
                  </svg>
                  Loan Details
                </div>
                <div class="summary-body">
                  <div class="summary-row"><span>Type</span><strong>{{ formatLoanType(loanForm.value.loanType) }}</strong></div>
                  <div class="summary-row"><span>Amount</span><strong>₹{{ formatCurrency(loanForm.value.loanAmount) }}</strong></div>
                  <div class="summary-row"><span>Tenure</span><strong>{{ loanForm.value.tenure }} months</strong></div>
                  <div class="summary-row highlight"><span>Est. EMI</span><strong>₹{{ calculateEMI() }}</strong></div>
                </div>
              </div>

              <div class="summary-card full-width">
                <div class="summary-header">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                  Property Details
                </div>
                <div class="summary-body">
                  <div class="summary-row"><span>Type</span><strong>{{ formatPropertyType(propertyForm.value.propertyType) }}</strong></div>
                  <div class="summary-row"><span>Value</span><strong>₹{{ formatCurrency(propertyForm.value.propertyValue) }}</strong></div>
                  <div class="summary-row">
                    <span>Address</span>
                    <strong>
                      {{ propertyForm.value.addressLine1 }}{{ propertyForm.value.addressLine2 ? ', ' + propertyForm.value.addressLine2 : '' }}<br>
                      {{ propertyForm.value.city }}, {{ propertyForm.value.state }} - {{ propertyForm.value.pincode }}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="btn-secondary" (click)="prevStep()">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back
              </button>
              <div class="submit-actions">
                <button type="button" class="btn-secondary" (click)="saveDraft()" [disabled]="submitting()">
                  Save Draft
                </button>
                <button type="button" class="btn-primary" (click)="submit()" [disabled]="submitting()">
                  @if (submitting()) {
                    <div class="spinner"></div>
                  } @else {
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                  }
                  Submit Application
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
      max-width: 900px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 24px;
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
      cursor: pointer;
      transition: all 0.15s;
    }

    .back-btn:hover {
      background: #f9fafb;
      color: #1f2937;
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

    .stepper-container {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px 12px 0 0;
      padding: 20px 24px;
    }

    .stepper {
      display: flex;
      justify-content: space-between;
    }

    .step {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .step-number {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #e5e7eb;
      border-radius: 50%;
      font-size: 14px;
      font-weight: 600;
      color: #6b7280;
      transition: all 0.2s;
    }

    .step.active .step-number {
      background: #1976d2;
      color: white;
    }

    .step.completed .step-number {
      background: #16a34a;
      color: white;
    }

    .step-label {
      font-size: 14px;
      font-weight: 500;
      color: #6b7280;
    }

    .step.active .step-label {
      color: #1f2937;
    }

    @media (max-width: 640px) {
      .step-label {
        display: none;
      }
    }

    .form-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-top: none;
      border-radius: 0 0 12px 12px;
      padding: 24px;
    }

    .form-card h3 {
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 20px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    @media (max-width: 640px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    .form-group label {
      font-size: 14px;
      font-weight: 500;
      color: #374151;
      margin-bottom: 6px;
    }

    .required {
      color: #dc2626;
    }

    .form-group input,
    .form-group select {
      height: 44px;
      padding: 0 12px;
      font-size: 14px;
      color: #1f2937;
      background: white;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      outline: none;
      transition: all 0.15s;
    }

    .form-group input::placeholder {
      color: #9ca3af;
    }

    .form-group input:focus,
    .form-group select:focus {
      border-color: #1976d2;
      box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
    }

    .form-group input.uppercase {
      text-transform: uppercase;
    }

    .form-group .error {
      font-size: 12px;
      color: #dc2626;
      margin-top: 4px;
    }

    .emi-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: linear-gradient(135deg, #eff6ff, #dbeafe);
      border-radius: 10px;
      margin-top: 20px;
    }

    .emi-icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      border-radius: 10px;
      color: #1976d2;
    }

    .emi-details {
      display: flex;
      flex-direction: column;
    }

    .emi-label {
      font-size: 12px;
      font-weight: 500;
      color: #1e40af;
    }

    .emi-value {
      font-size: 24px;
      font-weight: 700;
      color: #1976d2;
    }

    .emi-note {
      font-size: 12px;
      color: #6b7280;
    }

    .form-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
    }

    .submit-actions {
      display: flex;
      gap: 12px;
    }

    .btn-primary,
    .btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      height: 44px;
      padding: 0 20px;
      font-size: 14px;
      font-weight: 500;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.15s;
      border: none;
    }

    .btn-primary {
      background: linear-gradient(135deg, #1976d2, #1565c0);
      color: white;
      box-shadow: 0 2px 8px rgba(25, 118, 210, 0.3);
    }

    .btn-primary:hover:not(:disabled) {
      box-shadow: 0 4px 12px rgba(25, 118, 210, 0.4);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: white;
      color: #4b5563;
      border: 1px solid #d1d5db;
    }

    .btn-secondary:hover {
      background: #f9fafb;
    }

    .spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    @media (max-width: 640px) {
      .summary-grid {
        grid-template-columns: 1fr;
      }
    }

    .summary-card {
      background: #f9fafb;
      border-radius: 10px;
      overflow: hidden;
    }

    .summary-card.full-width {
      grid-column: 1 / -1;
    }

    .summary-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: #f3f4f6;
      font-size: 14px;
      font-weight: 600;
      color: #4b5563;
    }

    .summary-body {
      padding: 16px;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 14px;
      border-bottom: 1px solid #e5e7eb;
    }

    .summary-row:last-child {
      border-bottom: none;
    }

    .summary-row span {
      color: #6b7280;
    }

    .summary-row strong {
      color: #1f2937;
      text-align: right;
    }

    .summary-row.highlight {
      background: #eff6ff;
      margin: 8px -16px -16px;
      padding: 12px 16px;
      border-radius: 0 0 10px 10px;
      border-bottom: none;
    }

    .summary-row.highlight strong {
      color: #1976d2;
      font-size: 16px;
    }
  `]
})
export class ApplicationFormComponent implements OnInit {
  @Input() id?: string;

  steps = [
    { id: 'customer', label: 'Customer' },
    { id: 'loan', label: 'Loan Details' },
    { id: 'property', label: 'Property' },
    { id: 'review', label: 'Review' }
  ];

  currentStep = signal(0);
  submitting = signal(false);

  customerForm!: FormGroup;
  loanForm!: FormGroup;
  propertyForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForms();
    if (this.id) {
      this.loadApplication();
    }
  }

  initForms(): void {
    this.customerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      panNumber: ['', [Validators.required, Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i)]],
      dateOfBirth: ['', Validators.required],
      employmentType: ['', Validators.required],
      monthlyIncome: ['', [Validators.required, Validators.min(10000)]]
    });

    this.loanForm = this.fb.group({
      loanType: ['', Validators.required],
      loanPurpose: ['', Validators.required],
      loanAmount: ['', [Validators.required, Validators.min(100000), Validators.max(100000000)]],
      tenure: ['', Validators.required]
    });

    this.propertyForm = this.fb.group({
      propertyType: ['', Validators.required],
      propertyValue: ['', [Validators.required, Validators.min(100000)]],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
  }

  loadApplication(): void {
    this.apiService.get(`/applications/${this.id}`).subscribe({
      next: (data: any) => {
        this.customerForm.patchValue(data.customer);
        this.loanForm.patchValue(data.loan);
        this.propertyForm.patchValue(data.property);
      }
    });
  }

  nextStep(): void {
    if (this.currentStep() < 3) {
      this.currentStep.update(s => s + 1);
    }
  }

  prevStep(): void {
    if (this.currentStep() > 0) {
      this.currentStep.update(s => s - 1);
    }
  }

  calculateEMI(): string {
    const principal = this.loanForm.value.loanAmount || 0;
    const tenure = this.loanForm.value.tenure || 240;
    const rate = 8.5 / 12 / 100;
    if (principal <= 0 || tenure <= 0) return '0';
    const emi = principal * rate * Math.pow(1 + rate, tenure) / (Math.pow(1 + rate, tenure) - 1);
    return Math.round(emi).toLocaleString('en-IN');
  }

  formatCurrency(value: number): string {
    return value ? value.toLocaleString('en-IN') : '0';
  }

  formatLoanType(type: string): string {
    return type ? type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) : '';
  }

  formatPropertyType(type: string): string {
    return type ? type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) : '';
  }

  saveDraft(): void {
    const data = { customer: this.customerForm.value, loan: this.loanForm.value, property: this.propertyForm.value, status: 'DRAFT' };
    this.apiService.post('/applications/leads', data).subscribe({
      next: () => {
        this.snackBar.open('Draft saved!', 'Close', { duration: 3000 });
        this.router.navigate(['/applications']);
      },
      error: () => {
        this.snackBar.open('Draft saved (demo)', 'Close', { duration: 3000 });
        this.router.navigate(['/applications']);
      }
    });
  }

  submit(): void {
    if (this.customerForm.invalid || this.loanForm.invalid || this.propertyForm.invalid) {
      this.snackBar.open('Please complete all fields', 'Close', { duration: 3000 });
      return;
    }
    this.submitting.set(true);
    const data = { customer: this.customerForm.value, loan: this.loanForm.value, property: this.propertyForm.value, status: 'PENDING' };
    this.apiService.post('/applications/leads', data).subscribe({
      next: () => {
        this.snackBar.open('Application submitted!', 'Close', { duration: 3000 });
        this.router.navigate(['/applications']);
      },
      error: () => {
        this.snackBar.open('Submitted (demo)', 'Close', { duration: 3000 });
        this.router.navigate(['/applications']);
      },
      complete: () => this.submitting.set(false)
    });
  }
}
