//utils.ts
// src/utils/utils.ts
// This file contains utility functions used throughout the application.

// --- Helper to generate unique IDs ---
export const uniqueId = () => '_' + Math.random().toString(36).substr(2, 9);

// --- New utility to convert file to base64 Data URL ---
export const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};


// --- Date Helper Functions ---
export const normalizeDateStr = (dateStr: string | null): Date | null => {
    if (!dateStr) return null;
    const parts = dateStr.split('-');
    if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) -1; 
        const day = parseInt(parts[2], 10);
        const date = new Date(Date.UTC(year, month, day));
        if (isNaN(date.getTime())) return null;
        return date;
    }
    const date = new Date(dateStr + "T00:00:00Z"); 
    if (isNaN(date.getTime())) return null;
    return date;
};

export const isDateToday = (dateStr: string | null): boolean => {
    const date = normalizeDateStr(dateStr);
    if (!date) return false;
    const today = new Date();
    today.setUTCHours(0,0,0,0); 
    return date.getTime() === today.getTime();
};

export const isDatePast = (dateStr: string | null): boolean => {
    const date = normalizeDateStr(dateStr);
    if (!date) return false;
    const today = new Date();
    today.setUTCHours(0,0,0,0); 
    return date < today;
};

export const isDateThisWeek = (dateStr: string | null): boolean => {
    const date = normalizeDateStr(dateStr);
    if (!date) return false;
    const today = new Date();
    today.setUTCHours(0,0,0,0);
    const currentDayOfWeek = today.getUTCDay(); 
    const firstDayOfWeek = new Date(today); 
    firstDayOfWeek.setUTCDate(today.getUTCDate() - currentDayOfWeek);
    
    const lastDayOfWeek = new Date(firstDayOfWeek); 
    lastDayOfWeek.setUTCDate(firstDayOfWeek.getUTCDate() + 6);
    lastDayOfWeek.setUTCHours(23,59,59,999);
    
    return date >= firstDayOfWeek && date <= lastDayOfWeek;
};

// --- Currency Helper Function ---
export const formatCurrency = (amount: number | undefined) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
};

// --- Time Helper Function ---
export const formatMinutes = (minutes: number): string => {
    if (minutes < 60) {
        return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
        return `${hours}h`;
    }
    return `${hours}h ${remainingMinutes}m`;
};