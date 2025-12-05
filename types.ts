export interface Account {
  id: string;
  name: string;
  username: string;
  password?: string;
  email?: string;
  expiryDate?: string;
  phoneNumber?: string;
  notes?: string;
}

export interface Domain {
  id: string;
  domainName: string;
  purchaseDate?: string;
  renewalDate?: string;
  registrar?: string; // e.g. GoDaddy, Namecheap
  purchasePrice?: number;
  renewalPrice?: number;
  purchaseEmail?: string;
  beneficiary?: string; // The person who benefits
  notes?: string;
}

export interface UserProfile {
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  type: 'personal' | 'business';
}

export type ViewState = 'accounts' | 'domains' | 'settings';