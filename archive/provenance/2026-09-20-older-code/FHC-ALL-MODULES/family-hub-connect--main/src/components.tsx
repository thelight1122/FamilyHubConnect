
import React, { useEffect, useMemo } from 'react';
import { useAppState } from './AppContext.tsx';
import { DEFAULT_NAV_ITEMS, ALL_MODULES } from './constants.ts';
import type { PageView } from './types.ts';

export const ArrowLeftIcon = () => <>←</>;

interface ModalProps {
    children: React.ReactNode;
    onClose: () => void;
    title: string;
    isOpen?: boolean;
}

export const Modal = ({ children, onClose, title, isOpen = true }: ModalProps) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }
    return (
        <div className="modal-backdrop fade-in" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="modal slide-down" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 id="modal-title">{title}</h3>
                    <button onClick={onClose} className="close-button" aria-label="Close modal">&times;</button>
                </div>
                <div className="modal-content">{children}</div>
            </div>
        </div>
    );
};

interface BottomNavbarProps {
    activePage: string;
    onNavigate: (page: PageView) => void;
}

export const BottomNavbar = ({ activePage, onNavigate }: BottomNavbarProps) => {
    const { profiles, viewingAsProfileId } = useAppState();
    const currentViewingProfile = useMemo(() => profiles.find(p => p.id === viewingAsProfileId), [profiles, viewingAsProfileId]);
    
    const navItemsToShow = useMemo(() => {
        return (currentViewingProfile?.navBarLayout && currentViewingProfile.navBarLayout.length > 0)
            ? currentViewingProfile.navBarLayout
            : DEFAULT_NAV_ITEMS;
    }, [currentViewingProfile]);

    const isChildView = currentViewingProfile?.role === 'Child';

    return (
        <nav className="bottom-nav">
            {navItemsToShow.map(item => {
                const moduleInfo = ALL_MODULES.find(m => m.page === item.page);
                const label = isChildView && moduleInfo?.childTitle ? moduleInfo.childTitle : item.label;
                
                return (
                    <button 
                        key={item.page} 
                        onClick={() => onNavigate(item.page)}
                        className={`nav-item ${activePage === item.page ? 'active' : ''}`}
                        aria-label={label}
                    >
                        <span className="icon" aria-hidden="true">{item.icon}</span>
                        {label}
                    </button>
                )
            })}
        </nav>
    );
};

interface HubTileProps {
    title: string;
    icon: string;
    description: string;
    onClick: () => void;
}

export const HubTile = ({ title, icon, description, onClick }: HubTileProps) => {
    return (
        <div 
            className="hub-tile"
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && onClick()}
        >
            <h3><span className="icon" aria-hidden="true">{icon}</span> {title}</h3>
            <p>{description}</p>
        </div>
    );
};

interface ToastProps {
    message: string;
    onClose: () => void;
    type?: 'info' | 'badge' | 'points';
    icon?: string;
}

export const Toast = ({ message, onClose, type = 'info', icon }: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`toast ${type} slide-down`} role="alert">
            {icon && <span className="toast-icon">{icon}</span>}
            {message}
        </div>
    );
};


export const EmptyState = ({ icon, title, message }: { icon: string; title: string; message: string }) => (
    <div className="card empty-state">
        <div className="empty-state-icon">{icon}</div>
        <h3 className="empty-state-title">{title}</h3>
        <p className="empty-state-message">{message}</p>
    </div>
);

export const LoadingSpinner = ({ message }: { message: string }) => (
    <div className="loading-spinner">
        <div className="loading-spinner-circle"></div>
        {message && <p>{message}</p>}
    </div>
);

export const AIHelperWidget: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => {
    return (
        <div className="ai-widget">
            <div className="ai-widget-header">
                <span className="ai-widget-icon">🤖</span>
                <div>
                    <h4 className="ai-widget-title">{title}</h4>
                    <p className="ai-widget-description">{description}</p>
                </div>
            </div>
            <div className="ai-widget-content">
                {children}
            </div>
        </div>
    );
};
