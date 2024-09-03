import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

class Database {
    connectionString: string;
    private MONGO_URI =
        process.env.DATABASE_CONNECTION_STRING || `mongodb://127.0.0.1:27017`;
    constructor(path: string) {
        this.connectionString = `${this.MONGO_URI}/${path}`;
    }

    connect = () => {
        mongoose.connect(this.connectionString);
    };

    addUser = () => {};
}

type Users = { name: string; room: string; id: string };
let users: Users[] = [];

export const addUser = (name: string, room: string, id: string) => {
    const existingUser = users.find(
        (user) => user.name === name && user.room === room
    );
    if (existingUser)
        return { error: `cannot have same username in the same room` };

    const user = { id, name, room };
    users.push(user);
};
