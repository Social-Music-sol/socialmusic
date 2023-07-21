import React, { useState } from 'react';
import './UserCard.css'; // Import CSS

const UserCard = ({ user }) => {
    const [image, setImage] = useState(null);

    const handleImageChange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setImage(reader.result);
        }

        if (file) {
            reader.readAsDataURL(file);
        } else {
            setImage(null);
        }
    }

    return (
        <div className="user-card">
            <p>{user}</p>
            <input type="file" onChange={handleImageChange} accept="image/*" />
            {image && <img src={image} alt="Profile" />}
        </div>
    );
};

export default UserCard;
