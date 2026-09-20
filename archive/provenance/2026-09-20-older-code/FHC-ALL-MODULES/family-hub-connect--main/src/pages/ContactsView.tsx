import React, { useState } from 'react';
import { useAppState, useAppDispatch } from '../AppContext.tsx';
import type { Contact } from '../types.ts';
import { Modal, ArrowLeftIcon, BottomNavbar } from '../components.tsx';

const ContactForm: React.FC<{
    onSave: (data: Partial<Contact>) => void;
    editingContact: Contact | null;
}> = ({ onSave, editingContact }) => {
    const [name, setName] = useState(editingContact?.name || '');
    const [number, setNumber] = useState(editingContact?.number || '');
    const [isAuthorized, setIsAuthorized] = useState<boolean>(editingContact?.isAuthorized ?? true);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({name, number, isAuthorized});
    }
    
    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name" />
            </div>
            <div className="form-group">
                <label>Number</label>
                <input type='tel' value={number} onChange={(e) => setNumber(e.target.value)} placeholder="Enter phone number" />
            </div>
            <div className="form-group">
                <label className="checkbox-label">
                    <input type='checkbox' className="checkbox" checked={isAuthorized} onChange={(e) => setIsAuthorized(e.target.checked)} /> 
                    Authorized for Child Use
                </label>
            </div>
            <div className="form-actions">
                <button type='submit' className="btn">Save Contact</button>
            </div>
        </form>
    );
}

export default function ContactsView() {
    const { addContact, updateContact, deleteContact, navigateToPhoneWithNumber, onNavigate } = useAppDispatch();
    const { contacts } = useAppState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<Contact | null>(null);

    const openModal = (contact?: Contact) => {
        setEditingContact(contact || null);
        setIsModalOpen(true);
    };
    
    const handleSave = (data: Partial<Contact>) => {
        if(editingContact) {
            updateContact(editingContact.id, data);
        } else {
            addContact({
                name: data.name || '',
                number: data.number || '',
                isAuthorized: data.isAuthorized ?? false
            });
        }
        setIsModalOpen(false);
    }

    return (
        <div className="page">
             <header className="header">
                 <button className="back-button" title="Go back to dashboard" onClick={() => onNavigate('dashboard')}>
                    <ArrowLeftIcon />
                </button>
                <h2>📖 Contacts</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                 <button className="btn w-auto mb-20" onClick={() => openModal()}>+ Add Contact</button>
                
                <div>
                    {contacts.map(contact => (
                        <div key={contact.id} className="list-item">
                            <div> 
                                <strong>{contact.name}</strong>
                                <span className="text-light" style={{ marginLeft: '10px' }}>{contact.number}</span>
                            </div>
                            <div style={{display: 'flex', gap: '5px'}}>
                                <button className="btn btn-info btn-sm" onClick={() => navigateToPhoneWithNumber(contact.number)}>Call</button>
                                <button className="btn btn-secondary btn-sm" onClick={() => openModal(contact)}>Edit</button>
                                <button className="btn btn-danger btn-sm" onClick={() => deleteContact(contact.id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
                
                {isModalOpen && (
                    <Modal
                        isOpen={true} 
                        onClose={() => setIsModalOpen(false)} 
                        title={editingContact ? "Edit Contact" : "New Contact"}
                    >
                        <ContactForm onSave={handleSave} editingContact={editingContact} />
                    </Modal>
                )}
            </main>
             <BottomNavbar activePage="contacts" onNavigate={onNavigate} />
        </div>
    );
}