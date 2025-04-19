// Base URL for the API
const API_BASE_URL = 'http://localhost:3000/api';

// Helper function to handle API calls with authentication
async function apiCall(endpoint, options = {}) {
    const token = localStorage.getItem('authToken');
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        ...options
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, defaultOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

// Reports API
export const reportsApi = {
    // Get all reports
    getAllReports: () => apiCall('/reportagens'),
    
    // Get report by ID
    getReportById: (uid) => apiCall(`/reportagens/${uid}`),
};

// Users API
export const usersApi = {
    // Get all users
    getAllUsers: () => apiCall('/users'),
    
    // Get user by ID
    getUserById: (uid) => apiCall(`/users/${uid}`),
    
    // Block user
    blockUser: (uid) => apiCall(`/users/${uid}/block`, {
        method: 'PATCH'
    }),
};

// Blogs API
export const blogsApi = {
    // Get all blogs
    getAllBlogs: () => apiCall('/blog'),
    
    // Get blog by ID
    getBlogById: (uid) => apiCall(`/blog/${uid}`),
    
    // Create new blog
    createBlog: (blogData) => apiCall('/blog', {
        method: 'POST',
        body: JSON.stringify(blogData)
    }),
};

// Authorities API
export const authoritiesApi = {
    // Get all authorities
    getAllAuthorities: () => apiCall('/autoridades'),
    
    // Get authority by ID
    getAuthorityById: (uid) => apiCall(`/autoridades/${uid}`),
    
    // Create new authority
    createAuthority: (authorityData) => apiCall('/autoridades', {
        method: 'POST',
        body: JSON.stringify(authorityData)
    }),
    
    // Block authority
    blockAuthority: (uid) => apiCall(`/autoridades/${uid}/block`, {
        method: 'PATCH'
    }),
};

// Error handling utility
export const handleApiError = (error) => {
    console.error('API Error:', error);
    if (error.message.includes('401')) {
        // Handle unauthorized access
        localStorage.removeItem('authToken');
        window.location.href = '/login.html';
    }
    throw error;
};

// Example usage:
/*
try {
    // Get all reports
    const reports = await reportsApi.getAllReports();
    
    // Get specific blog
    const blog = await blogsApi.getBlogById('some-id');
    
    // Create new authority
    const newAuthority = await authoritiesApi.createAuthority({
        name: 'New Authority',
        // ... other authority data
    });
} catch (error) {
    handleApiError(error);
}
*/

import { reportsApi, blogsApi, authoritiesApi, usersApi } from './handleApi.js';

reportsApi.getAllReports().then(reports => {
    console.log(reports);
});

// Then use them in your async functions:
async function loadReports() {
    try {
        const { reports } = await reportsApi.getAllReports();
        // Handle the reports data
    } catch (error) {
        handleApiError(error);
    }
} 