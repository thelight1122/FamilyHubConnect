
import type { CSSProperties } from 'react';

// --- Consolidated Styles ---
export const styles: { [key: string]: CSSProperties } = {
    // --- layout.ts ---
    appLayout: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'var(--background-color, #f0f4f8)',
        color: 'var(--text-color, #333)',
        fontFamily: 'var(--font-family-body, "Nunito", sans-serif)',
    },
    pageContainer: {
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        flexGrow: 1,
    },
    mainContentPane: {
        flexGrow: 1,
        paddingTop: '60px', // Space for fixed top bar
        paddingBottom: '65px', // Space for fixed bottom nav bar
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease-in-out',
    },
    container: {
        flex: 1,
        width: '100%',
        padding: '20px',
    },
    section: {
        backgroundColor: 'var(--section-bg, white)',
        padding: '20px',
        borderRadius: 'var(--border-radius-main, 8px)',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        border: '1px solid #d1d9e6',
    },
    sectionTitle: {
        fontSize: '1.5em',
        fontFamily: 'var(--font-family-header, "Nunito", sans-serif)',
        color: 'var(--text-color, #333)',
        marginBottom: '15px',
        paddingBottom: '10px',
        borderBottom: '2px solid var(--primary-color, #4a90e2)',
        marginTop: 0,
    },
    pageHeader: {
        fontSize: '2em',
        fontWeight: 700,
        fontFamily: 'var(--font-family-header, "Nunito", sans-serif)',
        color: 'var(--text-color, #333)',
        marginBottom: '20px',
        textAlign: 'center',
    },
    emptyStateContainer: {
        textAlign: 'center',
        padding: '40px 20px',
        backgroundColor: 'rgba(0,0,0,0.02)',
        borderRadius: 'var(--border-radius-main, 8px)',
        border: '1px dashed #ccc',
        margin: '20px 0',
    },
    emptyStateIcon: {
        fontSize: '3em',
        marginBottom: '10px',
    },
    emptyStateTitle: {
        fontSize: '1.4em',
        margin: '0 0 10px 0',
    },
    emptyStateMessage: {
        color: '#6c757d',
        maxWidth: '400px',
        margin: '0 auto',
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        color: '#6c757d',
    },
    loadingMessage: {
        textAlign: 'center',
        padding: '40px 20px',
        fontSize: '1.2em',
        color: '#6c757d',
    },
    listItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px',
        backgroundColor: 'transparent',
        border: '1px solid #dee2e6',
        borderRadius: 'var(--border-radius-main, 8px)',
        marginBottom: '10px',
        transition: 'all 0.2s ease',
        textAlign: 'left',
        width: '100%',
    },
    listItemContent: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        flexGrow: 1,
    },
    listItemActions: {
        display: 'flex',
        gap: '10px',
        marginLeft: '15px',
    },
    spinner: {
        border: '4px solid #f3f3f3',
        borderTop: '4px solid var(--primary-color, #4a90e2)',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        animation: 'spin 1s linear infinite',
        marginBottom: '10px'
    },
    // --- forms.ts ---
    formGroup: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 600,
        color: 'var(--text-color, #333)',
        fontFamily: 'var(--font-family-header, "Nunito", sans-serif)',
    },
    input: {
        width: '100%',
        padding: '12px',
        borderRadius: 'var(--border-radius-main, 4px)',
        border: '1px solid #ccc',
        fontSize: '1em',
        backgroundColor: 'white',
        boxSizing: 'border-box',
        fontFamily: 'var(--font-family-body, "Nunito", sans-serif)',
    },
    selectInput: {
        width: '100%',
        padding: '12px',
        borderRadius: 'var(--border-radius-main, 4px)',
        border: '1px solid #ccc',
        fontSize: '1em',
        backgroundColor: 'white',
        cursor: 'pointer',
        boxSizing: 'border-box',
        fontFamily: 'var(--font-family-body, "Nunito", sans-serif)',
    },
    textarea: {
        width: '100%',
        padding: '10px',
        borderRadius: 'var(--border-radius-main, 4px)',
        border: '1px solid #ccc',
        fontSize: '1em',
        backgroundColor: 'white',
        boxSizing: 'border-box',
        minHeight: '80px',
        resize: 'vertical',
        fontFamily: 'var(--font-family-body, "Nunito", sans-serif)',
    },
    checkbox: {
        marginRight: '10px',
        transform: 'scale(1.2)',
    },
    checkboxLabel: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
    },
    button: {
        backgroundColor: 'var(--button-bg, #4a90e2)',
        color: 'var(--button-text, white)',
        border: 'none',
        padding: '12px 20px',
        borderRadius: 'var(--border-radius-main, 6px)',
        cursor: 'pointer',
        fontSize: '1em',
        fontWeight: 600,
        transition: 'background-color 0.3s ease, transform 0.1s ease',
        width: '100%',
        fontFamily: 'var(--font-family-header, "Nunito", sans-serif)',
    },
    buttonSecondary: {
        backgroundColor: 'var(--secondary-color, #6c757d)',
    },
    buttonDanger: {
        backgroundColor: '#dc3545',
        color: 'white',
    },
    buttonSuccess: {
        backgroundColor: '#28a745',
        color: 'white',
    },
    buttonWarning: {
        backgroundColor: '#ffc107',
        color: '#212529', // Dark text for yellow background
    },
    buttonInfo: {
        backgroundColor: '#17a2b8',
        color: 'white',
    },
    formGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        alignItems: 'end',
    },
    formGrid2Col: { // Added for more specific layouts
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
    },
    // --- modals.ts ---
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'var(--modal-overlay-bg, rgba(0, 0, 0, 0.6))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1200,
        padding: '20px',
    },
    modalContent: {
        backgroundColor: 'var(--section-bg, white)',
        padding: '25px',
        borderRadius: 'var(--border-radius-main, 8px)',
        boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
        position: 'relative',
        width: '100%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflowY: 'auto',
    },
    modalCloseButton: {
        position: 'absolute',
        top: '10px',
        right: '15px',
        background: 'none',
        border: 'none',
        fontSize: '2em',
        color: '#aaa',
        cursor: 'pointer',
    },
    modalTitle: {
        marginTop: 0,
        marginBottom: '20px',
        fontSize: '1.6em',
        color: 'var(--text-color, #333)',
        textAlign: 'center',
        fontFamily: 'var(--font-family-header, "Nunito", sans-serif)',
    },
    modalActions: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
        marginTop: '25px',
    },
    modalButton: {
        width: 'auto',
        minWidth: '100px',
    },
    // --- navigation.ts ---
    topBar: {
        backgroundColor: 'var(--top-bar-bg, #34495e)',
        color: 'var(--top-bar-text, white)',
        padding: '0 20px',
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        alignItems: 'center',
        height: '60px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        gap: '15px',
    },
    topBarBackButton: {
        background: 'none',
        border: 'none',
        color: 'var(--top-bar-text, #ecf0f1)',
        fontSize: '1.8em',
        cursor: 'pointer',
        padding: '0',
        transition: 'color 0.2s ease',
        justifySelf: 'start',
    },
    topBarTitle: {
        fontSize: '1.6em',
        fontWeight: 700,
        fontFamily: 'var(--font-family-header, "Nunito", sans-serif)',
        color: 'var(--header-text, #ecf0f1)',
        textAlign: 'center',
    },
    topBarCrest: {
        height: '45px',
        maxHeight: '45px',
        objectFit: 'contain',
        justifySelf: 'center',
    },
    topBarNavIcons: {
        display: 'flex',
        gap: '15px',
        justifySelf: 'end',
    },
    topBarIcon: {
        position: 'relative',
        background: 'none',
        border: 'none',
        color: 'var(--top-bar-text, #bdc3c7)',
        fontSize: '2em',
        cursor: 'pointer',
        padding: '5px',
        transition: 'color 0.2s ease',
    },
    topBarIconLabel: {
        position: 'absolute',
        bottom: '-20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '3px 8px',
        borderRadius: '4px',
        fontSize: '0.8em',
        whiteSpace: 'nowrap',
        opacity: 0,
        transition: 'opacity 0.2s ease, bottom 0.2s ease',
        pointerEvents: 'none',
    },
    notificationIndicator: {
        position: 'absolute',
        top: '5px',
        right: '5px',
        width: '10px',
        height: '10px',
        backgroundColor: '#e74c3c',
        borderRadius: '50%',
        border: '2px solid var(--top-bar-bg, #34495e)',
    },
    bottomNavBar: {
        backgroundColor: 'var(--top-bar-bg, #34495e)',
        display: 'flex',
        justifyContent: 'space-around',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '65px',
        boxShadow: '0 -2px 5px rgba(0,0,0,0.1)',
        zIndex: 1100,
    },
    bottomNavButton: {
        background: 'none',
        border: 'none',
        color: 'var(--top-bar-text, #bdc3c7)',
        fontFamily: 'var(--font-family-body, "Nunito", sans-serif)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        cursor: 'pointer',
        transition: 'background-color 0.2s, color 0.2s',
        padding: '5px 0',
    },
    bottomNavButtonActive: {
        color: 'white',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    bottomNavIcon: {
        fontSize: '1.8em',
    },
    bottomNavLabel: {
        fontSize: '0.8em',
        marginTop: '2px',
    },
    backButton: {
        background: 'none',
        border: 'none',
        color: 'var(--primary-color, #4a90e2)',
        cursor: 'pointer',
        fontSize: '1em',
        padding: '5px',
        marginBottom: '10px',
    },
    // --- ai.ts ---
    badgeMakerContainer: {
        borderTop: '2px dashed var(--primary-color, #4a90e2)',
        marginTop: '25px',
        paddingTop: '20px',
    },
    badgeMakerForm: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr auto',
        gap: '15px',
        alignItems: 'flex-end',
        marginBottom: '20px',
    },
    badgeMakerIconPicker: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        backgroundColor: '#f8f9fa',
        padding: '10px',
        borderRadius: 'var(--border-radius-main, 8px)',
    },
    badgeMakerIconButton: {
        background: 'none',
        border: '1px solid transparent',
        borderRadius: 'var(--border-radius-main, 8px)',
        padding: '5px',
        fontSize: '1.5em',
        cursor: 'pointer',
    },
    badgeMakerIconButtonSelected: {
        borderColor: 'var(--primary-color, #4a90e2)',
        backgroundColor: 'var(--accent-color-light, #e9f5ff)',
    },
    aiHelperWidget: {
        backgroundColor: 'var(--accent-color-light, #e9f5ff)',
        border: '1px solid var(--primary-color, #4a90e2)',
        borderRadius: 'var(--border-radius-main, 8px)',
        padding: '15px',
        marginTop: '20px',
    },
    aiHelperTitle: {
        fontSize: '1.2em',
        margin: '0 0 10px 0',
        color: 'var(--primary-color, #4a90e2)',
        fontFamily: 'var(--font-family-header, "Nunito", sans-serif)',
    },
    aiSuggestionsContainer: {
        marginTop: '15px',
        paddingTop: '15px',
        borderTop: '1px dashed var(--primary-color, #4a90e2)',
    },
    aiSuggestionItem: {
        background: 'white',
        border: '1px solid #b3d7ff',
        padding: '8px 12px',
        borderRadius: '16px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        color: 'var(--primary-color, #4a90e2)',
    },
    aiError: {
        color: '#721c24',
        backgroundColor: '#f8d7da',
        border: '1px solid #f5c6cb',
        padding: '10px 15px',
        borderRadius: 'var(--border-radius-main, 4px)',
        margin: '10px 0',
        textAlign: 'center',
    },
    // --- dashboard.ts ---
    hubGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
    },
    hubTile: {
        backgroundColor: 'var(--tile-bg, white)',
        padding: '20px',
        borderRadius: 'var(--border-radius-main, 8px)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        border: '1px solid #d1d9e6',
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        display: 'flex',
        flexDirection: 'column',
    },
    hubTileTitle: {
        fontSize: '1.3em',
        fontFamily: 'var(--font-family-header, "Nunito", sans-serif)',
        color: 'var(--text-color, #333)',
        marginBottom: '10px',
        marginTop: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    hubTileDescription: {
        fontSize: '0.9em',
        color: '#666',
        lineHeight: 1.5,
        flexGrow: 1,
    },
    hubTileIcon: {
        fontSize: '1.5em',
    },
    hubTileNotificationBadge: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        width: '12px',
        height: '12px',
        backgroundColor: '#e74c3c',
        borderRadius: '50%',
        border: '2px solid var(--tile-bg, white)',
    },
    dashboardMotto: {
        fontSize: '1.2em',
        fontStyle: 'italic',
        fontFamily: 'var(--font-family-header, "Caveat", cursive)',
        color: 'var(--primary-color, #4a90e2)',
        textAlign: 'center',
        marginBottom: '15px',
    },
    viewAsContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        marginBottom: '20px',
    },
    memberInfoFrame: {
        padding: '15px',
        border: '2px solid var(--primary-color, #4a90e2)',
        borderRadius: 'var(--border-radius-main, 8px)',
        backgroundColor: 'var(--accent-color-light, #e9f5ff)',
    },
    memberInfoName: {
        fontSize: '1.8em',
        margin: '0 0 5px 0',
        fontFamily: 'var(--font-family-header, "Nunito", sans-serif)',
    },
    memberInfoRolePoints: {
        display: 'flex',
        gap: '10px',
        justifyContent: 'center',
        marginBottom: '10px',
    },
    aiBriefingContainerDashboard: {
        backgroundColor: 'var(--section-bg, white)',
        padding: '15px',
        borderRadius: 'var(--border-radius-main, 8px)',
        marginBottom: '20px',
        border: '1px solid #d1d9e6',
        textAlign: 'center',
    },
    aiBriefingTextDashboard: {
        margin: 0,
        fontSize: '1.1em',
        fontStyle: 'italic',
        color: '#555',
    },
    widgetTile: {
        gridColumn: '1 / -1', // Span full width
        backgroundColor: 'var(--tile-bg, white)',
        padding: '20px',
        borderRadius: 'var(--border-radius-main, 8px)',
        border: '1px solid #d1d9e6',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        textAlign: 'left',
    },
    widgetTitle: {
        fontSize: '1.3em',
        margin: '0 0 10px 0',
        fontFamily: 'var(--font-family-header, "Nunito", sans-serif)',
    },
    widgetSummaryText: {
        fontSize: '1em',
        color: '#666',
        margin: 0,
    },
    widgetContentList: {
        listStyle: 'none',
        padding: 0,
        margin: '10px 0 0 0',
    },
    widgetContentItem: {
        padding: '5px 0',
        borderBottom: '1px solid #f0f0f0',
    },
    widgetMoreText: {
        color: 'var(--primary-color, #4a90e2)',
        fontSize: '0.9em',
        margin: '10px 0 0 0',
    },
    shoutOutDashboardWidget: {
        backgroundColor: '#fffbe6',
        border: '1px solid #ffe58f',
        borderRadius: '4px',
        padding: '20px',
        marginBottom: '20px',
        textAlign: 'center',
        fontFamily: "'Caveat', cursive",
        cursor: 'pointer',
        position: 'relative',
        boxShadow: '2px 2px 5px rgba(0,0,0,0.1)',
        transform: 'rotate(-1deg)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        width: '100%',
    },
    shoutOutPin: {
        position: 'absolute',
        top: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '15px',
        height: '15px',
        backgroundColor: '#e74c3c',
        borderRadius: '50%',
        boxShadow: '0 0 3px rgba(0,0,0,0.4)',
        border: '2px solid white',
    },
    shoutOutDashboardWidgetQuote: {
        fontSize: '1.5em',
        margin: '10px 0',
        fontStyle: 'italic',
        color: '#333',
    },
    shoutOutDashboardWidgetFrom: {
        fontSize: '1em',
        color: '#666',
        textAlign: 'right',
        margin: '10px 0 0 0',
    },
    // --- chores.ts ---
    choreCard: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px',
        backgroundColor: '#fff',
        border: '1px solid #dee2e6',
        borderRadius: 'var(--border-radius-main, 8px)',
        marginBottom: '10px',
        borderLeft: '5px solid #ccc',
        transition: 'all 0.2s',
    },
    choreCardContent: {
        display: 'flex',
        justifyContent: 'space-between',
        flexGrow: 1,
        alignItems: 'center',
    },
    choreCardDetails: {
        flexGrow: 1,
    },
    choreCardTitle: {
        fontSize: '1.2em',
        fontWeight: 600,
        margin: '0 0 5px 0',
    },
    choreCardMeta: {
        fontSize: '0.9em',
        color: '#666',
        margin: '0 0 5px 0',
    },
    choreCardStatus: {
        color: 'white',
        padding: '4px 10px',
        borderRadius: '12px',
        fontSize: '0.8em',
        fontWeight: 'bold',
        textTransform: 'capitalize',
        marginBottom: '10px',
    },
    choreCardActions: {
        marginTop: '10px',
    },
    choreRejectionReason: {
        backgroundColor: 'rgba(220, 53, 69, 0.1)',
        color: '#721c24',
        borderTop: '2px solid #dc3545',
        padding: '10px',
        marginTop: '10px',
        borderRadius: '0 0 8px 8px',
        margin: '10px -15px -15px',
    },
    bonusTodoSection: {
        backgroundColor: '#fffbe6',
        border: '1px solid #ffe58f',
        padding: '20px',
        borderRadius: 'var(--border-radius-main, 8px)',
        marginBottom: '20px',
    },
    // --- calendar.ts ---
    calendarHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    calendarMonthYear: {
        fontSize: '1.5em',
        margin: 0,
    },
    calendarNavButton: {
        background: 'none',
        border: '1px solid #ccc',
        borderRadius: 'var(--border-radius-main, 8px)',
        padding: '8px 12px',
        cursor: 'pointer',
    },
    calendarGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '5px',
    },
    calendarDayHeader: {
        textAlign: 'center',
        fontWeight: 'bold',
        paddingBottom: '10px',
    },
    calendarDayCell: {
        border: '1px solid #eee',
        minHeight: '120px',
        padding: '8px',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    calendarDayCellNotInMonth: {
        backgroundColor: '#f9f9f9',
        color: '#ccc',
    },
    calendarDayToday: {
        backgroundColor: 'var(--accent-color-light, #e9f5ff)',
    },
    calendarDayNumber: {
        textAlign: 'right',
        fontSize: '0.9em',
    },
    calendarDayNumberToday: {
        textAlign: 'right',
        fontWeight: 'bold',
        color: 'var(--primary-color, #4a90e2)',
    },
    calendarTodoItem: {
        fontSize: '0.8em',
        padding: '3px 5px',
        borderRadius: '4px',
        backgroundColor: '#fffbe6',
        border: '1px solid #ffe58f',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
    },
    calendarEventItem: {
        fontSize: '0.8em',
        padding: '3px 5px',
        borderRadius: '4px',
        backgroundColor: '#e9f5ff',
        border: '1px solid #b3d7ff',
        fontWeight: 'bold',
    },
    calendarTodoStatusDot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        flexShrink: 0,
    },
    calendarTripItem: {
        fontSize: '0.8em',
        padding: '3px 5px',
        borderRadius: '4px',
        backgroundColor: '#e4f9e4',
        border: '1px solid #a3e9a3',
        fontWeight: 'bold',
    },
    calendarMealItem: {
        fontSize: '0.8em',
        padding: '3px 5px',
        borderRadius: '4px',
        backgroundColor: '#fdeaea',
        border: '1px solid #f9c5c5',
    },
    calendarEventSyncedIcon: {
        marginRight: '5px',
    },
    // --- mealPlan.ts ---
    mealPlanGrid: {
        display: 'grid',
        gridTemplateColumns: 'auto repeat(7, 1fr)',
        gap: '5px',
        marginTop: '20px',
    },
    mealPlanGridHeader: {
        padding: '10px',
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: 'var(--accent-color-light, #e9f5ff)',
        borderRadius: '4px',
        minWidth: '80px',
    },
    mealPlanCell: {
        border: '1px solid #eee',
        minHeight: '80px',
        padding: '8px',
        borderRadius: '4px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
    mealPlanCellContent: {
        textAlign: 'center',
        width: '100%',
        position: 'relative',
    },
    mealPlanClearButton: {
        position: 'absolute',
        top: '2px',
        right: '2px',
        background: 'rgba(0,0,0,0.4)',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '20px',
        height: '20px',
        cursor: 'pointer',
        lineHeight: '20px',
        textAlign: 'center',
        fontSize: '1em',
        transition: 'background-color 0.2s',
    },
    mealPlanAddButton: {
        background: 'none',
        border: '2px dashed #ccc',
        borderRadius: '50%',
        color: '#ccc',
        width: '30px',
        height: '30px',
        fontSize: '1.5em',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    // --- auth.ts ---
    landingPageContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        padding: '20px',
    },
    header: {
        marginBottom: '30px',
    },
    headerTitle: {
        fontSize: '3em',
        fontFamily: 'var(--font-family-header, "Caveat", cursive)',
        marginBottom: '10px',
        color: 'var(--primary-color, #4a90e2)',
    },
    headerSubtitle: {
        fontSize: '1.2em',
        color: '#666',
    },
    landingNavButtons: {
        display: 'flex',
        gap: '15px',
    },
    landingButton: {
        fontSize: '1.2em',
        padding: '15px 30px',
        border: 'none',
        borderRadius: 'var(--border-radius-main, 8px)',
        color: 'white',
        cursor: 'pointer',
    },
    featureGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
    },
    featureCard: {
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: 'var(--border-radius-main, 8px)',
    },
    featureTitle: {
        fontSize: '1.3em',
        marginTop: 0,
    },
    listIcon: {
        color: '#28a745',
    },
    setupStepCard: {
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: 'var(--border-radius-main, 8px)',
        border: '1px solid #dee2e6',
        marginBottom: '20px',
    },
    authContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
    },
    authForm: {
        width: '100%',
        maxWidth: '400px',
        padding: '30px',
        backgroundColor: 'var(--section-bg, white)',
        borderRadius: 'var(--border-radius-main, 8px)',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    },
    authTitle: {
        textAlign: 'center',
        marginBottom: '25px',
    },
    authToggleButton: {
        background: 'none',
        border: 'none',
        color: 'var(--primary-color, #4a90e2)',
        cursor: 'pointer',
        marginTop: '15px',
        width: '100%',
    },
    // --- storyGenerator.ts ---
    storyPromptForm: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        backgroundColor: 'var(--section-bg, white)',
        padding: '20px',
        borderRadius: 'var(--border-radius-main, 8px)',
        border: '1px solid #d1d9e6',
    },
    storyGeneratorButtonPrimary: {
        gridColumn: '1 / -1',
        backgroundColor: 'var(--primary-color, #4a90e2)',
        color: 'white',
        border: 'none',
        padding: '12px 20px',
        borderRadius: 'var(--border-radius-main, 6px)',
        cursor: 'pointer',
        fontSize: '1em',
        fontWeight: 600,
    },
    storyGeneratorButtonSecondary: {
        gridColumn: '1 / -1',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        padding: '12px 20px',
        borderRadius: 'var(--border-radius-main, 6px)',
        cursor: 'pointer',
        fontSize: '1em',
        fontWeight: 600,
    },
    storyResultContainer: {
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        gap: '20px',
        marginTop: '20px',
        backgroundColor: 'var(--section-bg, white)',
        padding: '20px',
        borderRadius: 'var(--border-radius-main, 8px)',
        border: '1px solid #d1d9e6',
    },
    storyImageColumn: {},
    storyTextColumn: {},
    storyResultHeader: {
        marginTop: 0,
    },
    storyImagePlaceholder: {
        width: '100%',
        aspectRatio: '1 / 1',
        backgroundColor: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ccc',
        borderRadius: 'var(--border-radius-main, 8px)',
    },
    storyImage: {
        width: '100%',
        height: 'auto',
        borderRadius: 'var(--border-radius-main, 8px)',
    },
    storyTextPlaceholder: {
        backgroundColor: '#f0f0f0',
        minHeight: '200px',
        borderRadius: 'var(--border-radius-main, 8px)',
        padding: '15px',
        color: '#ccc'
    },
    storyTextArea: {
        whiteSpace: 'pre-wrap',
        lineHeight: 1.7,
        maxHeight: '400px',
        overflowY: 'auto',
        paddingRight: '10px',
    },
    // --- tripPlanner.ts ---
    tripCard: {
        backgroundColor: 'var(--section-bg, white)',
        padding: '15px',
        borderRadius: 'var(--border-radius-main, 8px)',
        border: '1px solid #dee2e6',
    },
    tripCardTitle: {
        margin: '0 0 10px 0',
        fontSize: '1.4em',
    },
    tripCardDetails: {
        margin: '0 0 5px 0',
        color: '#666',
    },
    tripCardActions: {
        marginTop: '15px',
        display: 'flex',
        gap: '10px',
    },
    tripChecklistSection: {
        marginBottom: '20px',
    },
    tripChecklistTitle: {
        fontSize: '1.1em',
        marginBottom: '10px',
    },
    tripChecklistItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '8px',
    },
    tripChecklistInput: {
        flexGrow: 1,
        border: 'none',
        borderBottom: '1px solid #ccc',
        padding: '5px',
        outline: 'none',
    },
    tripChecklistAddButton: {
        background: 'none',
        border: '1px dashed #ccc',
        color: '#666',
        width: '100%',
        padding: '8px',
        borderRadius: 'var(--border-radius-main, 8px)',
        cursor: 'pointer',
    },
    // --- misc.ts ---
    configErrorScreen: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '20px',
    },
    configErrorBox: {
        maxWidth: '600px',
        padding: '30px',
        border: '1px solid #f5c6cb',
        borderRadius: '8px',
        backgroundColor: '#fdf2f2',
    },
    configErrorCode: {
        backgroundColor: '#f5f5f5',
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        whiteSpace: 'pre-wrap',
        marginTop: '15px',
    },
    promptBanner: {
        position: 'fixed',
        bottom: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'var(--primary-color, #4a90e2)',
        color: 'white',
        padding: '15px 25px',
        borderRadius: 'var(--border-radius-main, 8px)',
        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        zIndex: 1300,
    },
    fab: {
        position: 'fixed',
        bottom: '80px',
        right: '20px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: 'var(--primary-color, #4a90e2)',
        color: 'white',
        fontSize: '2em',
        border: 'none',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.2s, background-color 0.2s',
        zIndex: 1200,
    },
    toastContainer: {
        position: 'fixed',
        top: '70px',
        right: '20px',
        zIndex: 1500,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    toast: {
        padding: '15px',
        borderRadius: 'var(--border-radius-main, 8px)',
        color: 'white',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    toastIcon: {
        fontSize: '1.2em',
    },
    caseModalGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px'
    },
    caseDetailSection: {
        padding: '15px',
        backgroundColor: 'var(--accent-color-light, #f8f9fa)',
        borderRadius: 'var(--border-radius-main, 8px)',
        border: '1px solid #dee2e6'
    },
    caseDetailTitle: {
        marginTop: 0,
        marginBottom: '10px',
        borderBottom: '1px solid #ccc',
        paddingBottom: '5px'
    },
    restorativeTask: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 0',
    },
    restorativeTaskCompleted: {
        textDecoration: 'line-through',
        color: '#6c757d',
    },
    // --- other styles ---
    definedRewardsList: {
        listStyle: 'none',
        padding: 0,
    },
    definedRewardItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px',
        border: '1px solid #eee',
        borderRadius: 'var(--border-radius-main, 8px)',
        marginBottom: '10px',
    },
    definedRewardName: {
        fontWeight: 600,
    },
    definedRewardCost: {
        color: '#28a745',
        fontWeight: 'bold',
    },
    parentalActionsContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginTop: '20px',
    },
    parentalActionCard: {
        backgroundColor: '#f8f9fa'
    },
    badgeInfoList: {
        listStyle: 'none',
        padding: 0,
        marginTop: '10px',
    },
    badgeInfoItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        padding: '8px 0',
    },
    badgeInfoIcon: {
        fontSize: '2em',
    },
    badgeInfoName: {
        fontWeight: 600,
    },
    badgeInfoDescription: {
        color: '#666',
        fontSize: '0.9em',
    },
    wishlistItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        marginBottom: '5px'
    },
    wishlistItemInfo: {},
    wishlistItemName: {
        fontWeight: 'bold'
    },
    wishlistItemMeta: {
        fontSize: '0.9em',
        color: '#6c757d',
        display: 'block'
    },
    wishlistItemActions: {
        display: 'flex',
        gap: '5px'
    },
    wishlistStatusTag: {
        padding: '3px 8px',
        borderRadius: '12px',
        fontSize: '0.8em',
        color: 'white',
        fontWeight: 'bold'
    },
    wishlistStatusPending: {
        backgroundColor: '#ffc107',
    },
    wishlistStatusApproved: {
        backgroundColor: '#28a745',
    },
    wishlistStatusDenied: {
        backgroundColor: '#dc3545',
    },
    topEarnerWidget: {
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#fffbe6',
        border: '2px solid #ffe58f',
        borderRadius: 'var(--border-radius-main, 8px)',
        marginBottom: '20px'
    },
    topEarnerTitle: {
        margin: '0 0 5px 0',
        fontSize: '1.4em',
        color: '#856404'
    },
    topEarnerName: {
        margin: 0,
        fontSize: '1.2em'
    },
    topEarnerPoints: {
        margin: '5px 0 0 0',
        fontSize: '1em',
        color: '#856404'
    },
    podiumContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        gap: '10px',
        padding: '20px',
    },
    podiumStep: {
        textAlign: 'center',
        padding: '10px',
        borderRadius: '8px 8px 0 0',
        color: 'white',
        width: '120px'
    },
    podiumStep1: {
        height: '150px',
        backgroundColor: '#ffd700', // Gold
    },
    podiumStep2: {
        height: '120px',
        backgroundColor: '#c0c0c0', // Silver
    },
    podiumStep3: {
        height: '90px',
        backgroundColor: '#cd7f32', // Bronze
    },
    podiumAvatar: {
        fontSize: '3em',
    },
    podiumName: {
        fontWeight: 'bold',
        marginTop: '5px'
    },
    podiumPoints: {
        fontSize: '0.9em'
    },
    // Shopping List Styles
    shoppingListItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 15px',
        borderBottom: '1px solid #eee',
    },
    shoppingListItemDetails: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
    },
    shoppingListItemName: {
        fontSize: '1.1em',
    },
    shoppingListCategoryHeader: {
        fontSize: '1.3em',
        color: 'var(--primary-color, #4a90e2)',
        padding: '10px',
        backgroundColor: 'var(--accent-color-light, #e9f5ff)',
        borderBottom: '2px solid var(--primary-color, #4a90e2)',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: '4px',
    },
    shoppingListCategoryItems: {},
    aiShoppingSuggestionContainer: {
        marginTop: '20px',
        borderTop: '1px dashed #ccc',
        paddingTop: '15px'
    },
    aiShoppingCategory: {
        marginBottom: '15px',
    },
    aiShoppingCategoryTitle: {
        margin: '0 0 5px 0',
        fontSize: '1.1em',
        fontWeight: 'bold',
    },
    aiShoppingItemList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    aiShoppingItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: '8px',
        borderRadius: '4px'
    },
    // Family Games
    familyGamesContainer: {
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
    },
    madLibsThemeSelection: {
        textAlign: 'center',
    },
    madLibsThemeTitle: {
        fontSize: '1.8em',
        color: 'var(--primary-color, #4a90e2)',
    },
    madLibsThemeButtonContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '15px',
        margin: '20px 0',
    },
    madLibsThemeButton: {
        padding: '15px 25px',
        fontSize: '1.1em',
        cursor: 'pointer',
        border: '2px solid #ccc',
        borderRadius: '8px',
        backgroundColor: 'white',
        transition: 'all 0.2s',
    },
    madLibsThemeButtonSelected: {
        backgroundColor: 'var(--primary-color, #4a90e2)',
        color: 'white',
        borderColor: 'var(--primary-color, #4a90e2)',
        transform: 'scale(1.05)',
    },
    madLibsActionButton: {
        padding: '12px 30px',
        fontSize: '1.2em',
        fontWeight: 'bold',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
    },
    madLibsWordInputSection: {
        marginTop: '20px'
    },
    madLibsPromptLabel: {
        fontSize: '1.1em',
        fontWeight: 'bold',
    },
    madLibsStoryDisplaySection: {
        marginTop: '20px',
        padding: '20px',
        backgroundColor: '#fffbe6',
        borderRadius: '8px',
        border: '1px solid #ffe58f',
    },
    madLibsStoryText: {
        fontSize: '1.2em',
        lineHeight: 1.8,
    },
    // Family Court
    infractionCard: {
        display: 'block',
        width: '100%',
        padding: '15px',
        marginBottom: '10px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        textAlign: 'left',
        cursor: 'pointer',
    },
    infractionCardHearingRequest: {
        border: '2px solid #fd7e14',
        backgroundColor: '#fff3e0'
    },
    infractionHeader: {
        margin: 0,
        fontSize: '1.2em',
    },
    meetingTabs: {
        display: 'flex',
        borderBottom: '1px solid #ccc',
        marginBottom: '15px'
    },
    meetingTab: {
        padding: '10px 15px',
        cursor: 'pointer',
        background: 'none',
        border: 'none',
        borderBottom: '3px solid transparent',
    },
    meetingTabActive: {
        borderBottom: '3px solid var(--primary-color)'
    },
    // Navigation Settings
    navSettingsContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
    },
    navSettingsColumn: {
        padding: '15px',
        border: '1px solid #eee',
        borderRadius: '8px',
        backgroundColor: '#f8f9fa'
    },
    navSettingsColumnTitle: {
        marginTop: 0,
        borderBottom: '1px solid #ccc',
        paddingBottom: '10px',
        fontSize: '1.2em'
    },
    navSettingsItemList: {
        listStyle: 'none',
        padding: 0,
        minHeight: '100px'
    },
    navSettingsDraggableItem: {
        backgroundColor: '#ffffff',
        padding: '12px 15px',
        marginBottom: '8px',
        borderRadius: '4px',
        cursor: 'grab',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '1px solid #ddd',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
    },
    navSettingsItemButton: {
        background: 'none',
        border: '1px solid #ccc',
        borderRadius: '50%',
        cursor: 'pointer',
        fontSize: '1.2em',
        width: '28px',
        height: '28px',
        lineHeight: '26px',
        textAlign: 'center',
        padding: 0,
    },
    navPreviewContainer: {
        marginTop: '20px',
        padding: '15px',
        border: '2px dashed var(--primary-color, #4a90e2)',
        borderRadius: '8px',
        gridColumn: '1 / -1'
    },
    navPreviewBar: {
        backgroundColor: 'var(--top-bar-bg, #34495e)',
        display: 'flex',
        justifyContent: 'space-around',
        height: '65px',
        boxShadow: '0 -2px 5px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        position: 'relative',
    },

    // Dashboard Settings
    dashboardSettingsList: {
        listStyle: 'none',
        padding: 0,
    },
    dashboardSettingsItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px',
        backgroundColor: 'var(--section-bg, white)',
        border: '1px solid #eee',
        borderRadius: '4px',
        marginBottom: '10px',
        cursor: 'grab',
    },
    toggleSwitchContainer: {
        position: 'relative',
        display: 'inline-block',
        width: '50px',
        height: '28px',
        cursor: 'pointer',
    },
    toggleSwitchSlider: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#ccc',
        transition: '.4s',
        borderRadius: '28px',
    },
    toggleSwitchSliderChecked: {
        backgroundColor: 'var(--primary-color, #2196F3)',
    },

    // Caregiving Central
    caregiverCard: {
        padding: '15px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        marginBottom: '10px',
        backgroundColor: 'var(--section-bg, white)',
    },
    careRecipientCard: {
        padding: '15px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        marginBottom: '10px',
        backgroundColor: 'var(--accent-color-light, #e9f5ff)',
    },

    // Weather Widget
    weatherWidgetContent: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
    },
    weatherWidgetMain: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    weatherWidgetIcon: {
        fontSize: '3em',
    },
    weatherWidgetTemp: {
        fontSize: '2.5em',
        fontWeight: 'bold',
    },
    weatherWidgetDetails: {},
    weatherWidgetCondition: {
        fontSize: '1.2em',
        margin: '0 0 5px 0',
        fontWeight: 'bold',
    },
    weatherWidgetHighLow: {
        margin: 0,
    },
     accoladeItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        padding: '15px',
        border: '1px solid #eee',
        borderRadius: '8px',
        marginBottom: '10px',
    },
    accoladeIcon: {
        fontSize: '3em',
    },
    accoladeName: {
        margin: 0,
        fontSize: '1.3em',
    },
    accoladeDescription: {
        margin: '5px 0 0 0',
        color: '#666',
    },
    accoladeReason: {
        margin: '5px 0 0 0',
        color: '#888',
        fontStyle: 'italic',
        fontSize: '0.9em'
    },
    drawingControls: {
        display: 'flex',
        gap: '15px',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: '15px',
        padding: '10px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
    },
    drawingCanvas: {
        border: '2px solid #ccc',
        borderRadius: '8px',
        width: '100%',
        height: '500px',
        touchAction: 'none'
    },
    timelineContainer: {
        position: 'relative',
        paddingLeft: '30px',
        borderLeft: '4px solid #e9ecef',
    },
    timelineItemWrapper: {
        position: 'relative',
        marginBottom: '30px',
    },
    timelineDate: {
        position: 'absolute',
        left: '-85px',
        top: '5px',
        backgroundColor: '#6c757d',
        color: 'white',
        padding: '3px 8px',
        borderRadius: '4px',
        fontSize: '0.9em'
    },
    timelineCard: {
        backgroundColor: 'var(--section-bg, white)',
        border: '1px solid #ddd',
        borderRadius: '8px',
        overflow: 'hidden',
    },
    timelineImage: {
        width: '100%',
        maxHeight: '300px',
        objectFit: 'cover',
    },
    timelineContent: {
        padding: '15px'
    },
    timelineTitle: {
        margin: '0 0 10px 0'
    },
};
// Add keyframes separately as they aren't direct style properties
const styleSheet = document.styleSheets[0];
if (styleSheet) {
    try {
        styleSheet.insertRule(`
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `, styleSheet.cssRules.length);
    } catch (e) {
        console.warn("Could not insert CSS keyframes.", e);
    }
}
