import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AppointmentsSection.css';

const AppointmentsSection = ({ clientId }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');
  const [rescheduleData, setRescheduleData] = useState({
    appointmentId: null,
    date: '',
    timeSlot: ''
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const { data } = await axios.get('/api/appointments', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setAppointments(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch appointments');
      setLoading(false);
    }
  };

  const handleCancel = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      await axios.patch(`/api/appointments/${appointmentId}/status`, 
        { status: 'cancelled' },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Update local state
      setAppointments(appointments.map(appointment => 
        appointment._id === appointmentId 
          ? { ...appointment, status: 'cancelled' } 
          : appointment
      ));
      
      setMessage({ type: 'success', text: 'Appointment cancelled successfully' });
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to cancel appointment' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRescheduleClick = async (appointment) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch available slots for the selected service and stylist
      const { data } = await axios.get('/api/appointments/available-slots', {
        params: {
          serviceId: appointment.service._id,
          stylistId: appointment.stylist,
          date: new Date().toISOString().split('T')[0] // Default to today
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setAvailableSlots(data);
      setRescheduleData({
        appointmentId: appointment._id,
        date: new Date().toISOString().split('T')[0],
        timeSlot: ''
      });
      
      setLoading(false);
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: 'Failed to fetch available time slots' 
      });
      setLoading(false);
    }
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    
    if (!rescheduleData.date || !rescheduleData.timeSlot) {
      setMessage({ type: 'error', text: 'Please select both date and time' });
      return;
    }
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const { data } = await axios.put(
        `/api/appointments/${rescheduleData.appointmentId}`,
        {
          date: rescheduleData.date,
          time: rescheduleData.timeSlot
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Update local state
      setAppointments(appointments.map(appointment => 
        appointment._id === rescheduleData.appointmentId 
          ? { ...appointment, date: data.date, time: data.time } 
          : appointment
      ));
      
      // Reset reschedule form
      setRescheduleData({
        appointmentId: null,
        date: '',
        timeSlot: ''
      });
      
      setMessage({ type: 'success', text: 'Appointment rescheduled successfully' });
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to reschedule appointment' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = async (e) => {
    const selectedDate = e.target.value;
    setRescheduleData({
      ...rescheduleData,
      date: selectedDate,
      timeSlot: ''
    });
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Find the appointment to get service and stylist info
      const appointment = appointments.find(a => a._id === rescheduleData.appointmentId);
      
      // Fetch available slots for the selected date
      const { data } = await axios.get('/api/appointments/available-slots', {
        params: {
          serviceId: appointment.service._id,
          stylistId: appointment.stylist,
          date: selectedDate
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setAvailableSlots(data);
      setLoading(false);
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: 'Failed to fetch available time slots' 
      });
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filter appointments based on active tab
  const currentDate = new Date();
  const upcomingAppointments = appointments.filter(appointment => 
    new Date(appointment.date) >= currentDate && 
    appointment.status !== 'cancelled'
  );
  
  const pastAppointments = appointments.filter(appointment => 
    new Date(appointment.date) < currentDate || 
    appointment.status === 'cancelled'
  );

  const displayAppointments = activeTab === 'upcoming' ? upcomingAppointments : pastAppointments;

  if (loading && appointments.length === 0) return <div className="loading">Loading appointments...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="appointments-section">
      <h2>My Appointments</h2>
      
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      <div className="appointments-tabs">
        <button 
          className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming
        </button>
        <button 
          className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`}
          onClick={() => setActiveTab('past')}
        >
          Past
        </button>
      </div>
      
      {rescheduleData.appointmentId && (
        <div className="reschedule-form">
          <h3>Reschedule Appointment</h3>
          <form onSubmit={handleRescheduleSubmit}>
            <div className="form-group">
              <label htmlFor="reschedule-date">Select New Date</label>
              <input 
                type="date" 
                id="reschedule-date" 
                value={rescheduleData.date}
                onChange={handleDateChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            
            {rescheduleData.date && (
              <div className="form-group">
                <label>Select New Time</label>
                <div className="time-slots">
                  {availableSlots.length > 0 ? (
                    availableSlots.map(slot => (
                      <button
                        key={slot}
                        type="button"
                        className={`time-slot ${rescheduleData.timeSlot === slot ? 'selected' : ''}`}
                        onClick={() => setRescheduleData({...rescheduleData, timeSlot: slot})}
                      >
                        {slot}
                      </button>
                    ))
                  ) : (
                    <p className="no-slots">No available slots for the selected date.</p>
                  )}
                </div>
              </div>
            )}
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="btn-save" 
                disabled={!rescheduleData.timeSlot || loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                type="button" 
                className="btn-cancel"
                onClick={() => setRescheduleData({
                  appointmentId: null,
                  date: '',
                  timeSlot: ''
                })}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      {displayAppointments.length === 0 ? (
        <div className="no-appointments">
          <p>You don't have any {activeTab} appointments.</p>
          {activeTab === 'upcoming' && (
            <button 
              onClick={() => navigate('/services')} 
              className="btn-book-new"
            >
              Book an Appointment
            </button>
          )}
        </div>
      ) : (
        <div className="appointments-list">
          {displayAppointments.map(appointment => (
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
                <p><strong>Duration:</strong> {appointment.service.duration}</p>
                <p><strong>Price:</strong> {appointment.service.price}</p>
                {appointment.notes && <p><strong>Notes:</strong> {appointment.notes}</p>}
              </div>
              
              <div className="appointment-actions">
                {appointment.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => handleRescheduleClick(appointment)} 
                      className="btn-reschedule"
                    >
                      Reschedule
                    </button>
                    <button 
                      onClick={() => handleCancel(appointment._id)} 
                      className="btn-cancel"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentsSection;
