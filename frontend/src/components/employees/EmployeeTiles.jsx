import React from 'react';
import { MoreVertical, Edit, Flag, Trash2, Mail, Briefcase } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const EmployeeTiles = ({ employees, onEmployeeClick, onEdit, onFlag, onDelete, currentUserRole }) => {
    const handleAction = (e, action, employee) => {
        e.stopPropagation();
        action(employee);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {employees.map((employee) => (
                <Card
                    key={employee.id}
                    onClick={() => onEmployeeClick(employee)}
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group"
                >
                    <CardContent className="p-6">
                        {/* Header with Avatar and Actions */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white font-semibold text-lg">
                                    {employee.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg leading-tight">{employee.name}</h3>
                                    <p className="text-xs text-muted-foreground capitalize">{employee.role}</p>
                                </div>
                            </div>

                            {/* Action Menu (always rendered to avoid hook mismatch; disabled for non-admins) */}
                            {currentUserRole === 'admin' && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                        title={currentUserRole !== 'admin' ? 'Admin only' : undefined}
                                    >
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={(e) => handleAction(e, onEdit, employee)} >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => handleAction(e, onFlag, employee)} >
                                        <Flag className="w-4 h-4 mr-2" />
                                        {employee.status === 'flagged' ? 'Unflag' : 'Flag'}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={(e) => handleAction(e, onDelete, employee)}
                                        className="text-destructive focus:text-destructive"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            )}
                        </div>

                        {/* Employee Details */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                <span className="text-muted-foreground truncate">{employee.email}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                                <Briefcase className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">{employee.position}</span>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                    {employee.department}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        employee.status === 'active'
                                            ? 'bg-green-100 text-green-700'
                                            : employee.status === 'flagged'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-gray-100 text-gray-700'
                                    }`}>
                                    {employee.status}
                                </span>
                            </div>

                            <div className="text-xs text-muted-foreground pt-2 border-t">
                                Joined {new Date(employee.joinDate).toLocaleDateString('en-US', {
                                    month: 'short',
                                    year: 'numeric'
                                })}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}

            {employees.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                    No employees found
                </div>
            )}
        </div>
    );
};

export default EmployeeTiles;
