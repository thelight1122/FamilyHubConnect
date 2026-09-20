import React from 'react';
import { useAppContext } from './AppContext';
import { ArrowLeftIcon, BottomNavbar } from './components';
import { styles } from './styles';
import { SmartDevice, SmartScene } from './types';

// Simple Toggle Switch Component, as pseudo-elements aren't available in inline styles
const Switch = ({ isOn, onToggle }: { isOn: boolean; onToggle: () => void }) => (
    <label style={styles.switch}>
        <input type="checkbox" style={styles.switchInput} checked={isOn} onChange={onToggle} />
        <span style={{...styles.slider, backgroundColor: isOn ? styles.buttonSuccess.backgroundColor : '#bdc3c7'}}>
            <span style={{ ...styles.sliderBefore, transform: isOn ? 'translateX(26px)' : 'translateX(0)' }}></span>
        </span>
    </label>
);


const SmartHomeView = () => {
    const { onNavigate, personalizationData, onSavePersonalization, addToast, currentViewingProfile } = useAppContext();
    const isParentView = currentViewingProfile.role !== 'Child';

    const devices = personalizationData.smartDevices || [];
    const scenes = personalizationData.smartScenes || [];

    const handleDeviceUpdate = (deviceId: string, newStatus: SmartDevice['status']) => {
        const updatedDevices = devices.map(d =>
            d.id === deviceId ? { ...d, status: newStatus } : d
        );
        onSavePersonalization({ smartDevices: updatedDevices });
    };

    const handleActivateScene = (scene: SmartScene) => {
        let updatedDevices = [...devices];
        scene.actions.forEach(action => {
            updatedDevices = updatedDevices.map(d =>
                d.id === action.deviceId ? { ...d, status: action.targetStatus } : d
            );
        });
        onSavePersonalization({ smartDevices: updatedDevices });
        addToast(`Activated scene: ${scene.name}`, 'badge');
    };
    
    const getDeviceIcon = (type: SmartDevice['type']) => {
        const iconMap = {
            Light: '💡',
            Thermostat: '🌡️',
            Lock: '🔒',
            Camera: '📹',
        };
        return iconMap[type];
    };

    const groupedDevices = devices.reduce((acc, device) => {
        const room = device.room || 'General';
        if (!acc[room]) {
            acc[room] = [];
        }
        acc[room].push(device);
        return acc;
    }, {} as Record<string, SmartDevice[]>);


    const DeviceCard = ({ device }: { device: SmartDevice }) => {
        const isDisconnected = device.connectionState === 'disconnected';

        const renderControls = () => {
            if (isDisconnected) return null;

            switch (device.type) {
                case 'Light':
                    return (
                        <Switch
                            isOn={device.status === 'on'}
                            onToggle={() => handleDeviceUpdate(device.id, device.status === 'on' ? 'off' : 'on')}
                        />
                    );
                case 'Thermostat':
                    const temp = device.status as number;
                    return (
                        <>
                            <button style={{...styles.button, ...styles.controlButton}} onClick={() => handleDeviceUpdate(device.id, temp - 1)}>-</button>
                            <span style={styles.thermostatDisplay}>{temp}°</span>
                            <button style={{...styles.button, ...styles.controlButton}} onClick={() => handleDeviceUpdate(device.id, temp + 1)}>+</button>
                        </>
                    );
                case 'Lock':
                    const isLocked = device.status === 'locked';
                    return (
                        <button
                            style={{...styles.button, backgroundColor: isLocked ? styles.buttonDanger.backgroundColor : styles.buttonSuccess.backgroundColor, width: '120px'}}
                            onClick={() => handleDeviceUpdate(device.id, isLocked ? 'unlocked' : 'locked')}
                        >
                            <span style={styles.lockStatus}>{isLocked ? 'Unlock' : 'Lock'}</span>
                        </button>
                    );
                case 'Camera':
                    return <p style={{color: '#7f8c8d'}}>Status: {device.status === 'on' ? 'Streaming' : 'Off'}</p>
                default:
                    return null;
            }
        };

        return (
            <div style={styles.deviceCard}>
                <div style={styles.deviceHeader}>
                    <span style={styles.deviceIcon}>{getDeviceIcon(device.type)}</span>
                    <h4 style={styles.deviceName}>{device.name}</h4>
                </div>
                <div style={styles.deviceControls}>
                    {renderControls()}
                </div>
                {isDisconnected && <div style={styles.disconnectedOverlay}>Disconnected</div>}
            </div>
        )
    };
    
    if (!isParentView) {
        return (
            <div style={styles.pageContainer}>
                <header style={styles.header}>
                    <button style={{...styles.navButton, flexShrink: 0, width: 40}} onClick={() => onNavigate('homeManagement')}><ArrowLeftIcon /></button>
                    <h2 style={styles.pageHeader}>💡 Smart Home</h2>
                        <div style={{flexShrink: 0, width: 40}}></div>
                </header>
                <main style={styles.mainContent}>
                    <div style={styles.section}>
                        <p>This feature is for parents only.</p>
                    </div>
                </main>
                <BottomNavbar activePage="homeManagement" onNavigate={onNavigate} />
            </div>
        )
    }

    return (
        <div style={styles.pageContainer}>
            <header style={styles.header}>
                <button style={{...styles.navButton, flexShrink: 0, width: 40}} onClick={() => onNavigate('homeManagement')}>
                    <ArrowLeftIcon />
                </button>
                <h2 style={styles.pageHeader}>💡 Smart Home</h2>
                <div style={{flexShrink: 0, width: 40}}></div>
            </header>
            <main style={styles.mainContent}>
                <section style={styles.section}>
                    <h3>Scenes</h3>
                    <div style={styles.sceneGrid}>
                        {scenes.map(scene => (
                            <button key={scene.id} style={styles.sceneButton} onClick={() => handleActivateScene(scene)}>
                                <span style={styles.sceneIcon}>{scene.icon}</span>
                                <span style={styles.sceneName}>{scene.name}</span>
                            </button>
                        ))}
                    </div>
                </section>
                
                {Object.keys(groupedDevices).sort().map((room) => (
                    <section key={room}>
                        <h3 style={styles.roomHeader}>{room}</h3>
                        <div style={styles.deviceGrid}>
                            {groupedDevices[room].map(device => <DeviceCard key={device.id} device={device} />)}
                        </div>
                    </section>
                ))}
            </main>
            <BottomNavbar activePage="homeManagement" onNavigate={onNavigate} />
        </div>
    );
};

export default SmartHomeView;
