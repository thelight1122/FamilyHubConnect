
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { styles } from '../styles';
import { uniqueId } from '../utils/utils';
import type { Photo, PhotoAlbum } from '../types';
import Modal from '../components/ui/Modal';
import { useAppContext } from '../contexts/AppContext';

interface DrawingBoardViewProps {
    addAlbum: (album: Omit<PhotoAlbum, 'id'|'family_id'>) => Promise<PhotoAlbum>;
    addPhoto: (photo: Omit<Photo, 'id'|'family_id'>) => Promise<Photo>;
    onBack: () => void;
}

export default function DrawingBoardView({ addAlbum, addPhoto, onBack }: DrawingBoardViewProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#000000');
    const [brushSize, setBrushSize] = useState(5);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    
    const { currentViewingProfile, addToast, photoAlbums } = useAppContext();

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

        if ('touches' in e) { // Touch event
            return {
                offsetX: e.touches[0].clientX - rect.left,
                offsetY: e.touches[0].clientY - rect.top,
            };
        }
        // Mouse event
        return { offsetX: e.clientX - rect.left, offsetY: e.clientY - rect.top };
    };

    const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        const context = contextRef.current;
        if (!context) return;
        const { offsetX, offsetY } = getEventCoordinates(e);
        context.beginPath();
        context.moveTo(offsetX, offsetY);
        setIsDrawing(true);
        e.preventDefault();
    }, []);

    const finishDrawing = useCallback(() => {
        const context = contextRef.current;
        if (!context) return;
        context.closePath();
        setIsDrawing(false);
    }, []);

    const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const context = contextRef.current;
        if (!context) return;
        const { offsetX, offsetY } = getEventCoordinates(e);
        context.lineTo(offsetX, offsetY);
        context.stroke();
        e.preventDefault();
    }, [isDrawing]);

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = contextRef.current;
        if (canvas && context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
    };
    
    const SaveDrawingForm = () => {
        const [saveTarget, setSaveTarget] = useState<'new_album' | string>(photoAlbums[0]?.id || 'new_album');
        const [newAlbumName, setNewAlbumName] = useState('');
        const [caption, setCaption] = useState('');

        const handleSave = async () => {
            const canvas = canvasRef.current;
            if (!canvas || !currentViewingProfile) return;

            const imageUrl = canvas.toDataURL('image/png');
            let albumId = saveTarget;

            if (saveTarget === 'new_album') {
                if (!newAlbumName.trim()) {
                    addToast("New album name cannot be empty.", 'info');
                    return;
                }
                const newAlbum = await addAlbum({
                    name: newAlbumName.trim(),
                    description: 'Drawings from the digital board',
                    createdBy: currentViewingProfile.id,
                    timestamp: Date.now()
                });
                albumId = newAlbum.id;
            }

            await addPhoto({
                albumId,
                imageUrl,
                caption: caption || `A drawing by ${currentViewingProfile.name}`,
                uploadedBy: currentViewingProfile.id,
                timestamp: Date.now()
            });

            addToast("Drawing saved!", 'badge');
            setIsSaveModalOpen(false);
            clearCanvas();
        };

        return React.createElement('div', null,
            React.createElement('div', {style: styles.formGroup}, React.createElement('label', {style: styles.label}, 'Caption (optional)', React.createElement('input', {value: caption, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCaption(e.target.value), style: styles.input}))),
            React.createElement('div', {style: styles.formGroup}, React.createElement('label', {style: styles.label}, 'Save to Album'),
                 React.createElement('select', {value: saveTarget, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setSaveTarget(e.target.value), style: styles.selectInput} as React.HTMLProps<HTMLSelectElement>,
                    React.createElement('option', {value: 'new_album'}, 'Create New Album...'),
                    ...photoAlbums.map(album => React.createElement('option', {key: album.id, value: album.id}, album.name))
                 )
            ),
            saveTarget === 'new_album' && React.createElement('div', {style: styles.formGroup}, React.createElement('label', {htmlFor: 'newAlbumName', style: styles.label}, 'New Album Name', React.createElement('input', {id: 'newAlbumName', value: newAlbumName, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setNewAlbumName(e.target.value), style: styles.input}))),
            React.createElement('button', {onClick: handleSave, style: styles.button}, 'Save to Album')
        );
    };

    return (
        React.createElement('div', { style: styles.pageContainer },
            React.createElement('button', {
                onClick: onBack,
                style: { ...styles.backButton, float: 'left' },
                'aria-label': "Back to Creators Studio"
            }, "← Back to Creators Studio"),
            React.createElement('div', {style: {clear: 'both'}}),
            React.createElement('h2', { style: styles.pageHeader }, "🎨 Digital Drawing Board"),
            
            React.createElement('div', { style: styles.drawingControls },
                React.createElement('div', {style: styles.formGroup}, React.createElement('label', {htmlFor: 'colorPicker'}, 'Color'), React.createElement('input', {type: 'color', id: 'colorPicker', value: color, onChange: e => setColor(e.target.value)})),
                React.createElement('div', {style: styles.formGroup}, React.createElement('label', {htmlFor: 'brushSize'}, `Brush Size: ${brushSize}`), React.createElement('input', {type: 'range', id: 'brushSize', min: '1', max: '50', value: brushSize, onChange: e => setBrushSize(Number(e.target.value))})),
                React.createElement('button', {onClick: clearCanvas, style: {...styles.button, width: 'auto'}}, 'Clear'),
                React.createElement('button', {onClick: () => setIsSaveModalOpen(true), style: {...styles.button, ...styles.buttonSuccess, width: 'auto'}}, 'Save Drawing')
            ),

            React.createElement('canvas', {
                ref: canvasRef,
                style: styles.drawingCanvas,
                onMouseDown: startDrawing,
                onMouseUp: finishDrawing,
                onMouseOut: finishDrawing,
                onMouseMove: draw,
                onTouchStart: startDrawing,
                onTouchEnd: finishDrawing,
                onTouchCancel: finishDrawing,
                onTouchMove: draw,
            }),
            
            isSaveModalOpen && React.createElement(Modal, {
                isOpen: true, 
                onClose: () => setIsSaveModalOpen(false), 
                title: 'Save Your Drawing', 
                children: React.createElement(SaveDrawingForm, null)
            })
        )
    );
}
