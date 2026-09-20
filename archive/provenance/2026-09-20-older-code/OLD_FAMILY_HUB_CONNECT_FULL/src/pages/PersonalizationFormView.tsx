
import React, { useState, useEffect, useCallback } from 'react';
import type { PageView, PersonalizationData, AdultDetailForm, ChildDetailForm, ToastMessage } from '../types';
import { styles } from '../styles';
import { uniqueId } from '../utils/utils';
import { AVATAR_OPTIONS } from '../constants';
import { useAppContext } from '../contexts/AppContext';

interface PersonalizationFormViewProps {
    onSave: (data: PersonalizationData) => Promise<void>;
}

export default function PersonalizationFormView({
    onSave
}: PersonalizationFormViewProps) {
    const { addToast, session } = useAppContext();
    const [step, setStep] = useState(1);
    const [numAdultsStr, setNumAdultsStr] = useState('1');
    const [numChildrenStr, setNumChildrenStr] = useState('1');
    const [adultDetails, setAdultDetails] = useState<AdultDetailForm[]>([]);
    const [childDetails, setChildDetails] = useState<ChildDetailForm[]>([]);
    const [gamifyTasks, setGamifyTasks] = useState(true);
    const [allowanceEnabled, setAllowanceEnabled] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const updateDetailArray = useCallback(<T extends AdultDetailForm | ChildDetailForm>(
        type: 'adult' | 'child',
        newCount: number,
        currentArray: T[]
    ): T[] => {
        const newArray = [...currentArray];
        if (newCount < newArray.length) {
            return newArray.slice(0, newCount);
        } else if (newCount > newArray.length) {
            for (let i = newArray.length; i < newCount; i++) {
                const defaultAvatar = type === 'adult' ? AVATAR_OPTIONS[1].value : AVATAR_OPTIONS[4].value;
                const tempId = `${type}_${Date.now()}_${i}`;
                if (type === 'adult') {
                    newArray.push({ tempId, name: '', avatarUrl: defaultAvatar, role: 'adult' } as T);
                } else {
                    newArray.push({ tempId, name: '', avatarUrl: defaultAvatar, age: undefined, role: 'child' } as T);
                }
            }
        }
        return newArray;
    }, []);

    useEffect(() => {
        const numA = parseInt(numAdultsStr, 10) || 0;
        setAdultDetails(prev => updateDetailArray('adult', numA, prev));
    }, [numAdultsStr, updateDetailArray]);

    useEffect(() => {
        const numC = parseInt(numChildrenStr, 10) || 0;
        setChildDetails(prev => updateDetailArray('child', numC, prev));
    }, [numChildrenStr, updateDetailArray]);

    useEffect(() => {
        // Pre-fill first adult's details from session
        if (session && adultDetails.length > 0 && !adultDetails[0].name) {
            const userEmail = session.user.email || '';
            const nameFromEmail = userEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            const newAdultDetails = [...adultDetails];
            newAdultDetails[0] = { 
                ...newAdultDetails[0], 
                name: nameFromEmail,
                email: userEmail,
            };
            setAdultDetails(newAdultDetails);
        }
    }, [session, adultDetails]);


    const handleMemberDetailChange = (
        type: 'adult' | 'child',
        index: number,
        field: keyof AdultDetailForm | keyof ChildDetailForm,
        value: string | number
    ) => {
        const setter = type === 'adult' ? setAdultDetails : setChildDetails;
        setter(prev => {
            const newDetails = [...prev];
            if (newDetails[index]) {
                if (type === 'child' && field === 'age') {
                    (newDetails[index] as ChildDetailForm)[field] = value === '' ? undefined : Number(value);
                } else {
                    (newDetails[index] as any)[field] = value;
                }
            }
            return newDetails;
        });
    };
    
    const validateStep = (currentStep: number): boolean => {
         if (currentStep === 1) {
            const numA = parseInt(numAdultsStr, 10);
            const numC = parseInt(numChildrenStr, 10);
            
            if (isNaN(numA) || numA <= 0) {
                 addToast('You must have at least one adult.', 'info');
                 return false;
            }
            if (isNaN(numC) || numC < 0) {
                addToast('Number of children must be 0 or more.', 'info');
                return false;
            }

            for (let i = 0; i < numA; i++) {
                if (!adultDetails[i]?.name.trim()) {
                    addToast(`Adult ${i + 1}'s name is required.`, 'info');
                    return false;
                }
            }

            for (let i = 0; i < numC; i++) {
                if (!childDetails[i]?.name.trim()) {
                    addToast(`Child ${i + 1}'s name is required.`, 'info');
                    return false;
                }
            }
         }
         return true;
    };
    
    const handleNextStep = async () => {
        if (validateStep(step)) {
            if (step === 2) {
                await handleSubmit();
            } else {
                setStep(prev => prev + 1);
            }
        }
    };

    const handlePreviousStep = () => {
        setStep(prev => prev - 1);
    };

    const handleSubmit = async () => {
        if (!validateStep(1) || !validateStep(2)) return;
        
        setIsSaving(true);
        const personalizationData: PersonalizationData = {
            id: uniqueId(), // This is temporary, the backend will assign a real ID
            numAdultsStr,
            numChildrenStr,
            adultDetailsArray: adultDetails,
            childDetailsArray: childDetails,
            gamifyTasks: gamifyTasks,
            availableRewards: [
                { id: 'r1', name: 'Extra TV Time', cost: 50 },
                { id: 'r2', name: 'Ice Cream Trip', cost: 100 },
            ],
            specificChores: 'Walk the dog\nSet the table',
            allowanceSettings: {
                enabled: allowanceEnabled,
                amount: 5,
                payday: 'Saturday',
            }
        };
        await onSave(personalizationData);
        setIsSaving(false);
    };

    const renderMemberInputs = (type: 'adult' | 'child', index: number, details: AdultDetailForm | ChildDetailForm) => {
        const isNameReadOnly = type === 'adult' && index === 0;

        return React.createElement('div', { key: details.tempId, style: styles.setupStepCard },
            React.createElement('h4', { style: { ...styles.sectionTitle, borderBottom: 'none', paddingBottom: 0, marginBottom: '15px' } }, `${type.charAt(0).toUpperCase() + type.slice(1)} ${index + 1} Details`),
            React.createElement('div', { style: styles.formGroup },
                React.createElement('label', { htmlFor: `${type}Name${index}`, style: styles.label }, "Name:"),
                React.createElement('input', {
                    type: "text",
                    id: `${type}Name${index}`,
                    style: styles.input,
                    value: details.name,
                    placeholder: "Enter name",
                    required: true,
                    'aria-required': "true",
                    readOnly: isNameReadOnly,
                    onChange: isNameReadOnly ? undefined : (e: React.ChangeEvent<HTMLInputElement>) => handleMemberDetailChange(type, index, 'name', e.target.value)
                })
            ),
             type === 'adult' && index === 0 && (details as AdultDetailForm).email && (
                 React.createElement('div', { style: styles.formGroup },
                    React.createElement('label', { htmlFor: 'primaryAdultEmail', style: styles.label }, "Email (from your login):"),
                    React.createElement('input', {
                        type: 'email', id: 'primaryAdultEmail', style: styles.input,
                        value: (details as AdultDetailForm).email, readOnly: true,
                    })
                )
            ),
            type === 'child' && React.createElement('div', { style: styles.formGroup },
                React.createElement('label', { htmlFor: `childAge${index}`, style: styles.label }, "Age (optional):"),
                React.createElement('input', {
                    type: "number", id: `childAge${index}`, style: styles.input,
                    value: (details as ChildDetailForm).age === undefined ? '' : (details as ChildDetailForm).age,
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleMemberDetailChange(type, index, 'age', e.target.value),
                    placeholder: "Enter age", min: "0", max:"100"
                })
            ),
            React.createElement('div', { style: styles.formGroup },
                React.createElement('label', { htmlFor: `${type}Avatar${index}`, style: styles.label }, "Avatar:"),
                React.createElement('select', {
                    id: `${type}Avatar${index}`, style: styles.selectInput,
                    value: details.avatarUrl || (type === 'adult' ? AVATAR_OPTIONS[0].value : AVATAR_OPTIONS[3].value),
                    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => handleMemberDetailChange(type, index, 'avatarUrl', e.target.value)
                }, AVATAR_OPTIONS.map(opt => React.createElement('option', { key: opt.value, value: opt.value }, opt.label)))
            )
        )
    };
    
    return React.createElement('div', { style: styles.pageContainer },
        React.createElement('h2', { style: styles.pageHeader }, `Welcome! Let's Get Set Up (Step ${step} of 2)`),
        React.createElement('form', { onSubmit: (e: React.FormEvent) => { e.preventDefault(); handleNextStep(); } },
            step === 1 && React.createElement('div', null,
                React.createElement('section', { style: styles.section },
                    React.createElement('h3', { style: styles.sectionTitle }, "Who is in your family?"),
                    React.createElement('div', { style: styles.formGroup },
                        React.createElement('label', { htmlFor: "numAdults", style: styles.label }, "Number of Adults:"),
                        React.createElement('input', {
                            type: "number", id: "numAdults", style: styles.input,
                            value: numAdultsStr,
                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setNumAdultsStr(e.target.value),
                            placeholder: "e.g., 1 or 2", min: "1", max: "10", 'aria-required': "true"
                        })
                    ),
                    adultDetails.map((adult, index) => renderMemberInputs('adult', index, adult)),
                    
                    React.createElement('div', { style: styles.formGroup },
                        React.createElement('label', { htmlFor: "numChildren", style: styles.label }, "Number of Children:"),
                        React.createElement('input', {
                            type: "number", id: "numChildren", style: styles.input,
                            value: numChildrenStr,
                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setNumChildrenStr(e.target.value),
                            placeholder: "e.g., 2", min: "0", max: "10"
                        })
                    ),
                    childDetails.map((child, index) => renderMemberInputs('child', index, child))
                ),
            ),
            step === 2 && React.createElement('div', null,
                React.createElement('section', { style: styles.section },
                    React.createElement('h3', { style: styles.sectionTitle }, "Choose Your Features"),
                    React.createElement('div', { style: styles.formGroup },
                        React.createElement('label', { style: styles.checkboxLabel },
                            React.createElement('input', {
                                type: "checkbox",
                                style: styles.checkbox,
                                checked: gamifyTasks,
                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => setGamifyTasks(e.target.checked)
                            }),
                            "Enable Gamification (Points & Badges for Chores)"
                        ),
                        React.createElement('p', {style: {fontSize: '0.9em', color: '#666', marginLeft: '28px'}}, 'Motivate your family by awarding points for completed tasks, which can be redeemed for prizes you set up.')
                    ),
                    React.createElement('div', { style: styles.formGroup },
                        React.createElement('label', { style: styles.checkboxLabel },
                            React.createElement('input', {
                                type: "checkbox",
                                style: styles.checkbox,
                                checked: allowanceEnabled,
                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => setAllowanceEnabled(e.target.checked)
                            }),
                            "Enable Digital Wallet & Allowance"
                        ),
                         React.createElement('p', {style: {fontSize: '0.9em', color: '#666', marginLeft: '28px'}}, 'Set up a weekly allowance for children. They can track their balance and request to spend their money.')
                    )
                )
            ),
            React.createElement('div', { style: {display: 'flex', justifyContent: step > 1 ? 'space-between' : 'flex-end', marginTop: '20px'} },
                step > 1 && React.createElement('button', { type: 'button', onClick: handlePreviousStep, style: {...styles.button, ...styles.buttonSecondary, width: 'auto'}}, '← Previous Step'),
                React.createElement('button', { type: 'submit', style: {...styles.button, width: 'auto'}, disabled: isSaving }, 
                    isSaving ? 'Saving...' : (step === 2 ? 'Finish Setup 🎉' : 'Next Step →')
                )
            )
        )
    );
}