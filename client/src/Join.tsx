import React from 'react';
import { Link } from 'react-router-dom';
import { socket } from './socket';

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
        <div>
            <form>
                <label htmlFor="name">name</label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    onChange={handleChange}
                    value={formData.name}
                />
                <label htmlFor="room">room</label>
                <input
                    type="text"
                    name="room"
                    id="room"
                    onChange={handleChange}
                    value={formData.room}
                />

                {formData.room.length && (
                    <Link
                        to={`/chat?name=${formData.name}&room=${formData.room}`}
                    >
                        join chat
                    </Link>
                )}
            </form>
        </div>
    );
};

export default Join;
