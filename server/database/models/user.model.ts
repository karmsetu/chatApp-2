import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
    id: string;
    name: string;
    room: string;
}

const userSchema = new Schema<IUser>(
    {
        id: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        room: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const User = model<IUser>('User', userSchema);

export default User;
