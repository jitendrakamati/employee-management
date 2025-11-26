import bcrypt from 'bcryptjs';
import { EmployeeModel } from '../models/Employee.js';
import { AuthService } from '../auth/auth.js';

export const resolvers = {
    Query: {
        employees: async (_, { filter, sort, limit, offset }, context) => {
            AuthService.requireAuth(context);

            const { employees, total } = await EmployeeModel.getAll({
                filter,
                sort,
                limit,
                offset
            });

            const sanitizedEmployees = employees.map(({ password, ...emp }) => emp);

            return {
                employees: sanitizedEmployees,
                total,
                hasMore: offset + limit < total
            };
        },

        employee: async (_, { id }, context) => {
            AuthService.requireAuth(context);
            const employee = await context.loaders.employeeLoader.load(id);

            if (!employee) {
                throw new Error('Employee not found');
            }

            const { password, ...sanitizedEmployee } = employee;
            return sanitizedEmployee;
        },

        me: async (_, __, context) => {
            const authUser = AuthService.requireAuth(context);
            const employee = await EmployeeModel.getById(authUser.id);
            if (!employee) {
                throw new Error('User not found');
            }
            const { password, ...sanitized } = employee;
            return sanitized;
        }
    },

    Mutation: {
        login: async (_, { email, password }) => {
            return await AuthService.authenticate(email, password);
        },

        createEmployee: async (_, { input }, context) => {
            AuthService.requireAdmin(context);
            const existing = await EmployeeModel.getByEmail(input.email);
            if (existing) {
                throw new Error('Email already exists');
            }
            const hashedPassword = await bcrypt.hash(input.password, 10);
            const employee = await EmployeeModel.create({
                ...input,
                password: hashedPassword
            });
            const { password, ...sanitizedEmployee } = employee;
            return sanitizedEmployee;
        },

        updateEmployee: async (_, { id, input }, context) => {
            AuthService.requireAdmin(context);
            const existing = await EmployeeModel.getById(id);
            if (!existing) {
                throw new Error('Employee not found');
            }
            const updated = await EmployeeModel.update(id, input);
            const { password, ...sanitizedEmployee } = updated;
            return sanitizedEmployee;
        },

        deleteEmployee: async (_, { id }, context) => {
            AuthService.requireAdmin(context);

            const success = await EmployeeModel.delete(id);
            if (!success) {
                throw new Error('Employee not found');
            }

            return true;
        },

        flagEmployee: async (_, { id }, context) => {
            AuthService.requireAdmin(context);

            const existing = await EmployeeModel.getById(id);
            if (!existing) {
                throw new Error('Employee not found');
            }

            const updated = await EmployeeModel.update(id, { status: 'flagged' });
            const { password, ...sanitized } = updated;
            return sanitized;
        },

        unflagEmployee: async (_, { id }, context) => {
            AuthService.requireAdmin(context);

            const existing = await EmployeeModel.getById(id);
            if (!existing) {
                throw new Error('Employee not found');
            }

            const updated = await EmployeeModel.update(id, { status: 'active' });
            const { password, ...sanitized } = updated;
            return sanitized;
        }
    }
};
