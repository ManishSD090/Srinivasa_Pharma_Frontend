import api from "./api";

// Get all tasks (admin: all, staff: assigned/open)
export const fetchTasks = () => {
    return api.get("/tasks");
};

// Get single task by ID
export const fetchTaskById = (taskId) => {
    return api.get(`/tasks/${taskId}`);
};

// Create new task (Admin only)
export const createTask = (data) => {
    return api.post("/tasks", {
        title: data.title,
        description: data.description,
        priority: data.priority,
        dueDate: data.dueDate,
        assignedTo: data.assignedTo || null, // null = open for volunteer
    });
};

// Update task (Admin or assigned Staff)
export const updateTask = (taskId, data) => {
    return api.put(`/tasks/${taskId}`, data);
};

// Delete task (Admin only)
export const deleteTask = (taskId) => {
    return api.delete(`/tasks/${taskId}`);
};


/* ===========================
   VOLUNTEER FLOW
=========================== */

// Staff volunteers for a task
export const volunteerForTask = (taskId) => {
    return api.post(`/tasks/${taskId}/volunteer`);
};

// Admin approves volunteer request
export const approveVolunteer = (volunteerId) => {
    return api.put(`/tasks/volunteer/approve/${volunteerId}`);
};

// Admin rejects volunteer request
export const rejectVolunteer = (volunteerId) => {
    return api.put(`/tasks/volunteer/reject/${volunteerId}`);
};

// Admin: get all pending volunteer requests
export const fetchPendingVolunteerRequests = () => {
    return api.get("/tasks/pending-volunteers");
};


/* ===========================
   EXTRA UTILITIES
=========================== */

// Admin: fetch overdue tasks
export const fetchOverdueTasks = () => {
    return api.get("/tasks/overdue");
};


/* ===========================
   STAFF (Used by Task UI)
=========================== */

// Admin: fetch all staff
export const fetchAllStaff = () => {
    return api.get("/staff");
};

// STAFF
export const requestTaskStatusChange = (taskId, status,staffId) =>
    api.post(`/tasks/${taskId}/request-status`, { requestedStatus: status,staffId:staffId });

// ADMIN
export const fetchStatusRequests = () =>
    api.get("/tasks/status-requests");

export const approveStatusRequest = (id) =>
    api.put(`/tasks/status-requests/approve/${id}`);

export const rejectStatusRequest = (id) =>
    api.put(`/tasks/status-requests/reject/${id}`);
