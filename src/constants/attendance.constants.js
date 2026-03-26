// Attendance Status Constants
export const ATTENDANCE_STATUS = {
    PRESENT: 'present',
    ABSENT: 'absent',
    LEAVE: 'leave',
    HALFDAY: 'halfday'
};

// Status Display Names (consistent mapping)
export const ATTENDANCE_STATUS_DISPLAY = {
    [ATTENDANCE_STATUS.PRESENT]: 'Present',
    [ATTENDANCE_STATUS.ABSENT]: 'Absent',
    [ATTENDANCE_STATUS.LEAVE]: 'On Leave',
    [ATTENDANCE_STATUS.HALFDAY]: 'Half Day'
};

// Status Colors for UI
export const ATTENDANCE_STATUS_COLORS = {
    [ATTENDANCE_STATUS.PRESENT]: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-300',
        dot: 'bg-green-500'
    },
    [ATTENDANCE_STATUS.ABSENT]: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        border: 'border-red-300',
        dot: 'bg-red-500'
    },
    [ATTENDANCE_STATUS.LEAVE]: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        border: 'border-yellow-300',
        dot: 'bg-yellow-500'
    },
    [ATTENDANCE_STATUS.HALFDAY]: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        border: 'border-blue-300',
        dot: 'bg-blue-500'
    }
};

// Month Names
export const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

// Export Formats
export const EXPORT_FORMATS = {
    PDF: 'pdf',
    CSV: 'csv',
    EXCEL: 'excel'
};

// Payroll Constants
export const PAYROLL_CONSTANTS = {
    DEFAULT_BASE_SALARY: 3500,
    STANDARD_MONTHLY_HOURS: 160,
    OVERTIME_RATE_PER_HOUR: 50
};

// API Polling Intervals (in milliseconds)
export const POLLING_INTERVALS = {
    ATTENDANCE: 30000, // 30 seconds
    PAYROLL: 60000,    // 1 minute
    NOTIFICATIONS: 15000 // 15 seconds
};

// Date Format Constants
export const DATE_FORMATS = {
    DISPLAY: 'MMM DD, YYYY',
    API: 'YYYY-MM-DD',
    MONTH_YEAR: 'MMMM-YYYY'
};

// Validation Constants
export const VALIDATION = {
    MIN_YEAR: 2020,
    MAX_YEAR: 2030,
    MAX_COMMENT_LENGTH: 500,
    MAX_LABEL_LENGTH: 100
};

/**
 * Normalize status string to lowercase
 * @param {string} status - Status to normalize
 * @returns {string} Normalized status
 */
export const normalizeStatus = (status) => {
    if (!status) return '';
    return status.toLowerCase().trim();
};

/**
 * Get display name for status
 * @param {string} status - Status value
 * @returns {string} Display name
 */
export const getStatusDisplay = (status) => {
    const normalized = normalizeStatus(status);
    return ATTENDANCE_STATUS_DISPLAY[normalized] || status;
};

/**
 * Get color classes for status
 * @param {string} status - Status value
 * @returns {object} Color classes
 */
export const getStatusColors = (status) => {
    const normalized = normalizeStatus(status);
    return ATTENDANCE_STATUS_COLORS[normalized] || {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        border: 'border-gray-300',
        dot: 'bg-gray-500'
    };
};

/**
 * Format month key for API
 * @param {Date} date - Date object
 * @returns {string} Formatted month (e.g., "December-2025")
 */
export const formatMonthKey = (date) => {
    const month = MONTH_NAMES[date.getMonth()];
    const year = date.getFullYear();
    return `${month}-${year}`;
};

/**
 * Validate year range
 * @param {number} year - Year to validate
 * @returns {boolean} Is valid
 */
export const isValidYear = (year) => {
    return year >= VALIDATION.MIN_YEAR && year <= VALIDATION.MAX_YEAR;
};
