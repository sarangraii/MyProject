// client/src/components/Appointment/AppointmentForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createAppointment, getAvailableTimeSlots } from '../../services/appointmentService';
import './AppointmentForm.css';

const AppointmentForm = ({ services, stylists }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const preSelectedServiceId = queryParams.get('service');

  const [formData, setFormData] = useState({
    serviceId: preSelectedServiceId || '',
    stylist: '',
    date: '',
    time: '',
    notes: ''
  });

  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Get available time slots when date, service, and stylist are selected
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (formData.date && formData.serviceId && formData.stylist) {
        try {
          setLoading(true);
          const slots = await getAvailableTimeSlots(
            formData.date,
            formData.serviceId,
            formData.stylist
          );
          setAvailableTimeSlots(slots);
          setLoading(false);
        } catch (error) {
          setError('Failed to fetch available time slots');
          setLoading(false);
        }
      }
    };

    fetchTimeSlots();
  }, [formData.date, formData.serviceId, formData.stylist]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Reset time when date, service or stylist changes
    if (name === 'date' || name === 'serviceId' || name === 'stylist') {
      setFormData(prev => ({
        ...prev,
        time: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      await createAppointment(formData);
      
      setSuccess('Appointment booked successfully!');
      setLoading(false);
      
      // Redirect to appointments list after successful booking
      setTimeout(() => {
        navigate('/appointments');
      }, 2000);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  return (
    <div className="appointment-form-container">
      <h2>Book an Appointment</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit} className="appointment-form">
        <div className="form-group">
          <label htmlFor="serviceId">Select Service</label>
          <select
            id="serviceId"
            name="serviceId"
            value={formData.serviceId}
            onChange={handleChange}
            required
          >
            <option value="">Select a service</option>
            {services.map(service => (
              <option key={service._id} value={service._id}>
                {service.name} - {service.price} ({service.duration} min)
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="stylist">Select Stylist</label>
          <select
            id="stylist"
            name="stylist"
            value={formData.stylist}
            onChange={handleChange}
            required
          >
            <option value="">Select a stylist</option>
            {stylists.map(stylist => (
              <option key={stylist.id} value={stylist.name}>
                {stylist.name} - {stylist.specialization}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="date">Select Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>
        
        {formData.date && formData.serviceId && formData.stylist && (
          <div className="form-group">
            <label htmlFor="time">Select Time</label>
            {loading ? (
              <p>Loading available time slots...</p>
            ) : availableTimeSlots.length > 0 ? (
              <div className="time-slots">
                {availableTimeSlots.map(slot => (
                  <button
                    type="button"
                    key={slot}
                    className={`time-slot ${formData.time === slot ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, time: slot })}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            ) : (
              <p>No available time slots for the selected date.</p>
            )}
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="notes">Special Requests or Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
          ></textarea>
        </div>
        
        <button 
          type="submit" 
          className="btn-book-appointment"
          disabled={loading || !formData.time}
        >
          {loading ? 'Booking...' : 'Book Appointment'}
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;
