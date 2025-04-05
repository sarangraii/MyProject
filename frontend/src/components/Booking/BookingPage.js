import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './BookingPage.css';

const BookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const serviceId = queryParams.get('service');

  const [service, setService] = useState(null);
  const [stylists, setStylists] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    serviceId: serviceId || '',
    stylistId: '',
    date: '',
    timeSlot: '',
    notes: ''
  });

  // Fetch service details when component mounts or serviceId changes
  useEffect(() => {
    const fetchServiceDetails = async () => {
      if (!serviceId) {
        navigate('/services');
        return;
      }
      
      try {
        setLoading(true);
        
        // Option 1: Use your local data instead of making an API call
        const servicesData = [
          {
            id: 1,
            name: "Men's Haircut",
            description: "Professional haircut tailored to your style preferences.",
            price: "₹2,175",
            duration: "30 min",
            category: "haircuts",
            gender: "male",
            image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
          },
          {
            id: 2,
            name: "Women's Haircut",
            description: "Custom haircut and styling by our expert stylists.",
            price: "₹3,045",
            duration: "45 min",
            category: "haircuts",
            gender: "female",
            image: "https://images.unsplash.com/photo-1560869713-7d0a29430803?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
          },
          {
            id: 3,
            name: "Hair Coloring",
            description: "Full hair coloring with premium products for vibrant, long-lasting color.",
            price: "₹5,655+",
            duration: "90 min",
            category: "coloring",
            gender: "female",
            image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80"
          },
          {
            id: 4,
            name: "Highlights",
            description: "Partial or full highlights to add dimension to your hair.",
            price: "₹6,525+",
            duration: "120 min",
            category: "coloring",
            gender: "female",
            image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80"
          },
          {
            id: 5,
            name: "Deep Conditioning Treatment",
            description: "Intensive hair treatment to restore moisture and shine.",
            price: "₹3,480",
            duration: "45 min",
            category: "treatments",
            gender: "unisex",
            image: "https://images.unsplash.com/photo-1635364477626-7b8d59ad2a41?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
          },
          {
            id: 6,
            name: "Keratin Treatment",
            description: "Smoothing treatment that eliminates frizz and adds shine.",
            price: "₹13,050+",
            duration: "120 min",
            category: "treatments",
            gender: "unisex",
            image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
          },
          {
            id: 7,
            name: "Bridal Makeup",
            description: "Complete makeup application for your special day.",
            price: "₹10,440",
            duration: "90 min",
            category: "makeup",
            gender: "female",
            image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
          },
          {
            id: 8,
            name: "Everyday Makeup",
            description: "Natural-looking makeup for everyday occasions.",
            price: "₹4,350",
            duration: "45 min",
            category: "makeup",
            gender: "female",
            image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80"
          },
          {
            id: 9,
            name: "Swedish Massage",
            description: "Relaxing full-body massage to relieve tension and stress.",
            price: "₹5,220",
            duration: "60 min",
            category: "spa",
            gender: "unisex",
            image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
          },
          {
            id: 10,
            name: "Deep Tissue Massage",
            description: "Therapeutic massage targeting deeper muscle layers.",
            price: "₹6,525",
            duration: "60 min",
            category: "spa",
            gender: "unisex",
            image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
          },
          {
            id: 11,
            name: "Manicure",
            description: "Nail shaping, cuticle care, and polish application.",
            price: "₹2,175",
            duration: "30 min",
            category: "nails",
            gender: "unisex",
            image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
          },
          {
            id: 12,
            name: "Pedicure",
            description: "Foot soak, exfoliation, nail care, and polish.",
            price: "₹3,045",
            duration: "45 min",
            category: "nails",
            gender: "unisex",
            image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
          },
          {
            id: 13,
            name: "Beard Trim",
            description: "Professional beard shaping and trimming.",
            price: "₹1,305",
            duration: "15 min",
            category: "haircuts",
            gender: "male",
            image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
          },
          {
            id: 14,
            name: "Men's Hair Coloring",
            description: "Natural-looking color to cover gray or change your look.",
            price: "₹3,915",
            duration: "45 min",
            category: "coloring",
            gender: "male",
            image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
          }
        ];
        
        const service = servicesData.find(s => s.id.toString() === serviceId);
        
        if (service) {
          setService(service);
          setFormData(prev => ({...prev, serviceId: service.id}));
        } else {
          setError('Service not found');
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch service details');
        setLoading(false);
        setTimeout(() => {
          navigate('/services');
        }, 3000);
      }
    };

    fetchServiceDetails();
  }, [serviceId, navigate]);

  // Fetch stylists when component mounts
  useEffect(() => {
    // Use mock data for stylists instead of API call
    const mockStylists = [
      { _id: '1', name: 'Priya Sharma', specialization: 'Hair Stylist' },
      { _id: '2', name: 'Rahul Patel', specialization: 'Colorist' },
      { _id: '3', name: 'Ananya Gupta', specialization: 'Makeup Artist' },
      { _id: '4', name: 'Vikram Singh', specialization: 'Spa Therapist' },
      { _id: '5', name: 'Meera Desai', specialization: 'Nail Technician' }
    ];
    
    setStylists(mockStylists);
  }, []);

  // Generate mock available time slots
  useEffect(() => {
    const generateMockTimeSlots = () => {
      if (!formData.date || !formData.stylistId || !formData.serviceId) return;
      
      setLoading(true);
      
      // Generate time slots from 9 AM to 7 PM at 30-minute intervals
      const mockSlots = [];
      for (let hour = 9; hour < 19; hour++) {
        mockSlots.push(`${hour.toString().padStart(2, '0')}:00`);
        mockSlots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
      
      setAvailableSlots(mockSlots);
      setLoading(false);
    };

    generateMockTimeSlots();
  }, [formData.date, formData.stylistId, formData.serviceId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Reset time slot when date or stylist changes
    if (name === 'date' || name === 'stylistId') {
      setFormData(prev => ({...prev, timeSlot: ''}));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login', { state: { from: location.pathname + location.search } });
        return;
      }
      
      // Mock successful booking
      setTimeout(() => {
        setLoading(false);
        navigate('/bookings/success');
      }, 1500);
    } catch (err) {
      setError('Failed to create booking');
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/services');
  };

  if (loading && !service) return <div className="loading">Loading...</div>;
  if (error) return (
    <div className="error-container">
      <div className="error-message">{error}</div>
      <button onClick={() => navigate('/services')} className="btn-return">
        Return to Services
      </button>
    </div>
  );
  if (!service && serviceId) return (
    <div className="not-found">
      <p>Service not found</p>
      <button onClick={() => navigate('/services')} className="btn-return">
        Return to Services
      </button>
    </div>
  );

  return (
    <div className="booking-page">
      <div className="booking-container">
        <h1>Book Your Appointment</h1>
        
        {service && (
          <div className="selected-service">
            <div className="service-image">
              <img src={service.image} alt={service.name} />
            </div>
            <div className="service-details">
              <h2>{service.name}</h2>
              <p>{service.description}</p>
              <div className="service-meta">
                <span className="price">{service.price}</span>
                <span className="duration">{service.duration}</span>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="booking-form">
          {!service && (
            <div className="form-group">
              <label htmlFor="serviceId">Select Service</label>
              <select 
                id="serviceId" 
                name="serviceId" 
                value={formData.serviceId} 
                onChange={handleInputChange}
                required
              >
                <option value="">Select a service</option>
                {/* This would be populated from your services API */}
              </select>
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="stylistId">Select Stylist</label>
            <select 
              id="stylistId" 
              name="stylistId" 
              value={formData.stylistId} 
              onChange={handleInputChange}
              required
            >
              <option value="">Select a stylist</option>
              {stylists.map(stylist => (
                <option key={stylist._id} value={stylist._id}>
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
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          
          {formData.date && formData.stylistId && (
            <div className="form-group">
              <label>Select Time Slot</label>
              <div className="time-slots">
                {availableSlots.length > 0 ? (
                  availableSlots.map(slot => (
                    <button
                      key={slot}
                      type="button"
                      className={`time-slot ${formData.timeSlot === slot ? 'selected' : ''}`}
                      onClick={() => setFormData({...formData, timeSlot: slot})}
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
          
          <div className="form-group">
            <label htmlFor="notes">Special Requests or Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows="3"
            ></textarea>
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-book-now"
              disabled={!formData.timeSlot || loading}
            >
              {loading ? 'Processing...' : 'Book Now'}
            </button>
            <button 
              type="button" 
              className="btn-cancel"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;