import React, { useState } from "react";
import './Contact.css';

const Contact = () => {
  const defaultContactForm = {
    username: "",
    email: "",
    message: "",
  };

  const [contact, setContact] = useState(defaultContactForm);

  const handleChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) =>   {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4002/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
      });

      if (response.ok) {
        alert("Message sent successfully.");
        setContact(defaultContactForm);
      } else {
        alert("Failed to send message.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="contact-container">
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username" className="form-label">Your Name</label>
          <input
            id="username"
            type="text"
            name="username"
            placeholder="Enter your name"
            value={contact.username}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email" className="form-label">Your Email</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={contact.email}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="message" className="form-label">Your Message</label>
          <textarea
            id="message"
            name="message"
            placeholder="Enter your message"
            value={contact.message}
            onChange={handleChange}
            required
            className="form-textarea"
          ></textarea>
        </div>
        <button type="submit" className="submit-button">Send Message</button>
      </form>
      {/* ifream */}
      <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58896.88480710542!2d75.7878566486328!3d22.6889852!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fcfaa753f05d%3A0x975c63c15cb23f0b!2sUniversal%20Informatics!5e0!3m2!1sen!2sin!4v1741682271610!5m2!1sen!2sin" width="100%" height="450" Style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
  );
};

export default Contact;