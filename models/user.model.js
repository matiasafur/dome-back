import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 5
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        validate: {
            validator: function (v) {
                return /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
    },
    devices: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Device'
        }
    ],
});

userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
        next();
    } catch (error) {
        return next(error);
    }
});

userSchema.methods.checkPassword = async function (candidate) {
    try {
        const match = await bcrypt.compare(candidate, this.password);
        return match;
    } catch (error) {
        throw new Error(error);
    }
};

export default mongoose.model('User', userSchema);