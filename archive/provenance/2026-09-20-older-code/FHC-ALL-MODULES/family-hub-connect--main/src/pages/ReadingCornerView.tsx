


import React, { useState, useMemo, useEffect } from 'react';
import type { BookLogEntry } from '../types';
import { useAppState, useAppDispatch } from '../AppContext';
import { ArrowLeftIcon, BottomNavbar, Modal, EmptyState, LoadingSpinner } from '../components';

interface ReadingCornerViewProps {
    onBack: () => void;
}

export default function ReadingCornerView({
    onBack
}: ReadingCornerViewProps) {
    const { 
        profiles, viewingAsProfileId, bookLogEntries
    } = useAppState();
    
    const { getProfileName, addToast, addBookLogEntry, updateBookLogEntry } = useAppDispatch();
    const currentViewingProfile = useMemo(() => profiles.find(p => p.id === viewingAsProfileId), [profiles, viewingAsProfileId]);


    const [showAddModal, setShowAddModal] = useState(false);
    const [editingBookId, setEditingBookId] = useState<string | null>(null);

    // Form state for modal
    const [newBookTitle, setNewBookTitle] = useState('');
    const [newBookAuthor, setNewBookAuthor] = useState('');
    const [newBookStatus, setNewBookStatus] = useState<'reading' | 'finished' | 'to_read'>('to_read');
    const [newBookRating, setNewBookRating] = useState<number>(0);
    const [newBookNotes, setNewBookNotes] = useState('');
    const [newBookStartDate, setNewBookStartDate] = useState('');
    const [newBookFinishDate, setNewBookFinishDate] = useState('');

    const [selectedChildId, setSelectedChildId] = useState<string>(currentViewingProfile?.role === 'Child' ? currentViewingProfile.id : '');
    
    useEffect(() => {
        if (currentViewingProfile?.role === 'Child' && (!selectedChildId || selectedChildId !== currentViewingProfile.id)) {
            setSelectedChildId(currentViewingProfile.id);
        } else if (currentViewingProfile?.role === 'Admin' || currentViewingProfile?.role === 'Parent') {
            const firstChild = profiles.find(p => p.role === 'Child');
            if (firstChild && !selectedChildId) {
                setSelectedChildId(firstChild.id);
            }
        }
    }, [currentViewingProfile, profiles, selectedChildId]);


    const handleOpenModal = (bookToEdit?: BookLogEntry) => {
        if (bookToEdit) {
            setEditingBookId(bookToEdit.id);
            setNewBookTitle(bookToEdit.title);
            setNewBookAuthor(bookToEdit.author || '');
            setNewBookStatus(bookToEdit.status);
            setNewBookRating(bookToEdit.rating || 0);
            setNewBookNotes(bookToEdit.notes || '');
            setNewBookStartDate(bookToEdit.startDate || '');
            setNewBookFinishDate(bookToEdit.finishDate || '');
        } else {
            setEditingBookId(null);
            setNewBookTitle('');
            setNewBookAuthor('');
            setNewBookStatus('to_read');
            setNewBookRating(0);
            setNewBookNotes('');
            setNewBookStartDate('');
            setNewBookFinishDate('');
        }
        setShowAddModal(true);
    };

    const handleAddOrUpdateBook = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBookTitle.trim()) {
            addToast("Book title cannot be empty.", 'info');
            return;
        }
        const profileForBook = currentViewingProfile?.role === 'Child' ? currentViewingProfile.id : selectedChildId;

        if (!profileForBook) {
            addToast("Cannot log book: No profile selected.", 'info');
            return;
        }

        const entryData: Omit<BookLogEntry, 'id' | 'family_id'> = {
            profileId: profileForBook,
            title: newBookTitle.trim(),
            author: newBookAuthor.trim() || undefined,
            status: newBookStatus,
            startDate: newBookStatus !== 'to_read' ? newBookStartDate : undefined,
            finishDate: newBookStatus === 'finished' ? newBookFinishDate : undefined,
            rating: newBookStatus === 'finished' ? newBookRating : undefined,
            notes: newBookNotes.trim() || undefined,
        };

        if (editingBookId) {
             await updateBookLogEntry(editingBookId, entryData);
             addToast(`"${entryData.title}" updated successfully.`, 'badge');
        } else {
            await addBookLogEntry(entryData);
            addToast(`"${entryData.title}" added to reading log.`, 'badge');
        }
        
        setShowAddModal(false);
    };
    
    const childProfiles = profiles.filter(p => p.role === 'Child');
    const profileToViewLogsFor = currentViewingProfile?.role === 'Child' ? currentViewingProfile.id : selectedChildId;
    
    const entriesByStatus = useMemo(() => {
        const reading: BookLogEntry[] = [];
        const toRead: BookLogEntry[] = [];
        const finished: BookLogEntry[] = [];

        (bookLogEntries || [])
            .filter(entry => entry.profileId === profileToViewLogsFor)
            .forEach(entry => {
                switch(entry.status) {
                    case 'reading': reading.push(entry); break;
                    case 'to_read': toRead.push(entry); break;
                    case 'finished': finished.push(entry); break;
                }
            });
        
        finished.sort((a,b) => (b.finishDate || '').localeCompare(a.finishDate || ''));

        return { reading, toRead, finished, total: reading.length + toRead.length + finished.length };
    }, [bookLogEntries, profileToViewLogsFor]);

    
    const renderStarRating = (rating?: number) => {
        if (rating === undefined || rating === 0) return null;
        return (
            <span aria-label={`${rating} out of 5 stars`} title={`${rating} out of 5 stars`}>
                {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
            </span>
        );
    };

    const renderBookEntry = (entry: BookLogEntry) => {
        const statusColors = {
            reading: '#1890ff',
            finished: '#52c41a',
            to_read: '#faad14',
        };

        return (
            <li key={entry.id} className="card" style={{ borderLeft: `5px solid ${statusColors[entry.status]}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <h4 style={{ margin: '0 0 5px 0', fontSize: '1.2em' }}>{entry.title}</h4>
                        {entry.author && <p style={{ margin: '0 0 5px 0', color: '#666' }}>by {entry.author}</p>}
                        {entry.status === 'finished' && renderStarRating(entry.rating)}
                    </div>
                    <button onClick={() => handleOpenModal(entry)} className="btn btn-secondary btn-sm" style={{alignSelf: 'flex-start'}}>Edit</button>
                </div>
                {entry.notes && <p style={{ fontStyle: 'italic', marginTop: '10px', borderTop: '1px dashed #eee', paddingTop: '10px' }}>Notes: {entry.notes}</p>}
            </li>
        );
    };
    
    if (!currentViewingProfile) {
        return <LoadingSpinner message="Loading profile..." />;
    }

    return (
        <div className="page">
            <header className="header">
                <button className="back-button" onClick={onBack}>
                    <ArrowLeftIcon />
                </button>
                <h2>📚 Reading Corner</h2>
                <div className="header-placeholder"></div>
            </header>
            <main className="main">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                    {(currentViewingProfile.role === 'Admin' || currentViewingProfile.role === 'Parent') && (
                        <div className="form-group" style={{flexGrow: 1}}>
                            <label htmlFor="child-select" style={{fontWeight: 600}}>Viewing logs for:</label>
                            <select
                                id="child-select"
                                value={selectedChildId}
                                onChange={(e) => setSelectedChildId(e.target.value)}
                                className="w-100"
                            >
                                {childProfiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                    )}
                    <button onClick={() => handleOpenModal()} className="btn w-auto" style={{flexShrink: 0}}>+ Log a Book</button>
                </div>

                {entriesByStatus.total > 0 ? (
                    <div>
                        {entriesByStatus.reading.length > 0 && (
                            <div className="card">
                                <h3>Currently Reading</h3>
                                <ul style={{ listStyle: 'none', padding: 0 }}>{entriesByStatus.reading.map(renderBookEntry)}</ul>
                            </div>
                        )}
                        {entriesByStatus.toRead.length > 0 && (
                             <div className="card">
                                <h3>Want to Read</h3>
                                <ul style={{ listStyle: 'none', padding: 0 }}>{entriesByStatus.toRead.map(renderBookEntry)}</ul>
                            </div>
                        )}
                        {entriesByStatus.finished.length > 0 && (
                             <div className="card">
                                <h3>Finished Books</h3>
                                <ul style={{ listStyle: 'none', padding: 0 }}>{entriesByStatus.finished.map(renderBookEntry)}</ul>
                            </div>
                        )}
                    </div>
                ) : (
                    <EmptyState
                        icon="📖"
                        title="No Books Logged"
                        message={`No books have been logged for ${getProfileName(profileToViewLogsFor) || 'this user'} yet. Add one to get started!`}
                    />
                )}
            </main>
            {showAddModal &&
                <Modal onClose={() => setShowAddModal(false)} title={editingBookId ? "Edit Book Entry" : "Log a New Book"}>
                    <form onSubmit={handleAddOrUpdateBook}>
                        <div className="form-group">
                            <label htmlFor="book-title">Title</label>
                            <input type="text" id="book-title" value={newBookTitle} onChange={(e) => setNewBookTitle(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="book-author">Author (optional)</label>
                            <input type="text" id="book-author" value={newBookAuthor} onChange={(e) => setNewBookAuthor(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="book-status">Status</label>
                            <select id="book-status" value={newBookStatus} onChange={(e) => setNewBookStatus(e.target.value as any)}>
                                <option value="to_read">To Read</option>
                                <option value="reading">Reading</option>
                                <option value="finished">Finished</option>
                            </select>
                        </div>
                        {newBookStatus !== 'to_read' && (
                            <div className="form-group">
                                <label htmlFor="book-start-date">Start Date</label>
                                <input type="date" id="book-start-date" value={newBookStartDate} onChange={(e) => setNewBookStartDate(e.target.value)} />
                            </div>
                        )}
                        {newBookStatus === 'finished' && (
                            <>
                                <div className="form-group">
                                    <label htmlFor="book-finish-date">Finish Date</label>
                                    <input type="date" id="book-finish-date" value={newBookFinishDate} onChange={(e) => setNewBookFinishDate(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="book-rating">Rating (1-5 stars)</label>
                                    <input type="number" id="book-rating" value={newBookRating} min={0} max={5} onChange={(e) => setNewBookRating(Number(e.target.value))} />
                                </div>
                            </>
                        )}
                         <div className="form-group">
                            <label htmlFor="book-notes">Notes (optional)</label>
                            <textarea id="book-notes" value={newBookNotes} onChange={(e) => setNewBookNotes(e.target.value)} rows={3}></textarea>
                        </div>
                        <div className="form-actions">
                            <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">Cancel</button>
                            <button type="submit" className="btn">{editingBookId ? 'Save Changes' : 'Add Book'}</button>
                        </div>
                    </form>
                </Modal>
            }
        </div>
    );
}