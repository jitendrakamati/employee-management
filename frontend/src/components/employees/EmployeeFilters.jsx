import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EmployeeFilters = ({ onFilterChange, onSortChange }) => {
    const [filters, setFilters] = useState({
        search: '',
        department: '',
        status: '',
    });

    const [sort, setSort] = useState({
        field: 'name',
        order: 'ASC',
    });

    const [showFilters, setShowFilters] = useState(false);

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleSortChange = (field) => {
        const newSort = {
            field,
            order: sort.field === field && sort.order === 'ASC' ? 'DESC' : 'ASC',
        };
        setSort(newSort);
        onSortChange(newSort);
    };

    const clearFilters = () => {
        const emptyFilters = { search: '', department: '', status: '' };
        setFilters(emptyFilters);
        onFilterChange(emptyFilters);
    };

    const hasActiveFilters = filters.search || filters.department || filters.status;

    return (
        <div className="space-y-4">
            {/* Search and Filter Toggle */}
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search employees..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                {/* Filter Toggle */}
                <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="sm:w-auto"
                >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                    {hasActiveFilters && (
                        <span className="ml-2 w-2 h-2 rounded-full bg-primary"></span>
                    )}
                </Button>

                {hasActiveFilters && (
                    <Button variant="ghost" onClick={clearFilters}>
                        <X className="w-4 h-4 mr-2" />
                        Clear
                    </Button>
                )}
            </div>

            {/* Advanced Filters */}
            {showFilters && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 border rounded-lg bg-muted/30 animate-fade-in">
                    <div>
                        <label className="text-sm font-medium mb-1.5 block">Department</label>
                        <select
                            value={filters.department}
                            onChange={(e) => handleFilterChange('department', e.target.value)}
                            className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">All Departments</option>
                            <option value="Engineering">Engineering</option>
                            <option value="Design">Design</option>
                            <option value="Product">Product</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Sales">Sales</option>
                            <option value="HR">HR</option>
                            <option value="Finance">Finance</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-1.5 block">Status</label>
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-1.5 block">Sort By</label>
                        <select
                            value={sort.field}
                            onChange={(e) => handleSortChange(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="name">Name</option>
                            <option value="department">Department</option>
                            <option value="position">Position</option>
                            <option value="joinDate">Join Date</option>
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeFilters;
