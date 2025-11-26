import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const emptyForm = {
  name: '',
  email: '',
  department: '',
  position: '',
  joinDate: '',
  password: '',
  role: 'employee',
};

const EmployeeFormModal = ({ open, mode = 'create', initialData = null, onClose, onSubmit }) => {
  const [form, setForm] = useState(emptyForm);
  const isEdit = mode === 'edit';

  useEffect(() => {
    if (open) {
      if (isEdit && initialData) {
        setForm({
          name: initialData.name || '',
          email: initialData.email || '',
          department: initialData.department || '',
          position: initialData.position || '',
          joinDate: initialData.joinDate || '',
          password: '',
          role: initialData.role || 'employee',
        });
      } else {
        setForm(emptyForm);
      }
    }
  }, [open, isEdit, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      department: form.department.trim(),
      position: form.position.trim(),
      joinDate: form.joinDate,
      role: form.role,
      ...(isEdit ? {} : { password: form.password }),
    };
    onSubmit?.(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Update Employee' : 'Add Employee'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Full name"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md"
                placeholder="email@company.com"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Department</label>
              <input
                name="department"
                value={form.department}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Department"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Position</label>
              <input
                name="position"
                value={form.position}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Position"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Join Date</label>
              <input
                name="joinDate"
                type="date"
                value={form.joinDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {!isEdit && (
              <div className="sm:col-span-2">
                <label className="block text-sm mb-1">Password</label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Set a password"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="gradient-primary text-white">
              {isEdit ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeFormModal;
