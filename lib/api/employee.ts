import apiClient, { ApiResponse, PaginatedResponse } from "../api-client";

// Types
export interface EmployeeProfile {
    id: string;
    userId?: string;
    employeeCode?: string;
    name: string;
    designation?: string;
    fatherName?: string;
    motherName?: string;
    dateOfBirth?: string;
    nationalId?: string;
    bloodGroup?: string;
    joiningDate: string;
    resignDate?: string;
    baseSalary: string | number;
    mobileNumber?: string;
    alternativeContactNumber?: string;
    corporateContactNumber?: string;
    emailAddress?: string;
    facebookProfileLink?: string;
    bankAccountNumber?: string;
    branchName?: string;
    bankName?: string;
    fatherContactNumber?: string;
    motherContactNumber?: string;
    emergencyContactNumber?: string;
    photoUrl?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    user?: {
        id: string;
        email: string;
        name: string;
        avatar?: string;
        status: string;
    };
}

export interface EmployeeAttendance {
    id: string;
    employeeId: string;
    date: string;
    checkInAt?: string;
    checkOutAt?: string;
    workingHours?: number;
    status: "PRESENT" | "ABSENT" | "LATE" | "ON_LEAVE";
    createdAt: string;
    updatedAt: string;
}

export interface EmployeeSalaryPayment {
    id: string;
    employeeId: string;
    month: number;
    year: number;
    basicSalary: string | number;
    grossSalary: string | number;
    totalDeduction: string | number;
    netPayable: string | number;
    paymentDate?: string;
    status: "PENDING" | "PAID" | "CANCELLED";
    createdAt: string;
    updatedAt: string;
}

export interface EmployeeSalaryIncrement {
    id: string;
    employeeId: string;
    previousSalary: string | number;
    newSalary: string | number;
    incrementAmount: string | number;
    effectiveFrom: string;
    reason?: string;
    approvedById?: string;
    createdAt: string;
}

export interface AttendanceStatistics {
    month: number;
    year: number;
    present: number;
    absent: number;
    late: number;
    onLeave: number;
    total: number;
    workingDays: number;
}

// API Functions
export const employeeApi = {
    // Profile
    getProfile: () =>
        apiClient.get<ApiResponse<EmployeeProfile>>("/employee/profile"),

    updateProfile: (data: {
        mobileNumber?: string;
        alternativeContactNumber?: string;
        emergencyContactNumber?: string;
        facebookProfileLink?: string;
    }) =>
        apiClient.put<ApiResponse<EmployeeProfile>>("/employee/profile", data),

    uploadPhoto: (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        return apiClient.post<ApiResponse<{ id: string; photoUrl: string; key: string }>>(
            "/employee/profile/photo",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
    },

    // Attendance
    getAttendance: (params?: {
        page?: number;
        limit?: number;
        fromDate?: string;
        toDate?: string;
        status?: string;
    }) =>
        apiClient.get<PaginatedResponse<EmployeeAttendance>>("/employee/attendance", { params }),

    getTodayAttendance: () =>
        apiClient.get<ApiResponse<EmployeeAttendance | null>>("/employee/attendance/today"),

    getAttendanceStatistics: () =>
        apiClient.get<ApiResponse<AttendanceStatistics>>("/employee/attendance/statistics"),

    checkIn: (date?: string) =>
        apiClient.post<ApiResponse<EmployeeAttendance>>("/employee/attendance/check-in", { date }),

    checkOut: (date?: string) =>
        apiClient.post<ApiResponse<EmployeeAttendance>>("/employee/attendance/check-out", { date }),

    // Salary
    getSalaryPayments: (params?: {
        page?: number;
        limit?: number;
        month?: number;
        year?: number;
    }) =>
        apiClient.get<PaginatedResponse<EmployeeSalaryPayment>>("/employee/salary/payments", { params }),

    getSalaryIncrements: () =>
        apiClient.get<ApiResponse<EmployeeSalaryIncrement[]>>("/employee/salary/increments"),
};
