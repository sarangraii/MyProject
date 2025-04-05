import React, { useState } from "react";
import './Payment.css';  // Import the CSS file

const Payment = () => {
    const [amount, setAmount] = useState("");

    const handlePayment = async () => {
        const response = await fetch("http://localhost:4002/api/payment/create-order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount: amount * 100 }), // Convert to smallest currency unit (paisa)
        });

        const orderData = await response.json();
        const options = {
            key: process.env.REACT_APP_RAZORPAY_KEY_ID,
            amount: orderData.amount,
            currency: orderData.currency,
            name: "Your Company Name",
            description: "Test Transaction",
            order_id: orderData.id,
            handler: function (response) {
                alert(`Payment successful: ${response.razorpay_payment_id}`);
                console.log(response);
            },
            prefill: {
                name: "Your Name",
                email: "youremail@example.com",
                contact: "9999999999",
            },
            theme: {
                color: "#3399cc",
            },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
    };

    return (
        <div className="payment-container">
            <h2 className="payment-title">Payment</h2>
            <input
                className="payment-input"
                type="number"
                placeholder="Enter Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <button 
                className="payment-button" 
                onClick={handlePayment}
            >
                Pay
            </button>
        </div>
    );
};

export default Payment;