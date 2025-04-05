// client/src/components/Appointment/AppointmentDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getAppointmentById, updateAppointmentStatus, deleteAppointment } from '../../services/appointmentService';
import './AppointmentDetails.css';

const AppointmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        setLoading(true);
        const data = await getAppointmentById(id);
        setAppointment(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch appointment details');
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [id]);

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await updateAppointmentStatus(id, 'cancelled');
        setAppointment({ ...appointment, status: 'cancelled' });
      } catch (error) {
        setError('Failed to cancel appointment');
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await deleteAppointment(id);
        navigate('/appointments');
      } catch (error) {
        setError('Failed to delete appointment');
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div className="loading">Loading appointment details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!appointment) return <div className="not-found">Appointment not found</div>;

  return (
    <div className="appointment-details-container">
      <h2>Appointment Details</h2>
      
      <div className="appointment-details-card">
        <div className="appointment-header">
          <h3>{appointment.service.name}</h3>
          <span className={`status-badge ${appointment.status}`}>
            {appointment.status}
          </span>
        </div>
        
        <div className="appointment-info">
          <div className="service-image">
            <img src={appointment.service.image} alt={appointment.service.name} />
          </div>
          
          <div className="appointment-data">
            <p><strong>Date:</strong> {formatDate(appointment.date)}</p>
            <p><strong>Time:</strong> {appointment.time}</p>
            <p><strong>Stylist:</strong> {appointment.stylist}</p>
            <p><strong>Duration:</strong> {appointment.duration} min</p>
            <p><strong>Price:</strong> ₹{appointment.price}</p>
            
            <div className="service-details">
              <h4>Service Details</h4>
              <p>{appointment.service.description}</p>
              <p><strong>Category:</strong> {appointment.service.category}</p>
            </div>
            
            {appointment.notes && (
              <div className="notes-section">
                <h4>Your Notes</h4>
                <p>{appointment.notes}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="appointment-actions">
          <Link to="/appointments" className="btn-back">
            Back to Appointments
          </Link>
          
          {appointment.status === 'pending' && (
            <>
              <Link to={`/appointments/${id}/edit`} className="btn-edit">
                Edit Appointment
              </Link>
              <button onClick={handleCancel} className="btn-cancel">
                Cancel Appointment
              </button>
            </>
          )}
          
          {(appointment.status === 'cancelled' || appointment.status === 'completed') && (
            <button onClick={handleDelete} className="btn-delete">
              Delete Appointment
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetails;
