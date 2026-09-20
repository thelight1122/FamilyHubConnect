
import React, { useState, useEffect } from 'react';
import { styles } from '../../styles';
import { useAppContext } from '../../contexts/AppContext';
import { supabase } from '../../services/supabaseClient';
import LoadingSpinner from './LoadingSpinner';

const WeatherWidget: React.FC = () => {
    const { personalizationData, IS_TESTING_MODE } = useAppContext();
    const [weather, setWeather] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWeather = async () => {
            if (IS_TESTING_MODE) {
                setWeather({
                    temperature: 72,
                    condition: "Sunny",
                    high: 78,
                    low: 65,
                });
                setIsLoading(false);
                return;
            }

            const location = personalizationData?.location;
            if (!location) {
                setError("Set location in Family Settings.");
                setIsLoading(false);
                return;
            }

            try {
                const { data, error: funcError } = await supabase.functions.invoke('ai-handler', {
                    body: {
                        endpoint: 'getWeather',
                        location: location,
                    }
                });
                if (funcError) throw funcError;
                setWeather(data.weather);
            } catch (e: any) {
                setError("Could not fetch weather data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchWeather();
    }, [personalizationData?.location, IS_TESTING_MODE]);

    const getWeatherIcon = (condition: string | undefined): string => {
        if (!condition) return '❓';
        const lowerCondition = condition.toLowerCase();
        if (lowerCondition.includes('sun') || lowerCondition.includes('clear')) return '☀️';
        if (lowerCondition.includes('cloud')) return '☁️';
        if (lowerCondition.includes('rain') || lowerCondition.includes('shower')) return '🌧️';
        if (lowerCondition.includes('storm')) return '⛈️';
        if (lowerCondition.includes('snow')) return '❄️';
        if (lowerCondition.includes('mist') || lowerCondition.includes('fog')) return '🌫️';
        return '❓';
    };

    const renderContent = () => {
        if (isLoading) {
            return React.createElement('div', {style: {margin: 'auto'}}, React.createElement(LoadingSpinner, { message: "Getting weather..." }));
        }
        if (error || !weather) {
            return React.createElement('p', { style: styles.widgetSummaryText }, error || 'Weather not available.');
        }
        return React.createElement('div', { style: styles.weatherWidgetContent },
            React.createElement('div', { style: styles.weatherWidgetMain },
                React.createElement('span', { style: styles.weatherWidgetIcon }, getWeatherIcon(weather.condition)),
                React.createElement('span', { style: styles.weatherWidgetTemp }, `${Math.round(weather.temperature)}°`)
            ),
            React.createElement('div', { style: styles.weatherWidgetDetails },
                React.createElement('p', { style: styles.weatherWidgetCondition }, weather.condition),
                React.createElement('p', { style: styles.weatherWidgetHighLow }, `H: ${Math.round(weather.high)}° L: ${Math.round(weather.low)}°`)
            )
        );
    };

    return React.createElement('div', { style: styles.widgetTile },
        React.createElement('h3', { style: styles.widgetTitle }, `📍 Weather for ${personalizationData?.location || '...'}`),
        renderContent()
    );
};

export default WeatherWidget;
