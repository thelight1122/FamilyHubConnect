import React, { useState, useMemo } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { useAppContext } from './AppContext';
import { ArrowLeftIcon, BottomNavbar, Modal } from './components';
import { styles } from './styles';
import { Book } from './types';

// --- Book Card Component ---
const BookCard = ({ book, onUpdateProgress }: { book: Book, onUpdateProgress: (book: Book) => void }) => {
    const progress = book.pageCount > 0 ? (book.currentPage / book.pageCount) * 100 : 0;
    const isFinished = book.status === 'finished';

    return (
        <div style={styles.bookCard}>
            <img src={book.coverUrl} alt={book.title} style={styles.bookCover} />
            <div style={styles.bookInfo}>
                <h3 style={styles.bookTitle}>{book.title}</h3>
                <p style={styles.bookAuthor}>by {book.author}</p>
                {isFinished ? (
                    <div style={styles.finishedOverlay}>
                        <p style={styles.finishedText}>🎉 Finished! 🎉</p>
                    </div>
                ) : (
                    <>
                        <div style={styles.progressContainer}>
                            <div style={styles.progressBar}>
                                <div style={{ ...styles.progressBarFill, width: `${progress}%` }}></div>
                            </div>
                            <p style={styles.progressText}>Page {book.currentPage} of {book.pageCount} ({Math.round(progress)}%)</p>
                        </div>
                        <div style={styles.bookActions}>
                            <button
                                style={{ ...styles.button, ...styles.buttonSecondary, padding: '6px 12px', fontSize: '0.9em' }}
                                onClick={() => onUpdateProgress(book)}
                            >
                                Update Progress
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};


// --- Add Book Modal ---
const AddBookModal = ({ onClose, onAdd, isLoading }: { onClose: () => void, onAdd: (title: string) => void, isLoading: boolean }) => {
    const [title, setTitle] = useState('');

    return (
        <Modal onClose={onClose} title="Add a New Book">
            <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="book-title">Book Title</label>
                <input id="book-title" style={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., The Lion, the Witch and the Wardrobe" />
                <small style={{ color: '#7f8c8d', marginTop: '5px', display: 'block' }}>
                    AI will automatically find the author, summary, page count, and cover art.
                </small>
            </div>
            <div style={styles.formActions}>
                <button style={{ ...styles.button, ...styles.buttonSecondary }} onClick={onClose}>Cancel</button>
                <button style={styles.button} onClick={() => onAdd(title)} disabled={isLoading || !title}>
                    {isLoading ? '📚 Finding...' : 'Add Book'}
                </button>
            </div>
        </Modal>
    );
};

// --- Update Progress Modal ---
const UpdateProgressModal = ({ onClose, onSave, book }: { onClose: () => void, onSave: (page: number) => void, book: Book }) => {
    const [page, setPage] = useState(book.currentPage.toString());

    return (
        <Modal onClose={onClose} title={`Update: ${book.title}`}>
            <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="current-page">What page are you on?</label>
                <input
                    id="current-page"
                    style={styles.input}
                    type="number"
                    value={page}
                    onChange={(e) => setPage(e.target.value)}
                    max={book.pageCount}
                    min="0"
                />
            </div>
            <div style={styles.formActions}>
                <button style={{ ...styles.button, ...styles.buttonSecondary }} onClick={onClose}>Cancel</button>
                <button style={styles.button} onClick={() => onSave(parseInt(page, 10))}>Save Progress</button>
            </div>
        </Modal>
    );
};

// --- AI Ideas Modal ---
const AiIdeasModal = ({ onClose, onAddBook, ideas, isLoading }: { onClose: () => void, onAddBook: (title: string) => void, ideas: any[], isLoading: boolean }) => {
    return (
        <Modal onClose={onClose} title="✨ AI Book Ideas">
            {isLoading ? (
                <p>Asking the librarian for ideas...</p>
            ) : (
                <div>
                    {ideas.map((idea, index) => (
                        <div key={index} style={styles.suggestionItem}>
                            <h4 style={styles.suggestionTitle}>{idea.title}</h4>
                            <p style={styles.suggestionAuthor}>by {idea.author}</p>
                            <p style={styles.suggestionSummary}>{idea.summary}</p>
                            <div style={{ ...styles.formActions, justifyContent: 'flex-start' }}>
                                <button
                                    style={{ ...styles.button, ...styles.buttonSuccess }}
                                    onClick={() => onAddBook(idea.title)}
                                >
                                    + Add to My Bookshelf
                                </button>
                            </div>
                        </div>
                    ))}
                    {ideas.length === 0 && <p>Couldn't find any suggestions right now. Try again later!</p>}
                </div>
            )}
        </Modal>
    );
};


// --- Main View ---
const ReadingCornerView = () => {
    const { onNavigate, personalizationData, onSavePersonalization, currentViewingProfile, addToast } = useAppContext();
    const isChildView = currentViewingProfile.role === 'Child';
    const allBooks = useMemo(() => (personalizationData.readingCornerBooks || []), [personalizationData.readingCornerBooks]);

    const [isLoading, setIsLoading] = useState(false);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
    const [isAiIdeasModalOpen, setAiIdeasModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [aiIdeas, setAiIdeas] = useState<any[]>([]);

    const myBooks = useMemo(() => allBooks.filter(b => b.addedBy === currentViewingProfile.id), [allBooks, currentViewingProfile.id]);
    const currentlyReading = myBooks.filter(b => b.status === 'reading').sort((a,b) => a.title.localeCompare(b.title));
    const finishedBooks = myBooks.filter(b => b.status === 'finished').sort((a,b) => a.title.localeCompare(b.title));

    const handleAddBook = async (title: string) => {
        if (!process.env.API_KEY) {
            addToast("API Key is not configured.", 'info');
            return;
        }
        setIsLoading(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const bookInfoResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Provide details for the book "${title}".`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            author: { type: Type.STRING },
                            summary: { type: Type.STRING, description: "A concise, one-paragraph summary." },
                            page_count: { type: Type.INTEGER },
                            cover_prompt: { type: Type.STRING, description: "A simple, descriptive prompt for an image generator to create a symbolic or minimalist cover for this book." }
                        }
                    }
                }
            });
            const bookInfo = JSON.parse(bookInfoResponse.text);

            addToast("Book details found, creating cover...", 'info');

            const coverImageResponse = await ai.models.generateImages({
                model: 'imagen-3.0-generate-002',
                prompt: bookInfo.cover_prompt,
                config: { numberOfImages: 1, outputMimeType: 'image/jpeg', aspectRatio: '3:4' }
            });

            const newBook: Book = {
                id: `book_${Date.now()}`,
                title: title,
                author: bookInfo.author,
                summary: bookInfo.summary,
                pageCount: bookInfo.page_count,
                coverUrl: `data:image/jpeg;base64,${coverImageResponse.generatedImages[0].image.imageBytes}`,
                currentPage: 0,
                status: 'reading',
                addedBy: currentViewingProfile.id
            };

            onSavePersonalization({ readingCornerBooks: [...allBooks, newBook] });
            addToast(`"${title}" was added to your bookshelf!`, 'badge');
            setAddModalOpen(false);
            if(isAiIdeasModalOpen) setAiIdeasModalOpen(false);

        } catch (error) {
            console.error("AI Add Book Failed:", error);
            addToast("Could not add this book. Please try again.", 'info');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateProgress = (book: Book) => {
        setSelectedBook(book);
        setUpdateModalOpen(true);
    };

    const handleSaveProgress = (page: number) => {
        if (!selectedBook) return;

        const newStatus = page >= selectedBook.pageCount ? 'finished' : 'reading';
        const updatedBook: Book = { ...selectedBook, currentPage: page, status: newStatus };

        const updatedBooks = allBooks.map(b => b.id === selectedBook.id ? updatedBook : b);
        onSavePersonalization({ readingCornerBooks: updatedBooks });

        if (newStatus === 'finished') {
            addToast(`Congratulations on finishing "${selectedBook.title}"!`, 'badge');
        } else {
            addToast('Progress saved!', 'badge');
        }

        setUpdateModalOpen(false);
        setSelectedBook(null);
    };

    const handleGetAiIdeas = async () => {
        if (!process.env.API_KEY) {
            addToast("API Key is not configured.", 'info');
            return;
        }
        setIsLoading(true);
        setAiIdeas([]);
        setAiIdeasModalOpen(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const finishedTitles = finishedBooks.map(b => b.title).join(', ');
            const prompt = `Based on a reader who is ${currentViewingProfile.age || 'of an unknown age'} and has finished reading these books: ${finishedTitles || 'None yet'}. Suggest 3 new, age-appropriate books.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            suggestions: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        title: { type: Type.STRING },
                                        author: { type: Type.STRING },
                                        summary: { type: Type.STRING, description: "A brief, enticing summary for the reader."}
                                    }
                                }
                            }
                        }
                    }
                }
            });
            const ideas = JSON.parse(response.text);
            setAiIdeas(ideas.suggestions);

        } catch (error) {
            console.error("AI Ideas Failed:", error);
            addToast("Could not get AI suggestions at this time.", 'info');
            setAiIdeas([]);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div style={styles.pageContainer}>
            <header style={styles.header}>
                <button style={{ ...styles.navButton, flexShrink: 0, width: 40 }} onClick={() => onNavigate('dashboard')}>
                    <ArrowLeftIcon />
                </button>
                <h2 style={styles.pageHeader}>{isChildView ? '📚 My Books' : '📚 Reading Corner'}</h2>
                <div style={{ flexShrink: 0, width: 40 }}></div>
            </header>
            <main style={styles.mainContent}>
                <section style={styles.section}>
                     <div style={styles.actionsContainer}>
                        <button style={{...styles.button, flexGrow: 1}} onClick={() => setAddModalOpen(true)}>+ Add a New Book</button>
                        <button style={{...styles.button, ...styles.buttonSecondary, flexGrow: 1}} onClick={handleGetAiIdeas} disabled={isAiIdeasModalOpen && isLoading}>
                            {isAiIdeasModalOpen && isLoading ? '🧠 Thinking...' : '✨ Get AI Ideas'}
                        </button>
                    </div>
                </section>
                
                <h2 style={styles.listHeader}>Currently Reading</h2>
                {currentlyReading.length > 0 ? (
                     <div style={styles.bookGrid}>
                        {currentlyReading.map(book => <BookCard key={book.id} book={book} onUpdateProgress={handleUpdateProgress} />)}
                    </div>
                ) : (
                    <div style={styles.section}><p>No books being read. Add one to get started!</p></div>
                )}
               
                <h2 style={styles.listHeader}>Finished Books</h2>
                {finishedBooks.length > 0 ? (
                     <div style={styles.bookGrid}>
                        {finishedBooks.map(book => <BookCard key={book.id} book={book} onUpdateProgress={handleUpdateProgress} />)}
                    </div>
                ) : (
                    <div style={styles.section}><p>No books finished yet. Keep on reading!</p></div>
                )}

            </main>

            {isAddModalOpen && (
                <AddBookModal onClose={() => setAddModalOpen(false)} onAdd={handleAddBook} isLoading={isLoading} />
            )}
            {isUpdateModalOpen && selectedBook && (
                <UpdateProgressModal onClose={() => setUpdateModalOpen(false)} onSave={handleSaveProgress} book={selectedBook} />
            )}
            {isAiIdeasModalOpen && (
                <AiIdeasModal onClose={() => setAiIdeasModalOpen(false)} onAddBook={handleAddBook} ideas={aiIdeas} isLoading={isLoading} />
            )}

            <BottomNavbar activePage="readingCorner" onNavigate={onNavigate} />
        </div>
    );
};

export default ReadingCornerView;