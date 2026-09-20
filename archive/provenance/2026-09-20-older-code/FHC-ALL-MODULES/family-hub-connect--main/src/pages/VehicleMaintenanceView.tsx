

import React, { useState } from 'react';
import { useAppState, useAppDispatch } from '../AppContext';
import type { Vehicle, VehicleMaintenanceLog } from '../types';
import { Modal, AIHelperWidget, LoadingSpinner, ArrowLeftIcon } from '../components';

export default function VehicleMaintenanceView() {
    const { vehicles, vehicleMaintenanceLogs } = useAppState();
    const { onNavigate, addVehicle, updateVehicle, addMaintenanceLog, updateMaintenanceLog } = useAppDispatch();
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
            const newVehicleData: Omit<Vehicle, 'id'> = {
                nickname: data.nickname || '',
                make: data.make || '',
                model: data.model || '',
                year: data.year || new Date().getFullYear(),
            };
            addVehicle(newVehicleData);
        }
        setIsVehicleModalOpen(false);
    };

    const handleSaveLog = (data: Partial<VehicleMaintenanceLog>) => {
        if (editingLog) {
            updateMaintenanceLog(editingLog.id, data);
        } else if (selectedVehicleId) {
             const newLogData: Omit<VehicleMaintenanceLog, 'id'> = {
                vehicleId: selectedVehicleId,
                serviceType: data.serviceType || '',
                date: data.date || new Date().toISOString().split('T')[0],
                notes: data.notes || '',
            };
            addMaintenanceLog(newLogData);
        }
        setIsLogModalOpen(false);
    };
    
    const handleGenerateSchedule = async (vehicle: Vehicle) => {
        if (!vehicle) return;
        setIsGeneratingSchedule(true);
        const mockSchedule = [
            { serviceType: 'Oil Change', intervalMiles: 5000 },
            { serviceType: 'Tire Rotation', intervalMiles: 7500 },
        ];
        await updateVehicle(vehicle.id, { aiSchedule: mockSchedule });
        setIsGeneratingSchedule(false);
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
        
        return (
            <form onSubmit={handleSubmit}>
                <div className="form-group"><label>Nickname<input value={nickname} onChange={e => setNickname(e.target.value)} /></label></div>
                <div className="form-group"><label>Make<input value={make} onChange={e => setMake(e.target.value)} /></label></div>
                <div className="form-group"><label>Model<input value={model} onChange={e => setModel(e.target.value)} /></label></div>
                <div className="form-group"><label>Year<input type='number' value={year} onChange={e => setYear(e.target.value)} /></label></div>
                <button type='submit' className="btn">Save Vehicle</button>
            </form>
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
        
        return (
            <form onSubmit={handleSubmit}>
                 <div className="form-group"><label>Service Type<input value={serviceType} onChange={e => setServiceType(e.target.value)} /></label></div>
                 <div className="form-group"><label>Date<input type='date' value={date} onChange={e => setDate(e.target.value)} /></label></div>
                 <div className="form-group"><label>Notes<textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} /></label></div>
                <button type='submit' className="btn">Save Log</button>
            </form>
        );
    };

    const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);
    const selectedVehicleLogs = vehicleMaintenanceLogs.filter(l => l.vehicleId === selectedVehicleId);

    return (
        <div className="page">
            <header className="header">
                <button className="back-button" onClick={() => onNavigate('homeManagement')}>
                    <ArrowLeftIcon />
                </button>
                <h2>🚗 Vehicle Maintenance</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                <section className="card">
                    <div className="flex gap-2">
                        <select value={selectedVehicleId || ''} onChange={e => setSelectedVehicleId(e.target.value)} style={{flexGrow: 1}}>
                            {vehicles.map(v => <option key={v.id} value={v.id}>{v.nickname}</option>)}
                        </select>
                        <button onClick={() => openVehicleModal()} className="btn w-auto">Add Vehicle</button>
                    </div>
                    {selectedVehicle && <button onClick={() => openVehicleModal(selectedVehicle)} className="btn btn-secondary w-auto mt-10">Edit Selected Vehicle</button>}
                </section>
                {selectedVehicle && (
                    <>
                        <section className="card">
                            <h3>Maintenance Schedule</h3>
                            {selectedVehicle.aiSchedule && selectedVehicle.aiSchedule.length > 0 ? (
                                selectedVehicle.aiSchedule.map((task, i) => <p key={i}>{`${task.serviceType} (every ${task.intervalMiles} miles)`}</p>)
                            ) : (
                                <AIHelperWidget title='AI Maintenance Schedule' description='Generate a typical maintenance schedule for this vehicle.'>
                                    <button onClick={() => handleGenerateSchedule(selectedVehicle)} disabled={isGeneratingSchedule} className="btn">
                                        {isGeneratingSchedule ? <LoadingSpinner message="Generating..." /> : 'Generate Schedule'}
                                    </button>
                                </AIHelperWidget>
                            )}
                        </section>
                        <section className="card">
                            <h3>Service History</h3>
                            <button onClick={() => openLogModal()} className="btn w-auto mb-20">Log Service</button>
                            {selectedVehicleLogs.map(log => (
                                <div key={log.id} className="list-item" onClick={() => openLogModal(log)}>
                                    <div><strong>{log.serviceType}</strong> on {log.date}</div>
                                    <span>{log.notes}</span>
                                </div>
                            ))}
                        </section>
                    </>
                )}
            </main>
            <Modal isOpen={isVehicleModalOpen} onClose={() => setIsVehicleModalOpen(false)} title='Vehicle Details'><VehicleForm onSave={handleSaveVehicle} /></Modal>
            <Modal isOpen={isLogModalOpen} onClose={() => setIsLogModalOpen(false)} title='Service Log'><LogForm onSave={handleSaveLog} /></Modal>
        </div>
    );
}
