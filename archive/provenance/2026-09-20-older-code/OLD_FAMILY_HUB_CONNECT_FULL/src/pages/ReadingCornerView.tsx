
import React, { useState, useMemo, useEffect } from 'react';
import type { PageView, BookLogEntry, Profile, ToastMessage, AppNotification, AISuggestedBook, AIDiscussionAndPrompts, PersonalizationData } from '../types';
import { styles } from '../styles';
import { uniqueId } from '../utils/utils';
import Modal from '../components/ui/Modal';
import { useAppContext } from '../contexts/AppContext';
import { supabase } from '../services/supabaseClient';

interface ReadingCornerViewProps {
    bookLogEntries: BookLogEntry[];
    addBookLogEntry: (entry: Omit<BookLogEntry, 'id' | 'family_id'>) => Promise<BookLogEntry | void>;
    updateBookLogEntry: (entryId: string, updates: Partial<BookLogEntry>) => Promise<void>;
}

export default function ReadingCornerView({
    bookLogEntries,
    addBookLogEntry,
    updateBookLogEntry
}: ReadingCornerViewProps) {
    const { currentViewingProfile, profiles, getProfileName, addToast, addAppNotification, personalizationData, IS_TESTING_MODE } = useAppContext();
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

    const [selectedChildId, setSelectedChildId] = useState<string>(currentViewingProfile?.role === 'child' ? currentViewingProfile.id : '');

    // AI States
    const [aiBookSuggestions, setAiBookSuggestions] = useState<AISuggestedBook[]>([]);
    const [aiBookSuggestionsLoading, setAiBookSuggestionsLoading] = useState(false);
    const [aiBookSuggestionsError, setAiBookSuggestionsError] = useState<string | null>(null);

    const [aiDiscussionPrompts, setAiDiscussionPrompts] = useState<{ [bookId: string]: AIDiscussionAndPrompts }>({});
    const [aiDiscussionPromptsLoading, setAiDiscussionPromptsLoading] = useState<{ [bookId: string]: boolean }>({});
    const [aiDiscussionPromptsError, setAiDiscussionPromptsError] = useState<{ [bookId: string]: string | null }>({});
    const [expandedBookIdeas, setExpandedBookIdeas] = useState<string | null>(null);

    useEffect(() => {
        if (currentViewingProfile?.role === 'child' && (!selectedChildId || selectedChildId !== currentViewingProfile.id)) {
            setSelectedChildId(currentViewingProfile.id);
        } else if (currentViewingProfile?.role === 'adult' && !selectedChildId && profiles.some(p => p.role === 'child')) {
            const firstChild = profiles.find(p => p.role === 'child');
            if (firstChild) setSelectedChildId(firstChild.id);
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
        const profileForBook = currentViewingProfile?.role === 'child' ? currentViewingProfile.id : selectedChildId;

        if (!profileForBook || !personalizationData) {
            addToast("Cannot log book: No profile selected or available.", 'info');
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
             addToast(`"${entryData.title}" updated successfully.`, 'info', '📚');
        } else {
            await addBookLogEntry(entryData);
            addAppNotification(`${getProfileName(profileForBook)} added "${entryData.title}" to their reading log!`, 'new_book_log', profileForBook);
            addToast(`"${entryData.title}" added to reading log.`, 'info', '📖');
        }
        
        setShowAddModal(false);
    };
    
    const childProfiles = profiles.filter(p => p.role === 'child');
    const profileToViewLogsFor = currentViewingProfile?.role === 'child' ? currentViewingProfile.id : selectedChildId;
    
    const entriesByStatus = useMemo(() => {
        const reading: BookLogEntry[] = [];
        const toRead: BookLogEntry[] = [];
        const finished: BookLogEntry[] = [];

        bookLogEntries
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

    // AI Handlers
    const handleGetAIBookSuggestions = async () => {
        if (IS_TESTING_MODE) {
            setAiBookSuggestionsLoading(true);
            setTimeout(() => {
                setAiBookSuggestions([
                    { title: "The Hobbit", author: "J.R.R. Tolkien", shortDescription: "A classic adventure about a small hobbit on a big journey." },
                    { title: "Matilda", author: "Roald Dahl", shortDescription: "A story about a gifted girl who uses her powers for good." },
                ]);
                setAiBookSuggestionsLoading(false);
            }, 500);
            return;
        }
        
        if (!profileToViewLogsFor) {
            setAiBookSuggestionsError("Please select a child to get book suggestions.");
            return;
        }
        setAiBookSuggestionsLoading(true);
        setAiBookSuggestions([]);
        setAiBookSuggestionsError(null);

        const childAgeInfo = profiles.find(p => p.id === profileToViewLogsFor)?.age;
        const prompt = `Suggest 3 engaging, age-appropriate book titles for a child ${childAgeInfo ? `aged ${childAgeInfo}` : 'of reading age'}.`;
        const systemInstruction = `Provide the response as a JSON array of objects. Each object should have "title" (string), "author" (string), and "shortDescription" (string, 1-2 sentences). Example: [{"title": "The Lion, the Witch, and the Wardrobe", "author": "C.S. Lewis", "shortDescription": "A classic fantasy adventure."}]. Do not include any other text, just the JSON array.`;

        try {
            const { data, error } = await supabase.functions.invoke('ai-handler', {
                body: { endpoint: 'generateJson', prompt, systemInstruction }
            });
            if (error) throw error;
            const parsedData = JSON.parse(data.text);
            if (Array.isArray(parsedData)) {
                setAiBookSuggestions(parsedData as AISuggestedBook[]);
            } else {
                setAiBookSuggestionsError("AI response was not in the expected format.");
            }
        } catch (error: any) {
            setAiBookSuggestionsError(error.message || "Failed to fetch book suggestions.");
        } finally {
            setAiBookSuggestionsLoading(false);
        }
    };

    const handleGetAIDiscussionPrompts = async (book: BookLogEntry) => {
        if (IS_TESTING_MODE) {
            setAiDiscussionPromptsLoading(prev => ({ ...prev, [book.id]: true }));
             setTimeout(() => {
                setAiDiscussionPrompts(prev => ({ ...prev, [book.id]: {
                    discussionQuestions: ["What was your favorite part of the mock book?", "Which character did you like the most?"],
                    creativePrompts: ["Draw a new cover for this test book.", "Write a different ending for the story."],
                } }));
                setExpandedBookIdeas(book.id);
                setAiDiscussionPromptsLoading(prev => ({ ...prev, [book.id]: false }));
            }, 500);
            return;
        }

        setAiDiscussionPromptsLoading(prev => ({ ...prev, [book.id]: true }));
        setAiDiscussionPromptsError(prev => ({ ...prev, [book.id]: null }));

        const prompt = `For the book titled "${book.title}" by ${book.author || 'an author'}, generate 2-3 open-ended discussion questions and 1-2 creative writing/drawing prompts.`;
        const systemInstruction = `Provide the response as a JSON object with two keys: "discussionQuestions" (array of strings) and "creativePrompts" (array of strings). Example: {"discussionQuestions": ["What was your favorite part?"], "creativePrompts": ["Draw a new cover."]}. Do not include any other text, just the raw JSON object.`;
        
        try {
            const { data, error } = await supabase.functions.invoke('ai-handler', {
                body: { endpoint: 'generateJson', prompt, systemInstruction }
            });
            if (error) throw error;
            const parsedData = JSON.parse(data.text);
            setAiDiscussionPrompts(prev => ({ ...prev, [book.id]: parsedData }));
            setExpandedBookIdeas(book.id);
        } catch (error: any) {
            setAiDiscussionPromptsError(prev => ({ ...prev, [book.id]: error.message || "Failed to fetch ideas." }));
        } finally {
            setAiDiscussionPromptsLoading(prev => ({ ...prev, [book.id]: false }));
        }
    };
    
    const toggleExpandedBookIdeas = (bookId: string) => {
        setExpandedBookIdeas(prev => prev === bookId ? null : bookId);
    };
    
    const renderStarRating = (rating?: number) => {
        if (rating === undefined || rating === 0) return null;
        return React.createElement('span', { 'aria-label': `${rating} out of 5 stars`, title: `${rating} out of 5 stars` }, 
            '★'.repeat(rating) + '☆'.repeat(5 - rating)
        );
    };

    const renderBookEntry = (entry: BookLogEntry) => {
        const statusColors = {
            reading: '#1890ff',
            finished: '#52c41a',
            to_read: '#faad14',
        };
        const canGetIdeas = currentViewingProfile?.role === 'adult' && entry.status === 'finished';
        const isLoadingIdeas = aiDiscussionPromptsLoading[entry.id];
        const ideasError = aiDiscussionPromptsError[entry.id];
        const ideas = aiDiscussionPrompts[entry.id];

        return React.createElement('li', { key: entry.id, style: {...styles.section, padding: '15px', marginBottom: '15px', borderLeft: `5px solid ${statusColors[entry.status]}` } },
            React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between' } },
                React.createElement('div', null,
                    React.createElement('h4', { style: { margin: '0 0 5px 0', fontSize: '1.2em' } }, entry.title),
                    entry.author && React.createElement('p', { style: { margin: '0 0 5px 0', color: '#666' } }, `by ${entry.author}`),
                    entry.status === 'finished' && renderStarRating(entry.rating)
                ),
                React.createElement('button', { onClick: () => handleOpenModal(entry), style: {...styles.button, width: 'auto', padding: '5px 10px', fontSize: '0.8em', alignSelf: 'flex-start'} }, 'Edit')
            ),
            entry.notes && React.createElement('p', { style: { fontStyle: 'italic', marginTop: '10px', borderTop: '1px dashed #eee', paddingTop: '10px' } }, `Notes: ${entry.notes}`),
            canGetIdeas && React.createElement('div', {style: {marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px'}},
                React.createElement('button', {
                    onClick: () => {
                        if (ideas) toggleExpandedBookIdeas(entry.id);
                        else handleGetAIDiscussionPrompts(entry);
                    },
                    style: {...styles.button, width: 'auto', padding: '5px 10px', fontSize: '0.8em', backgroundColor: '#5bc0de'}
                }, isLoadingIdeas ? 'Thinking...' : (ideas ? (expandedBookIdeas === entry.id ? 'Hide Ideas' : 'Show Ideas') : 'Get Discussion Ideas')),
                ideasError && React.createElement('p', {style: styles.aiError}, ideasError),
                (expandedBookIdeas === entry.id && ideas) && React.createElement('div', {style: {marginTop: '10px'}},
                    React.createElement('h5', null, 'Discussion Questions:'),
                    React.createElement('ul', {style: {paddingLeft: '20px'}}, ideas.discussionQuestions.map((q,i) => React.createElement('li', {key: i}, q))),
                    React.createElement('h5', null, 'Creative Prompts:'),
                    React.createElement('ul', {style: {paddingLeft: '20px'}}, ideas.creativePrompts.map((p,i) => React.createElement('li', {key: i}, p)))
                )
            )
        );
    };
    
    if (!currentViewingProfile) {
        return React.createElement('div', {style: styles.loadingMessage}, 'Loading profile...');
    }

    return React.createElement('div', { style: styles.pageContainer },
        React.createElement('h2', { style: styles.pageHeader }, "📚 Reading Corner"),
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' } },
            currentViewingProfile.role === 'adult' ? React.createElement(React.Fragment, null,
                React.createElement('label', { htmlFor: 'child-select', style: {fontWeight: 600} }, "Viewing logs for:"),
                React.createElement('select', {
                    id: 'child-select',
                    value: selectedChildId,
                    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedChildId(e.target.value),
                    style: styles.selectInput,
                }, childProfiles.map(p => React.createElement('option', { key: p.id, value: p.id }, p.name)))
            ) : React.createElement('div', null), // Placeholder to keep spacing
            React.createElement('button', { onClick: () => handleOpenModal(), style: { ...styles.button, width: 'auto' } }, '+ Log a Book')
        ),

        // AI Suggestions Section
        currentViewingProfile.role === 'adult' && React.createElement('section', { style: styles.section },
            React.createElement('h3', { style: styles.sectionTitle }, "AI Book Recommendations"),
            React.createElement('p', null, `Get book suggestions tailored for ${getProfileName(selectedChildId) || 'the selected child'}.`),
            React.createElement('button', { onClick: handleGetAIBookSuggestions, disabled: aiBookSuggestionsLoading, style: styles.button }, aiBookSuggestionsLoading ? 'Finding books...' : 'Get Suggestions'),
            aiBookSuggestionsError && React.createElement('p', { style: styles.aiError }, aiBookSuggestionsError),
            aiBookSuggestions.length > 0 && React.createElement('div', { style: { marginTop: '15px' } },
                aiBookSuggestions.map((book, index) => React.createElement('div', { key: index, style: { padding: '10px', border: '1px solid #eee', borderRadius: '4px', marginBottom: '10px' } },
                    React.createElement('h4', { style: { margin: 0 } }, `${book.title} by ${book.author}`),
                    React.createElement('p', { style: { margin: '5px 0' } }, book.shortDescription),
                    React.createElement('button', { onClick: () => { setNewBookTitle(book.title); setNewBookAuthor(book.author); setShowAddModal(true); }, style: { ...styles.button, width: 'auto', padding: '5px 10px', fontSize: '0.8em' } }, 'Add to Log')
                ))
            )
        ),
        
        // Book Lists
        entriesByStatus.total > 0 ? React.createElement('div', { style: { marginTop: '20px' } },
            (entriesByStatus.reading.length > 0) && React.createElement('section', { style: styles.section },
                React.createElement('h3', { style: styles.sectionTitle }, "Currently Reading"),
                React.createElement('ul', { style: { listStyle: 'none', padding: 0 } }, entriesByStatus.reading.map(renderBookEntry))
            ),
            (entriesByStatus.toRead.length > 0) && React.createElement('section', { style: styles.section },
                React.createElement('h3', { style: styles.sectionTitle }, "Want to Read"),
                React.createElement('ul', { style: { listStyle: 'none', padding: 0 } }, entriesByStatus.toRead.map(renderBookEntry))
            ),
            (entriesByStatus.finished.length > 0) && React.createElement('section', { style: styles.section },
                React.createElement('h3', { style: styles.sectionTitle }, "Finished Books"),
                React.createElement('ul', { style: { listStyle: 'none', padding: 0 } }, entriesByStatus.finished.map(renderBookEntry))
            )
        ) : React.createElement('p', { style: styles.emptyStateText }, "No books logged yet. Add one to get started!"),

        // Add/Edit Modal
        React.createElement(Modal, {
            isOpen: showAddModal,
            onClose: () => setShowAddModal(false),
            title: editingBookId ? "Edit Book Entry" : "Log a New Book",
            children: React.createElement('form', { onSubmit: handleAddOrUpdateBook },
                React.createElement('div', { style: styles.formGroup },
                    React.createElement('label', { htmlFor: 'book-title', style: styles.label }, 'Title'),
                    React.createElement('input', { type: 'text', id: 'book-title', value: newBookTitle, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setNewBookTitle(e.target.value), style: styles.input, required: true })
                ),
                React.createElement('div', { style: styles.formGroup },
                    React.createElement('label', { htmlFor: 'book-author', style: styles.label }, 'Author (optional)'),
                    React.createElement('input', { type: 'text', id: 'book-author', value: newBookAuthor, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setNewBookAuthor(e.target.value), style: styles.input })
                ),
                React.createElement('div', { style: styles.formGroup },
                    React.createElement('label', { htmlFor: 'book-status', style: styles.label }, 'Status'),
                    React.createElement('select', { id: 'book-status', value: newBookStatus, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setNewBookStatus(e.target.value as any), style: styles.selectInput },
                        React.createElement('option', { value: 'to_read' }, 'To Read'),
                        React.createElement('option', { value: 'reading' }, 'Reading'),
                        React.createElement('option', { value: 'finished' }, 'Finished')
                    )
                ),
                newBookStatus !== 'to_read' && React.createElement('div', { style: styles.formGroup },
                    React.createElement('label', { htmlFor: 'book-start-date', style: styles.label }, 'Start Date'),
                    React.createElement('input', { type: 'date', id: 'book-start-date', value: newBookStartDate, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setNewBookStartDate(e.target.value), style: styles.input })
                ),
                newBookStatus === 'finished' && React.createElement(React.Fragment, null,
                    React.createElement('div', { style: styles.formGroup },
                        React.createElement('label', { htmlFor: 'book-finish-date', style: styles.label }, 'Finish Date'),
                        React.createElement('input', { type: 'date', id: 'book-finish-date', value: newBookFinishDate, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setNewBookFinishDate(e.target.value), style: styles.input })
                    ),
                    React.createElement('div', { style: styles.formGroup },
                        React.createElement('label', { htmlFor: 'book-rating', style: styles.label }, 'Rating (1-5 stars)'),
                        React.createElement('input', { type: 'number', id: 'book-rating', value: newBookRating, min: 0, max: 5, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setNewBookRating(Number(e.target.value)), style: styles.input })
                    )
                ),
                 React.createElement('div', { style: styles.formGroup },
                    React.createElement('label', { htmlFor: 'book-notes', style: styles.label }, 'Notes (optional)'),
                    React.createElement('textarea', { id: 'book-notes', value: newBookNotes, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => setNewBookNotes(e.target.value), style: styles.textarea, rows: 3 })
                ),
                React.createElement('div', { style: styles.modalActions },
                    React.createElement('button', { type: 'button', onClick: () => setShowAddModal(false), style: { ...styles.button, ...styles.buttonSecondary, ...styles.modalButton } }, 'Cancel'),
                    React.createElement('button', { type: 'submit', style: { ...styles.button, ...styles.modalButton } }, editingBookId ? 'Save Changes' : 'Add Book')
                )
            )
        })
    );
}
