import { CSSProperties } from 'react';

export const pageStyles: { [key: string]: CSSProperties } = {
    pageContainer: { fontFamily: "'Inter', sans-serif", backgroundColor: '#f4f7fa', minHeight: '100vh', display: 'flex', flexDirection: 'column' },
    pageHeader: { fontSize: '1.5em', fontWeight: 'bold', color: '#2c3e50', textAlign: 'center', flexGrow: 1 },
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 20px', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 100 },
    mainContent: { flexGrow: 1, padding: '20px', paddingBottom: '100px' /* For bottom nav */ },
    section: { backgroundColor: 'white', padding: '20px', borderRadius: '16px', marginBottom: '20px', boxShadow: '0 8px 16px rgba(0,0,0,0.05)', color: '#2c3e50' },
    button: { backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '8px', padding: '12px 20px', cursor: 'pointer', fontSize: '1em', fontWeight: '600', transition: 'background-color 0.2s ease' },
    buttonDanger: { backgroundColor: '#e74c3c' },
    buttonSuccess: { backgroundColor: '#2ecc71' },
    buttonSecondary: { backgroundColor: '#95a5a6' },
    textarea: { width: 'calc(100% - 22px)', padding: '10px', border: '1px solid #dfe6e9', borderRadius: '8px', minHeight: '100px', marginBottom: '10px', fontSize: '1em', fontFamily: "'Inter', sans-serif", resize: 'vertical' },
    input: { width: 'calc(100% - 22px)', padding: '10px', border: '1px solid #dfe6e9', borderRadius: '8px', fontSize: '1em' },
    selectInput: { width: '100%', padding: '10px', border: '1px solid #dfe6e9', borderRadius: '8px', fontSize: '1em', backgroundColor: 'white' },
    label: { display: 'block', marginBottom: '8px', fontWeight: '600', color: '#34495e' },
    formGroup: { marginBottom: '15px' },
    formActions: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' },
    modalBackdrop: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalContainer: { backgroundColor: 'white', padding: '0', borderRadius: '16px', width: '90%', maxWidth: '500px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' },
    modalHeader: { padding: '20px 25px', borderBottom: '1px solid #f0f2f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    modalTitle: { margin: 0, fontSize: '1.4em', fontWeight: 'bold', color: '#2c3e50' },
    closeButton: { background: 'none', border: 'none', fontSize: '1.8em', cursor: 'pointer', color: '#95a5a6', lineHeight: 1 },
    modalContent: { padding: '25px' },
    bottomNav: { position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'white', display: 'flex', justifyContent: 'space-around', padding: '10px 0', boxShadow: '0 -2px 10px rgba(0,0,0,0.08)', zIndex: 100 },
    navItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: '#7f8c8d', textDecoration: 'none', fontSize: '0.75em', border: 'none', background: 'none', cursor: 'pointer', flexBasis: 0, flexGrow: 1 },
    navItemActive: { color: '#3498db', fontWeight: 'bold' },
    navButton: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5em', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34495e' },
    toastArea: { position: 'fixed', top: '20px', right: '20px', zIndex: 2000, display: 'flex', flexDirection: 'column', gap: '10px' },
};

export const dashboardStyles: { [key: string]: CSSProperties } = {
    hubGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' },
    hubTile: { backgroundColor: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 8px 16px rgba(0,0,0,0.05)', border: '1px solid #eef2f7', textAlign: 'left', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', display: 'flex', flexDirection: 'column' },
    hubTileTitle: { fontSize: '1.3em', fontFamily: "'Nunito', sans-serif", color: '#333', marginBottom: '10px', marginTop: 0, display: 'flex', alignItems: 'center', gap: '10px' },
    hubTileDescription: { fontSize: '0.9em', color: '#666', lineHeight: 1.5, flexGrow: 1 },
    hubTileIcon: { fontSize: '1.5em' },
    dashboardMotto: { fontSize: '1.2em', fontStyle: 'italic', fontFamily: "'Caveat', cursive", color: '#3498db', textAlign: 'center', marginBottom: '20px' },
    memberInfoFrame: { padding: '20px', borderRadius: '16px', backgroundColor: 'white', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '20px' },
    memberInfoName: { fontSize: '1.8em', margin: '0 0 5px 0', fontFamily: "'Nunito', sans-serif", color: '#2c3e50' },
    memberInfoRolePoints: { color: '#7f8c8d', margin: 0 },
    profileSelectWrapper: { display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 500 },
    profileSelect: { padding: '8px', border: '1px solid #dfe6e9', borderRadius: '8px', fontSize: '.9em' },
};

export const mealPlanStyles: { [key: string]: CSSProperties } = {
    weekGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '15px',
    },
    dayColumn: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
    },
    dayHeader: {
        padding: '12px',
        borderBottom: '1px solid #f0f2f5',
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        borderTopLeftRadius: '12px',
        borderTopRightRadius: '12px',
    },
    mealSlot: {
        padding: '12px',
        borderBottom: '1px solid #f0f2f5',
        cursor: 'pointer',
        flexGrow: 1,
        transition: 'background-color 0.2s ease',
        minHeight: '80px',
        display: 'flex',
        flexDirection: 'column',
    },
    mealType: {
        fontWeight: '600',
        fontSize: '0.8em',
        color: '#7f8c8d',
        marginBottom: '5px',
    },
    mealName: {
        fontSize: '0.95em',
        color: '#2c3e50',
        flexGrow: 1,
    },
    addMeal: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#bdc3c7',
        fontSize: '2em',
        height: '100%',
        borderRadius: '8px',
    },
};

export const allowanceStyles: { [key: string]: CSSProperties } = {
    balanceDisplay: {
        fontSize: '3em',
        fontWeight: 'bold',
        color: '#2c3e50',
        textAlign: 'center',
        margin: '10px 0 20px 0',
        fontFamily: "'Nunito', sans-serif",
    },
    balanceLabel: {
        fontSize: '1em',
        fontWeight: 'normal',
        color: '#7f8c8d',
        textAlign: 'center',
        display: 'block',
        marginTop: '-15px',
        marginBottom: '20px'
    },
    transactionList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    transactionItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '10px',
    },
    transactionDetails: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
    },
    transactionIcon: {
        fontSize: '1.5em',
    },
    transactionDescription: {
        fontWeight: 600,
    },
    transactionDate: {
        fontSize: '0.85em',
        color: '#7f8c8d',
    },
    transactionAmount: {
        fontWeight: 'bold',
        fontSize: '1.1em',
    },
};

export const choreStyles: { [key: string]: CSSProperties } = {
    choreListContainer: { display: 'flex', flexDirection: 'column', gap: '15px' },
    choreItem: {
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        padding: '15px',
        borderLeft: '5px solid #bdc3c7', // Default 'done' color
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    choreItemHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
    choreTitle: { fontWeight: 600, fontSize: '1.1em', color: '#2c3e50', flexGrow: 1, marginRight: '10px' },
    choreReward: {
        backgroundColor: 'rgba(46, 204, 113, 0.1)',
        color: '#27ae60',
        padding: '4px 8px',
        borderRadius: '6px',
        fontSize: '0.9em',
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
    },
    choreMeta: { display: 'flex', gap: '15px', fontSize: '0.85em', color: '#7f8c8d' },
    choreActions: { display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' },
    listHeader: {
        fontSize: '1.2em',
        fontWeight: 700,
        color: '#34495e',
        paddingBottom: '8px',
        borderBottom: '2px solid #ecf0f1',
        marginBottom: '10px',
    },
};

export const shoppingListStyles: { [key: string]: CSSProperties } = {
    addItemForm: {
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
    },
    addItemInput: {
        flexGrow: 1,
        width: 'auto',
    },
    listActions: {
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
    },
    categoryHeader: {
        fontSize: '1.2em',
        fontWeight: 700,
        color: '#34495e',
        paddingBottom: '8px',
        borderBottom: '2px solid #ecf0f1',
        marginBottom: '10px',
        marginTop: '20px',
    },
    listContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    listItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        transition: 'background-color 0.2s',
    },
    listItemName: {
        flexGrow: 1,
        fontSize: '1.05em',
        transition: 'color 0.2s, text-decoration 0.2s',
    },
    listItemCompleted: {
        color: '#95a5a6',
        textDecoration: 'line-through',
    },
    deleteItemButton: {
        background: 'none',
        border: 'none',
        color: '#bdc3c7',
        fontSize: '1.2em',
        cursor: 'pointer',
        transition: 'color 0.2s',
    },
    checkbox: {
        width: '20px',
        height: '20px',
        flexShrink: 0,
    }
};

export const messageStyles: { [key: string]: CSSProperties } = {
    channelList: { display: 'flex', flexDirection: 'column', gap: '10px' },
    channelListItem: {
        backgroundColor: 'white',
        padding: '15px 20px',
        borderRadius: '12px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        borderLeft: '4px solid #3498db',
    },
    channelName: { fontWeight: 600, fontSize: '1.1em', color: '#2c3e50', marginBottom: '5px' },
    lastMessage: { color: '#7f8c8d', fontSize: '0.9em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    messagesContainer: { flexGrow: 1, padding: '10px', display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' },
    messageBubble: {
        padding: '10px 15px',
        borderRadius: '18px',
        maxWidth: '75%',
        display: 'flex',
        flexDirection: 'column',
    },
    messageBubbleSelf: {
        backgroundColor: '#dcf8c6',
        alignSelf: 'flex-end',
        borderBottomRightRadius: '4px',
    },
    messageBubbleOther: {
        backgroundColor: 'white',
        alignSelf: 'flex-start',
        borderBottomLeftRadius: '4px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    },
    messageSender: { fontWeight: 'bold', fontSize: '0.8em', marginBottom: '4px', color: '#3498db' },
    messageContent: { margin: 0, whiteSpace: 'pre-wrap', wordWrap: 'break-word' },
    messageTimestamp: { fontSize: '0.75em', color: '#95a5a6', alignSelf: 'flex-end', marginTop: '5px' },
    chatInputForm: {
        display: 'flex',
        gap: '10px',
        padding: '10px',
        backgroundColor: 'white',
        borderTop: '1px solid #ecf0f1',
    },
    chatInput: {
        flexGrow: 1,
        border: '1px solid #dfe6e9',
        borderRadius: '20px',
        padding: '10px 15px',
        fontSize: '1em',
    },
    sendButton: {
        borderRadius: '50%',
        width: '44px',
        height: '44px',
        padding: 0,
        fontSize: '1.5em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
};

export const photoAlbumStyles: { [key: string]: CSSProperties } = {
    actionButtons: {
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
    },
    albumGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
    },
    albumTile: {
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        display: 'flex',
        flexDirection: 'column',
    },
    albumCoverImage: {
        width: '100%',
        height: '180px',
        objectFit: 'cover',
        backgroundColor: '#ecf0f1',
    },
    albumInfo: {
        padding: '15px',
        flexGrow: 1,
    },
    albumTitle: {
        fontSize: '1.2em',
        fontWeight: 600,
        color: '#2c3e50',
        margin: '0 0 5px 0',
    },
    albumDescription: {
        fontSize: '0.9em',
        color: '#7f8c8d',
        margin: 0,
    },
    photoGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '15px',
    },
    photoWrapper: {
        position: 'relative',
        paddingBottom: '100%', // 1:1 Aspect Ratio
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: '#f0f2f5',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
    photo: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    cameraView: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '15px',
    },
    cameraVideo: {
        width: '100%',
        borderRadius: '8px',
        border: '1px solid #dfe6e9',
    },
    cameraOutput: {
        width: '100%',
        borderRadius: '8px',
        border: '1px solid #dfe6e9',
    },
};

export const movieNightStyles: { [key: string]: CSSProperties } = {
    actionsContainer: {
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
        flexWrap: 'wrap',
    },
    suggestionGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
    },
    suggestionCard: {
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        border: '3px solid transparent',
        transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.3s',
        position: 'relative',
    },
    suggestionPoster: {
        width: '100%',
        height: '200px',
        objectFit: 'cover',
        backgroundColor: '#ecf0f1',
    },
    suggestionBody: {
        padding: '15px',
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    suggestionTitle: {
        fontSize: '1.2em',
        fontWeight: 600,
        color: '#2c3e50',
        margin: '0 0 8px 0',
    },
    suggestionDesc: {
        fontSize: '0.9em',
        color: '#7f8c8d',
        margin: '0 0 15px 0',
        lineHeight: 1.4,
        flexGrow: 1,
    },
    suggestedBy: {
        fontSize: '0.8em',
        color: '#95a5a6',
        marginBottom: '15px',
    },
    voteInfo: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    voteCount: {
        fontWeight: 'bold',
        fontSize: '1.1em',
    },
    voteButton: {
        padding: '8px 16px',
        fontSize: '0.9em',
    },
    votedButton: {
        backgroundColor: '#2ecc71', // green for voted
    },
    winnerCard: {
        borderColor: '#f1c40f',
        boxShadow: '0 10px 30px rgba(241, 196, 15, 0.4)',
    },
    winnerBanner: {
        position: 'absolute',
        top: '10px',
        right: '-30px',
        backgroundColor: '#f1c40f',
        color: 'white',
        padding: '5px 30px',
        transform: 'rotate(45deg)',
        fontSize: '1em',
        fontWeight: 'bold',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    }
};

export const readingCornerStyles: { [key: string]: CSSProperties } = {
    actionsContainer: {
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
        flexWrap: 'wrap',
    },
    listHeader: {
        fontSize: '1.4em',
        fontWeight: 700,
        color: '#34495e',
        paddingBottom: '10px',
        borderBottom: '2px solid #ecf0f1',
        marginBottom: '20px',
        marginTop: '20px',
    },
    bookGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px',
    },
    bookCard: {
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
        display: 'flex',
        gap: '15px',
        padding: '15px',
    },
    bookCover: {
        width: '100px',
        height: '150px',
        objectFit: 'cover',
        borderRadius: '8px',
        backgroundColor: '#ecf0f1',
        flexShrink: 0,
    },
    bookInfo: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        minWidth: 0, // Prevents flex item from overflowing
    },
    bookTitle: {
        fontSize: '1.1em',
        fontWeight: 600,
        color: '#2c3e50',
        margin: '0 0 5px 0',
    },
    bookAuthor: {
        fontSize: '0.9em',
        color: '#7f8c8d',
        margin: '0 0 10px 0',
    },
    progressContainer: {
        marginTop: 'auto',
    },
    progressBar: {
        height: '8px',
        backgroundColor: '#ecf0f1',
        borderRadius: '4px',
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#2ecc71',
        borderRadius: '4px',
        transition: 'width 0.3s ease-in-out',
    },
    progressText: {
        fontSize: '0.8em',
        color: '#7f8c8d',
        marginTop: '5px',
    },
    bookActions: {
        marginTop: '10px',
    },
    finishedOverlay: {
        marginTop: 'auto',
        textAlign: 'center',
        padding: '10px'
    },
    finishedText: {
        fontSize: '1.2em',
        fontWeight: 'bold',
        color: '#27ae60',
    },
    suggestionItem: {
        padding: '15px',
        border: '1px solid #ecf0f1',
        borderRadius: '8px',
        marginBottom: '10px',
    },
    suggestionTitle: {
        fontWeight: 600,
        color: '#2c3e50',
    },
    suggestionAuthor: {
        fontSize: '0.9em',
        color: '#7f8c8d',
    },
    suggestionSummary: {
        fontSize: '0.9em',
        marginTop: '8px',
        lineHeight: 1.4,
    }
};

export const familyGamesStyles: { [key: string]: CSSProperties } = {
    drawingPromptDisplay: {
        backgroundColor: 'white',
        padding: '15px 20px',
        borderRadius: '12px',
        textAlign: 'center',
        fontSize: '1.2em',
        fontWeight: 500,
        marginBottom: '20px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
        color: '#34495e',
    },
    canvasContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '20px',
    },
    drawingCanvas: {
        border: '2px solid #ecf0f1',
        borderRadius: '16px',
        backgroundColor: 'white',
        touchAction: 'none',
        cursor: 'crosshair',
        width: '100%',
        maxWidth: '400px',
        aspectRatio: '1 / 1',
    },
    drawingControls: {
        display: 'flex',
        justifyContent: 'space-around',
        gap: '10px',
        flexWrap: 'wrap',
    },
    resultModalContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '10px',
    },
    resultText: {
        fontSize: '1.2em',
        margin: 0,
        color: '#34495e',
    },
};

export const tripPlannerStyles: { [key: string]: CSSProperties } = {
    tripCard: {
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        display: 'flex',
        flexDirection: 'column',
    },
    tripCardImage: {
        width: '100%',
        height: '180px',
        objectFit: 'cover',
        backgroundColor: '#ecf0f1',
    },
    tripCardInfo: {
        padding: '15px',
        flexGrow: 1,
    },
    tripCardTitle: {
        fontSize: '1.3em',
        fontWeight: 600,
        color: '#2c3e50',
        margin: '0 0 5px 0',
    },
    tripCardDetails: {
        fontSize: '0.9em',
        color: '#7f8c8d',
        margin: 0,
    },
    tabs: {
        display: 'flex',
        borderBottom: '2px solid #ecf0f1',
        marginBottom: '20px',
    },
    tabButton: {
        padding: '10px 20px',
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        fontSize: '1em',
        fontWeight: 600,
        color: '#7f8c8d',
        borderBottom: '3px solid transparent',
        marginBottom: '-2px',
    },
    tabButtonActive: {
        color: '#3498db',
        borderBottomColor: '#3498db',
    },
    itineraryDay: {
        marginBottom: '20px',
    },
    itineraryDayHeader: {
        fontSize: '1.2em',
        fontWeight: 700,
        color: '#34495e',
        paddingBottom: '8px',
        borderBottom: '2px solid #ecf0f1',
        marginBottom: '15px',
    },
    activityCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        padding: '15px',
        marginBottom: '10px',
        borderLeft: '4px solid #1abc9c',
    },
    activityTitle: {
        fontWeight: 600,
        color: '#2c3e50',
    },
    activityTime: {
        fontSize: '0.8em',
        fontWeight: 500,
        color: '#95a5a6',
        textTransform: 'uppercase',
        marginBottom: '5px',
    },
    packingListItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 0',
        borderBottom: '1px solid #ecf0f1',
    },
    packingListItemName: {
        flexGrow: 1,
        fontSize: '1.05em',
    },
    packingListItemChecked: {
        textDecoration: 'line-through',
        color: '#95a5a6',
    },
    checkbox: {
        width: '20px',
        height: '20px',
        flexShrink: 0,
    }
};

export const financeHubStyles: { [key: string]: CSSProperties } = {
    progressBarContainer: {
        width: '100%',
        height: '24px',
        backgroundColor: '#ecf0f1',
        borderRadius: '12px',
        overflow: 'hidden',
        position: 'relative',
        marginTop: '10px',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#3498db',
        borderRadius: '12px',
        transition: 'width 0.5s ease-in-out',
    },
    progressBarText: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#2c3e50',
        fontWeight: 600,
        fontSize: '0.9em',
    },
    savingsGoalCard: {
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
    },
    savingsGoalImage: {
        width: '100%',
        height: '150px',
        objectFit: 'cover',
        backgroundColor: '#ecf0f1',
    },
    savingsGoalInfo: {
        padding: '15px',
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    savingsGoalTitle: {
        fontSize: '1.2em',
        fontWeight: 600,
        color: '#2c3e50',
        margin: '0 0 10px 0',
    },
    savingsGoalProgressText: {
        fontSize: '0.9em',
        color: '#7f8c8d',
        marginBottom: '5px',
    }
};

export const homeProjectStyles: { [key: string]: CSSProperties } = {
    projectCard: {
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
        padding: '20px',
        marginBottom: '20px',
    },
    projectHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
    },
    projectTitle: {
        fontSize: '1.3em',
        fontWeight: 600,
        color: '#2c3e50',
        margin: 0,
    },
    statusBadge: {
        padding: '5px 12px',
        borderRadius: '12px',
        fontSize: '0.85em',
        fontWeight: 'bold',
        color: 'white',
    },
    projectDescription: {
        color: '#555',
        marginBottom: '15px',
    },
    projectProgressText: {
        fontSize: '0.9em',
        color: '#7f8c8d',
        marginBottom: '5px',
    },
    projectTaskList: {
        marginTop: '15px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    projectTaskItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px',
        backgroundColor: '#f8f9fa',
        borderRadius: '6px',
    },
};

export const serviceContactStyles: { [key: string]: CSSProperties } = {
    searchContainer: {
        marginBottom: '20px',
    },
    searchInput: {
        width: 'calc(100% - 24px)', // Adjust for padding
        padding: '12px',
        border: '1px solid #dfe6e9',
        borderRadius: '8px',
        fontSize: '1em',
    },
    contactCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        padding: '15px',
        marginBottom: '10px',
        borderLeft: '4px solid #1abc9c',
    },
    contactName: {
        fontSize: '1.2em',
        fontWeight: 600,
        color: '#2c3e50',
        margin: '0 0 5px 0',
    },
    contactInfo: {
        fontSize: '0.95em',
        color: '#555',
        margin: '3px 0',
    },
    contactNotes: {
        fontSize: '0.9em',
        color: '#7f8c8d',
        fontStyle: 'italic',
        marginTop: '8px',
    },
};

export const skillsTrackerStyles: { [key: string]: CSSProperties } = {
    skillCard: {
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
        padding: '20px',
        marginBottom: '20px',
    },
    skillHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '10px',
    },
    skillTitle: {
        fontSize: '1.3em',
        fontWeight: 600,
        color: '#2c3e50',
        margin: 0,
    },
    levelBadge: {
        padding: '5px 12px',
        borderRadius: '12px',
        fontSize: '0.85em',
        fontWeight: 'bold',
        color: 'white',
        backgroundColor: '#9b59b6', // Amethyst color for skills
    },
    xpText: {
        fontSize: '0.9em',
        color: '#7f8c8d',
        marginBottom: '5px',
        textAlign: 'right',
    },
    milestoneList: {
        marginTop: '15px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    milestoneItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px',
        backgroundColor: '#f8f9fa',
        borderRadius: '6px',
    },
};

export const routineBuilderStyles: { [key: string]: CSSProperties } = {
    routineCard: {
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
        padding: '20px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '15px',
    },
    routineInfo: {
        flexGrow: 1,
    },
    routineTitle: {
        fontSize: '1.3em',
        fontWeight: 600,
        color: '#2c3e50',
        margin: '0 0 5px 0',
    },
    streakCounter: {
        fontSize: '1.1em',
        fontWeight: 'bold',
        color: '#e67e22',
    },
    heatmapContainer: {
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
    },
    heatmapGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '4px',
    },
    heatmapCell: {
        width: '100%',
        paddingBottom: '100%', // Creates a square aspect ratio
        borderRadius: '4px',
        backgroundColor: '#ebedf0',
    },
};

export const homeworkHelperStyles: { [key: string]: CSSProperties } = {
    homeworkHelperTabs: {
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
    },
    homeworkHelperTab: {
        ...pageStyles.button,
        backgroundColor: pageStyles.buttonSecondary.backgroundColor,
        flex: 1,
    },
    homeworkHelperTabActive: {
        ...pageStyles.button,
        flex: 1,
    },
};

export const shoutOutsStyles: { [key: string]: CSSProperties } = {
    shoutOutCard: {
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
        borderLeft: '5px solid #f1c40f',
    },
    shoutOutHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '15px',
    },
    shoutOutAvatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#ecf0f1',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '1.2em',
        fontWeight: 'bold',
        color: '#bdc3c7',
    },
    shoutOutHeaderText: {
        fontWeight: 600,
        color: '#34495e',
    },
    shoutOutMessage: {
        fontSize: '1.1em',
        fontStyle: 'italic',
        color: '#2c3e50',
        padding: '15px',
        backgroundColor: '#fdfdfd',
        border: '1px solid #f0f2f5',
        borderRadius: '8px',
        margin: '0 0 15px 0',
    },
    shoutOutFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    reactionsContainer: {
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
    },
    reactionBubble: {
        backgroundColor: '#f0f2f5',
        borderRadius: '15px',
        padding: '5px 10px',
        fontSize: '0.9em',
        cursor: 'default',
    },
    emojiPicker: {
        display: 'flex',
        gap: '10px',
        backgroundColor: 'white',
        padding: '8px',
        borderRadius: '20px',
        boxShadow: '0 4px 12px rgba(0,0,0,.15)',
    },
    emojiButton: {
        background: 'none',
        border: 'none',
        fontSize: '1.5em',
        cursor: 'pointer',
        transition: 'transform 0.2s',
    },
};

export const lockerRoomStyles: { [key: string]: CSSProperties } = {
    whatsNextCard: {
        backgroundColor: '#3498db',
        color: 'white',
        padding: '25px',
        borderRadius: '20px',
        marginBottom: '25px',
        boxShadow: '0 10px 20px rgba(52, 152, 219, 0.3)',
    },
    whatsNextTitle: {
        fontSize: '1.2em',
        fontWeight: 600,
        margin: '0 0 5px 0',
        opacity: 0.8,
        textTransform: 'uppercase',
        letterSpacing: '1px',
    },
    whatsNextActivity: {
        fontSize: '2em',
        fontWeight: 'bold',
        margin: '0 0 10px 0',
    },
    whatsNextDetails: {
        fontSize: '1.1em',
        margin: 0,
    },
    activityCard: {
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
        padding: '20px',
        marginBottom: '20px',
    },
    activityHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px',
        flexWrap: 'wrap',
        gap: '10px',
    },
    activityTitle: {
        fontSize: '1.4em',
        fontWeight: 600,
        color: '#2c3e50',
        margin: 0,
    },
    activityTypeBadge: {
        padding: '5px 12px',
        borderRadius: '12px',
        fontSize: '0.85em',
        fontWeight: 'bold',
        color: 'white',
        backgroundColor: '#95a5a6'
    },
    activityDetailsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '20px',
    },
    activityDetailItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '0.95em',
    },
    gearChecklist: {
        marginTop: '20px',
        borderTop: '1px solid #f0f2f5',
        paddingTop: '20px',
    },
    gearChecklistTitle: {
        fontSize: '1.1em',
        fontWeight: 600,
        marginBottom: '10px',
    },
    gearItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        marginBottom: '8px',
    },
    gearItemName: {
        flexGrow: 1,
        transition: 'color 0.2s, text-decoration 0.2s',
    },
    gearItemPacked: {
        color: '#95a5a6',
        textDecoration: 'line-through',
    },
};

export const smartHomeStyles: { [key: string]: CSSProperties } = {
    sceneGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '15px',
        marginBottom: '20px',
    },
    sceneButton: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '20px 10px',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        border: '1px solid #eef2f7',
        cursor: 'pointer',
        textAlign: 'center',
        transition: 'transform 0.2s, box-shadow 0.2s',
    },
    sceneIcon: {
        fontSize: '2em',
    },
    sceneName: {
        fontWeight: 600,
        color: '#34495e',
    },
    roomHeader: {
        fontSize: '1.2em',
        fontWeight: 700,
        color: '#34495e',
        paddingBottom: '8px',
        borderBottom: '2px solid #ecf0f1',
        marginBottom: '15px',
        marginTop: '25px',
    },
    deviceGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '15px',
    },
    deviceCard: {
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '15px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        border: '1px solid #eef2f7',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        position: 'relative',
    },
    deviceHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    deviceIcon: {
        fontSize: '1.5em',
    },
    deviceName: {
        fontWeight: 600,
        fontSize: '1.1em',
        color: '#2c3e50',
    },
    deviceControls: {
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        minHeight: '50px',
    },
    thermostatDisplay: {
        fontSize: '2.5em',
        fontWeight: 'bold',
        fontFamily: "'Nunito', sans-serif",
    },
    controlButton: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5em',
        padding: 0,
    },
    lockStatus: {
        fontSize: '1.2em',
        fontWeight: 600,
    },
    disconnectedOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '16px',
        color: '#7f8c8d',
        fontWeight: 'bold',
        fontSize: '1.1em',
        backdropFilter: 'blur(2px)',
    },
    switch: {
        position: 'relative',
        display: 'inline-block',
        width: '60px',
        height: '34px',
    },
    switchInput: {
        opacity: 0,
        width: 0,
        height: 0,
    },
    slider: {
        position: 'absolute',
        cursor: 'pointer',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: '#ccc',
        transition: '.4s',
        borderRadius: '34px',
    },
    sliderBefore: {
        position: 'absolute',
        height: '26px',
        width: '26px',
        left: '4px',
        bottom: '4px',
        backgroundColor: 'white',
        transition: '.4s',
        borderRadius: '50%',
    },
};


export const styles = { ...pageStyles, ...dashboardStyles, ...mealPlanStyles, ...allowanceStyles, ...choreStyles, ...shoppingListStyles, ...messageStyles, ...photoAlbumStyles, ...movieNightStyles, ...readingCornerStyles, ...familyGamesStyles, ...tripPlannerStyles, ...financeHubStyles, ...homeProjectStyles, ...serviceContactStyles, ...skillsTrackerStyles, ...routineBuilderStyles, ...homeworkHelperStyles, ...shoutOutsStyles, ...lockerRoomStyles, ...smartHomeStyles };