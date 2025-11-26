import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { EmployeeModel } from '../models/Employee.js';

const JWT_SECRET = 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '24h';

export const AuthService = {
    // Generate JWT token
    generateToken: (user) => {
        return jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );
    },

    // Verify JWT token
    verifyToken: (token) => {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (error) {
            return null;
        }
    },

    // Authenticate user
    authenticate: async (email, password) => {
        const user = await EmployeeModel.getByEmail(email);
        if (!user || !user.password) {
            throw new Error('Invalid credentials');
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }

        // Normalize user and strip password
        const { password: _pw, _id, id: existingId, ...rest } = user;
        const normalized = { id: String(existingId || _id), ...rest };

        const token = AuthService.generateToken(normalized);

        return { user: normalized, token };
    },

    // Get user from context
    getUserFromContext: (context) => {
        return context.user || null;
    },

    // Check if user is authenticated
    requireAuth: (context) => {
        if (!context.user) {
            throw new Error('Authentication required');
        }
        return context.user;
    },

    // Check if user has admin role
    requireAdmin: (context) => {
        const user = AuthService.requireAuth(context);
        if (user.role !== 'admin') {
            throw new Error('Admin access required');
        }
        return user;
    },

    // Check if user can access resource (admin or own resource)
    canAccessResource: (context, resourceUserId) => {
        const user = AuthService.requireAuth(context);
        if (user.role === 'admin' || user.id === resourceUserId) {
            return true;
        }
        throw new Error('Access denied');
    }
};
