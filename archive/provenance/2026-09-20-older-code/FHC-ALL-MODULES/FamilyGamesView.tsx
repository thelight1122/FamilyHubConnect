import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { useAppContext } from './AppContext';
import { ArrowLeftIcon, Modal } from './components';
import { styles } from './styles';


const DrawingGame = ({ onBack }: { onBack: () => void }) => {
    const { addToast } = useAppContext();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [prompt, setPrompt] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [guessResult, setGuessResult] = useState<{ guess: string; isCorrect: boolean } | null>(null);

    // --- Canvas Drawing Logic ---
    const getCoords = (e: MouseEvent | TouchEvent): { x: number, y: number } | null => {
        if (!canvasRef.current) return null;
        const rect = canvasRef.current.getBoundingClientRect();
        const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
        const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const startDrawing = useCallback((e: MouseEvent | TouchEvent) => {
        e.preventDefault();
        const coords = getCoords(e);
        if (!coords) return;
        const context = canvasRef.current?.getContext('2d');
        if (context) {
            context.beginPath();
            context.moveTo(coords.x, coords.y);
            setIsDrawing(true);
        }
    }, []);

    const draw = useCallback((e: MouseEvent | TouchEvent) => {
        if (!isDrawing) return;
        e.preventDefault();
        const coords = getCoords(e);
        if (!coords) return;
        const context = canvasRef.current?.getContext('2d');
        if (context) {
            context.lineTo(coords.x, coords.y);
            context.stroke();
        }
    }, [isDrawing]);

    const stopDrawing = useCallback(() => {
        const context = canvasRef.current?.getContext('2d');
        if (context) {
            context.closePath();
            setIsDrawing(false);
        }
    }, []);

    const setupCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const context = canvas.getContext('2d');
            if (context) {
                // Scale canvas for high-DPI displays
                const dpr = window.devicePixelRatio || 1;
                const rect = canvas.getBoundingClientRect();
                canvas.width = rect.width * dpr;
                canvas.height = rect.height * dpr;
                context.scale(dpr, dpr);
                
                context.fillStyle = "white";
                context.fillRect(0, 0, canvas.width, canvas.height);

                context.lineCap = 'round';
                context.lineJoin = 'round';
                context.lineWidth = 8;
                context.strokeStyle = '#2c3e50';
            }
        }
    }, []);

    const clearCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const context = canvas.getContext('2d');
            context?.clearRect(0, 0, canvas.width, canvas.height);
            setupCanvas();
        }
    }, [setupCanvas]);

    useEffect(() => {
        setupCanvas();
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);
        canvas.addEventListener('touchstart', startDrawing, { passive: false });
        canvas.addEventListener('touchmove', draw, { passive: false });
        canvas.addEventListener('touchend', stopDrawing);

        return () => {
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('mouseup', stopDrawing);
            canvas.removeEventListener('mouseout', stopDrawing);
            canvas.removeEventListener('touchstart', startDrawing);
            canvas.removeEventListener('touchmove', draw);
            canvas.removeEventListener('touchend', stopDrawing);
        };
    }, [startDrawing, draw, stopDrawing, setupCanvas]);

    // --- Gemini API Logic ---
    const getPrompt = async () => {
        if (!process.env.API_KEY) return addToast("API Key is not configured.", 'info');
        setIsLoading(true);
        setPrompt(null);
        clearCanvas();

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const geminiPrompt = "Give me a single, simple, common object to draw, like 'cat' or 'house'. Respond with only the word, nothing else. The word should be easy for a child to draw.";
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: geminiPrompt });
            setPrompt(response.text.trim().toLowerCase().replace(/[^a-z\s]/gi, ''));
        } catch (error) {
            console.error("Error getting prompt:", error);
            addToast("Could not get a prompt. Try again!", 'info');
        } finally {
            setIsLoading(false);
        }
    };

    const submitDrawing = async () => {
        if (!prompt || !canvasRef.current || !process.env.API_KEY) return;
        setIsLoading(true);
        setGuessResult(null);

        const canvas = canvasRef.current;
        const dataUrl = canvas.toDataURL('image/png');
        const base64Data = dataUrl.split(',')[1];
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const imagePart = { inlineData: { mimeType: 'image/png', data: base64Data } };
            const textPart = { text: "What is this a drawing of? Respond with a single word or a short, simple phrase (e.g., 'a house' or 'a cat')." };
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: { parts: [imagePart, textPart] }
            });
            
            const guess = response.text.trim().toLowerCase().replace(/[^a-z\s]/gi, '');
            setGuessResult({ guess, isCorrect: guess.includes(prompt) });
        } catch (error) {
            console.error("Error guessing drawing:", error);
            addToast("The AI couldn't make a guess. Try drawing more clearly!", 'info');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handlePlayAgain = () => {
        setGuessResult(null);
        getPrompt();
    };

    return (
        <div style={styles.pageContainer}>
             <header style={styles.header}>
                 <button style={{...styles.navButton, flexShrink: 0, width: 40}} onClick={onBack}>
                    <ArrowLeftIcon />
                </button>
                <h2 style={styles.pageHeader}>AI Guess My Drawing</h2>
                <div style={{flexShrink: 0, width: 40}}></div>
            </header>
            <main style={styles.mainContent}>
                <div style={styles.drawingPromptDisplay}>
                    {prompt ? (
                        <>Your turn to draw: <strong>{prompt.toUpperCase()}</strong></>
                    ) : (
                        "Click 'Get a Word' to start!"
                    )}
                </div>
                
                <div style={styles.canvasContainer}>
                    <canvas ref={canvasRef} style={styles.drawingCanvas} />
                </div>

                <div style={styles.drawingControls}>
                    <button style={{...styles.button, ...styles.buttonSecondary}} onClick={getPrompt} disabled={isLoading}>
                        {isLoading && !prompt ? 'Getting...' : 'Get a Word'}
                    </button>
                    <button style={{...styles.button, ...styles.buttonDanger}} onClick={clearCanvas} disabled={isLoading}>Clear</button>
                    <button style={{...styles.button, ...styles.buttonSuccess}} onClick={submitDrawing} disabled={!prompt || isLoading}>
                        {isLoading && !guessResult ? 'Guessing...' : 'AI, Guess!'}
                    </button>
                </div>
            </main>

            {guessResult && (
                <Modal onClose={() => setGuessResult(null)} title="The AI's Guess Is...">
                    <div style={styles.resultModalContent}>
                        <div style={{ fontSize: '5em', lineHeight: 1 }} role="img" aria-label={guessResult.isCorrect ? 'Correct' : 'Incorrect'}>
                           {guessResult.isCorrect ? '🎉' : '🤔'}
                        </div>
                        <p style={styles.resultText}>The AI guessed: <strong>{guessResult.guess.toUpperCase()}</strong></p>
                        <p style={styles.resultText}>The word was: <strong>{prompt?.toUpperCase()}</strong></p>
                        <h3 style={{marginTop: '20px', color: guessResult.isCorrect ? styles.buttonSuccess.backgroundColor : styles.buttonDanger.backgroundColor }}>
                            {guessResult.isCorrect ? 'YOU WIN!' : 'NICE TRY!'}
                        </h3>
                         <div style={{...styles.formActions, marginTop: '30px'}}>
                            <button style={{...styles.button, ...styles.buttonSecondary}} onClick={() => setGuessResult(null)}>Close</button>
                            <button style={styles.button} onClick={handlePlayAgain}>Play Again</button>
                         </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};


const FamilyGamesView = () => {
    const { onNavigate, currentViewingProfile } = useAppContext();
    const isChildView = currentViewingProfile?.role === 'Child';
    const [view, setView] = useState<'hub' | 'drawing_game'>('hub');
    
    const games = [
        { id: 'drawing_game', title: 'AI Guess My Drawing', icon: '🎨', description: 'Can the AI guess what you drew? Get a prompt and find out!' }
    ];

    if (view === 'drawing_game') {
        return <DrawingGame onBack={() => setView('hub')} />;
    }

    return (
        <div style={styles.pageContainer}>
            <header style={styles.header}>
                 <button style={{...styles.navButton, flexShrink: 0, width: 40}} onClick={() => onNavigate('dashboard')}>
                    <ArrowLeftIcon />
                </button>
                <h2 style={styles.pageHeader}>{isChildView ? '🎲 Game Zone' : '🎲 Family Games'}</h2>
                <div style={{flexShrink: 0, width: 40}}></div>
            </header>
            <main style={styles.mainContent}>
                 <div style={styles.hubGrid}>
                    {games.map(game => (
                         <div
                            key={game.id}
                            style={styles.hubTile}
                            onClick={() => setView(game.id as any)}
                            role="button"
                            tabIndex={0}
                            onKeyPress={(e) => e.key === 'Enter' && setView(game.id as any)}
                        >
                            <h3 style={styles.hubTileTitle}><span style={styles.hubTileIcon} aria-hidden="true">{game.icon}</span> {game.title}</h3>
                            <p style={styles.hubTileDescription}>{game.description}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default FamilyGamesView;