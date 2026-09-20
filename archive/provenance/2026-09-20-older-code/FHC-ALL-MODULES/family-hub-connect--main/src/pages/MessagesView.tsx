import React from 'react';
import { useAppDispatch } from '../AppContext.tsx';
import { EmptyState, ArrowLeftIcon, BottomNavbar } from '../components.tsx';

export default function MessagesView({ onClearInitialRecipient }: { onClearInitialRecipient: () => void }) {
    const { onNavigate } = useAppDispatch();

     React.useEffect(() => {
        onClearInitialRecipient();
    }, [onClearInitialRecipient]);

    return (
        <div className="page">
             <header className="header">
                 <button className="back-button" onClick={() => onNavigate('connections')}>
                    <ArrowLeftIcon />
                </button>
                <h2>💬 Messages</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                <EmptyState
                    icon="🚧"
                    title="Under Construction"
                    message="This feature is currently being rebuilt."
                />
            </main>
            <BottomNavbar activePage="messages" onNavigate={onNavigate} />
        </div>
    );
}