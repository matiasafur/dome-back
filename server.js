import mongoose from 'mongoose';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { config } from 'dotenv';

// Context
import context from './context.js';

// Type Defs
import { typeDefs } from './schema/schema.js';

// Resolvers
import userResolvers from './resolvers/user.resolver.js';
import deviceResolvers from './resolvers/device.resolver.js';

config();

export async function startServer() {
    const server = new ApolloServer({
        typeDefs,
        resolvers: [userResolvers, deviceResolvers],
        includeStacktraceInErrorResponses: true,
    });

    const PORT = process.env.PORT_DEV || 4000;
    const MONGODB_URI = process.env.MONGODB_URI;

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅  Connected to MongoDB');

        const { url } = await startStandaloneServer(server, {
            listen: { port: PORT },
            context,
        });

        console.log(`🚀  Server ready at: ${url}`);
    } catch (error) {
        console.error('Error: ', error);
    }
}