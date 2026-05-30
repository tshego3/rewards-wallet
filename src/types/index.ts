export interface LoyaltyCard {
  readonly id: string;
  name: string;
  category: CardCategory;
  barcode: string;
  barcodeFormat: BarcodeFormat;
  points: number;
  color: string;
  isFavorite: boolean;
  readonly createdAt: number;
  updatedAt: number;
}

export type CardCategory = 'retail' | 'grocery' | 'fuel' | 'pharmacy' | 'other';

export type BarcodeFormat = 'EAN13' | 'CODE128';

export interface CardFormData {
  name: string;
  category: CardCategory;
  barcode: string;
  barcodeFormat: BarcodeFormat;
  points: number;
  color: string;
}

export type Screen = 'dashboard' | 'search' | 'settings' | 'details' | 'add' | 'edit';

export interface RouteState {
  screen: Screen;
  cardId?: string;
}
