
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { styles } from '../styles';
import type { Vehicle, VehicleMaintenanceLog } from '../types';
import Modal from '../components/ui/Modal';
import AIHelperWidget from '../components/ui/AIHelperWidget';
import { supabase } from '../services/supabaseClient';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function VehicleMaintenanceView() {
    const { 
        vehicles, vehicleMaintenanceLogs, onNavigate, addVehicle, updateVehicle, 
        addMaintenanceLog, updateMaintenanceLog, IS_TESTING_MODE 
    } = useAppContext();
    const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles[0]?.id || null);
    const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
    const [editingLog, setEditingLog] = useState<VehicleMaintenanceLog | null>(null);

    const [isGeneratingSchedule, setIsGeneratingSchedule] = useState(false);

    const openVehicleModal = (vehicle?: Vehicle) => {
        setEditingVehicle(vehicle || null);
        setIsVehicleModalOpen(true);
    };

    const openLogModal = (log?: VehicleMaintenanceLog) => {
        setEditingLog(log || null);
        setIsLogModalOpen(true);
    };

    const handleSaveVehicle = (data: Partial<Vehicle>) => {
        if (editingVehicle) {
            updateVehicle(editingVehicle.id, data);
        } else {
            addVehicle(data as Omit<Vehicle, 'id'>);
        }
        setIsVehicleModalOpen(false);
    };

    const handleSaveLog = (data: Partial<VehicleMaintenanceLog>) => {
        if (!selectedVehicleId) return;
        if (editingLog) {
            updateMaintenanceLog(editingLog.id, data);
        } else {
            addMaintenanceLog({ ...data, vehicleId: selectedVehicleId } as Omit<VehicleMaintenanceLog, 'id'>);
        }
        setIsLogModalOpen(false);
    };
    
    const handleGenerateSchedule = async (vehicle: Vehicle) => {
        if (!vehicle) return;
        setIsGeneratingSchedule(true);
        try {
            if (IS_TESTING_MODE) {
                const mockSchedule = [
                    { serviceType: "Oil Change", intervalMiles: 5000 },
                    { serviceType: "Tire Rotation", intervalMiles: 7500 },
                ];
                await updateVehicle(vehicle.id, { aiSchedule: mockSchedule as any });
            } else {
                const { data, error } = await supabase.functions.invoke('ai-handler', {
                    body: {
                        endpoint: 'generateMaintenanceSchedule',
                        make: vehicle.make,
                        model: vehicle.model,
                        year: vehicle.year
                    }
                });
                if (error) throw error;
                const schedule = data.schedule.map((s: string) => ({ serviceType: s, intervalMiles: 0, intervalMonths: 0 }));
                await updateVehicle(vehicle.id, { aiSchedule: schedule as any });
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsGeneratingSchedule(false);
        }
    };
    
    const VehicleForm: React.FC<{ onSave: (data: Partial<Vehicle>) => void }> = ({ onSave }) => {
        const [nickname, setNickname] = useState(editingVehicle?.nickname || '');
        const [make, setMake] = useState(editingVehicle?.make || '');
        const [model, setModel] = useState(editingVehicle?.model || '');
        const [year, setYear] = useState(String(editingVehicle?.year || new Date().getFullYear()));
        
        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            onSave({ nickname, make, model, year: parseInt(year) });
        };
        
        return React.createElement('form', {onSubmit: handleSubmit},
            React.createElement('div', {style: styles.formGroup}, React.createElement('label', null, 'Nickname'), React.createElement('input', {value: nickname, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setNickname(e.target.value), style: styles.input})),
            React.createElement('div', {style: styles.formGroup}, React.createElement('label', null, 'Make'), React.createElement('input', {value: make, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setMake(e.target.value), style: styles.input})),
            React.createElement('div', {style: styles.formGroup}, React.createElement('label', null, 'Model'), React.createElement('input', {value: model, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setModel(e.target.value), style: styles.input})),
            React.createElement('div', {style: styles.formGroup}, React.createElement('label', null, 'Year'), React.createElement('input', {type: 'number', value: year, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setYear(e.target.value), style: styles.input})),
            React.createElement('button', {type: 'submit', style: styles.button}, 'Save Vehicle')
        );
    };
    
    const LogForm: React.FC<{ onSave: (data: Partial<VehicleMaintenanceLog>) => void }> = ({ onSave }) => {
        const [serviceType, setServiceType] = useState(editingLog?.serviceType || '');
        const [date, setDate] = useState(editingLog?.date || new Date().toISOString().split('T')[0]);
        const [notes, setNotes] = useState(editingLog?.notes || '');
        
        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            onSave({ serviceType, date, notes });
        };
        
        return React.createElement('form', {onSubmit: handleSubmit},
             React.createElement('div', {style: styles.formGroup}, React.createElement('label', null, 'Service Type'), React.createElement('input', {value: serviceType, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setServiceType(e.target.value), style: styles.input})),
             React.createElement('div', {style: styles.formGroup}, React.createElement('label', null, 'Date'), React.createElement('input', {type: 'date', value: date, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value), style: styles.input})),
             React.createElement('div', {style: styles.formGroup}, React.createElement('label', null, 'Notes'), React.createElement('textarea', {value: notes, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value), style: styles.textarea, rows: 3})),
            React.createElement('button', {type: 'submit', style: styles.button}, 'Save Log')
        );
    };

    const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);
    const selectedVehicleLogs = vehicleMaintenanceLogs.filter(l => l.vehicleId === selectedVehicleId);

    return (
        React.createElement('div', { style: styles.pageContainer },
            React.createElement('button', { onClick: () => onNavigate('homeManagement'), style: { ...styles.backButton, float: 'left' } }, "← Back"),
            React.createElement('div', { style: { clear: 'both' } }),
            React.createElement('h2', { style: styles.pageHeader }, "🚗 Vehicle Maintenance"),
            React.createElement('section', { style: styles.section },
                React.createElement('div', {style: {display: 'flex', gap: '10px'}},
                    React.createElement('select', {value: selectedVehicleId || '', onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedVehicleId(e.target.value), style: styles.selectInput},
                        vehicles.map(v => React.createElement('option', {key: v.id, value: v.id}, v.nickname))
                    ),
                    React.createElement('button', {onClick: () => openVehicleModal(), style: {...styles.button, width: 'auto'}}, 'Add Vehicle')
                ),
                selectedVehicle && React.createElement('button', {onClick: () => openVehicleModal(selectedVehicle), style: {...styles.button, ...styles.buttonSecondary, width: 'auto', marginTop: '10px'}}, 'Edit Selected Vehicle')
            ),
            selectedVehicle && React.createElement(React.Fragment, null,
                React.createElement('section', {style: styles.section},
                    React.createElement('h3', {style: styles.sectionTitle}, 'Maintenance Schedule'),
                    selectedVehicle.aiSchedule ? 
                         selectedVehicle.aiSchedule.map((task, i) => React.createElement('p', {key: i}, `${task.serviceType}`))
                         : React.createElement(AIHelperWidget, {title: 'AI Maintenance Schedule', description: 'Generate a typical maintenance schedule for this vehicle.', children: 
                            React.createElement('button', {onClick: () => handleGenerateSchedule(selectedVehicle), disabled: isGeneratingSchedule, style: styles.button}, isGeneratingSchedule ? React.createElement(LoadingSpinner, {message:"Generating..."}) : 'Generate Schedule')
                         }),
                ),
                React.createElement('section', {style: styles.section},
                    React.createElement('h3', {style: styles.sectionTitle}, 'Service History'),
                    React.createElement('button', {onClick: () => openLogModal(), style: {...styles.button, width: 'auto', marginBottom: '10px'}}, 'Log Service'),
                    selectedVehicleLogs.map(log => React.createElement('div', {key: log.id, style: styles.listItem, onClick: () => openLogModal(log)},
                        React.createElement('div', null, React.createElement('strong', null, log.serviceType), ` on ${log.date}`),
                        React.createElement('span', null, log.notes)
                    ))
                )
            ),
            isVehicleModalOpen && React.createElement(Modal, {isOpen: true, onClose: () => setIsVehicleModalOpen(false), title: 'Vehicle Details', children: React.createElement(VehicleForm, {onSave: handleSaveVehicle})}),
            isLogModalOpen && React.createElement(Modal, {isOpen: true, onClose: () => setIsLogModalOpen(false), title: 'Service Log', children: React.createElement(LogForm, {onSave: handleSaveLog})})
        )
    );
}
