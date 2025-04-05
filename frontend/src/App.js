import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Register from './components/Pages/Register';
import Login from './components/Pages/Login';
import Profile from './components/Pages/Profile';
import AppointmentPage from './components/Pages/AppointmentPage';
import Services from './components/Pages/Services';
import PrivateRoute from './components/PrivateRoute';
import BookingSuccess from './components/Booking/BookingSuccess';
import BookingPage from './components/Booking/BookingPage';
import Contact from "./components/Contact";
import Payment from "./Payment";
import AdminProfile from './components/Pages/AdminProfile';

// Import other page components

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path = "/login" element= {<Login />} />
            <Route path = "/profile" element= {<Profile/>} />
            <Route path='/admin/profile' element={<AdminProfile/>}/>
            <Route path = "/services" element= {<Services/>} />
            <Route path="/book-appointment" element={<BookingPage />} />
            <Route path="/bookings/success" element={<BookingSuccess />} />
            <Route path="/appointments/*" element={<AppointmentPage />} />
            <Route path="/contact" element={<Contact />} />
             /* Add a redirect for any undefined routes
            <Route path="*" element={<Navigate to="/services" />} />
            <Route path="/create-order" element={<Payment />} />
            <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
            {/* Add other routes as you develop more components */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

