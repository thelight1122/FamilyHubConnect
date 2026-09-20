
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { styles } from '../styles';
import type { DigitalVaultItem, DigitalVaultItemType } from '../types';
import Modal from '../components/ui/Modal';
import { fileToDataUrl } from '../utils/utils';

export default function DigitalVaultView() {
    const { 
        digitalVaultItems, addDigitalVaultItem, updateDigitalVaultItem, deleteDigitalVaultItem,
        currentViewingProfile, personalizationData, onSavePersonalization, addToast
    } = useAppContext();
    
    const [password, setPassword] = useState('');
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [isSetupMode, setIsSetupMode] = useState(!personalizationData?.digitalVaultPassword);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<DigitalVaultItem | null>(null);

    const handleUnlock = () => {
        if (password === personalizationData?.digitalVaultPassword) {
            setIsUnlocked(true);
            setPassword('');
        } else {
            addToast("Incorrect password.", 'info');
        }
    };

    const handleSetupPassword = () => {
        if (newPassword.length < 4) {
            addToast("Password must be at least 4 characters.", 'info'); return;
        }
        if (newPassword !== confirmPassword) {
            addToast("Passwords do not match.", 'info'); return;
        }
        onSavePersonalization({ digitalVaultPassword: newPassword });
        setIsSetupMode(false);
        setIsUnlocked(true);
        addToast("Digital Vault password set!", 'badge');
    };
    
    const openItemModal = (item?: DigitalVaultItem) => {
        setEditingItem(item || null);
        setIsModalOpen(true);
    };

    const handleSaveItem = (itemData: Partial<DigitalVaultItem>) => {
        if (editingItem) {
            updateDigitalVaultItem(editingItem.id, itemData);
        } else {
            addDigitalVaultItem({ ...itemData, profileId: currentViewingProfile?.id } as any);
        }
        setIsModalOpen(false);
    };
    
    const ItemForm: React.FC<{onSave: (data: Partial<DigitalVaultItem>) => void}> = ({ onSave }) => {
        const [title, setTitle] = useState(editingItem?.title || '');
        const [type, setType] = useState<DigitalVaultItemType>(editingItem?.type || 'generic_document');
        const [notes, setNotes] = useState(editingItem?.notes || '');
        const [file, setFile] = useState<File | null>(null);
        
        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            let documentUrl: string | undefined = editingItem?.documentUrl;
            let documentName: string | undefined = editingItem?.documentName;
            if (file) {
                documentUrl = await fileToDataUrl(file);
                documentName = file.name;
            }
            onSave({ title, type, notes, documentUrl, documentName });
        };
        
        return React.createElement('form', {onSubmit: handleSubmit},
            React.createElement('div', {style: styles.formGroup}, React.createElement('label', null, 'Title'), React.createElement('input', {value: title, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value), style: styles.input})),
            React.createElement('div', {style: styles.formGroup}, React.createElement('label', null, 'Type'), React.createElement('select', {value: type, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setType(e.target.value as any), style: styles.selectInput},
                React.createElement('option', {value: 'generic_document'}, 'Generic Document'),
                React.createElement('option', {value: 'secure_note'}, 'Secure Note'),
                React.createElement('option', {value: 'id_card'}, 'ID Card'),
                React.createElement('option', {value: 'passport'}, 'Passport'),
            )),
             React.createElement('div', {style: styles.formGroup}, React.createElement('label', null, 'Notes'), React.createElement('textarea', {value: notes, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value), style: styles.textarea, rows: 4})),
             React.createElement('div', {style: styles.formGroup}, React.createElement('label', null, 'File'), React.createElement('input', {type: 'file', onChange: (e: React.ChangeEvent<HTMLInputElement>) => setFile(e.target.files ? e.target.files[0] : null), style: styles.input})),
            React.createElement('button', {type: 'submit', style: styles.button}, 'Save')
        )
    };
    
    const renderLockedState = () => (
        React.createElement('div', {style: {textAlign: 'center'}},
            React.createElement('h3', null, "Digital Vault is Locked"),
            React.createElement('p', {style: {color: '#666'}}, 'Enter the password to access your secure documents.'),
            React.createElement('div', {style: {display: 'flex', gap: '10px', justifyContent: 'center'}},
                React.createElement('input', {type: 'password', value: password, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value), style: styles.input, placeholder: 'Password'} as React.HTMLProps<HTMLInputElement>),
                React.createElement('button', {onClick: handleUnlock, style: {...styles.button, width: 'auto'}}, 'Unlock')
            )
        )
    );
    
    const renderSetupState = () => (
         React.createElement('div', {style: {textAlign: 'center'}},
            React.createElement('h3', null, "Set Up Your Digital Vault"),
            React.createElement('p', {style: {color: '#666'}}, 'Create a password to secure your vault. This password is not recoverable, so store it safely!'),
            React.createElement('div', {style: styles.formGroup}, React.createElement('input', {type: 'password', value: newPassword, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value), style: styles.input, placeholder: 'New Password'} as React.HTMLProps<HTMLInputElement>)),
            React.createElement('div', {style: styles.formGroup}, React.createElement('input', {type: 'password', value: confirmPassword, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value), style: styles.input, placeholder: 'Confirm Password'} as React.HTMLProps<HTMLInputElement>)),
            React.createElement('button', {onClick: handleSetupPassword, style: styles.button}, 'Set Password & Open Vault')
        )
    );

    const renderUnlockedState = () => (
        React.createElement('div', null,
            React.createElement('button', {onClick: () => openItemModal(), style: {...styles.button, width: 'auto', marginBottom: '15px'}}, '+ Add New Item'),
            digitalVaultItems.map(item => (
                React.createElement('div', {key: item.id, style: styles.listItem},
                    React.createElement('strong', null, item.title),
                    React.createElement('div', null,
                         item.documentUrl && React.createElement('a', {href: item.documentUrl, download: item.documentName, style: {...styles.button, width: 'auto', marginRight: '5px'}}, 'Download'),
                        React.createElement('button', {onClick: () => openItemModal(item), style: {...styles.button, ...styles.buttonSecondary, width: 'auto', marginRight: '5px'}}, 'Edit'),
                        React.createElement('button', {onClick: () => deleteDigitalVaultItem(item.id), style: {...styles.button, ...styles.buttonDanger, width: 'auto'}}, 'Delete')
                    )
                )
            ))
        )
    );

    return (
        React.createElement('div', { style: styles.pageContainer },
            React.createElement('h2', { style: styles.pageHeader }, "🗄️ Digital Vault"),
            React.createElement('section', { style: styles.section },
                isSetupMode ? renderSetupState() : (isUnlocked ? renderUnlockedState() : renderLockedState())
            ),
             isModalOpen && React.createElement(Modal, {isOpen: true, onClose: () => setIsModalOpen(false), title: editingItem ? 'Edit Vault Item' : 'New Vault Item', children: React.createElement(ItemForm, {onSave: handleSaveItem})})
        )
    );
}
