import React from 'react';
import { ArrowUpDown } from 'lucide-react';

const EmployeeGrid = ({ employees, onEmployeeClick }) => {
    const [sortConfig, setSortConfig] = React.useState({ field: null, order: 'ASC' });

    const handleSort = (field) => {
        setSortConfig({
            field,
            order: sortConfig.field === field && sortConfig.order === 'ASC' ? 'DESC' : 'ASC'
        });
    };

    const sortedEmployees = React.useMemo(() => {
        if (!sortConfig.field) return employees;

        return [...employees].sort((a, b) => {
            const aVal = a[sortConfig.field];
            const bVal = b[sortConfig.field];
            const direction = sortConfig.order === 'DESC' ? -1 : 1;

            if (aVal < bVal) return -1 * direction;
            if (aVal > bVal) return 1 * direction;
            return 0;
        });
    }, [employees, sortConfig]);

    const columns = [
        { key: 'id', label: 'ID', width: 'w-16' },
        { key: 'name', label: 'Name', width: 'w-40' },
        { key: 'email', label: 'Email', width: 'w-56' },
        { key: 'department', label: 'Department', width: 'w-32' },
        { key: 'position', label: 'Position', width: 'w-48' },
        { key: 'joinDate', label: 'Join Date', width: 'w-28' },
        { key: 'status', label: 'Status', width: 'w-24' },
        { key: 'role', label: 'Role', width: 'w-24' },
    ];

    return (
        <div className="w-full overflow-x-auto rounded-lg border bg-card shadow-sm">
            <table className="w-full">
                <thead className="bg-muted/50 border-b">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className={`${column.width} px-4 py-3 text-left text-sm font-semibold`}
                            >
                                <button
                                    onClick={() => handleSort(column.key)}
                                    className="flex items-center gap-2 hover:text-primary transition-colors"
                                >
                                    {column.label}
                                    <ArrowUpDown className="w-4 h-4" />
                                </button>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sortedEmployees.map((employee, index) => (
                        <tr
                            key={employee.id}
                            onClick={() => onEmployeeClick(employee)}
                            className={`border-b cursor-pointer hover:bg-accent/50 transition-colors ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                                }`}
                        >
                            <td className="px-4 py-3 text-sm font-mono text-muted-foreground">{employee.id}</td>
                            <td className="px-4 py-3 text-sm font-medium">{employee.name}</td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">{employee.email}</td>
                            <td className="px-4 py-3 text-sm">
                                <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                    {employee.department}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-sm">{employee.position}</td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">
                                {new Date(employee.joinDate).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-sm">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        employee.status === 'active'
                                            ? 'bg-green-100 text-green-700'
                                            : employee.status === 'flagged'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-gray-100 text-gray-700'
                                    }`}>
                                    {employee.status}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-sm capitalize">{employee.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {sortedEmployees.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    No employees found
                </div>
            )}
        </div>
    );
};

export default EmployeeGrid;
