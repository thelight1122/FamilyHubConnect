
import React from 'react';
import { styles } from '../../styles.ts';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string; // Title is optional
    contentStyle?: React.CSSProperties; // Allow overriding content style
    'aria-labelledby'?: string;
}

export default function Modal({ isOpen, onClose, children, title, contentStyle }: ModalProps) {
    if (!isOpen) return null;

    const finalContentStyle = { ...styles.modalContent, ...contentStyle };
    const modalTitleId = title ? 'modal-title' : undefined;

    return React.createElement(
        'div',
        {
            style: styles.modalOverlay,
            onClick: onClose,
            role: 'dialog',
            'aria-modal': 'true',
            'aria-labelledby': modalTitleId,
        } as React.HTMLProps<HTMLDivElement>,
        React.createElement(
            'div',
            {
                style: finalContentStyle,
                onClick: (e) => e.stopPropagation(),
            } as React.HTMLProps<HTMLDivElement>,
            React.createElement(
                'button',
                { onClick: onClose, style: styles.modalCloseButton, 'aria-label': 'Close dialog' },
                '×'
            ),
            title && React.createElement('h3', { id: modalTitleId, style: styles.modalTitle }, title),
            children
        )
    );
}
