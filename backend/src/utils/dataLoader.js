import DataLoader from 'dataloader';
import { EmployeeModel } from '../models/Employee.js';

// DataLoader for batching and caching employee queries
export const createEmployeeLoader = () => {
    return new DataLoader(async (ids) => {
        console.log(`DataLoader: Batching ${ids.length} employee queries`);
        return EmployeeModel.getByIds(ids);
    }, {
        // Cache results for the duration of the request
        cache: true,
        // Batch multiple requests within 10ms
        batchScheduleFn: (callback) => setTimeout(callback, 10)
    });
};

// Create loaders for each request
export const createLoaders = () => ({
    employeeLoader: createEmployeeLoader()
});
