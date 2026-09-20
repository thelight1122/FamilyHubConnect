

import React, { useState, useMemo } from 'react';
import { useAppState, useAppDispatch } from '../AppContext.tsx';
import type { DigitalVaultItem, DigitalVaultItemType } from '../types.ts';
import { Modal, ArrowLeftIcon } from '../components.tsx';
import { fileToDataUrl } from '../utils/utils.ts';

const ItemForm: React.FC<{
    onSave: (data: Partial<DigitalVaultItem>) => void;
    editingItem: DigitalVaultItem | null;
}> = ({ onSave, editingItem }) => {
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
    
    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="item-title">Title</label>
                <input 
                    id="item-title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    title="Enter the title of the item" 
                    placeholder="Enter title" 
                />
            </div>
            <div className="form-group">
                <label>Type</label>
                <label htmlFor="item-type">Type</label>
                <select id="item-type" value={type} onChange={(e) => setType(e.target.value as any)}>
                    <option value='generic_document'>Generic Document</option>
                    <option value='secure_note'>Secure Note</option>
                    <option value='id_card'>ID Card</option>
                    <option value='passport'>Passport</option>
                </select>
            </div>
            <div className="form-group"><label>Notes</label><textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} placeholder="Enter your notes here" /></div>
            <div className="form-group">
                <label>File</label>
                <input 
                    type='file' 
                    title="Upload a file" 
                    placeholder="Choose a file" 
                    onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} 
                />
            </div>
            <div className="form-actions"><button type='submit' className="btn">Save</button></div>
        </form>
    );
};

export default function DigitalVaultView() {
    const { 
        addDigitalVaultItem, updateDigitalVaultItem, deleteDigitalVaultItem,
        onSavePersonalization, addToast, onNavigate
    } = useAppDispatch();
    const { digitalVaultItems, viewingAsProfileId, personalizationData, profiles } = useAppState();
    const currentViewingProfile = useMemo(() => profiles.find(p => p.id === viewingAsProfileId), [profiles, viewingAsProfileId]);
    
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
        if (newPassword.length < 4) { addToast("Password must be at least 4 characters.", 'info'); return; }
        if (newPassword !== confirmPassword) { addToast("Passwords do not match.", 'info'); return; }
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
    
    const renderLockedState = () => (
        <div className="text-center">
            <h3>Digital Vault is Locked</h3>
            <div className="unlock-container">
                <div className="unlock-input-group">
                    <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password'/>
                    <button onClick={handleUnlock} className="btn w-auto">Unlock</button>
                </div>
            </div>
        </div>
    );
    
    const renderSetupState = () => (
         <div className="text-center">
            <h3>Set Up Your Digital Vault</h3>
            <p className="text-light">Create a password to secure your vault. This password is not recoverable, so store it safely!</p>
            <div className="form-group"><input type='password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder='New Password'/></div>
            <div className="form-group"><input type='password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder='Confirm Password'/></div>
            <button onClick={handleSetupPassword} className="btn">Set Password & Open Vault</button>
        </div>
    );

    const renderUnlockedState = () => (
        <div>
            <button onClick={() => openItemModal()} className="btn w-auto mb-20">+ Add New Item</button>
            {digitalVaultItems.map(item => (
                <div key={item.id} className="list-item">
                    <strong>{item.title}</strong>
                    <div>
                         {item.documentUrl && <a href={item.documentUrl} download={item.documentName} className="btn btn-sm download-button">Download</a>}
                        <button onClick={() => openItemModal(item)} className="btn btn-secondary btn-sm btn-secondary-margin">Edit</button>
                        <button onClick={() => deleteDigitalVaultItem(item.id)} className="btn btn-danger btn-sm">Delete</button>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="page">
             <header className="header">
                 <button className="back-button" title="Go back to dashboard" onClick={() => onNavigate('dashboard')}>
                    <ArrowLeftIcon />
                </button>
                <h2>🗄️ Digital Vault</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                 <section className="card">
                    {isSetupMode ? renderSetupState() : (isUnlocked ? renderUnlockedState() : renderLockedState())}
                </section>
                 {isModalOpen && <Modal isOpen={true} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Vault Item' : 'New Vault Item'}><ItemForm onSave={handleSaveItem} editingItem={editingItem} /></Modal>}
            </main>
        </div>
    );
}