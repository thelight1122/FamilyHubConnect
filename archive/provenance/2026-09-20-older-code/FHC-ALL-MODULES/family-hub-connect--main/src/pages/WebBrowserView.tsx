
import React, { useState } from 'react';
import { useAppState } from '../AppContext';
import { HubTile, ArrowLeftIcon } from '../components';

export default function WebBrowserView({ onBackToDashboard }: { onBackToDashboard: () => void }) {
    const { safeWebsiteUrls } = useAppState();
    const [iframeUrl, setIframeUrl] = useState<string | null>(null);

    if (iframeUrl) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#333' }}>
                <div style={{ padding: '10px', backgroundColor: '#444', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                    <button onClick={() => setIframeUrl(null)} className="btn w-auto">← Back to Hub</button>
                    <p style={{ color: 'white', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{iframeUrl}</p>
                </div>
                <iframe
                    src={iframeUrl}
                    style={{ flexGrow: 1, border: 'none' }}
                    title="Web Browser"
                    sandbox="allow-scripts allow-same-origin"
                />
            </div>
        );
    }
    
    return (
        <div className="page">
            <header className="header">
                 <button className="back-button" onClick={onBackToDashboard}>
                    <ArrowLeftIcon />
                </button>
                <h2>🌐 Safe Web Browser</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                <p className="text-center text-light">Select a website to visit. Only parent-approved sites are available.</p>
                <div className="hub-grid">
                    {safeWebsiteUrls.map(site => (
                        <HubTile
                            key={site.id}
                            icon='🌐'
                            title={site.name}
                            description={site.url}
                            onClick={() => setIframeUrl(site.url)}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}
