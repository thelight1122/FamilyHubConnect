import React, { useState, useMemo } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { useAppContext } from './AppContext';
import { ArrowLeftIcon, BottomNavbar, Modal } from './components';
import { styles } from './styles';
import { Trip, PackingListItem, ItineraryDay } from './types';

const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start + 'T00:00:00');
    const endDate = new Date(end + 'T00:00:00');
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return `${startDate.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', options)}`;
};


// --- Trip Creation Modal ---
const PlanTripModal = ({ onClose, onSave, isLoading }: { onClose: () => void; onSave: (data: any) => void; isLoading: boolean; }) => {
    const [destination, setDestination] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [interests, setInterests] = useState('');

    const handleSubmit = () => {
        if (!destination || !startDate || !endDate || !interests) {
            alert('Please fill out all fields.');
            return;
        }
        onSave({ destination, startDate, endDate, interests });
    };

    return (
        <Modal onClose={onClose} title="✈️ Plan a New Adventure">
            <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="destination">Destination</label>
                <input id="destination" style={styles.input} value={destination} onChange={e => setDestination(e.target.value)} placeholder="e.g., Paris, France" />
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{...styles.formGroup, flex: 1}}>
                    <label style={styles.label} htmlFor="start-date">Start Date</label>
                    <input id="start-date" type="date" style={styles.input} value={startDate} onChange={e => setStartDate(e.target.value)} />
                </div>
                <div style={{...styles.formGroup, flex: 1}}>
                    <label style={styles.label} htmlFor="end-date">End Date</label>
                    <input id="end-date" type="date" style={styles.input} value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="interests">Interests & Vibe</label>
                <textarea id="interests" style={styles.textarea} value={interests} onChange={e => setInterests(e.target.value)} placeholder="e.g., Kid-friendly museums, relaxing, great food, historical sites..." />
            </div>
            <div style={styles.formActions}>
                <button onClick={onClose} style={{...styles.button, ...styles.buttonSecondary}}>Cancel</button>
                <button onClick={handleSubmit} style={styles.button} disabled={isLoading}>
                    {isLoading ? '🧠 Planning...' : '✨ Generate Trip with AI'}
                </button>
            </div>
        </Modal>
    );
};


// --- Trip Details View ---
const TripDetailsView = ({ trip, onBack, onUpdateTrip }: { trip: Trip; onBack: () => void; onUpdateTrip: (updatedTrip: Trip) => void; }) => {
    const [activeTab, setActiveTab] = useState<'itinerary' | 'packing'>('itinerary');
    const { currentViewingProfile } = useAppContext();

    const handleTogglePacked = (itemId: string) => {
        const updatedList = trip.packingList.map(item => {
            if (item.id === itemId) {
                return { ...item, packedBy: item.packedBy ? null : currentViewingProfile.id };
            }
            return item;
        });
        onUpdateTrip({ ...trip, packingList: updatedList });
    };

    const ItineraryTab = () => (
        <div>
            {trip.itinerary.map(day => (
                <div key={day.date} style={styles.itineraryDay}>
                    <h3 style={styles.itineraryDayHeader}>
                        {new Date(day.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </h3>
                    {day.activities.map(activity => (
                        <div key={activity.id} style={styles.activityCard}>
                            <p style={styles.activityTime}>{activity.timeSlot}</p>
                            <h4 style={styles.activityTitle}>{activity.title}</h4>
                            <p>{activity.description}</p>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );

    const PackingListTab = () => {
        const groupedPackingList = trip.packingList.reduce((acc, item) => {
            const category = item.category || 'General';
            if (!acc[category]) acc[category] = [];
            acc[category].push(item);
            return acc;
        }, {} as Record<string, PackingListItem[]>);
    
        return (
            <div>
                {Object.entries(groupedPackingList).map(([category, items]) => (
                    <div key={category} style={{ marginBottom: '20px' }}>
                        <h3 style={styles.categoryHeader}>{category}</h3>
                        {items.map(item => (
                            <div key={item.id} style={styles.packingListItem}>
                                <input
                                    type="checkbox"
                                    style={styles.checkbox}
                                    checked={!!item.packedBy}
                                    onChange={() => handleTogglePacked(item.id)}
                                    aria-labelledby={`item-name-${item.id}`}
                                />
                                <span id={`item-name-${item.id}`} style={{ ...styles.packingListItemName, ...(item.packedBy ? styles.packingListItemChecked : {})}}>
                                    {item.name}
                                </span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div style={styles.pageContainer}>
            <header style={styles.header}>
                <button style={{ ...styles.navButton, flexShrink: 0, width: 40 }} onClick={onBack}>
                    <ArrowLeftIcon />
                </button>
                <h2 style={styles.pageHeader}>✈️ {trip.name}</h2>
                <div style={{ flexShrink: 0, width: 40 }}></div>
            </header>
            <main style={styles.mainContent}>
                <div style={styles.tabs}>
                    <button
                        style={activeTab === 'itinerary' ? { ...styles.tabButton, ...styles.tabButtonActive } : styles.tabButton}
                        onClick={() => setActiveTab('itinerary')}>Itinerary</button>
                    <button
                        style={activeTab === 'packing' ? { ...styles.tabButton, ...styles.tabButtonActive } : styles.tabButton}
                        onClick={() => setActiveTab('packing')}>Packing List</button>
                </div>
                <div style={styles.section}>
                    {activeTab === 'itinerary' && <ItineraryTab />}
                    {activeTab === 'packing' && <PackingListTab />}
                </div>
            </main>
        </div>
    );
};


// --- Main Trip Planner Hub View ---
const TripPlannerView = () => {
    const { onNavigate, personalizationData, onSavePersonalization, addToast, profiles, currentViewingProfile } = useAppContext();
    const allTrips = useMemo(() => (personalizationData.trips || []), [personalizationData.trips]);

    const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateTrip = async ({ destination, startDate, endDate, interests }: { destination: string, startDate: string, endDate: string, interests: string }) => {
        if (!process.env.API_KEY) {
            addToast("API Key is not configured.", 'info');
            return;
        }
        setIsLoading(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const familyProfile = profiles.map(p => `${p.role} (age ${p.age})`).join(', ');
            
            // Step 1: Generate the trip plan JSON
            const planPrompt = `Create a family trip plan to ${destination} from ${startDate} to ${endDate}. The family consists of: ${familyProfile}. Their interests are: ${interests}. Generate a fun trip name, a day-by-day itinerary, and a categorized packing list.`;
            
            const planResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: planPrompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            trip_name: { type: Type.STRING, description: 'A fun, catchy name for the trip.' },
                            itinerary: {
                                type: Type.ARRAY, description: "Array of daily plans.",
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        date: { type: Type.STRING, description: "Date in YYYY-MM-DD format." },
                                        activities: {
                                            type: Type.ARRAY, items: {
                                                type: Type.OBJECT, properties: {
                                                    time_slot: { type: Type.STRING, description: "Morning, Afternoon, or Evening" },
                                                    title: { type: Type.STRING },
                                                    description: { type: Type.STRING }
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            packing_list: {
                                type: Type.ARRAY, description: "Categorized packing list.",
                                items: {
                                    type: Type.OBJECT, properties: {
                                        category: { type: Type.STRING },
                                        item: { type: Type.STRING }
                                    }
                                }
                            }
                        }
                    }
                }
            });
            const plan = JSON.parse(planResponse.text);

            addToast("Trip plan created, now generating a cover image...", 'info');

            // Step 2: Generate cover image
            const imagePrompt = `A beautiful, vibrant, picturesque travel photo of ${destination}.`;
            const imageResponse = await ai.models.generateImages({
                model: 'imagen-3.0-generate-002',
                prompt: imagePrompt,
                config: { numberOfImages: 1, aspectRatio: '16:9', outputMimeType: 'image/jpeg' }
            });
            const imageUrl = `data:image/jpeg;base64,${imageResponse.generatedImages[0].image.imageBytes}`;

            // Step 3: Assemble the full Trip object
            const newTrip: Trip = {
                id: `trip_${Date.now()}`,
                name: plan.trip_name,
                destination, startDate, endDate,
                travelerIds: profiles.map(p => p.id),
                coverImageUrl: imageUrl,
                itinerary: plan.itinerary.map((day: any): ItineraryDay => ({
                    date: day.date,
                    activities: day.activities.map((act: any, index: number) => ({
                        id: `act_${Date.now()}_${index}`,
                        title: act.title,
                        description: act.description,
                        timeSlot: act.time_slot,
                        status: 'idea'
                    }))
                })),
                packingList: plan.packing_list.map((item: any, index: number): PackingListItem => ({
                    id: `pack_${Date.now()}_${index}`,
                    name: item.item,
                    category: item.category,
                    packedBy: null,
                })),
                budget: [] // Budget can be added manually later
            };

            onSavePersonalization({ trips: [...allTrips, newTrip] });
            addToast(`Trip to ${destination} planned!`, 'badge');
            setIsModalOpen(false);

        } catch (error) {
            console.error("AI Trip Generation Failed:", error);
            addToast("AI generation failed. Please check the prompt and try again.", 'info');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateTrip = (updatedTrip: Trip) => {
        const updatedTrips = allTrips.map(t => t.id === updatedTrip.id ? updatedTrip : t);
        onSavePersonalization({ trips: updatedTrips });
        // Optionally, update the selected trip state if you want the details view to re-render immediately
        setSelectedTrip(updatedTrip);
    };

    if (selectedTrip) {
        return <TripDetailsView trip={selectedTrip} onBack={() => setSelectedTrip(null)} onUpdateTrip={handleUpdateTrip} />;
    }

    // Hub View
    return (
        <div style={styles.pageContainer}>
            <header style={styles.header}>
                <button style={{ ...styles.navButton, flexShrink: 0, width: 40 }} onClick={() => onNavigate('dashboard')}>
                    <ArrowLeftIcon />
                </button>
                <h2 style={styles.pageHeader}>{currentViewingProfile.role === 'Child' ? '✈️ Adventure Map' : '✈️ Trip Planner'}</h2>
                <div style={{ flexShrink: 0, width: 40 }}></div>
            </header>
            <main style={styles.mainContent}>
                <button onClick={() => setIsModalOpen(true)} style={{ ...styles.button, width: '100%', marginBottom: '20px' }}>
                    + Plan a New Trip
                </button>
                <div style={styles.hubGrid}>
                    {allTrips.map(trip => (
                        <div key={trip.id} style={styles.tripCard} onClick={() => setSelectedTrip(trip)}>
                            <img src={trip.coverImageUrl} alt={trip.name} style={styles.tripCardImage} />
                            <div style={styles.tripCardInfo}>
                                <h3 style={styles.tripCardTitle}>{trip.name}</h3>
                                <p style={styles.tripCardDetails}>{formatDateRange(trip.startDate, trip.endDate)}</p>
                            </div>
                        </div>
                    ))}
                    {allTrips.length === 0 && (
                        <div style={styles.section}>
                            <p>No trips planned yet. Click the button above to start your next adventure!</p>
                        </div>
                    )}
                </div>
            </main>
            {isModalOpen && <PlanTripModal onClose={() => setIsModalOpen(false)} onSave={handleGenerateTrip} isLoading={isLoading} />}
            <BottomNavbar activePage="tripPlanner" onNavigate={onNavigate} />
        </div>
    );
};

export default TripPlannerView;