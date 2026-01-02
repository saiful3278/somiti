import { demoMembers, demoTransactions } from './demoData';

/**
 * Wrapper functions to return demo or production data based on mode
 * Use these instead of directly calling Firebase services
 */

export const getDemoOrProductionMembers = async (isDemo, productionFetcher) => {
    if (isDemo) {
        console.log('[useDemoData] Returning demo members');
        return {
            success: true,
            data: demoMembers
        };
    }

    return await productionFetcher();
};

export const getDemoOrProductionTransactions = async (isDemo, productionFetcher) => {
    if (isDemo) {
        console.log('[useDemoData] Returning demo transactions');
        return {
            success: true,
            data: demoTransactions
        };
    }

    return await productionFetcher();
};

export const getDemoOrProductionFundSummary = async (isDemo, productionFetcher) => {
    if (isDemo) {
        // Calculate fund summary from demo data
        const totalFunds = demoTransactions
            .filter(t => t.type === 'deposit')
            .reduce((sum, t) => sum + t.amount, 0);

        const monthlyDeposits = demoTransactions
            .filter(t => t.type === 'deposit' && t.category === 'monthly')
            .reduce((sum, t) => sum + t.amount, 0);

        console.log('[useDemoData] Returning demo fund summary');
        return {
            success: true,
            data: {
                totalAmount: totalFunds,
                totalBalance: totalFunds,
                availableCash: totalFunds * 0.8,
                monthlyDeposits,
                monthlyExpense: 5000,
                cashFlow: []
            }
        };
    }

    return await productionFetcher();
};

// Generic wrapper
export const getDemoOrProductionData = async (isDemo, demoData, productionFetcher) => {
    if (isDemo) {
        console.log('[useDemoData] Returning demo data');
        return {
            success: true,
            data: demoData
        };
    }

    return await productionFetcher();
};
