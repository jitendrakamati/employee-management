import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import { typeDefs } from './schema/typeDefs.js';
import { resolvers } from './schema/resolvers.js';
import { AuthService } from './auth/auth.js';
import { createLoaders } from './utils/dataLoader.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/employee_management';

// Create Apollo Server
const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (error) => {
        console.error('GraphQL Error:', error);
        return {
            message: error.message,
            extensions: error.extensions
        };
    }
});

// Start server
await server.start();

// Middleware
const CORS_ORIGINS = process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:3000';
const allowedOrigins = CORS_ORIGINS.split(',').map(o => o.trim()).filter(Boolean);
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use(express.json());

// GraphQL endpoint with context
app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }) => {
        // Get token from header
        const token = req.headers.authorization?.replace('Bearer ', '');

        // Verify token and get user
        let user = null;
        if (token) {
            const decoded = AuthService.verifyToken(token);
            if (decoded) {
                user = { id: decoded.id, email: decoded.email, role: decoded.role };
            }
        }

        // Create DataLoaders for this request
        const loaders = createLoaders();

        return { user, loaders };
    }
}));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Connect to Mongo and then start HTTP server
async function start() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log(`📦 Connected to MongoDB`);

        // Ensure models are registered
        await import('./models/Employee.js');
        const Employee = mongoose.model('Employee');

        // Seed if empty
        const { employees: seedEmployees } = await import('./data/seedData.js');
        const existingCount = await Employee.countDocuments();
        if (existingCount === 0) {
            const toInsert = seedEmployees.map(({ id, ...rest }) => rest);
            await Employee.insertMany(toInsert);
            console.log('🌱 Seeded initial employees');
        }

        app.listen(PORT, () => {
            console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
            console.log(`📊 Health check at http://localhost:${PORT}/health`);
            console.log(`\n📝 Test credentials:`);
            console.log(`   Admin: sarah.johnson@company.com / admin123`);
            console.log(`   Employee: michael.chen@company.com / employee123`);
        });
    } catch (err) {
        console.error('MongoDB connection failed:', err.message);
        process.exit(1);
    }
}

await start();
