// Helper utility to wrap data fetching with demo mode support

import { demoMembers, demoTransactions, demoTreasury, demoNotices, demoInvestments, demoProfitDistributions, demoStats } from './demoData';

console.log('[useDemoData] File loaded');

/**
 * Returns demo or production data based on current mode
 * @param {boolean} isDemo - Whether in demo mode
 * @param {string} dataType - Type of data to fetch
 * @param {*} productionData - Production data or production data fetcher
 * @param {string} userId - Optional user ID for filtering demo data
 */
export const getDemoOrProductionData = (isDemo, dataType, productionData, userId = null) => {
    if (!isDemo) {
        return productionData;
    }

    // Return demo data based on type
    switch (dataType) {
        case 'members':
            return demoMembers;

        case 'transactions':
            if (userId) {
                // Filter transactions for specific user in demo mode
                return demoTransactions.filter(t => t.memberId === userId);
            }
            return demoTransactions;

        case 'treasury':
            return demoTreasury;

        case 'notices':
            return demoNotices;

        case 'investments':
            return demoInvestments;

        case 'profitDistributions':
            return demoProfitDistributions;

        case 'stats':
            return demoStats;

        default:
            return productionData;
    }
};

/**
 * Creates a demo-aware service wrapper
 * @param {boolean} isDemo - Whether in demo mode
 * @param {object} service - Production service object
 * @param {string} dataType - Type of data this service handles
 */
export const createDemoService = (isDemo, service, dataType) => {
    if (!isDemo) {
        return service;
    }

    // Create a wrapper that returns demo data
    return {
        ...service,
        getActiveMembers: async () => ({
            success: true,
            data: demoMembers
        }),
        getMemberById: async (id) => {
            const member = demoMembers.find(m => m.id === id);
            return {
                success: !!member,
                data: member || null
            };
        },
        getAllTransactions: async () => ({
            success: true,
            data: demoTransactions
        }),
        getTransactionsByMember: async (memberId) => ({
            success: true,
            data: demoTransactions.filter(t => t.memberId === memberId)
        }),
        getTreasuryData: async () => ({
            success: true,
            data: demoTreasury
        }),
        getNotices: async () => ({
            success: true,
            data: demoNotices
        }),
        getInvestments: async () => ({
            success: true,
            data: demoInvestments
        }),
        getProfitDistributions: async () => ({
            success: true,
            data: demoProfitDistributions
        }),
        getStats: async () => ({
            success: true,
            data: demoStats
        })
    };
};
