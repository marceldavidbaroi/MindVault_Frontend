export interface SavingsGoal {
  id: number;
  name: string;
  purpose?: string;
  target_amount: string;
  target_date?: string;
  status: string;

  account: {
    id: number;
    name: string;
    balance: string;
    ownerId: number;

    currency: {
      code: string;
      symbol: string;
    };

    type: {
      id: number;
      name: string;
    };

    owner: {
      id: number;
      username: string;
    };
  };
}

export interface CreateSavingsGoalDto {
  name: string;
  purpose?: string;
  targetAmount: string;
  currencyCode: string;
  accountTypeId: number;
  targetDate?: string;
}

export interface UpdateSavingsGoalDto {
  name?: string;
  purpose?: string;
  targetAmount?: string;
  currencyCode?: string;
  accountTypeId?: number;
  targetDate?: string;
}
