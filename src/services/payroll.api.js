import api from "./api";

/* ===== PAYROLL ===== */
export const fetchPayrollDetails = (staffId, month) =>
    api.get(`/payroll/${staffId}/${month}`);

export const generatePayroll = (staffId, month) =>
    api.post(`/payroll/generate/${staffId}/${month}`);

export const fetchPayrollHistory = (staffId) =>
    api.get(`/payroll/history/${staffId}`);

export const addPayrollItem = (payrollId, payload) =>
    api.post(`/payroll/${payrollId}/item`, payload);

export const updatePayrollItem = (payrollId, itemId, payload) =>
    api.put(`/payroll/${payrollId}/item/${itemId}`, payload);

export const deletePayrollItem = (payrollId, itemId) =>
    api.delete(`/payroll/${payrollId}/item/${itemId}`);

/* ===== ATTENDANCE (ADMIN) ===== */
export const fetchAdminCalendar = (staffId, month) =>
    api.get(`/admin/attendance/calendar/${staffId}/${month}`);

export const addAttendanceComment = (attendanceId, comment) =>
    api.put(`/admin/attendance/${attendanceId}/comment`, { comment }); 