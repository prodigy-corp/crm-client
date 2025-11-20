import apiClient, { type ApiResponse } from '../api-client';

// ==================== TYPES ====================

export interface Department {
    id: string;
    name: string;
    description?: string;
    defaultShiftId?: string;
    defaultShift?: Shift;
    createdAt: string;
    updatedAt: string;
    _count?: {
        employees: number;
    };
}

export interface Shift {
    id: string;
    name: string;
    description?: string;
    startTime: string; // HH:mm
    endTime: string; // HH:mm
    lateToleranceMinutes: number;
    earlyDepartureToleranceMinutes: number;
    schedules?: ShiftSchedule[];
    createdAt: string;
    updatedAt: string;
    _count?: {
        employees: number;
        departments: number;
    };
}

export interface ShiftSchedule {
    id: string;
    shiftId: string;
    dayOfWeek: number; // 0=Sunday, 1=Monday, ..., 6=Saturday
    startTime?: string;
    endTime?: string;
    isOffDay: boolean;
    isHalfDay: boolean;
}

export interface CreateDepartmentDto {
    name: string;
    description?: string;
    defaultShiftId?: string;
}

export interface UpdateDepartmentDto {
    name?: string;
    description?: string;
    defaultShiftId?: string;
}

export interface CreateShiftScheduleDto {
    dayOfWeek: number;
    startTime?: string;
    endTime?: string;
    isOffDay: boolean;
    isHalfDay: boolean;
}

export interface CreateShiftDto {
    name: string;
    description?: string;
    startTime: string;
    endTime: string;
    lateToleranceMinutes: number;
    earlyDepartureToleranceMinutes: number;
    schedules?: CreateShiftScheduleDto[];
}

export interface UpdateShiftDto {
    name?: string;
    description?: string;
    startTime?: string;
    endTime?: string;
    lateToleranceMinutes?: number;
    earlyDepartureToleranceMinutes?: number;
    schedules?: CreateShiftScheduleDto[];
}

// ==================== API FUNCTIONS ====================

export const organizationApi = {
    // ==================== DEPARTMENTS ====================

    getDepartments: () =>
        apiClient.get<ApiResponse<Department[]>>('/admin/departments'),

    getDepartmentById: (id: string) =>
        apiClient.get<ApiResponse<Department>>(`/admin/departments/${id}`),

    createDepartment: (data: CreateDepartmentDto) =>
        apiClient.post<ApiResponse<Department>>('/admin/departments', data),

    updateDepartment: (id: string, data: UpdateDepartmentDto) =>
        apiClient.patch<ApiResponse<Department>>(`/admin/departments/${id}`, data),

    deleteDepartment: (id: string) =>
        apiClient.delete<ApiResponse<void>>(`/admin/departments/${id}`),

    // ==================== SHIFTS ====================

    getShifts: () =>
        apiClient.get<ApiResponse<Shift[]>>('/admin/shifts'),

    getShiftById: (id: string) =>
        apiClient.get<ApiResponse<Shift>>(`/admin/shifts/${id}`),

    createShift: (data: CreateShiftDto) =>
        apiClient.post<ApiResponse<Shift>>('/admin/shifts', data),

    updateShift: (id: string, data: UpdateShiftDto) =>
        apiClient.patch<ApiResponse<Shift>>(`/admin/shifts/${id}`, data),

    deleteShift: (id: string) =>
        apiClient.delete<ApiResponse<void>>(`/admin/shifts/${id}`),
};
