import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import axios from 'axios';

const dummyData = {
    male: [
      { id: 1, name: "Men's Haircut", price: "₹2,175", category: "male" },
      { id: 2, name: "Beard Trim", price: "₹1,305", category: "male" },
      { id: 3, name: "Hair Color for Men", price: "₹3,915", category: "male" },
      { id: 4, name: "Men's Facial", price: "₹3,045", category: "male" },
      { id: 5, name: "Men's Manicure", price: "₹1,740", category: "male" }
    ],
    female: [
      { id: 6, name: "Women's Haircut", price: "₹3,045", category: "female" },
      { id: 7, name: "Hair Coloring", price: "₹5,655", category: "female" },
      { id: 8, name: "Blowout & Styling", price: "₹3,480", category: "female" },
      { id: 9, name: "Makeup Application", price: "₹4,350", category: "female" },
      { id: 10, name: "Manicure & Pedicure", price: "₹3,915", category: "female" }
    ],
    unisex: [
      { id: 11, name: "Spa Massage", price: "₹5,220", category: "unisex" },
      { id: 12, name: "Hair Treatment", price: "₹3,480", category: "unisex" },
      { id: 13, name: "Eyebrow Threading", price: "₹1,305", category: "unisex" },
      { id: 14, name: "Waxing Services", price: "₹2,610+", category: "unisex" },
      { id: 15, name: "Hair Wash & Conditioning", price: "₹2,175", category: "unisex" }
    ]
  };
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSalonSearchOpen, setIsSalonSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [salonSearchQuery, setSalonSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSalonCategory, setSelectedSalonCategory] = useState('all');
  const [searchResults, setSearchResults] = useState([]);
  const [salonResults, setSalonResults] = useState([]);
  const searchRef = useRef(null);
  const salonSearchRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isSearchOpen) setIsSearchOpen(false);
    if (isSalonSearchOpen) setIsSalonSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSalonSearchOpen) setIsSalonSearchOpen(false);
    if (!isSearchOpen) {
      setTimeout(() => {
        if (searchRef.current) searchRef.current.focus();
      }, 100);
    }
  };

  const toggleSalonSearch = () => {
    setIsSalonSearchOpen(!isSalonSearchOpen);
    if (isSearchOpen) setIsSearchOpen(false);
    if (!isSalonSearchOpen) {
      setTimeout(() => {
        if (salonSearchRef.current) salonSearchRef.current.focus();
      }, 100);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    performSearch(e.target.value, selectedCategory);
  };

  const handleSalonSearchChange = (e) => {
    setSalonSearchQuery(e.target.value);
    performSalonSearch(e.target.value, selectedSalonCategory);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    performSearch(searchQuery, e.target.value);
  };

  const handleSalonCategoryChange = (e) => {
    setSelectedSalonCategory(e.target.value);
    performSalonSearch(salonSearchQuery, e.target.value);
  };

  const performSearch = (query, category) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    let results = [];
    const searchTerm = query.toLowerCase();

    if (category === 'all') {
      // Search in all categories
      Object.values(dummyData).forEach(categoryData => {
        results = [...results, ...categoryData.filter(item => 
          item.name.toLowerCase().includes(searchTerm)
        )];
      });
    } else {
      // Search in specific category
      results = dummyData[category]?.filter(item => 
        item.name.toLowerCase().includes(searchTerm)
      ) || [];
    }

    setSearchResults(results);
  };

  const performSalonSearch = async (query, category) => {
    if (!query.trim()) {
      setSalonResults([]);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:4002/api/salons/search`, {
        params: {
          query: query,
          category: category
        }
      });
      setSalonResults(response.data);
    } catch (error) {
      console.error("Error searching salons:", error);
      setSalonResults([]);
    }
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
      if (salonSearchRef.current && !salonSearchRef.current.contains(event.target)) {
        setIsSalonSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          One Stop Salon
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          <i className={isMenuOpen ? 'fas fa-times' : 'fas fa-bars'} />
        </div>

        <ul className={isMenuOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/register" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Register
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/Login" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Login
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/profile" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Profile
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/services" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Services
            </Link>
          </li>
          {/* <li className="nav-item search-item">
            <div className={`search-container ${isSearchOpen ? 'active' : ''}`} ref={searchRef}>
              <div className="search-icon" onClick={toggleSearch}>
                <i className="fas fa-search"></i>
              </div>
              
              {isSearchOpen && (
                <div className="search-dropdown">
                  <div className="search-input-container">
                    <input
                      type="text"
                      placeholder="Search services..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="search-input"
                    />
                    <select 
                      className="category-select"
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                    >
                      <option value="all">All</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="unisex">Unisex</option>
                    </select>
                  </div>
                  
                  {searchResults.length > 0 && (
                    <div className="search-results">
                      {searchResults.map(result => (
                        <Link 
                          key={result.id} 
                          to={`/services/${result.category}/${result.id}`}
                          className="search-result-item"
                          onClick={() => {
                            setIsSearchOpen(false);
                            setIsMenuOpen(false);
                          }}
                        >
                          <div className="search-result-name">{result.name}</div>
                          <div className="search-result-price">{result.price}</div>
                          <div className={`search-result-category ${result.category}`}>
                            {result.category}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                  
                  {searchQuery && searchResults.length === 0 && (
                    <div className="no-results">
                      No services found matching "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>
          </li> */}
          
          {/* New Salon Search Item */}
          {/* <li className="nav-item search-item">
            <div className={`search-container ${isSalonSearchOpen ? 'active' : ''}`} ref={salonSearchRef}>
              <div className="search-icon salon-search-icon" onClick={toggleSalonSearch}>
                <i className="fas fa-cut"></i>
                <span className="search-text">Search Salon</span>
              </div>
              
              {isSalonSearchOpen && (
                <div className="search-dropdown">
                  <div className="search-input-container">
                    <input
                      type="text"
                      placeholder="Search salons..."
                      value={salonSearchQuery}
                      onChange={handleSalonSearchChange}
                      className="search-input"
                    />
                    <select 
                      className="category-select"
                      value={selectedSalonCategory}
                      onChange={handleSalonCategoryChange}
                    >
                      <option value="all">All Salons</option>
                      <option value="male">Male Salons</option>
                      <option value="female">Female Salons</option>
                      <option value="unisex">Unisex Salons</option>
                    </select>
                  </div>
                  
                  {salonResults.length > 0 && (
                    <div className="search-results">
                      {salonResults.map(salon => (
                        <Link 
                          key={salon._id} 
                          to={`/salons/${salon._id}`}
                          className="search-result-item"
                          onClick={() => {
                            setIsSalonSearchOpen(false);
                            setIsMenuOpen(false);
                          }}
                        >
                          <div className="search-result-name">{salon.name}</div>
                          <div className="search-result-location">{salon.location}</div>
                          <div className={`search-result-category ${salon.type}`}>
                            {salon.type}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                  
                  {salonSearchQuery && salonResults.length === 0 && (
                    <div className="no-results">
                      No salons found matching "{salonSearchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>
          </li> */}
          
          <li className="nav-item">
            <Link to="/contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Contact
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/appointment" className="nav-link appointment-btn" onClick={() => setIsMenuOpen(false)}>
              Book Now
            </Link>
          </li>
          {/* <li className="nav-item">
            <Link to="/bill" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Bills
            </Link>
          </li> */}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;