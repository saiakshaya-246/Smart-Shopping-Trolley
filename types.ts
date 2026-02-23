
export interface Product {
  id: string;
  name: string;
  price: number;
  gstPercent: number;
}

export interface TrolleyItem {
  scanId: string;
  productId: string;
  name: string;
  price: number;
  gstPercent: number;
  gstAmount: number;
  totalPrice: number;
  status: 'Scanned' | 'Removed';
  timestamp: Date;
}

export interface BillingSummary {
  subtotal: number;
  totalGst: number;
  grandTotal: number;
}
