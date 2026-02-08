import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface WorkflowStage {
  id: string;
  name: string;
  status: 'completed' | 'current' | 'pending' | 'blocked';
  completedAt?: string;
  assignedTo?: string;
  slaHours: number;
  actualHours?: number;
  slaBreach: boolean;
}

interface ApplicationWorkflow {
  id: number;
  applicationNumber: string;
  customerName: string;
  loanAmount: number;
  currentStage: string;
  overallProgress: number;
  startDate: string;
  expectedCompletion: string;
  priority: 'high' | 'medium' | 'low';
  stages: WorkflowStage[];
}

@Component({
  selector: 'app-workflow-tracker',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page-container">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <h1>Workflow Tracker</h1>
          <p>Track loan applications through the complete lifecycle</p>
        </div>
        <div class="header-actions">
          <div class="sla-summary">
            <div class="sla-item good">
              <span class="count">{{ getOnTrackCount() }}</span>
              <span class="label">On Track</span>
            </div>
            <div class="sla-item warning">
              <span class="count">{{ getAtRiskCount() }}</span>
              <span class="label">At Risk</span>
            </div>
            <div class="sla-item breach">
              <span class="count">{{ getBreachedCount() }}</span>
              <span class="label">SLA Breach</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters-bar">
        <div class="filter-group">
          <select [(ngModel)]="stageFilter" (change)="applyFilters()">
            <option value="all">All Stages</option>
            <option value="lead">Lead</option>
            <option value="kyc">KYC</option>
            <option value="documents">Documents</option>
            <option value="credit">Credit Assessment</option>
            <option value="valuation">Valuation</option>
            <option value="sanction">Sanction</option>
            <option value="agreement">Agreement</option>
            <option value="disbursement">Disbursement</option>
          </select>
          <select [(ngModel)]="priorityFilter" (change)="applyFilters()">
            <option value="all">All Priority</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
          <select [(ngModel)]="slaFilter" (change)="applyFilters()">
            <option value="all">All SLA Status</option>
            <option value="ontrack">On Track</option>
            <option value="atrisk">At Risk</option>
            <option value="breach">SLA Breach</option>
          </select>
        </div>
        <div class="search-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" placeholder="Search application..." [(ngModel)]="searchTerm" (input)="applyFilters()">
        </div>
      </div>

      <!-- Workflow Cards -->
      <div class="workflow-list">
        @for (app of filteredApplications(); track app.id) {
          <div class="workflow-card" [class.high-priority]="app.priority === 'high'">
            <!-- Card Header -->
            <div class="card-header">
              <div class="app-info">
                <div class="app-main">
                  <span class="app-number">{{ app.applicationNumber }}</span>
                  <span class="priority-badge" [class]="app.priority">{{ app.priority | titlecase }}</span>
                </div>
                <span class="customer-name">{{ app.customerName }}</span>
                <span class="loan-amount">&#8377;{{ formatAmount(app.loanAmount) }}</span>
              </div>
              <div class="progress-info">
                <div class="progress-ring">
                  <svg viewBox="0 0 36 36">
                    <path class="bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                    <path class="fill" [class]="getProgressClass(app)" [attr.stroke-dasharray]="app.overallProgress + ', 100'" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                  </svg>
                  <span class="percent">{{ app.overallProgress }}%</span>
                </div>
                <div class="dates">
                  <span class="date-label">Started: {{ app.startDate }}</span>
                  <span class="date-label">Expected: {{ app.expectedCompletion }}</span>
                </div>
              </div>
            </div>

            <!-- Workflow Timeline -->
            <div class="workflow-timeline">
              @for (stage of app.stages; track stage.id; let i = $index) {
                <div class="stage" [class]="stage.status" [class.breach]="stage.slaBreach">
                  <div class="stage-connector">
                    @if (i > 0) {
                      <div class="connector-line" [class.completed]="stage.status === 'completed' || stage.status === 'current'"></div>
                    }
                  </div>
                  <div class="stage-dot">
                    @if (stage.status === 'completed') {
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    } @else if (stage.status === 'current') {
                      <div class="pulse"></div>
                    } @else if (stage.status === 'blocked') {
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    }
                  </div>
                  <div class="stage-info">
                    <span class="stage-name">{{ stage.name }}</span>
                    @if (stage.status === 'completed') {
                      <span class="stage-time">{{ stage.completedAt }}</span>
                    } @else if (stage.status === 'current') {
                      <span class="stage-assignee">{{ stage.assignedTo }}</span>
                    }
                    @if (stage.slaBreach) {
                      <span class="sla-badge breach">SLA Breach</span>
                    } @else if (stage.status === 'current' && stage.actualHours && stage.actualHours > stage.slaHours * 0.8) {
                      <span class="sla-badge warning">At Risk</span>
                    }
                  </div>
                </div>
              }
            </div>

            <!-- Card Actions -->
            <div class="card-footer">
              <div class="current-stage">
                <span class="label">Current Stage:</span>
                <span class="value">{{ app.currentStage }}</span>
              </div>
              <div class="actions">
                <button class="btn-action" (click)="viewDetails(app)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  View
                </button>
                <button class="btn-action primary" (click)="takeAction(app)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                  Process
                </button>
              </div>
            </div>
          </div>
        } @empty {
          <div class="empty-state">
            <p>No applications match the selected filters</p>
          </div>
        }
      </div>

      <!-- SLA Configuration Panel -->
      <div class="sla-config">
        <h3>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          SLA Configuration (Hours)
        </h3>
        <div class="sla-grid">
          <div class="sla-item-config">
            <span class="stage">Lead to KYC</span>
            <span class="hours">4 hrs</span>
          </div>
          <div class="sla-item-config">
            <span class="stage">KYC Verification</span>
            <span class="hours">8 hrs</span>
          </div>
          <div class="sla-item-config">
            <span class="stage">Document Collection</span>
            <span class="hours">48 hrs</span>
          </div>
          <div class="sla-item-config">
            <span class="stage">Credit Assessment</span>
            <span class="hours">24 hrs</span>
          </div>
          <div class="sla-item-config">
            <span class="stage">Property Valuation</span>
            <span class="hours">72 hrs</span>
          </div>
          <div class="sla-item-config">
            <span class="stage">Sanction Approval</span>
            <span class="hours">24 hrs</span>
          </div>
          <div class="sla-item-config">
            <span class="stage">Agreement Execution</span>
            <span class="hours">48 hrs</span>
          </div>
          <div class="sla-item-config">
            <span class="stage">Disbursement</span>
            <span class="hours">24 hrs</span>
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

    .sla-summary {
      display: flex;
      gap: 12px;
    }

    .sla-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 12px 20px;
      border-radius: 10px;
      min-width: 80px;
    }

    .sla-item.good { background: #d1fae5; }
    .sla-item.warning { background: #fef3c7; }
    .sla-item.breach { background: #fee2e2; }

    .sla-item .count {
      font-size: 20px;
      font-weight: 700;
      color: #1f2937;
    }

    .sla-item .label {
      font-size: 11px;
      color: #6b7280;
    }

    .filters-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      gap: 16px;
    }

    .filter-group {
      display: flex;
      gap: 12px;
    }

    .filter-group select {
      padding: 10px 14px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 14px;
      background: white;
      outline: none;
      cursor: pointer;
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

    .workflow-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 24px;
    }

    .workflow-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      overflow: hidden;
    }

    .workflow-card.high-priority {
      border-left: 4px solid #dc2626;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      padding: 20px;
      background: #f9fafb;
      border-bottom: 1px solid #e5e7eb;
    }

    .app-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .app-main {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .app-number {
      font-size: 16px;
      font-weight: 600;
      color: #1976d2;
    }

    .priority-badge {
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 500;
    }

    .priority-badge.high { background: #fee2e2; color: #dc2626; }
    .priority-badge.medium { background: #fef3c7; color: #d97706; }
    .priority-badge.low { background: #e5e7eb; color: #6b7280; }

    .customer-name {
      font-size: 14px;
      color: #4b5563;
    }

    .loan-amount {
      font-size: 15px;
      font-weight: 600;
      color: #1f2937;
    }

    .progress-info {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .progress-ring {
      position: relative;
      width: 56px;
      height: 56px;
    }

    .progress-ring svg {
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }

    .progress-ring .bg {
      fill: none;
      stroke: #e5e7eb;
      stroke-width: 4;
    }

    .progress-ring .fill {
      fill: none;
      stroke: #22c55e;
      stroke-width: 4;
      stroke-linecap: round;
    }

    .progress-ring .fill.warning { stroke: #f59e0b; }
    .progress-ring .fill.breach { stroke: #ef4444; }

    .progress-ring .percent {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 12px;
      font-weight: 600;
      color: #1f2937;
    }

    .dates {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .date-label {
      font-size: 12px;
      color: #6b7280;
    }

    .workflow-timeline {
      display: flex;
      padding: 24px 20px;
      overflow-x: auto;
    }

    .stage {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      min-width: 100px;
      position: relative;
    }

    .stage-connector {
      position: absolute;
      top: 12px;
      left: -50%;
      width: 100%;
      height: 2px;
    }

    .connector-line {
      width: 100%;
      height: 2px;
      background: #e5e7eb;
    }

    .connector-line.completed {
      background: #22c55e;
    }

    .stage-dot {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;
      margin-bottom: 8px;
    }

    .stage.completed .stage-dot {
      background: #22c55e;
      color: white;
    }

    .stage.current .stage-dot {
      background: #1976d2;
      box-shadow: 0 0 0 4px rgba(25, 118, 210, 0.2);
    }

    .stage.blocked .stage-dot {
      background: #ef4444;
      color: white;
    }

    .stage.breach .stage-dot {
      background: #ef4444;
    }

    .pulse {
      width: 10px;
      height: 10px;
      background: white;
      border-radius: 50%;
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.7; transform: scale(1.2); }
    }

    .stage-info {
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .stage-name {
      font-size: 12px;
      font-weight: 500;
      color: #4b5563;
    }

    .stage.current .stage-name {
      color: #1976d2;
      font-weight: 600;
    }

    .stage-time, .stage-assignee {
      font-size: 10px;
      color: #9ca3af;
    }

    .sla-badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 9px;
      font-weight: 600;
      margin-top: 4px;
    }

    .sla-badge.warning { background: #fef3c7; color: #d97706; }
    .sla-badge.breach { background: #fee2e2; color: #dc2626; }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      background: #f9fafb;
      border-top: 1px solid #e5e7eb;
    }

    .current-stage .label {
      font-size: 12px;
      color: #6b7280;
    }

    .current-stage .value {
      font-size: 14px;
      font-weight: 600;
      color: #1976d2;
      margin-left: 8px;
    }

    .actions {
      display: flex;
      gap: 10px;
    }

    .btn-action {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border: 1px solid #d1d5db;
      background: white;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      color: #4b5563;
      cursor: pointer;
    }

    .btn-action:hover { background: #f3f4f6; }

    .btn-action.primary {
      background: #1976d2;
      border-color: #1976d2;
      color: white;
    }

    .btn-action.primary:hover { background: #1565c0; }

    .sla-config {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 20px;
    }

    .sla-config h3 {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 15px;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 16px 0;
    }

    .sla-config h3 svg { color: #6b7280; }

    .sla-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }

    .sla-item-config {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: #f9fafb;
      border-radius: 8px;
    }

    .sla-item-config .stage {
      font-size: 13px;
      color: #4b5563;
    }

    .sla-item-config .hours {
      font-size: 13px;
      font-weight: 600;
      color: #1976d2;
    }

    .empty-state {
      text-align: center;
      padding: 60px;
      color: #9ca3af;
    }

    @media (max-width: 1024px) {
      .sla-grid { grid-template-columns: repeat(2, 1fr); }
      .filters-bar { flex-direction: column; align-items: stretch; }
      .filter-group { flex-wrap: wrap; }
      .search-box { width: 100%; }
    }
  `]
})
export class WorkflowTrackerComponent {
  searchTerm = '';
  stageFilter = 'all';
  priorityFilter = 'all';
  slaFilter = 'all';

  applications: ApplicationWorkflow[] = [
    {
      id: 1,
      applicationNumber: 'APP-2024-1542',
      customerName: 'Rajesh Kumar',
      loanAmount: 4500000,
      currentStage: 'Credit Assessment',
      overallProgress: 50,
      startDate: '05 Feb 2024',
      expectedCompletion: '15 Feb 2024',
      priority: 'high',
      stages: [
        { id: 'lead', name: 'Lead', status: 'completed', completedAt: '05 Feb', slaHours: 4, slaBreach: false },
        { id: 'kyc', name: 'KYC', status: 'completed', completedAt: '06 Feb', slaHours: 8, slaBreach: false },
        { id: 'documents', name: 'Documents', status: 'completed', completedAt: '07 Feb', slaHours: 48, slaBreach: false },
        { id: 'credit', name: 'Credit', status: 'current', assignedTo: 'Anil Kumar', slaHours: 24, actualHours: 20, slaBreach: false },
        { id: 'valuation', name: 'Valuation', status: 'pending', slaHours: 72, slaBreach: false },
        { id: 'sanction', name: 'Sanction', status: 'pending', slaHours: 24, slaBreach: false },
        { id: 'agreement', name: 'Agreement', status: 'pending', slaHours: 48, slaBreach: false },
        { id: 'disbursement', name: 'Disburse', status: 'pending', slaHours: 24, slaBreach: false }
      ]
    },
    {
      id: 2,
      applicationNumber: 'APP-2024-1538',
      customerName: 'Priya Sharma',
      loanAmount: 3200000,
      currentStage: 'Sanction Approval',
      overallProgress: 75,
      startDate: '01 Feb 2024',
      expectedCompletion: '12 Feb 2024',
      priority: 'medium',
      stages: [
        { id: 'lead', name: 'Lead', status: 'completed', completedAt: '01 Feb', slaHours: 4, slaBreach: false },
        { id: 'kyc', name: 'KYC', status: 'completed', completedAt: '02 Feb', slaHours: 8, slaBreach: false },
        { id: 'documents', name: 'Documents', status: 'completed', completedAt: '04 Feb', slaHours: 48, slaBreach: false },
        { id: 'credit', name: 'Credit', status: 'completed', completedAt: '05 Feb', slaHours: 24, slaBreach: false },
        { id: 'valuation', name: 'Valuation', status: 'completed', completedAt: '07 Feb', slaHours: 72, slaBreach: false },
        { id: 'sanction', name: 'Sanction', status: 'current', assignedTo: 'Branch Manager', slaHours: 24, actualHours: 12, slaBreach: false },
        { id: 'agreement', name: 'Agreement', status: 'pending', slaHours: 48, slaBreach: false },
        { id: 'disbursement', name: 'Disburse', status: 'pending', slaHours: 24, slaBreach: false }
      ]
    },
    {
      id: 3,
      applicationNumber: 'APP-2024-1530',
      customerName: 'Amit Patel',
      loanAmount: 6800000,
      currentStage: 'Document Collection',
      overallProgress: 25,
      startDate: '28 Jan 2024',
      expectedCompletion: '10 Feb 2024',
      priority: 'high',
      stages: [
        { id: 'lead', name: 'Lead', status: 'completed', completedAt: '28 Jan', slaHours: 4, slaBreach: false },
        { id: 'kyc', name: 'KYC', status: 'completed', completedAt: '29 Jan', slaHours: 8, slaBreach: true },
        { id: 'documents', name: 'Documents', status: 'current', assignedTo: 'RM Team', slaHours: 48, actualHours: 240, slaBreach: true },
        { id: 'credit', name: 'Credit', status: 'blocked', slaHours: 24, slaBreach: false },
        { id: 'valuation', name: 'Valuation', status: 'pending', slaHours: 72, slaBreach: false },
        { id: 'sanction', name: 'Sanction', status: 'pending', slaHours: 24, slaBreach: false },
        { id: 'agreement', name: 'Agreement', status: 'pending', slaHours: 48, slaBreach: false },
        { id: 'disbursement', name: 'Disburse', status: 'pending', slaHours: 24, slaBreach: false }
      ]
    }
  ];

  filteredApplications = signal<ApplicationWorkflow[]>(this.applications);

  applyFilters(): void {
    let filtered = this.applications;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(app =>
        app.applicationNumber.toLowerCase().includes(term) ||
        app.customerName.toLowerCase().includes(term)
      );
    }

    if (this.priorityFilter !== 'all') {
      filtered = filtered.filter(app => app.priority === this.priorityFilter);
    }

    if (this.stageFilter !== 'all') {
      filtered = filtered.filter(app =>
        app.stages.find(s => s.id === this.stageFilter && s.status === 'current')
      );
    }

    if (this.slaFilter !== 'all') {
      filtered = filtered.filter(app => {
        const hasBreached = app.stages.some(s => s.slaBreach);
        const hasAtRisk = app.stages.some(s => s.status === 'current' && s.actualHours && s.actualHours > s.slaHours * 0.8);

        if (this.slaFilter === 'breach') return hasBreached;
        if (this.slaFilter === 'atrisk') return hasAtRisk && !hasBreached;
        return !hasBreached && !hasAtRisk;
      });
    }

    this.filteredApplications.set(filtered);
  }

  getOnTrackCount(): number {
    return this.applications.filter(app => !app.stages.some(s => s.slaBreach)).length;
  }

  getAtRiskCount(): number {
    return this.applications.filter(app =>
      app.stages.some(s => s.status === 'current' && s.actualHours && s.actualHours > s.slaHours * 0.8) &&
      !app.stages.some(s => s.slaBreach)
    ).length;
  }

  getBreachedCount(): number {
    return this.applications.filter(app => app.stages.some(s => s.slaBreach)).length;
  }

  getProgressClass(app: ApplicationWorkflow): string {
    if (app.stages.some(s => s.slaBreach)) return 'breach';
    if (app.stages.some(s => s.status === 'current' && s.actualHours && s.actualHours > s.slaHours * 0.8)) return 'warning';
    return '';
  }

  formatAmount(amount: number): string {
    if (amount >= 10000000) {
      return (amount / 10000000).toFixed(2) + ' Cr';
    } else if (amount >= 100000) {
      return (amount / 100000).toFixed(2) + ' L';
    }
    return amount.toLocaleString();
  }

  viewDetails(app: ApplicationWorkflow): void {
    alert(`Viewing details for ${app.applicationNumber}`);
  }

  takeAction(app: ApplicationWorkflow): void {
    alert(`Processing ${app.applicationNumber} - Current Stage: ${app.currentStage}`);
  }
}
