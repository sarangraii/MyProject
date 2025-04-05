// client/src/components/Appointment/AppointmentCalendar.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserAppointments } from '../../services/appointmentService';
import './AppointmentCalendar.css';

const AppointmentCalendar = () => {
  const [appointments, setAppointments] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
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

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      
      // Find appointments for this day
      const dayAppointments = appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        return (
          appointmentDate.getDate() === day &&
          appointmentDate.getMonth() === month &&
          appointmentDate.getFullYear() === year
        );
      });
      
      days.push(
        <div 
          key={day} 
          className={`calendar-day ${dayAppointments.length > 0 ? 'has-appointments' : ''}`}
            >
              <span className="day-number">{day}</span>
              
              {dayAppointments.length > 0 && (
                <div className="day-appointments">
                  {dayAppointments.map(appointment => (
                    <Link 
                      key={appointment._id} 
                      to={`/appointments/${appointment._id}`}
                      className={`appointment-dot ${appointment.status}`}
                      title={`${appointment.service.name} at ${appointment.time}`}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        }
        
        return (
          <div className="calendar-container">
            <div className="calendar-header">
              <button 
                onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                className="month-nav"
              >
                &lt;
              </button>
              <h3>{monthNames[month]} {year}</h3>
              <button 
                onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                className="month-nav"
              >
                &gt;
              </button>
            </div>
            
            <div className="weekdays">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>
            
            <div className="calendar-days">
              {days}
            </div>
          </div>
        );
      };
    
      if (loading) return <div className="loading">Loading calendar...</div>;
      if (error) return <div className="error-message">{error}</div>;
    
      return (
        <div className="calendar-view">
          <h2>My Appointment Calendar</h2>
          {renderCalendar()}
          
          <div className="calendar-legend">
            <div className="legend-item">
              <span className="dot pending"></span>
              <span>Pending</span>
            </div>
            <div className="legend-item">
              <span className="dot confirmed"></span>
              <span>Confirmed</span>
            </div>
            <div className="legend-item">
              <span className="dot cancelled"></span>
              <span>Cancelled</span>
            </div>
            <div className="legend-item">
              <span className="dot completed"></span>
              <span>Completed</span>
            </div>
          </div>
          
          <div className="calendar-actions">
            <Link to="/book-appointment" className="btn-book">Book New Appointment</Link>
            <Link to="/appointments" className="btn-view-list">View as List</Link>
          </div>
        </div>
      );
    };
    
    export default AppointmentCalendar;