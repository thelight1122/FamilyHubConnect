
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { styles } from '../styles';
import type { Contact } from '../types';
import Modal from '../components/ui/Modal';

export default function ContactsView() {
    const { contacts, addContact, updateContact, deleteContact, navigateToPhoneWithNumber } = useAppContext();
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
    
    const ContactForm: React.FC<{onSave: (data: Partial<Contact>) => void}> = ({onSave}) => {
        const [name, setName] = useState(editingContact?.name || '');
        const [number, setNumber] = useState(editingContact?.number || '');
        const [isAuthorized, setIsAuthorized] = useState<boolean>(editingContact?.isAuthorized ?? true);
        
        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            onSave({name, number, isAuthorized});
        }
        
        return React.createElement('form', {onSubmit: handleSubmit},
            React.createElement('div', {style: styles.formGroup}, React.createElement('label', null, 'Name'), React.createElement('input', {style: styles.input, value: name, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)})),
            React.createElement('div', {style: styles.formGroup}, React.createElement('label', null, 'Number'), React.createElement('input', {style: styles.input, type: 'tel', value: number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setNumber(e.target.value)})),
            React.createElement('div', {style: styles.formGroup}, React.createElement('label', {style: styles.checkboxLabel}, React.createElement('input', {type: 'checkbox', checked: isAuthorized, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setIsAuthorized(e.target.checked)}), 'Authorized for Child Use')),
            React.createElement('button', {type: 'submit', style: styles.button}, 'Save Contact')
        )
    }

    return React.createElement('div', { style: styles.pageContainer },
        React.createElement('h2', { style: styles.pageHeader }, "📖 Contacts"),
        React.createElement('button', {style: {...styles.button, width: 'auto'}, onClick: () => openModal()}, '+ Add Contact'),
        
        React.createElement('div', {style: {marginTop: '20px'}},
            contacts.map(contact => (
                React.createElement('div', {key: contact.id, style: styles.listItem},
                    React.createElement('div', null, 
                        React.createElement('strong', null, contact.name),
                        React.createElement('span', {style: {color: '#666', marginLeft: '10px'}}, contact.number)
                    ),
                    React.createElement('div', {style: {display: 'flex', gap: '5px'}},
                        React.createElement('button', {style: {...styles.button, ...styles.buttonInfo, width: 'auto'}, onClick: () => navigateToPhoneWithNumber(contact.number)}, 'Call'),
                        React.createElement('button', {style: {...styles.button, ...styles.buttonSecondary, width: 'auto'}, onClick: () => openModal(contact)}, 'Edit'),
                        React.createElement('button', {style: {...styles.button, ...styles.buttonDanger, width: 'auto'}, onClick: () => deleteContact(contact.id)}, 'Delete')
                    )
                )
            ))
        ),
        
        isModalOpen && React.createElement(Modal, {
            isOpen: true, 
            onClose: () => setIsModalOpen(false), 
            title: editingContact ? "Edit Contact" : "New Contact",
            children: React.createElement(ContactForm, {onSave: handleSave})
        })
    );
}
