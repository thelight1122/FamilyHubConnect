
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { styles } from '../styles';
import type { Photo, PhotoAlbum, FamilyMessage } from '../types';
import { fileToDataUrl, uniqueId } from '../utils/utils';
import Modal from '../components/ui/Modal';
import HubTile from '../components/ui/HubTile';
import EmptyState from '../components/ui/EmptyState';

interface PhotoAlbumViewProps {
    addAlbum: (album: Omit<PhotoAlbum, 'id'|'family_id'>) => Promise<any>;
    deleteAlbum: (id: string) => Promise<any>;
    addPhoto: (photo: Omit<Photo, 'id'|'family_id'>) => Promise<any>;
    deletePhoto: (id: string) => Promise<any>;
    addMessage: (message: Omit<FamilyMessage, 'id'|'family_id'>) => Promise<any>;
}

export default function PhotoAlbumView({ addAlbum, deleteAlbum, addPhoto, deletePhoto, addMessage }: PhotoAlbumViewProps) {
    const { onNavigate, photoAlbums, familyPhotos, currentViewingProfile } = useAppContext();
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
        const newPhoto = await addPhoto({
            albumId: viewingAlbumId,
            imageUrl,
            caption: photoCaption.trim(),
            uploadedBy: currentViewingProfile.id,
            timestamp: Date.now()
        });
        if (newPhoto) {
            await addMessage({
                text: `${currentViewingProfile.name} added a new photo!`,
                authorId: currentViewingProfile.id,
                authorName: currentViewingProfile.name,
                timestamp: Date.now(),
                recipientId: null,
            });
        }
        setIsPhotoModalOpen(false);
        setPhotoCaption('');
        setPhotoFile(null);
    };

    const renderAlbumList = () => (
        React.createElement(React.Fragment, null,
            React.createElement('h2', {style: styles.pageHeader}, "📸 Photo Albums"),
            React.createElement('button', {style: {...styles.button, width: 'auto', marginBottom: '20px'}, onClick: () => setIsAlbumModalOpen(true)}, '+ New Album'),
            photoAlbums.length > 0 ? (
                React.createElement('div', {style: styles.hubGrid},
                    photoAlbums.map(album => (
                        React.createElement(HubTile, {key: album.id, icon: '🖼️', title: album.name, description: `${familyPhotos.filter(p => p.albumId === album.id).length} photos`, onClick: () => setViewingAlbumId(album.id)})
                    ))
                )
            ) : (
                React.createElement(EmptyState, {icon: '🖼️', title: 'No Albums Yet', message: 'Create an album to start sharing family photos!'})
            )
        )
    );
    
    const renderPhotoGrid = () => {
        const album = photoAlbums.find(a => a.id === viewingAlbumId);
        const photosInAlbum = familyPhotos.filter(p => p.albumId === viewingAlbumId);

        return React.createElement(React.Fragment, null,
            React.createElement('button', {style: {...styles.backButton, float: 'left'}, onClick: () => setViewingAlbumId(null)}, '← Back to Albums'),
            React.createElement('div', {style: {clear: 'both'}}),
            React.createElement('h2', {style: styles.pageHeader}, album?.name),
            React.createElement('button', {style: {...styles.button, width: 'auto', marginBottom: '20px'}, onClick: () => setIsPhotoModalOpen(true)}, '+ Upload Photo'),
            photosInAlbum.length > 0 ? (
                React.createElement('div', {style: {display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))'}},
                    photosInAlbum.map(photo => (
                        React.createElement('div', {key: photo.id},
                            React.createElement('img', {src: photo.imageUrl, alt: photo.caption, style: {width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px'}}),
                            React.createElement('p', {style: {fontSize: '0.9em'}}, photo.caption)
                        )
                    ))
                )
            ) : (
                React.createElement(EmptyState, {icon: '📷', title: 'Empty Album', message: 'Upload the first photo to this album!'})
            )
        )
    };

    return (
        React.createElement('div', { style: styles.pageContainer },
            viewingAlbumId ? renderPhotoGrid() : renderAlbumList(),
            isAlbumModalOpen && React.createElement(Modal, {isOpen: true, onClose: () => setIsAlbumModalOpen(false), title: 'New Photo Album', children:
                React.createElement('div', null,
                    React.createElement('div', {style: styles.formGroup}, React.createElement('label', null, 'Album Name'), React.createElement('input', {value: albumName, onChange: e => setAlbumName(e.target.value), style: styles.input})),
                    React.createElement('button', {onClick: handleCreateAlbum, style: styles.button}, 'Create Album')
                )
            }),
            isPhotoModalOpen && React.createElement(Modal, {isOpen: true, onClose: () => setIsPhotoModalOpen(false), title: 'Upload Photo', children:
                React.createElement('div', null,
                    React.createElement('div', {style: styles.formGroup}, React.createElement('label', null, 'Photo File'), React.createElement('input', {type: 'file', accept: 'image/*', onChange: e => setPhotoFile(e.target.files ? e.target.files[0] : null), style: styles.input})),
                    React.createElement('div', {style: styles.formGroup}, React.createElement('label', null, 'Caption'), React.createElement('input', {value: photoCaption, onChange: e => setPhotoCaption(e.target.value), style: styles.input})),
                    React.createElement('button', {onClick: handleUploadPhoto, style: styles.button, disabled: !photoFile}, 'Upload')
                )
            })
        )
    );
}
