import React, { useState, useMemo } from 'react';
import { useAppContext } from './AppContext';
import { ArrowLeftIcon, BottomNavbar, Modal } from './components';
import { styles } from './styles';
import { ServiceContact } from './types';

// --- Contact Form ---
const ContactForm = ({ onSave, onClose, editingContact }: { onSave: (data: Partial<Omit<ServiceContact, 'id'>>) => void, onClose: () => void, editingContact: ServiceContact | null }) => {
    const [name, setName] = useState(editingContact?.name || '');
    const [category, setCategory] = useState(editingContact?.category || 'Handyman');
    const [phone, setPhone] = useState(editingContact?.phone || '');
    const [email, setEmail] = useState(editingContact?.email || '');
    const [notes, setNotes] = useState(editingContact?.notes || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, category, phone, email, notes });
    };

    const categories: ServiceContact['category'][] = ['Plumber', 'Electrician', 'HVAC', 'Handyman', 'Painter', 'Landscaper', 'Other'];

    return (
        <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}><label style={styles.label}>Name / Company</label><input style={styles.input} value={name} onChange={e => setName(e.target.value)} required /></div>
            <div style={styles.formGroup}><label style={styles.label}>Category</label>
                <select style={styles.selectInput} value={category} onChange={e => setCategory(e.target.value as any)}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{...styles.formGroup, flex: 1}}><label style={styles.label}>Phone</label><input type="tel" style={styles.input} value={phone} onChange={e => setPhone(e.target.value)} required /></div>
                <div style={{...styles.formGroup, flex: 1}}><label style={styles.label}>Email (Optional)</label><input type="email" style={styles.input} value={email} onChange={e => setEmail(e.target.value)} /></div>
            </div>
            <div style={styles.formGroup}><label style={styles.label}>Notes (Optional)</label><textarea style={styles.textarea} value={notes} onChange={e => setNotes(e.target.value)} /></div>
            <div style={styles.formActions}>
                <button type="button" onClick={onClose} style={{...styles.button, ...styles.buttonSecondary}}>Cancel</button>
                <button type="submit" style={styles.button}>Save Contact</button>
            </div>
        </form>
    );
};

// --- Main View ---
const ServiceContactsView = () => {
    const { onNavigate, personalizationData, onSavePersonalization, addToast, currentViewingProfile } = useAppContext();
    const isParentView = currentViewingProfile.role !== 'Child';
    const allContacts = useMemo(() => (personalizationData.serviceContacts || []).sort((a,b) => a.name.localeCompare(b.name)), [personalizationData.serviceContacts]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<ServiceContact | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    const handleSaveContact = (data: Partial<Omit<ServiceContact, 'id'>>) => {
        let updatedContacts;
        if (editingContact) {
            updatedContacts = allContacts.map(c => c.id === editingContact.id ? { ...c, ...data } as ServiceContact : c);
            addToast("Contact updated!", 'badge');
        } else {
            const newContact: ServiceContact = {
                id: `serv_${Date.now()}`,
                name: data.name!,
                category: data.category!,
                phone: data.phone!,
                email: data.email,
                notes: data.notes
            };
            updatedContacts = [...allContacts, newContact];
            addToast("Contact added!", 'badge');
        }
        onSavePersonalization({ serviceContacts: updatedContacts });
        setIsModalOpen(false);
        setEditingContact(null);
    };

    if (!isParentView) {
        return (
             <div style={styles.pageContainer}>
                <header style={styles.header}>
                    <button style={{...styles.navButton, flexShrink: 0, width: 40}} onClick={() => onNavigate('homeManagement')}><ArrowLeftIcon /></button>
                    <h2 style={styles.pageHeader}>📞 Service Contacts</h2>
                     <div style={{flexShrink: 0, width: 40}}></div>
                </header>
                <main style={styles.mainContent}><div style={styles.section}><p>This feature is for parents only.</p></div></main>
            </div>
        )
    }

    const filteredContacts = useMemo(() => {
        if (!searchTerm) return allContacts;
        const lowercasedTerm = searchTerm.toLowerCase();
        return allContacts.filter(contact => 
            contact.name.toLowerCase().includes(lowercasedTerm) ||
            contact.category.toLowerCase().includes(lowercasedTerm) ||
            contact.notes?.toLowerCase().includes(lowercasedTerm)
        );
    }, [allContacts, searchTerm]);

    const groupedContacts = useMemo(() => {
        return filteredContacts.reduce((acc, contact) => {
            const category = contact.category;
            if (!acc[category]) acc[category] = [];
            acc[category].push(contact);
            return acc;
        }, {} as { [key in ServiceContact['category']]?: ServiceContact[] });
    }, [filteredContacts]);

    const categoryOrder: ServiceContact['category'][] = ['Plumber', 'Electrician', 'HVAC', 'Handyman', 'Painter', 'Landscaper', 'Other'];

    return (
        <div style={styles.pageContainer}>
            <header style={styles.header}>
                <button style={{...styles.navButton, flexShrink: 0, width: 40}} onClick={() => onNavigate('homeManagement')}>
                    <ArrowLeftIcon />
                </button>
                <h2 style={styles.pageHeader}>📞 Service Contacts</h2>
                <div style={{flexShrink: 0, width: 40}}>
                    <button onClick={() => setIsModalOpen(true)} style={{...styles.navButton, fontSize: '1.8em', color: styles.button.backgroundColor}}>+</button>
                </div>
            </header>
            <main style={styles.mainContent}>
                <div style={styles.searchContainer}>
                    <input 
                        type="search"
                        style={styles.searchInput}
                        placeholder="🔍 Search by name, category, or notes..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                {categoryOrder.map(category => (
                    groupedContacts[category] && (
                        <div key={category}>
                            <h3 style={styles.listHeader}>{category}</h3>
                            {groupedContacts[category]?.map(contact => (
                                <div key={contact.id} style={styles.contactCard}>
                                    <h4 style={styles.contactName}>{contact.name}</h4>
                                    <p style={styles.contactInfo}><strong>Phone:</strong> <a href={`tel:${contact.phone}`}>{contact.phone}</a></p>
                                    {contact.email && <p style={styles.contactInfo}><strong>Email:</strong> <a href={`mailto:${contact.email}`}>{contact.email}</a></p>}
                                    {contact.notes && <p style={styles.contactNotes}>{contact.notes}</p>}
                                </div>
                            ))}
                        </div>
                    )
                ))}

                {filteredContacts.length === 0 && (
                    <div style={styles.section}>
                        <p>{allContacts.length === 0 ? "No contacts saved yet. Click '+' to add one." : "No contacts match your search."}</p>
                    </div>
                )}
            </main>

            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)} title={editingContact ? "Edit Contact" : "Add Service Contact"}>
                    <ContactForm onSave={handleSaveContact} onClose={() => setIsModalOpen(false)} editingContact={editingContact} />
                </Modal>
            )}
            <BottomNavbar activePage="homeManagement" onNavigate={onNavigate} />
        </div>
    );
};

export default ServiceContactsView;
