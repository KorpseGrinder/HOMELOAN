import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface ReportCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  lastGenerated?: string;
}

@Component({
  selector: 'app-reports-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-container">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <h1>Reports & Analytics</h1>
          <p>Generate and download management reports</p>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="quick-stats">
        <div class="stat-card">
          <div class="stat-icon blue">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">1,247</span>
            <span class="stat-label">Total Applications</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">₹89.2 Cr</span>
            <span class="stat-label">Total Portfolio</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon purple">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">892</span>
            <span class="stat-label">Active Customers</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon red">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">1.34%</span>
            <span class="stat-label">NPA Ratio</span>
          </div>
        </div>
      </div>

      <!-- Reports Categories -->
      <div class="reports-section">
        <h2>Available Reports</h2>

        <div class="category-section">
          <h3>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
              <path d="M9 12l2 2 4-4"/>
            </svg>
            Portfolio Reports
          </h3>
          <div class="reports-grid">
            @for (report of portfolioReports; track report.id) {
              <div class="report-card">
                <div class="report-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                </div>
                <div class="report-info">
                  <h4>{{ report.title }}</h4>
                  <p>{{ report.description }}</p>
                </div>
                <button class="btn-generate" [class.loading]="generatingReport() === report.id" [disabled]="generatingReport() !== null" (click)="generateReport(report)">
                  @if (generatingReport() === report.id) {
                    <span class="spinner-small"></span>
                    Generating...
                  } @else {
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Generate
                  }
                </button>
              </div>
            }
          </div>
        </div>

        <div class="category-section">
          <h3>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            Disbursement Reports
          </h3>
          <div class="reports-grid">
            @for (report of disbursementReports; track report.id) {
              <div class="report-card">
                <div class="report-icon green">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="5" width="20" height="14" rx="2"/>
                    <line x1="2" y1="10" x2="22" y2="10"/>
                  </svg>
                </div>
                <div class="report-info">
                  <h4>{{ report.title }}</h4>
                  <p>{{ report.description }}</p>
                </div>
                <button class="btn-generate" [class.loading]="generatingReport() === report.id" [disabled]="generatingReport() !== null" (click)="generateReport(report)">
                  @if (generatingReport() === report.id) {
                    <span class="spinner-small"></span>
                    Generating...
                  } @else {
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Generate
                  }
                </button>
              </div>
            }
          </div>
        </div>

        <div class="category-section">
          <h3>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            Risk & Collection Reports
          </h3>
          <div class="reports-grid">
            @for (report of riskReports; track report.id) {
              <div class="report-card">
                <div class="report-icon red">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                  </svg>
                </div>
                <div class="report-info">
                  <h4>{{ report.title }}</h4>
                  <p>{{ report.description }}</p>
                </div>
                <button class="btn-generate" [class.loading]="generatingReport() === report.id" [disabled]="generatingReport() !== null" (click)="generateReport(report)">
                  @if (generatingReport() === report.id) {
                    <span class="spinner-small"></span>
                    Generating...
                  } @else {
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Generate
                  }
                </button>
              </div>
            }
          </div>
        </div>

        <div class="category-section">
          <h3>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M3 9h18"/>
              <path d="M9 21V9"/>
            </svg>
            Regulatory Reports
          </h3>
          <div class="reports-grid">
            @for (report of regulatoryReports; track report.id) {
              <div class="report-card">
                <div class="report-icon purple">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
                    <path d="M9 12l2 2 4-4"/>
                  </svg>
                </div>
                <div class="report-info">
                  <h4>{{ report.title }}</h4>
                  <p>{{ report.description }}</p>
                </div>
                <button class="btn-generate" [class.loading]="generatingReport() === report.id" [disabled]="generatingReport() !== null" (click)="generateReport(report)">
                  @if (generatingReport() === report.id) {
                    <span class="spinner-small"></span>
                    Generating...
                  } @else {
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Generate
                  }
                </button>
              </div>
            }
          </div>
        </div>
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

    .quick-stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 32px;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 16px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 20px;
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
    }

    .stat-icon.blue { background: #eff6ff; color: #2563eb; }
    .stat-icon.green { background: #f0fdf4; color: #16a34a; }
    .stat-icon.purple { background: #faf5ff; color: #9333ea; }
    .stat-icon.red { background: #fef2f2; color: #dc2626; }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 20px;
      font-weight: 700;
      color: #1f2937;
    }

    .stat-label {
      font-size: 13px;
      color: #6b7280;
    }

    .reports-section h2 {
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 24px 0;
    }

    .category-section {
      margin-bottom: 32px;
    }

    .category-section h3 {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 15px;
      font-weight: 600;
      color: #4b5563;
      margin: 0 0 16px 0;
    }

    .category-section h3 svg {
      color: #6b7280;
    }

    .reports-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    .report-card {
      display: flex;
      align-items: center;
      gap: 16px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      padding: 16px 20px;
      transition: all 0.15s ease;
    }

    .report-card:hover {
      border-color: #d1d5db;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .report-icon {
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #eff6ff;
      border-radius: 8px;
      color: #2563eb;
      flex-shrink: 0;
    }

    .report-icon.green { background: #f0fdf4; color: #16a34a; }
    .report-icon.red { background: #fef2f2; color: #dc2626; }
    .report-icon.purple { background: #faf5ff; color: #9333ea; }

    .report-info {
      flex: 1;
    }

    .report-info h4 {
      font-size: 14px;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 4px 0;
    }

    .report-info p {
      font-size: 13px;
      color: #6b7280;
      margin: 0;
    }

    .btn-generate {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      background: #1976d2;
      color: white;
      font-size: 13px;
      font-weight: 500;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.15s ease;
    }

    .btn-generate:hover:not(:disabled) {
      background: #1565c0;
    }

    .btn-generate:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-generate.loading {
      background: #1976d2;
    }

    .spinner-small {
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 1024px) {
      .quick-stats {
        grid-template-columns: repeat(2, 1fr);
      }
      .reports-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ReportsDashboardComponent {
  generatingReport = signal<string | null>(null);
  generatedReports = signal<{ id: string; filename: string; generatedAt: Date }[]>([]);

  portfolioReports: ReportCard[] = [
    { id: 'portfolio-summary', title: 'Portfolio Summary', description: 'Overview of total portfolio with segmentation', icon: 'description', category: 'portfolio' },
    { id: 'sanctioned-disbursed', title: 'Sanctioned vs Disbursed', description: 'Comparison of sanctioned and disbursed amounts', icon: 'compare', category: 'portfolio' },
    { id: 'product-wise', title: 'Product-wise Analysis', description: 'Portfolio breakdown by loan products', icon: 'pie_chart', category: 'portfolio' },
    { id: 'branch-wise', title: 'Branch-wise Performance', description: 'Performance metrics by branch', icon: 'business', category: 'portfolio' }
  ];

  disbursementReports: ReportCard[] = [
    { id: 'daily-disbursement', title: 'Daily Disbursement', description: 'Day-wise disbursement summary', icon: 'today', category: 'disbursement' },
    { id: 'monthly-trend', title: 'Monthly Disbursement Trend', description: 'Month-over-month disbursement analysis', icon: 'trending_up', category: 'disbursement' },
    { id: 'pending-disbursement', title: 'Pending Disbursements', description: 'List of sanctioned but pending disbursements', icon: 'pending', category: 'disbursement' }
  ];

  riskReports: ReportCard[] = [
    { id: 'dpd-aging', title: 'DPD Aging Report', description: 'Aging analysis of overdue accounts', icon: 'schedule', category: 'risk' },
    { id: 'npa-report', title: 'NPA Report', description: 'Non-performing assets with provisioning', icon: 'warning', category: 'risk' },
    { id: 'collection-efficiency', title: 'Collection Efficiency', description: 'Collection performance metrics', icon: 'assessment', category: 'risk' },
    { id: 'overdue-summary', title: 'Overdue Summary', description: 'Summary of all overdue accounts', icon: 'error_outline', category: 'risk' }
  ];

  regulatoryReports: ReportCard[] = [
    { id: 'rbi-return', title: 'RBI Regulatory Return', description: 'Quarterly return as per RBI guidelines', icon: 'gavel', category: 'regulatory' },
    { id: 'irac-provisioning', title: 'IRAC Provisioning', description: 'Provisioning as per IRAC norms', icon: 'account_balance', category: 'regulatory' },
    { id: 'cibil-submission', title: 'CIBIL Submission', description: 'Monthly CIBIL data submission', icon: 'verified', category: 'regulatory' }
  ];

  generateReport(report: ReportCard): void {
    if (this.generatingReport()) return; // Prevent multiple clicks

    this.generatingReport.set(report.id);

    // Simulate report generation delay
    setTimeout(() => {
      const now = new Date();
      const filename = `${report.id}_${now.toISOString().split('T')[0]}.xlsx`;

      // Add to generated reports list
      this.generatedReports.update(reports => [
        { id: report.id, filename, generatedAt: now },
        ...reports.slice(0, 9) // Keep last 10
      ]);

      // Create and download a sample file
      this.downloadReport(report, filename);

      this.generatingReport.set(null);
    }, 1500);
  }

  private downloadReport(report: ReportCard, filename: string): void {
    // Generate sample CSV content based on report type
    let content = '';
    const now = new Date().toLocaleString();

    switch (report.category) {
      case 'portfolio':
        content = this.generatePortfolioCSV(report);
        break;
      case 'disbursement':
        content = this.generateDisbursementCSV(report);
        break;
      case 'risk':
        content = this.generateRiskCSV(report);
        break;
      case 'regulatory':
        content = this.generateRegulatoryCSV(report);
        break;
      default:
        content = `Report: ${report.title}\nGenerated: ${now}\n\nNo data available.`;
    }

    // Create blob and download
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.replace('.xlsx', '.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  private generatePortfolioCSV(report: ReportCard): string {
    const now = new Date().toLocaleString();
    let csv = `HLMS - ${report.title}\nGenerated: ${now}\n\n`;

    if (report.id === 'portfolio-summary') {
      csv += 'Metric,Value\n';
      csv += 'Total Portfolio,89.2 Cr\n';
      csv += 'Total Accounts,892\n';
      csv += 'Average Ticket Size,10.0 Lakhs\n';
      csv += 'Weighted Avg Interest Rate,9.25%\n';
      csv += 'Average Tenure,180 months\n';
    } else if (report.id === 'sanctioned-disbursed') {
      csv += 'Month,Sanctioned (Cr),Disbursed (Cr),Pending (Cr)\n';
      csv += 'Jan 2024,12.5,10.2,2.3\n';
      csv += 'Feb 2024,15.8,14.1,1.7\n';
      csv += 'Mar 2024,18.2,16.5,1.7\n';
    } else if (report.id === 'product-wise') {
      csv += 'Product,Count,Amount (Cr),Percentage\n';
      csv += 'Home Loan,520,52.3,58.6%\n';
      csv += 'LAP,180,22.1,24.8%\n';
      csv += 'Plot Loan,120,10.5,11.8%\n';
      csv += 'Construction Loan,72,4.3,4.8%\n';
    } else {
      csv += 'Branch,Accounts,Amount (Cr),NPA %\n';
      csv += 'Mumbai Main,245,28.5,1.2%\n';
      csv += 'Delhi Central,198,22.1,1.5%\n';
      csv += 'Bangalore,156,18.2,0.9%\n';
      csv += 'Chennai,142,12.8,1.8%\n';
      csv += 'Kolkata,151,7.6,2.1%\n';
    }
    return csv;
  }

  private generateDisbursementCSV(report: ReportCard): string {
    const now = new Date().toLocaleString();
    let csv = `HLMS - ${report.title}\nGenerated: ${now}\n\n`;

    if (report.id === 'daily-disbursement') {
      csv += 'Date,Count,Amount (Lakhs),Avg Ticket Size\n';
      csv += '2024-02-09,8,245.5,30.7\n';
      csv += '2024-02-08,12,382.0,31.8\n';
      csv += '2024-02-07,6,175.2,29.2\n';
      csv += '2024-02-06,10,298.5,29.9\n';
      csv += '2024-02-05,9,267.8,29.8\n';
    } else if (report.id === 'monthly-trend') {
      csv += 'Month,Disbursement Count,Amount (Cr),Growth %\n';
      csv += 'Feb 2024,156,14.2,+8.5%\n';
      csv += 'Jan 2024,142,13.1,+5.2%\n';
      csv += 'Dec 2023,128,12.5,-2.1%\n';
      csv += 'Nov 2023,135,12.8,+12.3%\n';
    } else {
      csv += 'Application ID,Customer,Sanctioned Amount,Sanction Date,Pending Since\n';
      csv += 'APP-2024-1245,Rahul Sharma,45.0 L,2024-01-15,25 days\n';
      csv += 'APP-2024-1198,Priya Patel,32.5 L,2024-01-20,20 days\n';
      csv += 'APP-2024-1156,Amit Kumar,28.0 L,2024-01-25,15 days\n';
    }
    return csv;
  }

  private generateRiskCSV(report: ReportCard): string {
    const now = new Date().toLocaleString();
    let csv = `HLMS - ${report.title}\nGenerated: ${now}\n\n`;

    if (report.id === 'dpd-aging') {
      csv += 'DPD Bucket,Count,Outstanding (Cr),% of Portfolio\n';
      csv += '0 DPD (Regular),812,78.5,88.0%\n';
      csv += '1-30 DPD,42,5.2,5.8%\n';
      csv += '31-60 DPD,18,2.8,3.1%\n';
      csv += '61-90 DPD,8,1.2,1.3%\n';
      csv += '90+ DPD (NPA),12,1.5,1.7%\n';
    } else if (report.id === 'npa-report') {
      csv += 'Category,Count,Outstanding (Cr),Provision Required (Cr)\n';
      csv += 'Sub-Standard,5,0.85,0.128\n';
      csv += 'Doubtful-1,4,0.42,0.168\n';
      csv += 'Doubtful-2,2,0.18,0.135\n';
      csv += 'Loss,1,0.05,0.050\n';
      csv += 'TOTAL NPA,12,1.50,0.481\n';
    } else if (report.id === 'collection-efficiency') {
      csv += 'Month,Demand (Cr),Collection (Cr),Efficiency %\n';
      csv += 'Feb 2024,8.52,8.21,96.4%\n';
      csv += 'Jan 2024,8.45,8.12,96.1%\n';
      csv += 'Dec 2023,8.38,8.05,96.1%\n';
    } else {
      csv += 'Account ID,Customer,DPD,Outstanding (Lakhs),EMI Due,Contact\n';
      csv += 'LN-2023-0542,Vikram Singh,45,28.5,42500,9876543210\n';
      csv += 'LN-2023-0398,Neha Gupta,32,18.2,28500,9876543211\n';
      csv += 'LN-2022-0856,Rajesh Kumar,28,35.8,52000,9876543212\n';
    }
    return csv;
  }

  private generateRegulatoryCSV(report: ReportCard): string {
    const now = new Date().toLocaleString();
    let csv = `HLMS - ${report.title}\nGenerated: ${now}\n\n`;

    if (report.id === 'rbi-return') {
      csv += 'Parameter,Value\n';
      csv += 'Total Advances,89.2 Cr\n';
      csv += 'Priority Sector Lending,35.68 Cr\n';
      csv += 'PSL Percentage,40.0%\n';
      csv += 'Gross NPA,1.50 Cr\n';
      csv += 'Gross NPA %,1.68%\n';
      csv += 'Net NPA,1.02 Cr\n';
      csv += 'Net NPA %,1.14%\n';
      csv += 'Provision Coverage Ratio,32.0%\n';
    } else if (report.id === 'irac-provisioning') {
      csv += 'Asset Category,Amount (Cr),Provision Rate,Provision (Cr)\n';
      csv += 'Standard Assets,87.7,0.40%,0.351\n';
      csv += 'Sub-Standard,0.85,15.00%,0.128\n';
      csv += 'Doubtful-1,0.42,40.00%,0.168\n';
      csv += 'Doubtful-2,0.18,75.00%,0.135\n';
      csv += 'Loss Assets,0.05,100.00%,0.050\n';
      csv += 'TOTAL,,, 0.832\n';
    } else {
      csv += 'Field,Count\n';
      csv += 'Total Accounts Reported,892\n';
      csv += 'New Accounts,45\n';
      csv += 'Closed Accounts,12\n';
      csv += 'Regular Accounts,812\n';
      csv += 'Overdue Accounts,68\n';
      csv += 'NPA Accounts,12\n';
      csv += 'Reporting Period,Feb 2024\n';
    }
    return csv;
  }
}
