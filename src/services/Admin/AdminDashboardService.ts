import api from "../api";

export interface DashboardSummary {
  totalBalance: number;
  income: number;
  expenses: number;
  savings: number;
  trends?: {
    totalBalance: number;
    income: number;
    expenses: number;
    savings: number;
  };
}

export interface MoneyFlowPoint {
  month: string;
  income: number;
  expense: number;
}

export interface BudgetResponse {
  status: number;
  error: boolean;
  message: string;
  data: {
    remainingBudget: number;
    totalExpenses: number;
    totalRevenue: number;
  };
}

export interface Transaction {
  id: string;
  createdAt: string;
  amount: number;
  customer: {
    email: string;
  };
  provider: string;
  status: string;
}

export const adminDashboardService = {
  getSummary: async (): Promise<DashboardSummary> => {
    const { data } = await api.get("/admin/summary");
    return data?.data;
  },

  getMoneyFlow: async (year: number): Promise<MoneyFlowPoint[]> => {
    const { data } = await api.get("/admin/money-flow", {
      params: { year },
    });
    return data?.data;
  },

  getBudget: async (): Promise<BudgetResponse> => {
    const { data } = await api.get("/admin/budget");
    return data;
  },

  getTransactions: async (params?: {
    accountId?: string;
    limit?: number;
  }): Promise<Transaction[]> => {
    const { data } = await api.get("/admin/transactions", {
      params,
    });
    return data?.data;
  },
};
