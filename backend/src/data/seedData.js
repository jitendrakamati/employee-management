import bcrypt from 'bcryptjs';

// Seed data with realistic employee names
export const employees = [
    {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@company.com',
        department: 'Engineering',
        position: 'Senior Software Engineer',
        joinDate: '2020-03-15',
        status: 'active',
        role: 'admin',
        password: bcrypt.hashSync('admin123', 10)
    },
    {
        id: '2',
        name: 'Michael Chen',
        email: 'michael.chen@company.com',
        department: 'Engineering',
        position: 'Frontend Developer',
        joinDate: '2021-06-01',
        status: 'active',
        role: 'employee',
        password: bcrypt.hashSync('employee123', 10)
    },
    {
        id: '3',
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@company.com',
        department: 'Design',
        position: 'UX Designer',
        joinDate: '2021-09-20',
        status: 'active',
        role: 'employee',
        password: bcrypt.hashSync('employee123', 10)
    },
    {
        id: '4',
        name: 'James Wilson',
        email: 'james.wilson@company.com',
        department: 'Engineering',
        position: 'Backend Developer',
        joinDate: '2019-11-10',
        status: 'active',
        role: 'employee',
        password: bcrypt.hashSync('employee123', 10)
    },
    {
        id: '5',
        name: 'Olivia Martinez',
        email: 'olivia.martinez@company.com',
        department: 'Product',
        position: 'Product Manager',
        joinDate: '2020-07-25',
        status: 'active',
        role: 'admin',
        password: bcrypt.hashSync('admin123', 10)
    },
    {
        id: '6',
        name: 'David Kim',
        email: 'david.kim@company.com',
        department: 'Engineering',
        position: 'DevOps Engineer',
        joinDate: '2022-01-15',
        status: 'active',
        role: 'employee',
        password: bcrypt.hashSync('employee123', 10)
    },
    {
        id: '7',
        name: 'Sophia Anderson',
        email: 'sophia.anderson@company.com',
        department: 'Marketing',
        position: 'Marketing Manager',
        joinDate: '2021-04-12',
        status: 'active',
        role: 'employee',
        password: bcrypt.hashSync('employee123', 10)
    },
    {
        id: '8',
        name: 'Daniel Brown',
        email: 'daniel.brown@company.com',
        department: 'Engineering',
        position: 'Full Stack Developer',
        joinDate: '2020-10-05',
        status: 'active',
        role: 'employee',
        password: bcrypt.hashSync('employee123', 10)
    },
    {
        id: '9',
        name: 'Isabella Taylor',
        email: 'isabella.taylor@company.com',
        department: 'HR',
        position: 'HR Manager',
        joinDate: '2019-08-30',
        status: 'active',
        role: 'admin',
        password: bcrypt.hashSync('admin123', 10)
    },
    {
        id: '10',
        name: 'Christopher Lee',
        email: 'christopher.lee@company.com',
        department: 'Engineering',
        position: 'Mobile Developer',
        joinDate: '2022-03-20',
        status: 'active',
        role: 'employee',
        password: bcrypt.hashSync('employee123', 10)
    },
    {
        id: '11',
        name: 'Ava Thompson',
        email: 'ava.thompson@company.com',
        department: 'Design',
        position: 'UI Designer',
        joinDate: '2021-11-08',
        status: 'active',
        role: 'employee',
        password: bcrypt.hashSync('employee123', 10)
    },
    {
        id: '12',
        name: 'Matthew Garcia',
        email: 'matthew.garcia@company.com',
        department: 'Sales',
        position: 'Sales Director',
        joinDate: '2018-05-15',
        status: 'active',
        role: 'admin',
        password: bcrypt.hashSync('admin123', 10)
    },
    {
        id: '13',
        name: 'Emma White',
        email: 'emma.white@company.com',
        department: 'Engineering',
        position: 'QA Engineer',
        joinDate: '2021-02-28',
        status: 'active',
        role: 'employee',
        password: bcrypt.hashSync('employee123', 10)
    },
    {
        id: '14',
        name: 'Joshua Harris',
        email: 'joshua.harris@company.com',
        department: 'Finance',
        position: 'Financial Analyst',
        joinDate: '2020-12-01',
        status: 'active',
        role: 'employee',
        password: bcrypt.hashSync('employee123', 10)
    },
    {
        id: '15',
        name: 'Mia Clark',
        email: 'mia.clark@company.com',
        department: 'Engineering',
        position: 'Data Engineer',
        joinDate: '2022-06-10',
        status: 'active',
        role: 'employee',
        password: bcrypt.hashSync('employee123', 10)
    }
];
