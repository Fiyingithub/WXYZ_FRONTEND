export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface ToastContextType {
  notifySuccess: (message: string, options?: object) => void;
  notifyError: (message: string, options?: object) => void;
  notifyInfo: (message: string, options?: object) => void;
  notifyWarn: (message: string, options?: object) => void;
  waitingLoader: boolean;
  startWaitingLoader: () => void;
  stopWaitingLoader: () => void;
  spinnerLoader: boolean;
  showSpinnerLoader: () => void;
  hideSpinnerLoader: () => void;
  addToCart: (item: CartItem) => Promise<void>;
  formatDate: (date: string) => string;
  formatNumberWithCommas: (number: number) => string;
  formatAmount: (amt: number) => string;
}
