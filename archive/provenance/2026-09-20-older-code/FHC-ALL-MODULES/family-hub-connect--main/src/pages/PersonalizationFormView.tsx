
import React, { useState, useEffect, useCallback } from 'react';
import type { PersonalizationData, AdultDetailForm, ChildDetailForm } from '../types';
import { AVATAR_OPTIONS } from '../constants';
import { useAppDispatch, useAppState } from '../AppContext';
import { uniqueId } from '../utils/utils';

interface PersonalizationFormViewProps {
    onSave?: (data: PersonalizationData) => Promise<void>; // Make optional if handled by context
}

export default function PersonalizationFormView({
    onSave
}: PersonalizationFormViewProps) {
    const { addToast, handleSaveInitialSetup } = useAppDispatch();
    const { session } = useAppState();
    const [step, setStep] = useState(1);
    const [numAdultsStr, setNumAdultsStr] = useState('1');
    const [numChildrenStr, setNumChildrenStr] = useState('1');
    const [adultDetails, setAdultDetails] = useState<AdultDetailForm[]>([]);
    const [childDetails, setChildDetails] = useState<ChildDetailForm[]>([]);
    const [gamifyTasks, setGamifyTasks] = useState(true);
    const [allowanceEnabled, setAllowanceEnabled] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    const effectiveOnSave = onSave || handleSaveInitialSetup;

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
        await effectiveOnSave(personalizationData);
        setIsSaving(false);
    };

    const renderMemberInputs = (type: 'adult' | 'child', index: number, details: AdultDetailForm | ChildDetailForm) => {
        const isNameReadOnly = type === 'adult' && index === 0;

        return (
            <div key={details.tempId} className="card">
                <h4 className="font-bold text-large mt-0 mb-20">{`${type.charAt(0).toUpperCase() + type.slice(1)} ${index + 1} Details`}</h4>
                <div className="form-group">
                    <label htmlFor={`${type}Name${index}`}>Name:</label>
                    <input
                        type="text"
                        id={`${type}Name${index}`}
                        value={details.name}
                        placeholder="Enter name"
                        required
                        aria-required="true"
                        readOnly={isNameReadOnly}
                        onChange={isNameReadOnly ? undefined : (e) => handleMemberDetailChange(type, index, 'name', e.target.value)}
                    />
                </div>
                 {type === 'adult' && index === 0 && (details as AdultDetailForm).email && (
                     <div className="form-group">
                        <label htmlFor='primaryAdultEmail'>Email (from your login):</label>
                        <input
                            type='email' id='primaryAdultEmail'
                            value={(details as AdultDetailForm).email} readOnly
                        />
                    </div>
                )}
                {type === 'child' && (
                    <div className="form-group">
                        <label htmlFor={`childAge${index}`}>Age (optional):</label>
                        <input
                            type="number" id={`childAge${index}`}
                            value={(details as ChildDetailForm).age === undefined ? '' : (details as ChildDetailForm).age}
                            onChange={(e) => handleMemberDetailChange(type, index, 'age', e.target.value)}
                            placeholder="Enter age" min="0" max="100"
                        />
                    </div>
                )}
                <div className="form-group">
                    <label htmlFor={`${type}Avatar${index}`}>Avatar:</label>
                    <select
                        id={`${type}Avatar${index}`}
                        value={details.avatarUrl || (type === 'adult' ? AVATAR_OPTIONS[0].value : AVATAR_OPTIONS[3].value)}
                        onChange={(e) => handleMemberDetailChange(type, index, 'avatarUrl', e.target.value)}
                    >
                        {AVATAR_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                </div>
            </div>
        );
    };
    
    return (
        <div className="page">
            <header className="header">
                <h2>Welcome! Let's Get Set Up (Step {step} of 2)</h2>
            </header>
            <main className="main">
                <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }}>
                    {step === 1 && (
                        <div>
                            <section className="card">
                                <h3>Who is in your family?</h3>
                                <div className="form-group">
                                    <label htmlFor="numAdults">Number of Adults:</label>
                                    <input
                                        type="number" id="numAdults"
                                        value={numAdultsStr}
                                        onChange={(e) => setNumAdultsStr(e.target.value)}
                                        placeholder="e.g., 1 or 2" min="1" max="10" aria-required="true"
                                    />
                                </div>
                                {adultDetails.map((adult, index) => renderMemberInputs('adult', index, adult))}
                                
                                <div className="form-group">
                                    <label htmlFor="numChildren">Number of Children:</label>
                                    <input
                                        type="number" id="numChildren"
                                        value={numChildrenStr}
                                        onChange={(e) => setNumChildrenStr(e.target.value)}
                                        placeholder="e.g., 2" min="0" max="10"
                                    />
                                </div>
                                {childDetails.map((child, index) => renderMemberInputs('child', index, child))}
                            </section>
                        </div>
                    )}
                    {step === 2 && (
                        <div>
                            <section className="card">
                                <h3>Choose Your Features</h3>
                                <div className="form-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            className="checkbox"
                                            checked={gamifyTasks}
                                            onChange={(e) => setGamifyTasks(e.target.checked)}
                                        />
                                        Enable Gamification (Points & Badges for Chores)
                                    </label>
                                    <p className="text-light" style={{marginLeft: '28px'}}>Motivate your family by awarding points for completed tasks, which can be redeemed for prizes you set up.</p>
                                </div>
                                <div className="form-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            className="checkbox"
                                            checked={allowanceEnabled}
                                            onChange={(e) => setAllowanceEnabled(e.target.checked)}
                                        />
                                        Enable Digital Wallet & Allowance
                                    </label>
                                    <p className="text-light" style={{marginLeft: '28px'}}>Set up a weekly allowance for children. They can track their balance and request to spend their money.</p>
                                </div>
                            </section>
                        </div>
                    )}
                    <div style={{display: 'flex', justifyContent: step > 1 ? 'space-between' : 'flex-end', marginTop: '20px'}}>
                        {step > 1 && <button type="button" onClick={handlePreviousStep} className="btn btn-secondary w-auto">← Previous Step</button>}
                        <button type="submit" className="btn w-auto" disabled={isSaving}> 
                            {isSaving ? 'Saving...' : (step === 2 ? 'Finish Setup 🎉' : 'Next Step →')}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}