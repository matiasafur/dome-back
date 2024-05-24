import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

const User = userModel;

const userResolvers = {
    Query: {
        getUserById: async (_, { id }) => {
            try {
                const user = await User.findById(id).populate('devices');
                return user;
            } catch (error) {
                throw new Error('Invalid id value');
            }
        },
        getUserByName: async (_, { username }) => {
            try {
                const user = await User.findOne({ username }).populate('devices');

                return user;
            } catch (error) {
                console.log(error);
                throw new Error('Failed to fetch user');
            }
        },
        listUsers: async () => {
            try {
                const users = await User.find().populate('devices');
                return users;
            } catch (error) {
                throw new Error('Failed to fetch users');
            }
        },
        me: async (_, args, context) => {
            return context.currentUser;
        },
    },

    Mutation: {
        createUser: async (_, { username, email, password }) => {
            try {
                const user = await User.create({ username, email, password });
                return user;
            } catch (error) {
                if (error.code === 11000) {
                    if (error.keyPattern?.username) throw new Error('Username not available');
                    else if (error.keyPattern?.email) throw new Error('E-mail not available');
                    else if (error.errors?.password?.kind === 'minlength') throw new Error('Password is too short');
                } else throw new Error('Failed to create a new User');
            }
        },
        login: async (_, { username, password }) => {
            try {
                const user = await User.findOne({ username });

                if (!user) {
                    throw new Error('No such user found');
                }

                const match = await user.checkPassword(password);

                if (!match) {
                    throw new Error('Invalid password');
                }

                const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
                    expiresIn: '30d',
                });

                return {
                    token
                };
            } catch (error) {
                throw new Error('Login failed');
            }
        },
    },
};

export default userResolvers;