export const typeDefs = `#graphql

type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    devices: [Device!]!
}

type Device {
    id: ID!
    name: String!
    type: String!
    description: String!
    location: String!
    connection: String!
    signalPower: Int!
    alerts: [String!]!
    status: DeviceStatus!
    owner: User!
}

type Token {
    token: String!
}

enum DeviceType {
    sensor
    actuator
}

enum DeviceStatus {
    active
    inactive
}

type Query {
    # User Queries
    getUserById(id: ID!): User
    getUserByName(username: String!): User
    listUsers: [User!]!
    me: User

    # Device Queries
    getDeviceById(id: ID!): Device
    listAllDevices: [Device!]!
}

type Mutation {
    # User Mutations
    createUser(
        username: String!
        email: String!
        password: String!
        ): User
    login(
        username: String!
        password: String!
    ): Token

    # Device Mutations
    addNewDevice(input: AddDeviceInput!): Device!
    removeDevice(id: ID!): Device!
}

input AddDeviceInput {
    name: String!
    type: DeviceType!
    description: String
    location: String
    connection: String
    signalPower: Int
    alerts: [String!]
    status: DeviceStatus
}
`;