// client/src/services/appointmentService.js
import axios from 'axios';

const API_URL = '/api/appointments';

// Get user token from local storage
const getToken = () => {
  const userInfo = localStorage.getItem('userInfo');
  return userInfo ? JSON.parse(userInfo).token : null;
};

// Configure headers with token
const config = () => {
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
  };
};

// Get all user appointments
const getUserAppointments = async () => {
  try {
    const { data } = await axios.get(API_URL, config());
    return data;
  } catch (error) {
    throw error.response && error.response.data.message
      ? error.response.data.message
      : error.message;
  }
};

// Get appointment by ID
const getAppointmentById = async (id) => {
  try {
    const { data } = await axios.get(`${API_URL}/${id}`, config());
    return data;
  } catch (error) {
    throw error.response && error.response.data.message
      ? error.response.data.message
      : error.message;
  }
};

// Create new appointment
const createAppointment = async (appointmentData) => {
  try {
    const { data } = await axios.post(API_URL, appointmentData, config());
    return data;
  } catch (error) {
    throw error.response && error.response.data.message
      ? error.response.data.message
      : error.message;
  }
};

// Update appointment
const updateAppointment = async (id, appointmentData) => {
  try {
    const { data } = await axios.put(`${API_URL}/${id}`, appointmentData, config());
    return data;
  } catch (error) {
    throw error.response && error.response.data.message
      ? error.response.data.message
      : error.message;
  }
};
const updateAppointmentStatus = async (id, status) => {
    try {
      const { data } = await axios.patch(`${API_URL}/${id}/status`, { status }, config());
      return data;
    } catch (error) {
      throw error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    }
  };
  
  // Delete appointment
  const deleteAppointment = async (id) => {
    try {
      const { data } = await axios.delete(`${API_URL}/${id}`, config());
      return data;
    } catch (error) {
      throw error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    }
  };
  
  // Get available time slots
  const getAvailableTimeSlots = async (date, serviceId, stylist) => {
    try {
      const { data } = await axios.get(
        `${API_URL}/available?date=${date}&serviceId=${serviceId}&stylist=${stylist}`
      );
      return data;
    } catch (error) {
      throw error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    }
  };
  
  export {
    getUserAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    updateAppointmentStatus,
    deleteAppointment,
    getAvailableTimeSlots
  };