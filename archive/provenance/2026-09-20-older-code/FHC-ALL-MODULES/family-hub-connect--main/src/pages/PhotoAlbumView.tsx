
import React, { useState, useMemo } from 'react';
import { useAppState, useAppDispatch } from '../AppContext';
import type { Photo, PhotoAlbum, FamilyMessage } from '../types';
import { fileToDataUrl } from '../utils/utils';
import { Modal, HubTile, EmptyState, ArrowLeftIcon } from '../components';

export default function PhotoAlbumView() {
    const { onNavigate, addAlbum, addPhoto, addMessage } = useAppDispatch();
    const { photoAlbums, familyPhotos, profiles, viewingAsProfileId } = useAppState();
    const currentViewingProfile = useMemo(() => profiles.find(p => p.id === viewingAsProfileId), [profiles, viewingAsProfileId]);

    const [viewingAlbumId, setViewingAlbumId] = useState<string | null>(null);
    const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
    const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
    const [albumName, setAlbumName] = useState('');
    const [photoCaption, setPhotoCaption] = useState('');
    const [photoFile, setPhotoFile] = useState<File | null>(null);

    const handleCreateAlbum = async () => {
        if (!albumName.trim() || !currentViewingProfile) return;
        await addAlbum({
            name: albumName.trim(),
            createdBy: currentViewingProfile.id,
            timestamp: Date.now()
        });
        setIsAlbumModalOpen(false);
        setAlbumName('');
    };

    const handleUploadPhoto = async () => {
        if (!photoFile || !viewingAlbumId || !currentViewingProfile) return;
        const imageUrl = await fileToDataUrl(photoFile);
        await addPhoto({
            albumId: viewingAlbumId,
            imageUrl,
            caption: photoCaption.trim(),
            uploadedBy: currentViewingProfile.id,
            timestamp: Date.now()
        });
        await addMessage({
            text: `${currentViewingProfile.name} added a new photo!`,
            authorId: currentViewingProfile.id,
            authorName: currentViewingProfile.name,
            timestamp: Date.now(),
            recipientId: null,
        });
        setIsPhotoModalOpen(false);
        setPhotoCaption('');
        setPhotoFile(null);
    };

    const renderAlbumList = () => (
        <div className="page">
            <header className="header">
                <button className="back-button" onClick={() => onNavigate('dashboard')}>
                    <ArrowLeftIcon />
                </button>
                <h2>📸 Photo Albums</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                <button className="btn w-auto mb-20" onClick={() => setIsAlbumModalOpen(true)}>+ New Album</button>
                {photoAlbums.length > 0 ? (
                    <div className="hub-grid">
                        {photoAlbums.map(album => (
                            <HubTile key={album.id} icon='🖼️' title={album.name} description={`${familyPhotos.filter(p => p.albumId === album.id).length} photos`} onClick={() => setViewingAlbumId(album.id)} />
                        ))}
                    </div>
                ) : (
                    <EmptyState icon='🖼️' title='No Albums Yet' message='Create an album to start sharing family photos!' />
                )}
            </main>
        </div>
    );
    
    const renderPhotoGrid = () => {
        const album = photoAlbums.find(a => a.id === viewingAlbumId);
        const photosInAlbum = familyPhotos.filter(p => p.albumId === viewingAlbumId);

        return (
            <div className="page">
                <header className="header">
                    <button className="back-button" onClick={() => setViewingAlbumId(null)}>
                        <ArrowLeftIcon />
                    </button>
                    <h2>{album?.name}</h2>
                    <div className="header-placeholder" />
                </header>
                <main className="main">
                    <button className="btn w-auto mb-20" onClick={() => setIsPhotoModalOpen(true)}>+ Upload Photo</button>
                    {photosInAlbum.length > 0 ? (
                        <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' }}>
                            {photosInAlbum.map(photo => (
                                <div key={photo.id}>
                                    <img src={photo.imageUrl} alt={photo.caption} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }} />
                                    <p style={{ fontSize: '0.9em' }}>{photo.caption}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState icon='📷' title='Empty Album' message='Upload the first photo to this album!' />
                    )}
                </main>
            </div>
        );
    };

    return (
        <>
            {viewingAlbumId ? renderPhotoGrid() : renderAlbumList()}
            
            <Modal isOpen={isAlbumModalOpen} onClose={() => setIsAlbumModalOpen(false)} title="New Photo Album">
                <div className="form-group">
                    <label>Album Name</label>
                    <input value={albumName} onChange={e => setAlbumName(e.target.value)} />
                </div>
                <button onClick={handleCreateAlbum} className="btn">Create Album</button>
            </Modal>

            <Modal isOpen={isPhotoModalOpen} onClose={() => setIsPhotoModalOpen(false)} title="Upload Photo">
                <div className="form-group">
                    <label>Photo File</label>
                    <input type='file' accept='image/*' onChange={e => setPhotoFile(e.target.files ? e.target.files[0] : null)} />
                </div>
                <div className="form-group">
                    <label>Caption</label>
                    <input value={photoCaption} onChange={e => setPhotoCaption(e.target.value)} />
                </div>
                <button onClick={handleUploadPhoto} className="btn" disabled={!photoFile}>Upload</button>
            </Modal>
        </>
    );
}
