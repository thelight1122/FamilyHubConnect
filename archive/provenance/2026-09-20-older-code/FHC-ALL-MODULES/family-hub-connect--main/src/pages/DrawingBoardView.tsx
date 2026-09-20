

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import type { Photo, PhotoAlbum } from '../types.ts';
import { Modal, ArrowLeftIcon } from '../components.tsx';
import { useAppState, useAppDispatch } from '../AppContext.tsx';

const SaveDrawingForm = ({ onSave, onCancel }: { onSave: (albumId: string, newAlbumName: string, caption: string) => void, onCancel: () => void }) => {
    const { photoAlbums } = useAppState();
    const [saveTarget, setSaveTarget] = useState<'new_album' | string>(photoAlbums[0]?.id || 'new_album');
    const [newAlbumName, setNewAlbumName] = useState('');
    const [caption, setCaption] = useState('');

    const handleSaveClick = () => {
        onSave(saveTarget, newAlbumName, caption);
    };

    return (
        <div>
            <div className="form-group">
                <label>Caption (optional)</label>
                <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Enter a caption" />
            </div>
            <div className="form-group">
                <label>Save to Album</label>
                 <select title="Save to Album" value={saveTarget} onChange={(e) => setSaveTarget(e.target.value)}>
                    <option value='new_album'>Create New Album...</option>
                    {photoAlbums.map(album => <option key={album.id} value={album.id}>{album.name}</option>)}
                 </select>
            </div>
            {saveTarget === 'new_album' && (
                <div className="form-group">
                    <label htmlFor='newAlbumName'>New Album Name</label>
                    <input id='newAlbumName' value={newAlbumName} onChange={(e) => setNewAlbumName(e.target.value)} />
                </div>
            )}
            <div className="form-actions">
                <button onClick={onCancel} className="btn btn-secondary">Cancel</button>
                <button onClick={handleSaveClick} className="btn">Save to Album</button>
            </div>
        </div>
    );
};

export default function DrawingBoardView({ onBack }: { onBack: () => void }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#000000');
    const [brushSize, setBrushSize] = useState(5);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    
    const { viewingAsProfileId, profiles } = useAppState();
    const currentViewingProfile = useMemo(() => profiles.find(p => p.id === viewingAsProfileId), [profiles, viewingAsProfileId]);
    const { addToast, addAlbum, addPhoto } = useAppDispatch();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        const context = canvas.getContext('2d');
        if (!context) return;
        context.lineCap = 'round';
        context.lineJoin = 'round';
        contextRef.current = context;
    }, []);

    useEffect(() => {
        if (contextRef.current) {
            contextRef.current.strokeStyle = color;
            contextRef.current.lineWidth = brushSize;
        }
    }, [color, brushSize]);

    const getEventCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { offsetX: 0, offsetY: 0 };
        const rect = canvas.getBoundingClientRect();
        const touch = 'touches' in e ? e.touches[0] : e;
        return { offsetX: touch.clientX - rect.left, offsetY: touch.clientY - rect.top };
    };

    const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        const context = contextRef.current;
        if (!context) return;
        const { offsetX, offsetY } = getEventCoordinates(e);
        context.beginPath();
        context.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    }, []);

    const finishDrawing = useCallback(() => {
        const context = contextRef.current;
        if (!context) return;
        context.closePath();
        setIsDrawing(false);
    }, []);

    const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        e.preventDefault();
        const context = contextRef.current;
        if (!context) return;
        const { offsetX, offsetY } = getEventCoordinates(e);
        context.lineTo(offsetX, offsetY);
        context.stroke();
    }, [isDrawing]);

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = contextRef.current;
        if (canvas && context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
    };
    
    const handleSaveDrawing = async (saveTarget: string, newAlbumName: string, caption: string) => {
        const canvas = canvasRef.current;
        if (!canvas || !currentViewingProfile) return;

        const imageUrl = canvas.toDataURL('image/png');
        let albumId = saveTarget;

        if (saveTarget === 'new_album') {
            if (!newAlbumName.trim()) { addToast("New album name cannot be empty.", 'info'); return; }
            const newAlbum = await addAlbum({
                name: newAlbumName.trim(), description: 'Drawings from the digital board',
                createdBy: currentViewingProfile.id, timestamp: Date.now()
            });
            albumId = newAlbum.id;
        }

        await addPhoto({
            albumId, imageUrl, caption: caption || `A drawing by ${currentViewingProfile.name}`,
            uploadedBy: currentViewingProfile.id, timestamp: Date.now()
        });

        addToast("Drawing saved!", 'badge');
        setIsSaveModalOpen(false);
        clearCanvas();
    };

    return (
        <div className="page">
             <header className="header">
                 <button className="back-button" onClick={onBack} title="Go Back">
                    <ArrowLeftIcon />
                </button>
                <h2>🎨 Digital Drawing Board</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                <div className="drawing-controls">
                    <div className="form-group">
                        <label htmlFor='colorPicker'>Color</label>
                        <input type='color' id='colorPicker' value={color} onChange={e => setColor(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor='brushSize'>{`Brush Size: ${brushSize}`}</label>
                        <input type='range' id='brushSize' min='1' max='50' value={brushSize} onChange={e => setBrushSize(Number(e.target.value))} />
                    </div>
                    <button onClick={clearCanvas} className="btn w-auto">Clear</button>
                    <button onClick={() => setIsSaveModalOpen(true)} className="btn btn-success w-auto">Save Drawing</button>
                </div>

                <canvas
                    ref={canvasRef}
                    className="drawing-canvas"
                    onMouseDown={startDrawing}
                    onMouseUp={finishDrawing}
                    onMouseOut={finishDrawing}
                    onMouseMove={draw}
                    onTouchStart={startDrawing}
                    onTouchEnd={finishDrawing}
                    onTouchCancel={finishDrawing}
                    onTouchMove={draw}
                />
            </main>
            
            {isSaveModalOpen && (
                <Modal isOpen={true} onClose={() => setIsSaveModalOpen(false)} title='Save Your Drawing'>
                    <SaveDrawingForm onSave={handleSaveDrawing} onCancel={() => setIsSaveModalOpen(false)} />
                </Modal>
            )}
        </div>
    );
}