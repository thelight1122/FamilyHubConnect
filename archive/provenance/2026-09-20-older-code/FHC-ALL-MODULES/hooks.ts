import { useState, useEffect } from 'react';

export const useCountdown = (endTime: number) => {
    const [timeLeft, setTimeLeft] = useState(endTime - Date.now());

    useEffect(() => {
        if (timeLeft <= 0) {
            setTimeLeft(0);
            return;
        };
        const interval = setInterval(() => {
            setTimeLeft(prev => prev > 1000 ? prev - 1000 : 0);
        }, 1000);
        return () => clearInterval(interval);
    }, [endTime]);

    if (timeLeft <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isFinished: true };
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, isFinished: timeLeft <= 0 };
};
