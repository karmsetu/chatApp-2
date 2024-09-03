import React from 'react';
import { Link } from 'react-router-dom';
import { socket } from './socket';
import './css/join.css';

const Join = () => {
    const [formData, setFormData] = React.useState({
        name: '',
        room: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }));

    React.useEffect(() => {
        socket.disconnect();
        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div className="join-form-container">
            <form className="join-form">
                <div className="input-field">
                    <label htmlFor="name">name</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        onChange={handleChange}
                        value={formData.name}
                    />
                </div>

                <div className="input-field">
                    <label htmlFor="room">room</label>
                    <input
                        type="text"
                        name="room"
                        id="room"
                        onChange={handleChange}
                        value={formData.room}
                    />
                </div>

                {formData.room && (
                    <Link
                        to={`/chat?name=${formData.name}&room=${formData.room}`}
                        className="join-chat-button"
                    >
                        join chat
                    </Link>
                )}
            </form>
        </div>
    );
};

export default Join;
