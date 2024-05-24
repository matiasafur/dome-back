import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    },
    type: {
        type: String,
        required: true,
        enum: ['sensor', 'actuator']
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },
    description: {
        type: String,
        maxLenght: 200,
        default: 'My Device Description'
    },
    location: {
        type: String,
        minLength: 3,
        default: 'My Location'
    },
    connection: {
        type: String,
        enum: ['wifi', 'ethernet', 'other'],
        default: 'other'
    },
    signalPower: {
        type: Number,
        min: 0,
        max: 100,
        default: 100
    },
    alerts: [{
        type: String
    }]
});

export default mongoose.model('Device', deviceSchema);