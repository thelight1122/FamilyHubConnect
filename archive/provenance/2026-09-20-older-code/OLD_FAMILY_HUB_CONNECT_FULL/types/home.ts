
export interface Vehicle {
    id: string;
    nickname: string;
    make: string;
    model: string;
    year: number;
    licensePlate?: string;
    vin?: string;
    insuranceInfo?: string;
    aiSchedule?: MaintenanceTaskTemplate[];
}
export interface MaintenanceTaskTemplate {
    serviceType: string;
    intervalMonths?: number;
    intervalMiles?: number;
}
export interface VehicleMaintenanceLog {
    id: string;
    vehicleId: string;
    serviceType: string;
    date: string;
    notes?: string;
    cost?: number;
    mileage?: number;
    nextServiceDue?: string;
}

export interface SmartDevice {
    id: string;
    name: string;
    type: 'light' | 'thermostat' | 'lock';
    status: 'on' | 'off' | 'locked' | 'unlocked' | number;
}
export interface SmartScene {
    id: string;
    name: string;
    icon: string;
    actions: { deviceId: string; newStatus: SmartDevice['status'] }[];
}
export interface AutomationRule {
    id: string;
    enabled: boolean;
    trigger: { type: 'all_chores_complete'; forProfileId: string | 'any_child' };
    action: { type: 'activate_scene'; sceneId: string };
}
