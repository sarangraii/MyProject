// client/src/components/Appointment/AppointmentList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserAppointments, updateAppointmentStatus, deleteAppointment } from '../../services/appointmentService';
import './AppointmentList.css';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await getUserAppointments();
      setAppointments(data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch appointments');
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await updateAppointmentStatus(id, 'cancelled');
        // Update the local state
        setAppointments(appointments.map(appointment => 
          appointment._id === id 
            ? { ...appointment, status: 'cancelled' } 
            : appointment
        ));
      } catch (error) {
        setError('Failed to cancel appointment');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await deleteAppointment(id);
        // Remove from local state
        setAppointments(appointments.filter(appointment => appointment._id !== id));
      } catch (error) {
        setError('Failed to delete appointment');
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div className="loading">Loading appointments...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="appointments-container">
      <h2>My Appointments</h2>
      
      {appointments.length === 0 ? (
        <div className="no-appointments">
          <p>You don't have any appointments yet.</p>
          <Link to="/book-appointment" className="btn-book">Book an Appointment</Link>
        </div>
      ) : (
        <div className="appointments-list">
          {appointments.map(appointment => (
            <div key={appointment._id} className={`appointment-card ${appointment.status}`}>
              <div className="appointment-header">
                <h3>{appointment.service.name}</h3>
                <span className={`status-badge ${appointment.status}`}>
                  {appointment.status}
                </span>
              </div>
              
              <div className="appointment-details">
                <p><strong>Date:</strong> {formatDate(appointment.date)}</p>
                <p><strong>Time:</strong> {appointment.time}</p>
                <p><strong>Stylist:</strong> {appointment.stylist}</p>
                <p><strong>Duration:</strong> {appointment.duration} min</p>
                <p><strong>Price:</strong> ₹{appointment.price}</p>
                {appointment.notes && <p><strong>Notes:</strong> {appointment.notes}</p>}
              </div>
              
              <div className="appointment-actions">
                <Link to={`/appointments/${appointment._id}`} className="btn-view">
                  View Details
                </Link>
                
                {appointment.status === 'pending' && (
                  <button 
                    onClick={() => handleCancel(appointment._id)} 
                    className="btn-cancel"
                  >
                    Cancel
                  </button>
                )}
                
                {(appointment.status === 'cancelled' || appointment.status === 'completed') && (
                  <button 
                    onClick={() => handleDelete(appointment._id)} 
                    className="btn-delete"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentList;
