export type DomainPhase = 'grace' | 'pending';

export interface Domain {
  id: string;
  name: string;
  expiryDate: number;
  phase: DomainPhase;
}
