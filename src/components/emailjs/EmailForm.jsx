import React, { useState } from 'react';

const EmailForm = ({ buyerMob, sellerMob, buyerEmail, sellerEmail, setIsEmailSent }) => {
    const [buttonText, setButtonText] = useState("Get contact info");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setButtonText("Please wait...")

        try {
            let data = await fetch(`${import.meta.env.VITE_BACKEND}/api/user/sendEmail`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ buyerMob: buyerMob, sellerMob: sellerMob, buyerEmail: buyerEmail, sellerEmail: sellerEmail }),
            });
            data = await data.json();
            console.log(data);
            setIsEmailSent(true);
            setButtonText("Get contact info")
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <button type="submit" className="interested hover:scale-105">{buttonText}</button>
        </form>
    );
};

export default EmailForm;
