// Common interfaces and types used across the application

export interface Customer {
  id: number;
  customerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  panNumber: string;
  aadhaarNumber?: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  employmentType: string;
  employerName?: string;
  monthlyIncome: number;
  address: Address;
  status: string;
  createdDate: string;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface LoanApplication {
  id: number;
  applicationNumber: string;
  customerId: number;
  customerName: string;
  loanType: LoanType;
  loanPurpose: string;
  loanAmount: number;
  tenure: number;
  interestRate: number;
  emi?: number;
  status: ApplicationStatus;
  stage: ApplicationStage;
  property?: Property;
  createdDate: string;
  lastUpdated: string;
}

export interface Property {
  id?: number;
  propertyType: PropertyType;
  propertyValue: number;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

export type LoanType =
  | 'HOME_LOAN'
  | 'HOME_CONSTRUCTION'
  | 'HOME_IMPROVEMENT'
  | 'LAND_PURCHASE'
  | 'BALANCE_TRANSFER';

export type PropertyType =
  | 'FLAT'
  | 'INDEPENDENT_HOUSE'
  | 'VILLA'
  | 'ROW_HOUSE'
  | 'PLOT';

export type ApplicationStatus =
  | 'DRAFT'
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'SANCTIONED'
  | 'DISBURSED'
  | 'REJECTED'
  | 'CANCELLED';

export type ApplicationStage =
  | 'LEAD'
  | 'APPLICATION'
  | 'CREDIT_APPRAISAL'
  | 'LEGAL_VERIFICATION'
  | 'TECHNICAL_VERIFICATION'
  | 'SANCTION'
  | 'DISBURSEMENT'
  | 'CLOSED';

export interface DashboardStats {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  disbursedAmount: number;
  totalPortfolio: number;
  npaCount: number;
  npaAmount: number;
  collectionDue: number;
}
