
export interface AvailableReward {
    id: string;
    name: string;
    cost: number;
}

export interface RewardWishlistItem {
    id: string;
    profileId: string;
    name: string;
    url?: string;
    status: 'pending' | 'approved' | 'denied';
}

export interface Transaction {
    id: string;
    profileId: string;
    family_id: string;
    amount: number;
    description: string;
    timestamp: number;
    status: 'completed' | 'pending' | 'denied';
}

export interface SavingsGoal {
    id: string;
    profileId: string;
    family_id: string;
    name: string;
    icon: string;
    targetAmount: number;
    currentAmount: number;
    isCompleted: boolean;
}

export interface Investment {
    id: string;
    profileId: string;
    initialAmount: number;
    currentValue: number;
    createdAt: number;
}
export interface Loan {
    id: string;
    profileId: string;
    amount: number;
    reason: string;
    status: 'pending' | 'active' | 'paid';
    remainingAmount: number;
    createdAt: number;
    paidAt?: number;
}

export interface BudgetCategory {
    id: string;
    name: string;
    allocated: number;
    icon: string;
}

export interface Expense {
    id: string;
    categoryId: string;
    description: string;
    amount: number;
    timestamp: number;
}

export interface ScreenTimeLog {
    id: string;
    profileId: string;
    changeMinutes: number;
    status: 'completed' | 'pending_approval' | 'denied';
    reason: string;
    timestamp: number;
}

export interface MarketAsset {
    id: string;
    name: string;
    ticker: string;
    type: 'stock' | 'crypto';
    price: number;
    trend: 'up' | 'down' | 'stable';
}
export interface PortfolioHolding {
    id: string;
    profileId: string;
    assetId: string;
    quantity: number;
    avgBuyPrice: number;
}
export interface MarketTransaction {
    id: string;
    profileId: string;
    assetId: string;
    type: 'buy' | 'sell';
    quantity: number;
    pricePerShare: number;
    timestamp: number;
}
