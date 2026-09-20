

import React, { useState, useMemo } from 'react';
import type { Profile, AppNotification, ToastMessage, AvailableReward, ScreenTimeLog, RewardWishlistItem } from '../types';
import { BADGE_DEFINITIONS } from '../constants/badges';
import { styles } from '../styles';
import Modal from '../components/ui/Modal';
import { useAppContext } from '../contexts/AppContext';
import { uniqueId } from '../utils/utils';
import EmptyState from '../components/ui/EmptyState';

interface RewardsViewProps {
    updateProfile: (profileId: string, updates: Partial<Profile>) => Promise<void>;
    deductPoints: (profileId: string, points: number) => Promise<void>;
}

export default function RewardsView({ updateProfile, deductPoints }: RewardsViewProps) {
    const { 
        profiles, personalizationData, currentViewingProfile, addAppNotification, 
        addToast, onNavigate, addScreenTime, rewardWishlist, getProfileName,
        addRewardWishlistItem, updateRewardWishlistItem, onSavePersonalization, weeklyTopEarner
    } = useAppContext();
    
    // --- State for standard rewards ---
    const [confirmingReward, setConfirmingReward] = useState<AvailableReward | null>(null);
    
    // --- State for consequence form ---
    const [consequenceChildId, setConsequenceChildId] = useState<string>('');
    const [consequencePoints, setConsequencePoints] = useState('');
    const [consequenceReason, setConsequenceReason] = useState('');

    // --- State for screen time award ---
    const [screenTimeChildId, setScreenTimeChildId] = useState<string>('');
    const [screenTimeMinutes, setScreenTimeMinutes] = useState('');
    const [screenTimeReason, setScreenTimeReason] = useState('Reward for good behavior');

    // --- State for Wishlist feature ---
    const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false);
    const [wishlistItemName, setWishlistItemName] = useState('');
    const [wishlistItemUrl, setWishlistItemUrl] = useState('');
    
    const [approvingItem, setApprovingItem] = useState<RewardWishlistItem | null>(null);
    const [approvalCost, setApprovalCost] = useState('');

    const sortedProfilesByPoints = [...profiles].sort((a, b) => (b.points || 0) - (a.points || 0));
    const availableRewardsList: AvailableReward[] = personalizationData?.availableRewards || [];

    const handleRedeemReward = (reward: AvailableReward) => {
        if (!currentViewingProfile || currentViewingProfile.role !== 'child') return;
        if (currentViewingProfile.points < reward.cost) {
            addToast("Not enough points to redeem this prize.", 'info', '😟');
            return;
        }
        setConfirmingReward(reward);
    };

    const executeRedeem = async () => {
        if (!confirmingReward || !currentViewingProfile) return;
        
        await deductPoints(currentViewingProfile.id, confirmingReward.cost);

        addAppNotification(
            `${currentViewingProfile.name} redeemed the prize "${confirmingReward.name}" for ${confirmingReward.cost} points!`,
            'reward_redeemed',
            currentViewingProfile.id
        );
        addToast(`🎉 You redeemed "${confirmingReward.name}"!`, 'badge', '🛍️');
        setConfirmingReward(null);
    };

    const handleConsequenceSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const pointsToDeduct = parseInt(consequencePoints, 10);
        if (!consequenceChildId || !consequenceReason.trim() || isNaN(pointsToDeduct) || pointsToDeduct <= 0) {
            addToast("Please select a child, enter a positive point amount, and provide a reason.", 'info');
            return;
        }

        const childProfile = profiles.find(p => p.id === consequenceChildId);
        if (!childProfile) return;

        await deductPoints(consequenceChildId, pointsToDeduct);
        addAppNotification(
            `You lost ${pointsToDeduct} points as a consequence for: ${consequenceReason.trim()}`,
            'reward_redeemed', // Using this type for visibility, could be a new 'consequence' type
            consequenceChildId
        );
        addToast(`${pointsToDeduct} points deducted from ${childProfile.name}.`, 'badge');
        
        // Reset form
        setConsequenceChildId('');
        setConsequencePoints('');
        setConsequenceReason('');
    };

    const handleAwardScreenTime = async (e: React.FormEvent) => {
        e.preventDefault();
        const minutes = parseInt(screenTimeMinutes, 10);
        if (!screenTimeChildId || !screenTimeReason.trim() || isNaN(minutes) || minutes <= 0) {
            addToast("Please select a child, enter a positive number of minutes, and provide a reason.", 'info');
            return;
        }
        
        await addScreenTime(screenTimeChildId, minutes, screenTimeReason.trim());
        setScreenTimeChildId('');
        setScreenTimeMinutes('');
    };
    
    const childProfiles = useMemo(() => profiles.filter(p => p.role === 'child'), [profiles]);

    // --- Wishlist Logic ---
    const myWishlistItems = useMemo(() => {
        if (!currentViewingProfile) return [];
        return rewardWishlist.filter(item => item.profileId === currentViewingProfile.id)
            .sort((a,b) => b.status.localeCompare(a.status)); // Keep pending at top
    }, [rewardWishlist, currentViewingProfile]);

    const pendingWishlistRequests = useMemo(() => {
        return rewardWishlist.filter(item => item.status === 'pending');
    }, [rewardWishlist]);

    const handleAddWishlistItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!wishlistItemName.trim() || !currentViewingProfile) {
            addToast("Please enter a name for your wish.", 'info');
            return;
        }
        await addRewardWishlistItem({
            profileId: currentViewingProfile.id,
            name: wishlistItemName.trim(),
            url: wishlistItemUrl.trim() || undefined,
            status: 'pending'
        });
        addToast("Your wish has been sent to your parents!", 'info');
        setIsWishlistModalOpen(false);
        setWishlistItemName('');
        setWishlistItemUrl('');
    };
    
    const handleDenyRequest = async (item: RewardWishlistItem) => {
        await updateRewardWishlistItem(item.id, { status: 'denied' });
        addAppNotification(`Your wishlist item "${item.name}" was not approved at this time.`, 'reward_redeemed', item.profileId);
        addToast("Request denied.", 'info');
    };

    const handleApproveRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        const cost = parseInt(approvalCost, 10);
        if (!approvingItem || isNaN(cost) || cost <= 0) {
            addToast("Please enter a valid point cost.", 'info');
            return;
        }

        // 1. Add to available rewards
        const newReward: AvailableReward = { id: uniqueId(), name: approvingItem.name, cost: cost };
        await onSavePersonalization({ availableRewards: [...availableRewardsList, newReward] });
        
        // 2. Update wishlist item status
        await updateRewardWishlistItem(approvingItem.id, { status: 'approved' });
        
        // 3. Notify child
        addAppNotification(`Your wishlist item "${approvingItem.name}" was approved and added to the prize list for ${cost} points!`, 'badge_earned', approvingItem.profileId);
        
        // 4. Close modal and reset
        addToast('Wishlist item approved!', 'info');
        setApprovingItem(null);
        setApprovalCost('');
    };
    
    const WishlistStatusTag = ({ status }: { status: RewardWishlistItem['status'] }) => {
        const styleMap = {
            pending: styles.wishlistStatusPending,
            approved: styles.wishlistStatusApproved,
            denied: styles.wishlistStatusDenied,
        };
        return React.createElement('span', { style: { ...styles.wishlistStatusTag, ...styleMap[status] } }, status);
    };
    
    const TopEarnerWidget = () => (
        weeklyTopEarner ? 
        React.createElement('div', {style: styles.topEarnerWidget},
            React.createElement('h3', {style: styles.topEarnerTitle}, '🏆 Top Earner of the Week!'),
            React.createElement('h4', {style: styles.topEarnerName}, weeklyTopEarner.profile.name),
            React.createElement('p', {style: styles.topEarnerPoints}, `With ${weeklyTopEarner.points} points earned!`)
        ) : null
    );

    const Podium = () => {
        const topThree = sortedProfilesByPoints.slice(0, 3);
        const podiumOrder = [
            topThree.find((_, i) => i === 1), // 2nd place
            topThree.find((_, i) => i === 0), // 1st place
            topThree.find((_, i) => i === 2), // 3rd place
        ].filter(Boolean); // Filter out undefined if less than 3 profiles

        return React.createElement('div', {style: styles.podiumContainer},
            podiumOrder.map((profile, index) => {
                if (!profile) return null;
                const podiumIndex = index === 0 ? 2 : index === 1 ? 1 : 3;
                return React.createElement('div', { key: profile.id, style: {...styles.podiumStep, ...(styles[`podiumStep${podiumIndex}`] || {})} },
                    React.createElement('div', {style: styles.podiumAvatar}, profile.avatarUrl || '👤'),
                    React.createElement('p', {style: styles.podiumName}, profile.name),
                    React.createElement('p', {style: styles.podiumPoints}, `${profile.points} pts`)
                )
            })
        );
    };

    return (
        React.createElement('div', { style: styles.pageContainer },
            React.createElement(Modal, {
                isOpen: !!confirmingReward,
                onClose: () => setConfirmingReward(null),
                title: "Confirm Redemption",
                children: React.createElement('div', null,
                    React.createElement('p', null, `Are you sure you want to redeem "${confirmingReward?.name}" for ${confirmingReward?.cost} points?`),
                    React.createElement('div', { style: styles.modalActions },
                        React.createElement('button', { onClick: () => setConfirmingReward(null), style: {...styles.button, ...styles.buttonSecondary} }, "Cancel"),
                        React.createElement('button', { onClick: executeRedeem, style: styles.button }, "Confirm")
                    )
                )
            }),
            React.createElement(Modal, {
                isOpen: isWishlistModalOpen,
                onClose: () => setIsWishlistModalOpen(false),
                title: "Add to My Wishlist",
                children: React.createElement('form', { onSubmit: handleAddWishlistItem },
                    React.createElement('div', {style: styles.formGroup}, React.createElement('label', {htmlFor: 'wishName'}, 'Item Name:'), React.createElement('input', {id: 'wishName', style: styles.input, value: wishlistItemName, onChange: e => setWishlistItemName(e.target.value), placeholder: 'e.g., A new video game'})),
                    React.createElement('div', {style: styles.formGroup}, React.createElement('label', {htmlFor: 'wishUrl'}, 'Link (optional):'), React.createElement('input', {id: 'wishUrl', style: styles.input, value: wishlistItemUrl, onChange: e => setWishlistItemUrl(e.target.value), placeholder: 'https://example.com/item'})),
                    React.createElement('div', {style: styles.modalActions}, React.createElement('button', {type: 'submit', style: styles.button}, 'Request Item'))
                )
            }),
             React.createElement(Modal, {
                isOpen: !!approvingItem,
                onClose: () => setApprovingItem(null),
                title: `Approve: ${approvingItem?.name}`,
                children: React.createElement('form', { onSubmit: handleApproveRequest },
                    React.createElement('div', {style: styles.formGroup}, React.createElement('label', {htmlFor: 'approvalCost'}, 'Set Point Cost:'), React.createElement('input', {id: 'approvalCost', type: 'number', style: styles.input, value: approvalCost, onChange: e => setApprovalCost(e.target.value), required: true})),
                    React.createElement('div', {style: styles.modalActions}, React.createElement('button', {type: 'submit', style: styles.button}, 'Approve & Add to Prizes'))
                )
            }),
            React.createElement('h2', { style: styles.pageHeader }, "🏆 Prizes & Recognition"),
            
            currentViewingProfile?.role === 'adult' && (
                React.createElement(React.Fragment, null,
                    React.createElement('section', {style: styles.section},
                        React.createElement('h3', { style: styles.sectionTitle}, 'Wishlist Requests'),
                        pendingWishlistRequests.length > 0 ? (
                            pendingWishlistRequests.map(item => React.createElement('div', { key: item.id, style: styles.wishlistItem },
                                React.createElement('div', { style: styles.wishlistItemInfo },
                                    React.createElement('span', { style: styles.wishlistItemName }, item.name),
                                    React.createElement('span', { style: styles.wishlistItemMeta }, `Requested by: ${getProfileName(item.profileId)}`)
                                ),
                                React.createElement('div', { style: styles.wishlistItemActions },
                                    React.createElement('button', { style: {...styles.button, width: 'auto'}, onClick: () => setApprovingItem(item) }, 'Approve'),
                                    React.createElement('button', { style: {...styles.button, ...styles.buttonDanger, width: 'auto'}, onClick: () => handleDenyRequest(item) }, 'Deny')
                                )
                            ))
                        ) : React.createElement(EmptyState, {icon: '🎁', title: 'No Pending Requests', message: 'All wishlist items have been reviewed.'})
                    ),
                    React.createElement('section', { style: styles.section },
                        React.createElement('h3', { style: styles.sectionTitle}, 'Parental Actions'),
                        React.createElement('div', { style: styles.parentalActionsContainer },
                            React.createElement('div', { style: {...styles.section, ...styles.parentalActionCard} },
                                React.createElement('h3', { style: {...styles.sectionTitle, border: 'none', padding: 0} }, "🎁 Award Screen Time"),
                                React.createElement('form', { onSubmit: handleAwardScreenTime },
                                    React.createElement('div', { style: styles.formGroup },
                                        React.createElement('label', {htmlFor: 'screenTimeChild', style: styles.label}, 'Child:'),
                                        React.createElement('select', {id: 'screenTimeChild', style: styles.selectInput, value: screenTimeChildId, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setScreenTimeChildId(e.currentTarget.value)},
                                            React.createElement('option', { value: '' }, 'Select a child...'),
                                            childProfiles.map(child => React.createElement('option', { key: child.id, value: child.id }, child.name))
                                        )
                                    ),
                                    React.createElement('div', { style: styles.formGroup },
                                        React.createElement('label', {htmlFor: 'screenTimeMinutes', style: styles.label}, 'Minutes to Award:'),
                                        React.createElement('input', {type: 'number', id: 'screenTimeMinutes', style: styles.input, value: screenTimeMinutes, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setScreenTimeMinutes(e.currentTarget.value), placeholder: 'e.g., 30'})
                                    ),
                                    React.createElement('div', { style: styles.formGroup },
                                        React.createElement('label', {htmlFor: 'screenTimeReason', style: styles.label}, 'Reason:'),
                                        React.createElement('input', {type: 'text', id: 'screenTimeReason', style: styles.input, value: screenTimeReason, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setScreenTimeReason(e.currentTarget.value)})
                                    ),
                                    React.createElement('button', {type: 'submit', style: {...styles.button, backgroundColor: '#17a2b8'}}, 'Award Screen Time')
                                )
                            ),
                            React.createElement('div', { style: {...styles.section, backgroundColor: '#fffbe6', border: '1px solid #ffe58f'} },
                                React.createElement('h3', { style: {...styles.sectionTitle, border: 'none', padding: 0} }, "⚖️ Apply Consequence"),
                                React.createElement('p', {style: {color: '#666'}}, 'Deduct points for unacceptable behavior.'),
                                React.createElement('form', { onSubmit: handleConsequenceSubmit },
                                    React.createElement('div', { style: styles.formGroup },
                                        React.createElement('label', {htmlFor: 'consequenceChild', style: styles.label}, 'Child:'),
                                        React.createElement('select', {id: 'consequenceChild', style: styles.selectInput, value: consequenceChildId, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setConsequenceChildId(e.currentTarget.value)},
                                            React.createElement('option', { value: '' }, 'Select a child...'),
                                            childProfiles.map(child => React.createElement('option', { key: child.id, value: child.id }, child.name))
                                        )
                                    ),
                                    React.createElement('div', { style: styles.formGroup },
                                        React.createElement('label', {htmlFor: 'consequencePoints', style: styles.label}, 'Points to Deduct:'),
                                        React.createElement('input', {type: 'number', id: 'consequencePoints', style: styles.input, value: consequencePoints, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setConsequencePoints(e.currentTarget.value), placeholder: 'e.g., 20'})
                                    ),
                                    React.createElement('div', { style: styles.formGroup },
                                        React.createElement('label', {htmlFor: 'consequenceReason', style: styles.label}, 'Reason:'),
                                        React.createElement('textarea', {id: 'consequenceReason', style: styles.textarea, value: consequenceReason, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => setConsequenceReason(e.currentTarget.value), placeholder: 'e.g., For dishonesty about chores.'})
                                    ),
                                    React.createElement('button', {type: 'submit', style: {...styles.button, backgroundColor: '#dc3545'}}, 'Deduct Points')
                                )
                            )
                        )
                    )
                )
            ),
            
            React.createElement(TopEarnerWidget, null),

            React.createElement('section', { style: styles.section },
                React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' } },
                    React.createElement('div', { 
                        style: {...styles.hubTile, cursor: 'pointer', background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)', color: 'white'},
                        onClick: () => onNavigate('mysteryBox')
                    },
                        React.createElement('h3', { style: {...styles.hubTileTitle, color: 'white'}}, '🎁 Mystery Box'),
                        React.createElement('p', { style: styles.hubTileDescription }, currentViewingProfile?.role === 'child' ? 'Feeling lucky? Spend your points on a surprise prize!' : 'Manage the prize tiers for Mystery Boxes.')
                    ),
                    React.createElement('div', { 
                        style: {...styles.hubTile, cursor: 'pointer', background: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)', color: 'white'},
                        onClick: () => onNavigate('accolades')
                    },
                        React.createElement('h3', { style: {...styles.hubTileTitle, color: 'white'}}, '🏅 Medals & Accolades'),
                        React.createElement('p', { style: styles.hubTileDescription }, currentViewingProfile?.role === 'child' ? 'View the special medals you have earned for great behavior!' : 'Create and award special medals for exceptional behavior.')
                    )
                ),

                // Pointboard
                React.createElement('h3', { style: styles.sectionTitle }, "All-Time Pointboard"),
                sortedProfilesByPoints.length > 0 ? (
                    React.createElement(Podium, null)
                ) : React.createElement('p', null, "No points earned yet to display on the Pointboard."),
                 
                // Available Rewards for Redemption
                React.createElement('div', { style: {marginTop: '25px'} },
                    React.createElement('h3', { style: {...styles.sectionTitle, fontSize: '1.3em'} }, "🛍️ Available Prizes for Redemption"),
                    availableRewardsList.length > 0 ? (
                        React.createElement('ul', { style: styles.definedRewardsList },
                            availableRewardsList.map(reward => {
                                const canRedeem = currentViewingProfile?.role === 'child' && currentViewingProfile.points >= reward.cost;
                                return (
                                    React.createElement('li', { key: reward.id, style: styles.definedRewardItem },
                                        React.createElement('div', null,
                                            React.createElement('span', { style: styles.definedRewardName }, reward.name),
                                            ' - ',
                                            React.createElement('span', { style: styles.definedRewardCost }, `${reward.cost} pts`)
                                        ),
                                        currentViewingProfile?.role === 'child' && (
                                            React.createElement('button', {
                                                onClick: () => handleRedeemReward(reward),
                                                style: canRedeem ? {...styles.button, width: 'auto'} : {...styles.button, width: 'auto', backgroundColor: '#ccc', cursor: 'not-allowed', opacity: 0.6},
                                                disabled: !canRedeem,
                                                'aria-label': `Redeem ${reward.name} for ${reward.cost} points. ${!canRedeem ? 'Not enough points.' : ''}`
                                            }, "Redeem")
                                        )
                                    )
                                );
                            })
                        )
                    ) : (
                        React.createElement('p', null, "No prizes have been set up by parents yet. Add some in 'Prize Settings'!")
                    ),
                    currentViewingProfile?.role === 'adult' && availableRewardsList.length > 0 && (
                         React.createElement('p', { style: {marginTop: '10px', fontSize: '0.9em', color: '#666'} }, "Children can redeem these prizes with their earned points. You can manage these in 'Prize Settings'.")
                    )
                ),
                
                 // Wishlist for Children
                currentViewingProfile?.role === 'child' && (
                    React.createElement('div', { style: {marginTop: '25px'} },
                        React.createElement('h3', { style: {...styles.sectionTitle, fontSize: '1.3em'} }, "My Wishlist"),
                        React.createElement('button', {onClick: () => setIsWishlistModalOpen(true), style: {...styles.button, width: 'auto', marginBottom: '10px'}}, '+ Add to Wishlist'),
                         myWishlistItems.length > 0 ? (
                            myWishlistItems.map(item => React.createElement('div', { key: item.id, style: styles.wishlistItem },
                                React.createElement('span', { style: styles.wishlistItemName }, item.name),
                                React.createElement(WishlistStatusTag, { status: item.status })
                            ))
                        ) : React.createElement(EmptyState, {icon: '🤔', title: 'Wishlist is Empty', message: 'Want a prize that isn\'t listed? Add it to your wishlist for your parents to see!'})
                    )
                ),
                
                // Available Badges
                React.createElement('div', { style: {marginTop: '25px'} },
                    React.createElement('h3', { style: {...styles.sectionTitle, fontSize: '1.3em'} }, "🌟 Available Badges & Achievements:"),
                    React.createElement('ul', { style: styles.badgeInfoList },
                        BADGE_DEFINITIONS.map(badge => (
                            React.createElement('li', { key: badge.id, style: styles.badgeInfoItem },
                                React.createElement('span', { style: styles.badgeInfoIcon }, badge.icon),
                                React.createElement('div', null,
                                    React.createElement('span', { style: styles.badgeInfoName }, badge.name),
                                    React.createElement('span', { style: styles.badgeInfoDescription }, ` - ${badge.description}`)
                                )
                            )
                        ))
                    )
                )
            )
        )
    );
}
