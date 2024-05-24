import deviceModel from "../models/device.model.js";
import userModel from "../models/user.model.js";
import { GraphQLError } from "graphql";
import { ApolloServerErrorCode } from "@apollo/server/errors";

const User = userModel;
const Device = deviceModel;

const deviceResolvers = {
    Query: {
        getDeviceById: async (_, { id }) => {
            try {
                const device = await Device.findById(id);
                if (!device) {
                    throw new GraphQLError('Device not found', {
                        extensions: {
                            code: 'NOT_FOUND',
                        },
                    });
                }
                return device;
            } catch (error) {
                throw new GraphQLError('Invalid id value', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    },
                });
            }
        },
        listAllDevices: async () => {
            try {
                const devices = await Device.find().populate('owner');
                return devices;
            } catch (error) {
                throw new Error('Failed to fetch devices');
            }
        },
    },

    Mutation: {
        addNewDevice: async (_, { input }, { currentUser }) => {
            if (!currentUser) throw new GraphQLError('User not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                },
            });

            try {
                input.owner = currentUser;

                const device = await Device.create(input);

                currentUser.devices.push(device);

                await currentUser.save();

                return device;
            } catch (error) {
                console.log(error);
                throw new GraphQLError('Invalid input value', {
                    extensions: {
                        code: ApolloServerErrorCode.BAD_USER_INPUT,
                    }
                });
            }
        },
        removeDevice: async (_, { id }, { currentUser }) => {
            if (!currentUser) throw new GraphQLError('User not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                },
            });

            try {
                const removedDevice = await Device.findByIdAndDelete(id);

                if (!removedDevice) throw new GraphQLError('Device not found', {
                    extensions: {
                        code: ApolloServerErrorCode.BAD_USER_INPUT
                    }
                })

                await User.findOneAndUpdate(
                    { devices: id },
                    { $pull: { devices: id } },
                    { new: true }
                );

                return removedDevice;
            } catch (error) {
                throw new Error('Failed to remove device');
            }
        },
    },
};

export default deviceResolvers;