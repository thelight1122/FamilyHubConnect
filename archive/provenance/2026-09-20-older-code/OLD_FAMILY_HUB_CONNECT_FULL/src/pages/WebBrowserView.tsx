
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { styles } from '../styles';
import HubTile from '../components/ui/HubTile';

export default function WebBrowserView({ onBackToDashboard }: { onBackToDashboard: () => void }) {
    const { safeWebsiteUrls } = useAppContext();
    const [iframeUrl, setIframeUrl] = useState<string | null>(null);

    if (iframeUrl) {
        return (
            React.createElement('div', { style: { display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px)', backgroundColor: '#333' } },
                React.createElement('div', { style: { padding: '10px', backgroundColor: '#444', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 } },
                    React.createElement('button', { onClick: () => setIframeUrl(null), style: { ...styles.button, width: 'auto' } }, '← Back to Hub'),
                    React.createElement('p', { style: { color: 'white', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, iframeUrl)
                ),
                React.createElement('iframe', {
                    src: iframeUrl,
                    style: { flexGrow: 1, border: 'none' },
                    title: 'Web Browser',
                    sandbox: "allow-scripts allow-same-origin"
                })
            )
        );
    }
    
    return (
        React.createElement('div', { style: styles.pageContainer },
            React.createElement('button', { onClick: onBackToDashboard, style: { ...styles.backButton, float: 'left' } }, "← Back"),
            React.createElement('div', { style: { clear: 'both' } }),
            React.createElement('h2', { style: styles.pageHeader }, "🌐 Safe Web Browser"),
            React.createElement('p', { style: { textAlign: 'center', color: '#666' } }, 'Select a website to visit. Only parent-approved sites are available.'),
            React.createElement('div', { style: styles.hubGrid },
                safeWebsiteUrls.map(site => (
                    React.createElement(HubTile, {
                        key: site.id,
                        icon: '🌐',
                        title: site.name,
                        description: site.url,
                        onClick: () => setIframeUrl(site.url)
                    })
                ))
            )
        )
    );
}
