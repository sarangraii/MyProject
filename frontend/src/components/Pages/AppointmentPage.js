// client/src/pages/AppointmentPage.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppointmentForm from '../Appointment/AppointmentForm';
import AppointmentList from '../Appointment/AppointmentList';
import AppointmentDetails from '../Appointment/AppointmentDetails';
import AppointmentCalendar from '../Appointment/AppointmentCalendar';
import axios from 'axios';
import './AppointmentPage.css';

const AppointmentPage = () => {
  const [services, setServices] = useState([]);
  const [stylists, setStylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch services
        const servicesResponse = await axios.get('http://localhost:4002/api/services');
        setServices(servicesResponse.data);
        
        // Mock data for stylists (in a real app, this would come from the API)
        setStylists([
          { id: 1, name: 'Priya Sharma', specialization: 'Hair Stylist' },
          { id: 2, name: 'Rahul Patel', specialization: 'Colorist' },
          { id: 3, name: 'Ananya Gupta', specialization: 'Makeup Artist' },
          { id: 4, name: 'Vikram Singh', specialization: 'Spa Therapist' },
          { id: 5, name: 'Meera Desai', specialization: 'Nail Technician' }
        ]);
        
        setLoading(false);
      } catch (error) {
        setError('Failed to load necessary data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="appointment-page">
      <Routes>
        <Route path="/" element={<Navigate to="/appointments/list" />} />
        <Route path="/list" element={<AppointmentList />} />
        <Route path="/calendar" element={<AppointmentCalendar />} />
        <Route path="/book" element={<AppointmentForm services={services} stylists={stylists} />} />
        <Route path="/:id" element={<AppointmentDetails />} />
        <Route path="/:id/edit" element={<AppointmentForm services={services} stylists={stylists} isEditing={true} />} />
      </Routes>
    </div>
  );
};

export default AppointmentPage;
