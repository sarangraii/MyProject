// import React from 'react';
// import { Link } from 'react-router-dom';
// import './BookingSuccess.css';

// const BookingSuccess = () => {
//   return (
//     <div className="booking-success">
//       <div className="success-container">
//         <div className="success-icon">
//           <i className="fas fa-check-circle"></i>
//         </div>
//         <h1>Booking Confirmed!</h1>
//         <p>Your appointment has been successfully booked. You will receive a confirmation email shortly.</p>
//         <div className="success-actions">
//           <Link to="/bookings" className="btn-view-bookings">View My Bookings</Link>
//           <Link to="/services" className="btn-back-services">Browse More Services</Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookingSuccess;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './BookingSuccess.css';

const BookingSuccess = () => {
  const [showBookingHistory, setShowBookingHistory] = useState(false);
  
  // Sample booking history data - in a real app, you would fetch this from your API/backend
  const bookingHistory = [
    { id: 1, service: "Haircut", date: "2025-03-22", time: "10:00 AM", status: "Completed" },
    { id: 2, service: "Massage", date: "2025-03-20", time: "2:30 PM", status: "Completed" },
    { id: 3, service: "Facial", date: "2025-03-18", time: "4:00 PM", status: "Cancelled" },
    { id: 4, service: "Manicure", date: "2025-03-23", time: "11:30 AM", status: "Upcoming" }
  ];

  const handleViewBookings = () => {
    setShowBookingHistory(true);
  };

  const handleBackToConfirmation = () => {
    setShowBookingHistory(false);
  };

  return (
    <div className="booking-success">
      {!showBookingHistory ? (
        <div className="success-container">
          <div className="success-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <h1>Booking Confirmed!</h1>
          <p>Your appointment has been successfully booked. You will receive a confirmation email shortly.</p>
          <div className="success-actions">
            <button onClick={handleViewBookings} className="btn-view-bookings">
              View My Bookings
            </button>
            <Link to="/services" className="btn-back-services">
              Browse More Services
            </Link>
          </div>
        </div>
      ) : (
        <div className="booking-history-container">
          <h1>My Booking History</h1>
          <div className="booking-list">
            {bookingHistory.map(booking => (
              <div key={booking.id} className={`booking-item ${booking.status.toLowerCase()}`}>
                <div className="booking-service">{booking.service}</div>
                <div className="booking-details">
                  <span className="booking-date">{booking.date}</span>
                  <span className="booking-time">{booking.time}</span>
                </div>
                <div className="booking-status">{booking.status}</div>
              </div>
            ))}
          </div>
          <div className="history-actions">
            <button onClick={handleBackToConfirmation} className="btn-back">
              Back to Confirmation
            </button>
            <Link to="/services" className="btn-back-services">
              Browse More Services
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingSuccess;

