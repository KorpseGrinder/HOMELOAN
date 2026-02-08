import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <!-- Page Header -->
      <div class="page-header">
        <h1>System Settings</h1>
        <p>Configure system parameters and business rules</p>
      </div>

      <!-- Settings Sections -->
      <div class="settings-grid">
        <!-- Loan Parameters -->
        <div class="settings-card">
          <div class="card-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="5" width="20" height="14" rx="2"/>
              <line x1="2" y1="10" x2="22" y2="10"/>
            </svg>
            <h3>Loan Parameters</h3>
          </div>
          <div class="card-content">
            <div class="setting-group">
              <label>Maximum Loan Amount</label>
              <div class="input-group">
                <span class="input-prefix">₹</span>
                <input type="number" [(ngModel)]="settings.maxLoanAmount" />
                <span class="input-suffix">Cr</span>
              </div>
            </div>
            <div class="setting-group">
              <label>Maximum Tenure (months)</label>
              <input type="number" [(ngModel)]="settings.maxTenure" />
            </div>
            <div class="setting-group">
              <label>Base Interest Rate (%)</label>
              <input type="number" [(ngModel)]="settings.baseInterestRate" step="0.01" />
            </div>
            <div class="setting-group">
              <label>Processing Fee (%)</label>
              <input type="number" [(ngModel)]="settings.processingFee" step="0.01" />
            </div>
          </div>
        </div>

        <!-- Eligibility Rules -->
        <div class="settings-card">
          <div class="card-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 12l2 2 4-4"/>
              <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
            </svg>
            <h3>Eligibility Rules</h3>
          </div>
          <div class="card-content">
            <div class="setting-group">
              <label>Maximum FOIR (%)</label>
              <input type="number" [(ngModel)]="settings.maxFOIR" />
            </div>
            <div class="setting-group">
              <label>Maximum LTV (%)</label>
              <input type="number" [(ngModel)]="settings.maxLTV" />
            </div>
            <div class="setting-group">
              <label>Minimum Credit Score</label>
              <input type="number" [(ngModel)]="settings.minCreditScore" />
            </div>
            <div class="setting-group">
              <label>Minimum Age (years)</label>
              <input type="number" [(ngModel)]="settings.minAge" />
            </div>
            <div class="setting-group">
              <label>Maximum Age at Maturity (years)</label>
              <input type="number" [(ngModel)]="settings.maxAgeAtMaturity" />
            </div>
          </div>
        </div>

        <!-- NPA Classification -->
        <div class="settings-card">
          <div class="card-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <h3>NPA Classification (IRAC Norms)</h3>
          </div>
          <div class="card-content">
            <div class="setting-group">
              <label>NPA Threshold (DPD)</label>
              <input type="number" [(ngModel)]="settings.npaThreshold" />
            </div>
            <div class="setting-group">
              <label>Sub-Standard Provision (%)</label>
              <input type="number" [(ngModel)]="settings.subStandardProvision" />
            </div>
            <div class="setting-group">
              <label>Doubtful 1 Year Provision (%)</label>
              <input type="number" [(ngModel)]="settings.doubtful1Provision" />
            </div>
            <div class="setting-group">
              <label>Doubtful 2 Year Provision (%)</label>
              <input type="number" [(ngModel)]="settings.doubtful2Provision" />
            </div>
            <div class="setting-group">
              <label>Loss Provision (%)</label>
              <input type="number" [(ngModel)]="settings.lossProvision" />
            </div>
          </div>
        </div>

        <!-- Notification Settings -->
        <div class="settings-card">
          <div class="card-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <h3>Notifications</h3>
          </div>
          <div class="card-content">
            <div class="setting-group toggle">
              <label>Email Notifications</label>
              <label class="switch">
                <input type="checkbox" [(ngModel)]="settings.emailNotifications">
                <span class="slider"></span>
              </label>
            </div>
            <div class="setting-group toggle">
              <label>SMS Notifications</label>
              <label class="switch">
                <input type="checkbox" [(ngModel)]="settings.smsNotifications">
                <span class="slider"></span>
              </label>
            </div>
            <div class="setting-group toggle">
              <label>EMI Reminder (days before)</label>
              <input type="number" [(ngModel)]="settings.emiReminderDays" />
            </div>
            <div class="setting-group toggle">
              <label>Overdue Alert</label>
              <label class="switch">
                <input type="checkbox" [(ngModel)]="settings.overdueAlert">
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>

        <!-- Authority Matrix -->
        <div class="settings-card wide">
          <div class="card-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <h3>Approval Authority Matrix</h3>
          </div>
          <div class="card-content">
            <table class="authority-table">
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Sanction Limit</th>
                  <th>Can Approve</th>
                  <th>Can Reject</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Relationship Manager</td>
                  <td>₹0 (Initiate Only)</td>
                  <td><span class="badge no">No</span></td>
                  <td><span class="badge no">No</span></td>
                </tr>
                <tr>
                  <td>Credit Officer</td>
                  <td>₹25 Lakhs</td>
                  <td><span class="badge yes">Yes</span></td>
                  <td><span class="badge yes">Yes</span></td>
                </tr>
                <tr>
                  <td>Branch Manager</td>
                  <td>₹1 Crore</td>
                  <td><span class="badge yes">Yes</span></td>
                  <td><span class="badge yes">Yes</span></td>
                </tr>
                <tr>
                  <td>Regional Manager</td>
                  <td>₹5 Crores</td>
                  <td><span class="badge yes">Yes</span></td>
                  <td><span class="badge yes">Yes</span></td>
                </tr>
                <tr>
                  <td>Credit Head</td>
                  <td>Unlimited</td>
                  <td><span class="badge yes">Yes</span></td>
                  <td><span class="badge yes">Yes</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="save-section">
        <button class="btn-secondary">Reset to Defaults</button>
        <button class="btn-primary" (click)="saveSettings()">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
            <polyline points="17 21 17 13 7 13 7 21"/>
            <polyline points="7 3 7 8 15 8"/>
          </svg>
          Save Settings
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
      margin-bottom: 24px;
    }

    .page-header h1 {
      font-size: 24px;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 4px 0;
    }

    .page-header p {
      font-size: 14px;
      color: #6b7280;
      margin: 0;
    }

    .settings-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-bottom: 24px;
    }

    .settings-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      overflow: hidden;
    }

    .settings-card.wide {
      grid-column: 1 / -1;
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 16px 20px;
      background: #f9fafb;
      border-bottom: 1px solid #e5e7eb;
    }

    .card-header svg {
      color: #6b7280;
    }

    .card-header h3 {
      font-size: 15px;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }

    .card-content {
      padding: 20px;
    }

    .setting-group {
      margin-bottom: 16px;
    }

    .setting-group:last-child {
      margin-bottom: 0;
    }

    .setting-group label {
      display: block;
      font-size: 13px;
      font-weight: 500;
      color: #4b5563;
      margin-bottom: 6px;
    }

    .setting-group input[type="number"],
    .setting-group input[type="text"] {
      width: 100%;
      height: 40px;
      padding: 0 12px;
      font-size: 14px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      outline: none;
    }

    .setting-group input:focus {
      border-color: #1976d2;
      box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
    }

    .input-group {
      display: flex;
      align-items: center;
    }

    .input-prefix, .input-suffix {
      padding: 0 10px;
      height: 40px;
      display: flex;
      align-items: center;
      background: #f3f4f6;
      border: 1px solid #d1d5db;
      font-size: 14px;
      color: #6b7280;
    }

    .input-prefix {
      border-radius: 6px 0 0 6px;
      border-right: none;
    }

    .input-suffix {
      border-radius: 0 6px 6px 0;
      border-left: none;
    }

    .input-group input {
      border-radius: 0;
    }

    .setting-group.toggle {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .setting-group.toggle label:first-child {
      margin-bottom: 0;
    }

    .switch {
      position: relative;
      display: inline-block;
      width: 44px;
      height: 24px;
    }

    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #d1d5db;
      transition: 0.3s;
      border-radius: 24px;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: 0.3s;
      border-radius: 50%;
    }

    input:checked + .slider {
      background-color: #1976d2;
    }

    input:checked + .slider:before {
      transform: translateX(20px);
    }

    .authority-table {
      width: 100%;
      border-collapse: collapse;
    }

    .authority-table th {
      text-align: left;
      padding: 12px 16px;
      font-size: 12px;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      background: #f9fafb;
      border-bottom: 1px solid #e5e7eb;
    }

    .authority-table td {
      padding: 12px 16px;
      font-size: 14px;
      color: #4b5563;
      border-bottom: 1px solid #f3f4f6;
    }

    .badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 500;
    }

    .badge.yes {
      background: #d1fae5;
      color: #065f46;
    }

    .badge.no {
      background: #fee2e2;
      color: #991b1b;
    }

    .save-section {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
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

    .btn-secondary {
      background: white;
      color: #4b5563;
      border: 1px solid #d1d5db;
    }

    @media (max-width: 768px) {
      .settings-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SettingsComponent {
  settings = {
    maxLoanAmount: 10,
    maxTenure: 360,
    baseInterestRate: 8.5,
    processingFee: 0.5,
    maxFOIR: 50,
    maxLTV: 80,
    minCreditScore: 650,
    minAge: 21,
    maxAgeAtMaturity: 70,
    npaThreshold: 90,
    subStandardProvision: 15,
    doubtful1Provision: 25,
    doubtful2Provision: 50,
    lossProvision: 100,
    emailNotifications: true,
    smsNotifications: true,
    emiReminderDays: 5,
    overdueAlert: true
  };

  saveSettings(): void {
    console.log('Saving settings:', this.settings);
  }
}
