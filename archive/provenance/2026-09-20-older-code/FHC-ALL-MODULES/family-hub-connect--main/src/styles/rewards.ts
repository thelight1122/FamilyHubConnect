//rewards.ts
//rewards.ts
import type { CSSProperties } from 'react';

export const rewardStyles: { [key: string]: CSSProperties } = {
    definedRewardsList: {
        listStyle: 'none',
        padding: 0,
    },
    definedRewardItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px',
        border: '1px solid #eee',
        borderRadius: 'var(--border-radius-main, 8px)',
        marginBottom: '10px',
    },
    definedRewardName: {
        fontWeight: 600,
    },
    definedRewardCost: {
        color: '#28a745',
        fontWeight: 'bold',
    },
    parentalActionsContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginTop: '20px',
    },
    parentalActionCard: {
        backgroundColor: '#f8f9fa'
    },
    badgeInfoList: {
        listStyle: 'none',
        padding: 0,
        marginTop: '10px',
    },
    badgeInfoItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        padding: '8px 0',
    },
    badgeInfoIcon: {
        fontSize: '2em',
    },
    badgeInfoName: {
        fontWeight: 600,
    },
    badgeInfoDescription: {
        color: '#666',
        fontSize: '0.9em',
    },
    wishlistItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        marginBottom: '5px'
    },
    wishlistItemInfo: {},
    wishlistItemName: {
        fontWeight: 'bold'
    },
    wishlistItemMeta: {
        fontSize: '0.9em',
        color: '#6c757d',
        display: 'block'
    },
    wishlistItemActions: {
        display: 'flex',
        gap: '5px'
    },
    wishlistStatusTag: {
        padding: '3px 8px',
        borderRadius: '12px',
        fontSize: '0.8em',
        color: 'white',
        fontWeight: 'bold'
    },
    wishlistStatusPending: {
        backgroundColor: '#ffc107',
    },
    wishlistStatusApproved: {
        backgroundColor: '#28a745',
    },
    wishlistStatusDenied: {
        backgroundColor: '#dc3545',
    },
    topEarnerWidget: {
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#fffbe6',
        border: '2px solid #ffe58f',
        borderRadius: 'var(--border-radius-main, 8px)',
        marginBottom: '20px'
    },
    topEarnerTitle: {
        margin: '0 0 5px 0',
        fontSize: '1.4em',
        color: '#856404'
    },
    topEarnerName: {
        margin: 0,
        fontSize: '1.2em'
    },
    topEarnerPoints: {
        margin: '5px 0 0 0',
        fontSize: '1em',
        color: '#856404'
    },
    podiumContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        gap: '10px',
        padding: '20px',
    },
    podiumStep: {
        textAlign: 'center',
        padding: '10px',
        borderRadius: '8px 8px 0 0',
        color: 'white',
        width: '120px'
    },
    podiumStep1: {
        height: '150px',
        backgroundColor: '#ffd700', // Gold
    },
    podiumStep2: {
        height: '120px',
        backgroundColor: '#c0c0c0', // Silver
    },
    podiumStep3: {
        height: '90px',
        backgroundColor: '#cd7f32', // Bronze
    },
    podiumAvatar: {
        fontSize: '3em',
    },
    podiumName: {
        fontWeight: 'bold',
        marginTop: '5px'
    },
    podiumPoints: {
        fontSize: '0.9em'
    },
};
