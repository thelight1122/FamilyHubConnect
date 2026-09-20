import React, { useState } from 'react';
import type { Chore, ChoreStatus, Profile } from '../../types';
import { styles } from '../../styles';
import { isDatePast } from '../../utils/utils';

// This state is managed in the parent (ChoresView) but defined here for prop typing.
interface AIAssigneeSuggestionState {
    choreId: string | null;
    isLoading: boolean;
    suggestedProfileId: string | null;
    error: string | null;
}

interface ChoreItemProps {
    chore: Chore;
    viewingProfile: Profile;
    profiles: Profile[];
    getProfileName: (id: string | null) => string;
    onAssign: (choreId: string, profileId: string | null) => void;
    onChangeStatus: (choreId: string, status: ChoreStatus) => void;
    onApprove: (choreId: string) => void;
    onReject: (choreId: string) => void;
    onTriggerPhotoUpload: (choreId: string) => void;
    onGetAIAssigneeSuggestion: (chore: Chore) => void;
    onApplyAISuggestion: (choreId: string, profileId: string) => void;
    aiSuggestionState: AIAssigneeSuggestionState;
    onAcceptBonusChore: (chore: Chore) => void;
}

const getStatusStyles = (status: ChoreStatus) => {
    switch (status) {
        case 'pending': return { borderColor: '#ffc107', statusColor: '#ffc107' };
        case 'in progress': return { borderColor: '#17a2b8', statusColor: '#17a2b8' };
        case 'pending_approval': return { borderColor: '#fd7e14', statusColor: '#fd7e14' };
        case 'completed': return { borderColor: '#28a745', statusColor: '#28a745' };
        case 'rejected': return { borderColor: '#dc3545', statusColor: '#dc3545' };
        default: return { borderColor: '#ccc', statusColor: '#ccc' };
    }
};

export default function ChoreItem({
    chore, viewingProfile, profiles, getProfileName, onAssign,
    onChangeStatus, onApprove, onReject, onTriggerPhotoUpload,
    onGetAIAssigneeSuggestion, onApplyAISuggestion, aiSuggestionState,
    onAcceptBonusChore
}: ChoreItemProps) {
    const { borderColor } = getStatusStyles(chore.status);
    const cardStyle = { ...styles.choreCard, borderLeft: `5px solid ${borderColor}` };
    const pastDue = isDatePast(chore.dueDate) && chore.status !== 'completed';
    const isAssignee = viewingProfile.id === chore.assignedTo;
    const isParent = viewingProfile.role === 'adult';

    const renderParentActions = () => {
        if (!isParent) return null;

        if (chore.status === 'pending_approval') {
            return React.createElement('div', { style: { display: 'flex', gap: '10px' } },
                React.createElement('button', { onClick: () => onApprove(chore.id), style: { ...styles.button, ...styles.buttonSuccess, width: 'auto' } }, 'Approve'),
                React.createElement('button', { onClick: () => onReject(chore.id), style: { ...styles.button, ...styles.buttonDanger, width: 'auto' } }, 'Reject')
            );
        }
        return null;
    };

    const renderChildActions = () => {
        if (!isAssignee) return null;
        switch (chore.status) {
            case 'pending':
                return React.createElement('button', { onClick: () => onChangeStatus(chore.id, 'in progress'), style: { ...styles.button, width: 'auto' } }, 'Start Chore');
            case 'in progress':
                return React.createElement('button', { onClick: () => chore.requiresPhoto ? onTriggerPhotoUpload(chore.id) : onChangeStatus(chore.id, 'completed'), style: { ...styles.button, ...styles.buttonSuccess, width: 'auto' } }, chore.requiresPhoto ? 'Submit Photo' : 'Mark as Done');
            case 'rejected':
                return React.createElement('button', { onClick: () => onChangeStatus(chore.id, 'in progress'), style: { ...styles.button, ...styles.buttonWarning, width: 'auto' } }, 'Try Again');
            default:
                return null;
        }
    };
    
    const renderAssigneeDropdown = () => {
        // Only parents can assign chores that are pending and not bonus chores
        if (!isParent || chore.status !== 'pending' || chore.isBonus) return null;

        return React.createElement('div', { style: { marginTop: '10px' } },
            React.createElement('select', { 
                value: chore.assignedTo || 'unassigned', 
                onChange: (e: React.ChangeEvent<HTMLSelectElement>) => onAssign(chore.id, e.target.value === 'unassigned' ? null : e.target.value), 
                style: {...styles.selectInput, fontSize: '0.9em'} 
            } as React.HTMLProps<HTMLSelectElement>,
                React.createElement('option', { value: 'unassigned' }, 'Unassigned'),
                ...profiles.filter(p => p.role === 'child').map(p => React.createElement('option', { key: p.id, value: p.id }, p.name))
            ),
             !chore.assignedTo && React.createElement('button', {
                style: { ...styles.button, ...styles.buttonInfo, fontSize: '0.8em', padding: '4px 8px', marginTop: '5px', width: 'auto' },
                disabled: aiSuggestionState.isLoading && aiSuggestionState.choreId === chore.id,
                onClick: () => onGetAIAssigneeSuggestion(chore)
            }, aiSuggestionState.isLoading && aiSuggestionState.choreId === chore.id ? "🧠 Thinking..." : "🤖 Get Suggestion")
        );
    };

    const renderAiSuggestion = () => {
        if (!isParent || aiSuggestionState.isLoading || aiSuggestionState.choreId !== chore.id) return null;
        
        const { suggestedProfileId, error } = aiSuggestionState;
        
        if (error) {
            return React.createElement('p', { style: { ...styles.aiError, fontSize: '0.8em', padding: '5px', marginTop: '5px' } }, error);
        }
        
        if (suggestedProfileId) {
            return React.createElement('div', { style: {backgroundColor: '#e9f5ff', padding: '5px', borderRadius: '4px', marginTop: '5px', fontSize: '0.9em'}},
                `AI Suggests: ${getProfileName(suggestedProfileId)}. `,
                React.createElement('button', {
                    style: {color: '#007bff', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', padding: 0, fontSize: 'inherit'},
                    onClick: () => onApplyAISuggestion(chore.id, suggestedProfileId)
                }, 'Apply')
            );
        }
        return null;
    };

    return React.createElement('li', { style: cardStyle },
        chore.photoProofUrl && chore.status === 'pending_approval' && React.createElement('a', { href: chore.photoProofUrl, target: '_blank', rel: 'noopener noreferrer' },
            React.createElement('img', { src: chore.photoProofUrl, alt: `Proof for ${chore.name}`, style: { width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px', marginRight: '15px' } })
        ),
        React.createElement('div', { style: styles.choreCardContent },
            React.createElement('div', { style: styles.choreCardDetails },
                React.createElement('h4', { style: styles.choreCardTitle }, chore.name),
                React.createElement('div', { style: styles.choreCardMeta },
                    React.createElement('span', { style: { ...styles.choreCardStatus, backgroundColor: getStatusStyles(chore.status).statusColor } }, chore.status.replace(/_/g, ' ')),
                    chore.dueDate && React.createElement('span', { style: { color: pastDue ? '#dc3545' : '#666' } }, `Due: ${new Date(chore.dueDate + 'T00:00:00Z').toLocaleDateString()}`),
                    (chore.points > 0 || chore.isBonus) && React.createElement('span', null, ` | ${chore.isBonus ? `$${chore.bonusAmount}` : `${chore.points} pts`}`),
                ),
                isParent ? renderAssigneeDropdown() : (chore.assignedTo ? React.createElement('p', {style: {fontSize: '0.9em', color: '#666', margin: '5px 0 0 0'}}, `Assigned to: ${getProfileName(chore.assignedTo)}`) : null),
                renderAiSuggestion(),
                chore.rejectionReason && React.createElement('p', { style: { ...styles.choreRejectionReason, margin: '10px 0 0 0', padding: '8px' } }, React.createElement('strong', null, 'Feedback: '), chore.rejectionReason)
            ),
            React.createElement('div', { style: { textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '5px' } },
                isParent ? renderParentActions() : renderChildActions(),
                chore.isBonus && !chore.assignedTo && !isParent && React.createElement('button', { onClick: () => onAcceptBonusChore(chore), style: {...styles.button, ...styles.buttonSuccess, width: 'auto'}}, 'Accept Bonus Chore')
            )
        )
    );
}