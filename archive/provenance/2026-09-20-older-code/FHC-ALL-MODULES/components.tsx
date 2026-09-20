import React, { useState, useEffect } from 'react';
import { useAppContext } from './AppContext';
import { styles } from './styles';

export const ArrowLeftIcon = () => <span style={styles.navButton}>←</span>;

interface ModalProps {
    children: React.ReactNode;
    onClose: () => void;
    title: string;
}

export const Modal = ({ children, onClose, title }: ModalProps) => (
    <div style={styles.modalBackdrop} className="fade-in">
        <div style={styles.modalContainer} className="slide-down">
            <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>{title}</h3>
                <button onClick={onClose} style={styles.closeButton}>&times;</button>
            </div>
            <div style={styles.modalContent}>{children}</div>
        </div>
    </div>
);

interface BottomNavbarProps {
    activePage: string;
    onNavigate: (page: string) => void;
}

export const BottomNavbar = ({ activePage, onNavigate }: BottomNavbarProps) => {
    const { currentViewingProfile } = useAppContext();
    const navItems = [
        { page: 'dashboard', label: 'Dashboard', icon: '🏠' },
        { page: 'calendar', label: 'Calendar', icon: '🗓️' },
        { page: 'chores', label: 'Chores', childLabel: 'My Jobs', icon: '🧹' },
        { page: 'rewards', label: 'Rewards', childLabel: 'Prize Box', icon: '🏆' },
    ];

    return (
        <nav style={styles.bottomNav}>
            {navItems.map(item => {
                const isChildView = currentViewingProfile?.role === 'Child';
                const label = isChildView && item.childLabel ? item.childLabel : item.label;
                const itemStyle = activePage === item.page ? {...styles.navItem, ...styles.navItemActive} : styles.navItem;

                return (
                    <button 
                        key={item.page} 
                        onClick={() => onNavigate(item.page)}
                        style={itemStyle}
                        aria-label={label}
                    >
                        <span style={{ fontSize: '1.5em' }} aria-hidden="true">{item.icon}</span>
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
    const [isHovered, setIsHovered] = useState(false);
    const tileStyle = {
        ...styles.hubTile,
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 12px 24px rgba(0,0,0,0.1)' : '0 8px 16px rgba(0,0,0,0.05)'
    };

    return (
        <div 
            style={tileStyle}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && onClick()}
        >
            <h3 style={styles.hubTileTitle}><span style={styles.hubTileIcon} aria-hidden="true">{icon}</span> {title}</h3>
            <p style={styles.hubTileDescription}>{description}</p>
        </div>
    );
};

interface ToastProps {
    message: string;
    onClose: () => void;
    type?: 'info' | 'badge';
}

export const Toast = ({ message, onClose, type = 'info' }: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const toastStyle = {
        padding: '15px 20px',
        borderRadius: '8px',
        color: 'white',
        boxShadow: '0 4px 12px rgba(0,0,0,.15)',
        backgroundColor: type === 'badge' ? '#2ecc71' : '#e74c3c'
    };

    return (
        <div style={toastStyle} className="slide-down" role="alert">
            {message}
        </div>
    );
};