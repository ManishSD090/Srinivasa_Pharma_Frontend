import api from "./api";

/* ===== PAYROLL ===== */
export const fetchPayrollDetails = (staffId, month) =>
    api.get(`/payroll/${staffId}/${month}`);

export const generatePayroll = (staffId, month) =>
    api.post(`/payroll/generate/${staffId}/${month}`);

export const fetchPayrollHistory = (staffId) =>
    api.get(`/payroll/history/${staffId}`);

export const updatePayroll = (payrollId, payload) =>
    api.put(`/payroll/${payrollId}`, payload);

export const exportPayrollPDF = (payrollId) =>
    api.get(`/payroll/export/${payrollId}/pdf`, {
        responseType: 'blob'
    });

/* ===== ATTENDANCE (ADMIN) ===== */
export const fetchAdminCalendar = (staffId, month) =>
    api.get(`/admin/attendance/calendar/${staffId}/${month}`);

export const addAttendanceComment = (attendanceId, comment) =>
    api.put(`/admin/attendance/${attendanceId}/comment`, { comment }); 