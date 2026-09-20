import React, { useState, useMemo, useRef } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { useAppContext } from './AppContext';
import { ArrowLeftIcon, BottomNavbar, Modal } from './components';
import { styles } from './styles';
import { Photo, PhotoAlbum } from './types';

// --- MODALS ---

const CreateAlbumModal = ({ onClose, onSave }: { onClose: () => void; onSave: (name: string, description: string) => void; }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    return (
        <Modal onClose={onClose} title="Create New Album">
            <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="album-name">Album Name</label>
                <input id="album-name" style={styles.input} value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="album-desc">Description</label>
                <textarea id="album-desc" style={styles.textarea} value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <div style={styles.formActions}>
                <button onClick={onClose} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
                <button onClick={() => onSave(name, description)} style={styles.button} disabled={!name}>Save Album</button>
            </div>
        </Modal>
    );
};

const UploadPhotoModal = ({ onClose, onSave, albumId }: { onClose: () => void; onSave: (photoData: Omit<Photo, 'id' | 'albumId' | 'timestamp' | 'uploaderId'>) => void; albumId: string; }) => {
    const [caption, setCaption] = useState('');
    const [imageData, setImageData] = useState<string | null>(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setIsCameraOn(true);
            setImageData(null);
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Could not access the camera. Please check permissions.");
        }
    };

    const takePicture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            const dataUrl = canvas.toDataURL('image/jpeg');
            setImageData(dataUrl);
            stopCamera();
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsCameraOn(false);
    };

    const handleSave = () => {
        if (!imageData) {
            alert("Please take a picture first.");
            return;
        }
        onSave({ url: imageData, caption });
    };

    return (
        <Modal onClose={onClose} title="Upload a Photo">
            <div style={styles.cameraView}>
                {isCameraOn ? (
                    <>
                        <video ref={videoRef} autoPlay style={styles.cameraVideo}></video>
                        <button onClick={takePicture} style={styles.button}>📸 Take Picture</button>
                    </>
                ) : imageData ? (
                    <img src={imageData} alt="Captured" style={styles.cameraOutput} />
                ) : (
                    <div style={{ padding: '40px 20px', textAlign: 'center', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                        <p>Use your camera to add a new photo.</p>
                        <button onClick={startCamera} style={styles.button}>Start Camera</button>
                    </div>
                )}
            </div>
            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
            <div style={{ ...styles.formGroup, marginTop: '20px' }}>
                <label style={styles.label} htmlFor="photo-caption">Caption</label>
                <input id="photo-caption" style={styles.input} value={caption} onChange={e => setCaption(e.target.value)} />
            </div>
            <div style={styles.formActions}>
                <button onClick={onClose} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
                <button onClick={handleSave} style={styles.button} disabled={!imageData}>Save Photo</button>
            </div>
        </Modal>
    );
};

const AiGenerateAlbumModal = ({ onClose, onGenerate, isLoading }: { onClose: () => void; onGenerate: (prompt: string) => void; isLoading: boolean; }) => {
    const [prompt, setPrompt] = useState('');
    return (
        <Modal onClose={onClose} title="Generate Album with AI">
            <p>Describe an event or theme, and AI will create an album for you!</p>
            <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="ai-prompt">Description</label>
                <textarea id="ai-prompt" style={styles.textarea} value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="e.g., A family trip to the mountains with hiking and campfires." />
            </div>
            <div style={styles.formActions}>
                <button onClick={onClose} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
                <button onClick={() => onGenerate(prompt)} style={styles.button} disabled={isLoading || !prompt}>
                    {isLoading ? '🧠 Generating...' : '✨ Generate Album'}
                </button>
            </div>
        </Modal>
    );
};

// --- MAIN VIEW ---

const PhotoAlbumsView = () => {
    const { onNavigate, personalizationData, onSavePersonalization, addToast, currentViewingProfile } = useAppContext();
    const allAlbums = useMemo(() => (personalizationData.photoAlbums || []), [personalizationData.photoAlbums]);
    const allPhotos = useMemo(() => (personalizationData.photos || []), [personalizationData.photos]);

    const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [isUploadModalOpen, setUploadModalOpen] = useState(false);
    const [isAiModalOpen, setAiModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateAlbum = (name: string, description: string) => {
        const newAlbum: PhotoAlbum = {
            id: `album_${Date.now()}`,
            name,
            description,
            createdBy: currentViewingProfile.id,
            createdAt: Date.now(),
        };
        onSavePersonalization({ photoAlbums: [...allAlbums, newAlbum] });
        addToast("Album created!", 'badge');
        setCreateModalOpen(false);
    };

    const handleUploadPhoto = (photoData: Omit<Photo, 'id' | 'albumId' | 'timestamp' | 'uploaderId'>) => {
        if (!selectedAlbumId) return;
        const newPhoto: Photo = {
            ...photoData,
            id: `photo_${Date.now()}`,
            albumId: selectedAlbumId,
            uploaderId: currentViewingProfile.id,
            timestamp: Date.now(),
        };
        const updatedPhotos = [...allPhotos, newPhoto];
        
        // Update cover photo if it's the first photo
        const album = allAlbums.find(a => a.id === selectedAlbumId);
        const updatedAlbums = [...allAlbums];
        if(album && !album.coverPhotoUrl) {
            const albumIndex = updatedAlbums.findIndex(a => a.id === selectedAlbumId);
            updatedAlbums[albumIndex].coverPhotoUrl = newPhoto.url;
        }

        onSavePersonalization({ photos: updatedPhotos, photoAlbums: updatedAlbums });
        addToast("Photo added!", 'badge');
        setUploadModalOpen(false);
    };

    const handleGenerateWithAi = async (prompt: string) => {
        if (!process.env.API_KEY) {
            addToast("API Key is not configured.", 'info');
            return;
        }
        setIsLoading(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            // Step 1: Generate album details and image prompts from the user's description
            const planResponse = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `Based on the user's description "${prompt}", create a photo album plan. Generate a suitable album title, a one-sentence description, and an array of 4 distinct, descriptive prompts for an image generation model. The prompts should capture key moments from the user's description.`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            description: { type: Type.STRING },
                            prompts: { type: Type.ARRAY, items: { type: Type.STRING } },
                        }
                    }
                }
            });
            const albumPlan = JSON.parse(planResponse.text);

            addToast("Album plan created, now generating images...", 'info');
            
            // Step 2: Generate images based on the prompts
            const imagePromises = albumPlan.prompts.map((p: string) => 
                ai.models.generateImages({
                    model: 'imagen-3.0-generate-002',
                    prompt: p,
                    config: { numberOfImages: 1, outputMimeType: 'image/jpeg', aspectRatio: '4:3' }
                })
            );
            const imageResults = await Promise.all(imagePromises);

            // Step 3: Assemble the new album and photos
            const newAlbum: PhotoAlbum = {
                id: `album_${Date.now()}`,
                name: albumPlan.title,
                description: albumPlan.description,
                createdBy: currentViewingProfile.id,
                createdAt: Date.now(),
                coverPhotoUrl: `data:image/jpeg;base64,${imageResults[0].generatedImages[0].image.imageBytes}`
            };

            const newPhotos: Photo[] = imageResults.map((result, index) => ({
                id: `photo_${Date.now()}_${index}`,
                albumId: newAlbum.id,
                url: `data:image/jpeg;base64,${result.generatedImages[0].image.imageBytes}`,
                caption: albumPlan.prompts[index],
                uploaderId: 'ai_generated',
                timestamp: Date.now() + index,
            }));

            onSavePersonalization({
                photoAlbums: [...allAlbums, newAlbum],
                photos: [...allPhotos, ...newPhotos],
            });

            addToast(`Successfully created album: "${newAlbum.name}"!`, 'badge');
            setAiModalOpen(false);

        } catch (error) {
            console.error("AI Album Generation Failed:", error);
            addToast("AI generation failed. Please try again.", 'info');
        } finally {
            setIsLoading(false);
        }
    };

    const renderAlbumList = () => (
        <>
            <div style={styles.actionButtons}>
                <button style={{...styles.button, flex: 1}} onClick={() => setCreateModalOpen(true)}>+ Create Album</button>
                <button style={{...styles.button, ...styles.buttonSecondary, flex: 1}} onClick={() => setAiModalOpen(true)}>✨ Generate with AI</button>
            </div>
            <div style={styles.albumGrid}>
                {allAlbums.map(album => (
                    <div key={album.id} style={styles.albumTile} onClick={() => setSelectedAlbumId(album.id)}>
                        <img src={album.coverPhotoUrl || 'https://placehold.co/400x300/ecf0f1/bdc3c7?text=No+Photos'} alt={album.name} style={styles.albumCoverImage} />
                        <div style={styles.albumInfo}>
                            <h3 style={styles.albumTitle}>{album.name}</h3>
                            <p style={styles.albumDescription}>{album.description}</p>
                        </div>
                    </div>
                ))}
            </div>
            {allAlbums.length === 0 && <div style={styles.section}><p>No photo albums yet. Create one to get started!</p></div>}
        </>
    );

    const renderAlbumDetails = () => {
        const album = allAlbums.find(a => a.id === selectedAlbumId);
        if (!album) return null;
        const photosInAlbum = allPhotos.filter(p => p.albumId === selectedAlbumId);

        return (
            <div>
                 <div style={styles.actionButtons}>
                    <button style={styles.button} onClick={() => setUploadModalOpen(true)}>+ Upload Photo</button>
                 </div>
                 <div style={styles.photoGrid}>
                    {photosInAlbum.map(photo => (
                        <div key={photo.id} style={styles.photoWrapper}>
                            <img src={photo.url} alt={photo.caption} style={styles.photo}/>
                            {/* Can add an overlay with caption here later */}
                        </div>
                    ))}
                 </div>
                 {photosInAlbum.length === 0 && <div style={styles.section}><p>This album is empty. Upload the first photo!</p></div>}
            </div>
        );
    };

    const selectedAlbum = allAlbums.find(a => a.id === selectedAlbumId);

    return (
        <div style={styles.pageContainer}>
            <header style={styles.header}>
                <button style={{ ...styles.navButton, flexShrink: 0, width: 40 }} onClick={() => selectedAlbumId ? setSelectedAlbumId(null) : onNavigate('dashboard')}>
                    <ArrowLeftIcon />
                </button>
                <h2 style={styles.pageHeader}>{selectedAlbum ? `🖼️ ${selectedAlbum.name}` : '🖼️ Photo Albums'}</h2>
                <div style={{ flexShrink: 0, width: 40 }}></div>
            </header>
            <main style={styles.mainContent}>
                {selectedAlbumId ? renderAlbumDetails() : renderAlbumList()}
            </main>
            
            {isCreateModalOpen && <CreateAlbumModal onClose={() => setCreateModalOpen(false)} onSave={handleCreateAlbum} />}
            {isUploadModalOpen && selectedAlbumId && <UploadPhotoModal onClose={() => setUploadModalOpen(false)} onSave={handleUploadPhoto} albumId={selectedAlbumId} />}
            {isAiModalOpen && <AiGenerateAlbumModal onClose={() => setAiModalOpen(false)} onGenerate={handleGenerateWithAi} isLoading={isLoading} />}
            
            <BottomNavbar activePage="photoAlbum" onNavigate={onNavigate} />
        </div>
    );
};

export default PhotoAlbumsView;