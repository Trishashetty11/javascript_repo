export interface User {
  id: string;
  name: string;
  email: string;
  role: 'issuer' | 'holder' | 'verifier';
}

export interface Certificate {
  id: string;
  holderName: string;
  holderEmail?: string;
  title: string;
  course: string;
  issueDate: string;
  issuerName: string;
  fileName?: string;
}

export interface VerificationRecord {
  id: string;
  certificateId: string;
  status: 'Valid' | 'Invalid';
  timestamp: number;
  verifierEmail: string;
}

export interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string, role: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface DataContextType {
  certificates: Certificate[];
  verificationHistory: VerificationRecord[];
  addCertificate: (certificate: Certificate) => void;
  addVerificationRecord: (record: VerificationRecord) => void;
  getCertificateById: (id: string) => Certificate | undefined;
  getCertificatesForHolder: (holderName: string, holderEmail?: string) => Certificate[];
  getIssuerStats: (issuerName: string) => {
    total: number;
    thisMonth: number;
    uniqueHolders: number;
  };
}