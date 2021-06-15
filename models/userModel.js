import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const { Schema, model } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        lowercase: true,
        index: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

// hash password
userSchema.methods.hashPassword = function hashPassword(password) {
    this.password = bcrypt.hashSync(password, 12);
};

// check password login
userSchema.methods.isValidPassword = function isValidPassword(password) {
    return bcrypt.compareSync(password, this.password);
};

// generate token
userSchema.methods.generateJWT = function generateJWT() {
    return jwt.sign(
        {
            _id: this.id,
            email: this.email,
        },
        process.env.JWT_SECRET
    );
};

// return user
userSchema.methods.returnAuthUser = function returnAuthUser() {
    return {
        _id: this._id,
        email: this.email,
        token: this.generateJWT(),
    };
};

const User = model('User', userSchema);

export default User;
