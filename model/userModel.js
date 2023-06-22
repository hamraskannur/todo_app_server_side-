import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        maxlength: 50,
        match: /^[A-Za-z\s]+$/,
    },
    emailAddress: {
        type: String,
        required: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        validate: {
            validator: function (value) {
                return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(value);
            },
            message: 'Password must contain at least 8 characters with at least one uppercase letter and one digit.',
        },
    },
    phoneNumber: {
        type: Number,
        required: true,
        match: /^\d{10}$/,
    },
});

export const userModel = mongoose.model('User', userSchema);