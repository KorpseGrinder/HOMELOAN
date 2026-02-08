import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'customers',
        loadComponent: () => import('./pages/customers/customer-list/customer-list.component').then(m => m.CustomerListComponent)
      },
      {
        path: 'customers/:id',
        loadComponent: () => import('./pages/customers/customer-detail/customer-detail.component').then(m => m.CustomerDetailComponent)
      },
      {
        path: 'applications',
        loadComponent: () => import('./pages/applications/application-list/application-list.component').then(m => m.ApplicationListComponent)
      },
      {
        path: 'applications/new',
        loadComponent: () => import('./pages/applications/application-form/application-form.component').then(m => m.ApplicationFormComponent)
      },
      {
        path: 'applications/:id',
        loadComponent: () => import('./pages/applications/application-detail/application-detail.component').then(m => m.ApplicationDetailComponent)
      },
      // KYC
      {
        path: 'kyc',
        loadComponent: () => import('./pages/kyc/kyc-verification/kyc-verification.component').then(m => m.KycVerificationComponent)
      },
      {
        path: 'kyc/:id',
        loadComponent: () => import('./pages/kyc/kyc-detail/kyc-detail.component').then(m => m.KycDetailComponent)
      },
      // Documents
      {
        path: 'documents',
        loadComponent: () => import('./pages/documents/document-checklist/document-checklist.component').then(m => m.DocumentChecklistComponent)
      },
      // Workflow
      {
        path: 'workflow',
        loadComponent: () => import('./pages/workflow/workflow-tracker/workflow-tracker.component').then(m => m.WorkflowTrackerComponent)
      },
      // Underwriting
      {
        path: 'underwriting',
        loadComponent: () => import('./pages/underwriting/credit-assessment/credit-assessment.component').then(m => m.CreditAssessmentComponent)
      },
      {
        path: 'underwriting/assess/:id',
        loadComponent: () => import('./pages/underwriting/assessment-detail/assessment-detail.component').then(m => m.AssessmentDetailComponent)
      },
      // Sanction
      {
        path: 'sanction',
        loadComponent: () => import('./pages/sanction/approval-queue/approval-queue.component').then(m => m.ApprovalQueueComponent)
      },
      // Disbursement
      {
        path: 'disbursement',
        loadComponent: () => import('./pages/disbursement/disbursement-list/disbursement-list.component').then(m => m.DisbursementListComponent)
      },
      // Servicing
      {
        path: 'servicing',
        redirectTo: 'servicing/loans',
        pathMatch: 'full'
      },
      {
        path: 'servicing/loans',
        loadComponent: () => import('./pages/servicing/loan-list/loan-list.component').then(m => m.LoanListComponent)
      },
      {
        path: 'servicing/loans/:id',
        loadComponent: () => import('./pages/servicing/loan-detail/loan-detail.component').then(m => m.LoanDetailComponent)
      },
      // Collections
      {
        path: 'collections',
        loadComponent: () => import('./pages/collections/overdue-list/overdue-list.component').then(m => m.OverdueListComponent)
      },
      // NPA
      {
        path: 'npa',
        loadComponent: () => import('./pages/npa/npa-list/npa-list.component').then(m => m.NpaListComponent)
      },
      // Reports
      {
        path: 'reports',
        loadComponent: () => import('./pages/reports/reports-dashboard/reports-dashboard.component').then(m => m.ReportsDashboardComponent)
      },
      // Admin
      {
        path: 'admin',
        redirectTo: 'admin/users',
        pathMatch: 'full'
      },
      {
        path: 'admin/users',
        loadComponent: () => import('./pages/admin/user-management/user-management.component').then(m => m.UserManagementComponent)
      },
      {
        path: 'admin/settings',
        loadComponent: () => import('./pages/admin/settings/settings.component').then(m => m.SettingsComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
