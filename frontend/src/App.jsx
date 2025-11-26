import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Grid3x3, LayoutGrid, Plus } from 'lucide-react';
import Header from './components/layout/Header';
import EmployeeGrid from './components/employees/EmployeeGrid';
import EmployeeTiles from './components/employees/EmployeeTiles';
import EmployeeDetail from './components/employees/EmployeeDetail';
import EmployeeFilters from './components/employees/EmployeeFilters';
import EmployeeFormModal from './components/employees/EmployeeFormModal';
import { Button } from './components/ui/button';
import { useToast } from './components/ui/toast.jsx';
import { GET_EMPLOYEES, GET_ME, DELETE_EMPLOYEE, LOGIN_MUTATION, CREATE_EMPLOYEE, UPDATE_EMPLOYEE, FLAG_EMPLOYEE, UNFLAG_EMPLOYEE } from './graphql/queries';

function App() {
    const { toast } = useToast();
    const [currentUser, setCurrentUser] = useState(null);
    const [viewMode, setViewMode] = useState('tiles'); // 'grid' or 'tiles'
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [filters, setFilters] = useState({});
    const [sort, setSort] = useState({ field: 'name', order: 'ASC' });
    // Pagination state
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(8); // items per page
    const [isLoginMode, setIsLoginMode] = useState(() => !localStorage.getItem('token'));
    const [loginForm, setLoginForm] = useState({ email: '', password: '' });
    const [loginError, setLoginError] = useState(null);

    // Login mutation
    const [login, { data: loginData, loading: loginLoading, error: loginMutationError }] = useMutation(LOGIN_MUTATION);

    // Get current user
    const { data: meData, error: meError, loading: meLoading, refetch: refetchMe } = useQuery(GET_ME, {
        skip: !localStorage.getItem('token'),
    });

    // Get employees
    const { data, loading, refetch } = useQuery(GET_EMPLOYEES, {
        variables: {
            filter: filters,
            sort: sort,
            limit: pageSize,
            offset: (page - 1) * pageSize,
        },
        skip: isLoginMode,
    });

    // Delete employee mutation
    const [deleteEmployee] = useMutation(DELETE_EMPLOYEE, {
        refetchQueries: [{
            query: GET_EMPLOYEES,
            variables: { filter: filters, sort: sort, limit: pageSize, offset: (page - 1) * pageSize }
        }],
        onCompleted: () => toast({ title: 'Employee deleted', variant: 'default' }),
        onError: (e) => toast({ title: 'Delete failed', description: e.message, variant: 'destructive' })
    });

    // Create employee (admin)
    const [createEmployee, { loading: creating }] = useMutation(CREATE_EMPLOYEE, {
        refetchQueries: [{
            query: GET_EMPLOYEES,
            variables: { filter: filters, sort: sort, limit: pageSize, offset: (page - 1) * pageSize }
        }],
        onCompleted: () => toast({ title: 'Employee added' }),
        onError: (e) => toast({ title: 'Add failed', description: e.message, variant: 'destructive' })
    });

    // Update employee (admin)
    const [updateEmployee, { loading: updating }] = useMutation(UPDATE_EMPLOYEE, {
        refetchQueries: [{
            query: GET_EMPLOYEES,
            variables: { filter: filters, sort: sort, limit: pageSize, offset: (page - 1) * pageSize }
        }],
        onCompleted: () => toast({ title: 'Employee updated' }),
        onError: (e) => toast({ title: 'Update failed', description: e.message, variant: 'destructive' })
    });

    // Flag/Unflag employee (admin)
    const [flagEmployee, { loading: flagging }] = useMutation(FLAG_EMPLOYEE, {
        refetchQueries: [{
            query: GET_EMPLOYEES,
            variables: { filter: filters, sort: sort, limit: pageSize, offset: (page - 1) * pageSize }
        }],
        onCompleted: () => toast({ title: 'Employee flagged' }),
        onError: (e) => toast({ title: 'Flag failed', description: e.message, variant: 'destructive' })
    });
    const [unflagEmployee, { loading: unflagging }] = useMutation(UNFLAG_EMPLOYEE, {
        refetchQueries: [{
            query: GET_EMPLOYEES,
            variables: { filter: filters, sort: sort, limit: pageSize, offset: (page - 1) * pageSize }
        }],
        onCompleted: () => toast({ title: 'Employee unflagged' }),
        onError: (e) => toast({ title: 'Unflag failed', description: e.message, variant: 'destructive' })
    });

    // Handle login success
    useEffect(() => {
        if (loginData?.login) {
            localStorage.setItem('token', loginData.login.token);
            setCurrentUser(loginData.login.user);
            setIsLoginMode(false);
            setLoginError(null);
            refetchMe?.();
        }
    }, [loginData, refetchMe]);

    // Handle login error
    useEffect(() => {
        if (loginMutationError) {
            console.error('Login error:', loginMutationError);
            setLoginError(loginMutationError.message);
        }
    }, [loginMutationError]);

    // Handle GET_ME success
    useEffect(() => {
        if (meData?.me) {
            setCurrentUser(meData.me);
            setIsLoginMode(false);
        }
    }, [meData]);

    // Handle GET_ME error (token invalid/expired) with guard to avoid race conditions
    useEffect(() => {
        const hasToken = !!localStorage.getItem('token');
        if (hasToken && meError && !meLoading && !loginLoading) {
            localStorage.removeItem('token');
            setIsLoginMode(true);
            setCurrentUser(null);
        }
    }, [meError, meLoading, loginLoading]);

    const handleLogin = (e) => {
        e.preventDefault();
        login({ variables: loginForm });
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setCurrentUser(null);
        setIsLoginMode(true);
    };

    const [deleteConfirm, setDeleteConfirm] = useState(null);

    // Admin-only form modal state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formMode, setFormMode] = useState('create'); // 'create' | 'edit'
    const [formInitial, setFormInitial] = useState(null);

    const handleAdd = () => {
        if (currentUser?.role !== 'admin') {
            alert('Only admins can add employees');
            return;
        }
        setFormMode('create');
        setFormInitial(null);
        setIsFormOpen(true);
    };

    const handleEdit = (employee) => {
        if (currentUser?.role !== 'admin') {
            alert('Only admins can edit employees');
            return;
        }
        setFormMode('edit');
        setFormInitial(employee);
        setIsFormOpen(true);
    };

    const handleFlag = (employee) => {
        if (currentUser?.role !== 'admin') {
            alert('Only admins can flag employees');
            return;
        }
        if (employee.status === 'flagged') {
            unflagEmployee({ variables: { id: employee.id } });
        } else {
            flagEmployee({ variables: { id: employee.id } });
        }
    };

    const handleDelete = (employee) => {
        if (currentUser?.role !== 'admin') {
            alert('Only admins can delete employees');
            return;
        }

        if (window.confirm(`Delete ${employee.name}? This cannot be undone.`)) {
            deleteEmployee({ variables: { id: employee.id } });
        }
    };

    const confirmDelete = () => {
        if (deleteConfirm) {
            deleteEmployee({ variables: { id: deleteConfirm.id } });
            setDeleteConfirm(null);
        }
    };

    const employees = data?.employees?.employees || [];
    const total = data?.employees?.total || 0;
    const pageCount = Math.max(1, Math.ceil(total / pageSize));

    // Reset to page 1 when filters/sort change
    useEffect(() => {
        setPage(1);
    }, [filters, sort]);

    // Mobile UX: scroll to top when changing page or page size
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [page, pageSize]);

    // Login Screen
    if (isLoginMode) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10">
                <div className="w-full max-w-md p-8 bg-card rounded-lg shadow-xl border">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center">
                            <span className="text-white font-bold text-2xl">E</span>
                        </div>
                        <h1 className="text-3xl font-bold mb-2">
                            <span className="text-gradient">Employee</span> Management
                        </h1>
                        <p className="text-muted-foreground">Sign in to continue</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <input
                                type="email"
                                value={loginForm.email}
                                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Password</label>
                            <input
                                type="password"
                                value={loginForm.password}
                                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full gradient-primary text-white" disabled={loginLoading}>
                            {loginLoading ? 'Signing in...' : 'Sign In'}
                        </Button>

                        {loginError && (
                            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
                                {loginError}
                            </div>
                        )}
                    </form>

                    <div className="mt-6 p-4 bg-muted/30 rounded-md text-sm">
                        <p className="font-medium mb-2">Test Credentials:</p>
                        <p className="text-muted-foreground">Admin: sarah.johnson@company.com / admin123</p>
                        <p className="text-muted-foreground">Employee: michael.chen@company.com / employee123</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header currentUser={currentUser} onLogout={handleLogout} />

            <main className="container mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">
                        Staff <span className="text-gradient">Directory</span>
                    </h1>
                    <p className="text-muted-foreground">
                        Search, manage, and keep your staff up to date
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-6">
                    <EmployeeFilters
                        onFilterChange={setFilters}
                        onSortChange={setSort}
                    />
                </div>

                {/* View Toggle and Actions */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
                    {/* Toggle buttons */}
                    <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
                        <Button
                            variant={viewMode === 'grid' ? 'default' : 'outline'}
                            size="sm"
                            className="w-full"
                            onClick={() => setViewMode('grid')}
                        >
                            <Grid3x3 className="w-4 h-4 mr-2" />
                            Grid
                        </Button>
                        <Button
                            variant={viewMode === 'tiles' ? 'default' : 'outline'}
                            size="sm"
                            className="w-full"
                            onClick={() => setViewMode('tiles')}
                        >
                            <LayoutGrid className="w-4 h-4 mr-2" />
                            Tiles
                        </Button>
                    </div>

                    {/* Add employee */}
                    {currentUser?.role === 'admin' && (
                        <Button
                            className="gradient-primary text-white w-full sm:w-auto"
                            onClick={handleAdd}
                            disabled={creating || updating || flagging}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Employee
                        </Button>
                    )}
                </div>

                {/* Employee Count */}
                <div className="mb-4 text-sm text-muted-foreground">
                    Showing {employees.length} employee{employees.length !== 1 ? 's' : ''}
                </div>

                {/* Employee Views */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-muted-foreground">Loading employees...</p>
                    </div>
                ) : viewMode === 'grid' ? (
                    <EmployeeGrid
                        employees={employees}
                        onEmployeeClick={setSelectedEmployee}
                    />
                ) : (
                    <EmployeeTiles
                        employees={employees}
                        onEmployeeClick={setSelectedEmployee}
                        onEdit={handleEdit}
                        onFlag={handleFlag}
                        onDelete={handleDelete}
                        currentUserRole={currentUser?.role}
                    />
                )}
            </main>

            {/* Pagination Controls */}
            <div className="container mx-auto px-4 pb-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t pt-4">
                    <div className="flex items-center justify-between sm:justify-start gap-3 text-sm text-muted-foreground">
                        <span className="whitespace-nowrap">Rows per page:</span>
                        <select
                            className="border rounded-md px-3 h-10 min-w-[84px]"
                            value={pageSize}
                            onChange={(e) => { setPage(1); setPageSize(parseInt(e.target.value, 10)); }}
                        >
                            <option value={6}>6</option>
                            <option value={8}>8</option>
                            <option value={12}>12</option>
                            <option value={24}>24</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                        <div className="text-center text-sm order-2 sm:order-none">
                            Page <span className="font-medium">{page}</span> of <span className="font-medium">{pageCount}</span>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto order-1 sm:order-none">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 sm:flex-none"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page <= 1}
                            >
                                Prev
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 sm:flex-none"
                                onClick={() => setPage(p => Math.min(pageCount, p + 1))}
                                disabled={page >= pageCount}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Employee Detail Modal */}
            <EmployeeDetail
                employee={selectedEmployee}
                isOpen={!!selectedEmployee}
                onClose={() => setSelectedEmployee(null)}
                currentUserRole={currentUser?.role}
                onEdit={(emp) => {
                    setSelectedEmployee(null);
                    handleEdit(emp);
                }}
            />

            {/* Employee Create/Edit Modal (Admin only) */}
            {currentUser?.role === 'admin' && (
                <EmployeeFormModal
                    open={isFormOpen}
                    mode={formMode}
                    initialData={formInitial}
                    onClose={() => setIsFormOpen(false)}
                    onSubmit={async (payload) => {
                        try {
                            if (formMode === 'create') {
                                await createEmployee({ variables: { input: payload } });
                            } else if (formInitial?.id) {
                                await updateEmployee({ variables: { id: formInitial.id, input: {
                                    name: payload.name,
                                    email: payload.email,
                                    department: payload.department,
                                    position: payload.position,
                                    joinDate: payload.joinDate,
                                    status: formInitial.status,
                                } } });
                            }
                            setIsFormOpen(false);
                        } catch (e) {
                            // onError handlers will show alert
                        }
                    }}
                />
            )}
        </div>
    );
}

export default App;
