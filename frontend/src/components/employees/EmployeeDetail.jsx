import React from 'react';
import { X, Mail, Briefcase, Calendar, Shield, Building2, CheckCircle2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const EmployeeDetail = ({ employee, isOpen, onClose, onEdit, currentUserRole }) => {
    if (!employee) return null;

    const details = [
        { icon: <Mail className="w-5 h-5" />, label: 'Email', value: employee.email },
        { icon: <Briefcase className="w-5 h-5" />, label: 'Position', value: employee.position },
        { icon: <Building2 className="w-5 h-5" />, label: 'Department', value: employee.department },
        { icon: <Calendar className="w-5 h-5" />, label: 'Join Date', value: new Date(employee.joinDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) },
        { icon: <Shield className="w-5 h-5" />, label: 'Role', value: employee.role },
        { icon: <CheckCircle2 className="w-5 h-5" />, label: 'Status', value: employee.status },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="sr-only">Employee Details</DialogTitle>
                </DialogHeader>

                {/* Header Section */}
                <div className="relative">
                    <div className="h-24 gradient-primary rounded-t-lg -mx-6 -mt-6"></div>
                    <div className="absolute -bottom-12 left-6">
                        <div className="w-24 h-24 rounded-full bg-background border-4 border-background shadow-lg flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full gradient-secondary flex items-center justify-center text-white font-bold text-2xl">
                                {employee.name.split(' ').map(n => n[0]).join('')}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="pt-14 pb-2">
                    {/* Name and ID */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold mb-1">{employee.name}</h2>
                        <p className="text-sm text-muted-foreground">Employee ID: #{employee.id}</p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {details.map((detail, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                            >
                                <div className="mt-0.5 text-primary">
                                    {detail.icon}
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">{detail.label}</p>
                                    <p className="font-medium capitalize">{detail.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-primary">
                                {Math.floor((new Date() - new Date(employee.joinDate)) / (1000 * 60 * 60 * 24 * 30))}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">Months</p>
                        </div>
                        <div className="text-center border-x">
                            <p className="text-2xl font-bold text-primary">
                                {employee.status === 'active' ? '100%' : '0%'}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">Active</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-primary capitalize">
                                {employee.role}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">Access Level</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                        <Button variant="outline" onClick={onClose}>
                            Close
                        </Button>
                        {currentUserRole === 'admin' && (
                        <Button className="gradient-primary text-white" onClick={() => { onEdit?.(employee); }}>
                            Edit Employee
                        </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EmployeeDetail;
