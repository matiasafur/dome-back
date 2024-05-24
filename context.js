import jwt from 'jsonwebtoken';
import userModel from './models/user.model.js';

const User = userModel;

const getUser = async (token) => {
    try {
        const accessToken = token.split(' ')[1];
        const { userId } = jwt.verify(accessToken, process.env.JWT_SECRET);
        const currentUser = await User.findById(userId).populate('devices');
        return currentUser;
    } catch (error) {
        console.log('Error getting user: ', error);
        return null;
    }
};

const isTokenExpired = (token) => {
    try {
        const accessToken = token.split(' ')[1];
        const decoded = jwt.decode(accessToken);
        if (!decoded || !decoded.exp) {
            return true;
        }
        const now = Math.floor(Date.now() / 1000);
        return decoded.exp < now;
    } catch (error) {
        console.log('Error decoding token:', error);
        return true;
    }
};

const context = async ({ req }) => {
    const authorizationHeader = req ? req.headers.authorization : null;

    if (!authorizationHeader || !authorizationHeader.toLowerCase().startsWith('bearer ')) {
        return null;
    }

    const token = authorizationHeader;

    if (isTokenExpired(token)) {
        return null;
    }

    const currentUser = await getUser(token);
    return { currentUser };
};

export default context;
