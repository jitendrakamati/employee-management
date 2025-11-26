import React, { useState, useEffect } from 'react';
import { Menu, X, User, LogOut, Settings, Users, BarChart3, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HamburgerMenu = ({ currentUser, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState(null);

    // Lock body scroll and enable ESC to close when drawer is open
    useEffect(() => {
        if (isOpen) {
            const prevOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';

            const onKeyDown = (e) => {
                if (e.key === 'Escape') setIsOpen(false);
            };
            window.addEventListener('keydown', onKeyDown);

            return () => {
                document.body.style.overflow = prevOverflow;
                window.removeEventListener('keydown', onKeyDown);
            };
        }
    }, [isOpen]);

    const menuItems = [
        {
            label: 'Dashboard',
            icon: <BarChart3 className="w-5 h-5" />,
            submenu: [
                { label: 'Overview', onClick: () => console.log('Overview') },
                { label: 'Analytics', onClick: () => console.log('Analytics') },
            ]
        },
        {
            label: 'Employees',
            icon: <Users className="w-5 h-5" />,
            submenu: [
                { label: 'All Employees', onClick: () => console.log('All Employees') },
                { label: 'Departments', onClick: () => console.log('Departments') },
            ]
        },
        {
            label: 'Reports',
            icon: <FileText className="w-5 h-5" />,
            submenu: [
                { label: 'Monthly', onClick: () => console.log('Monthly') },
                { label: 'Quarterly', onClick: () => console.log('Quarterly') },
            ]
        },
        {
            label: 'Settings',
            icon: <Settings className="w-5 h-5" />,
            onClick: () => console.log('Settings')
        },
    ];

    const toggleSubmenu = (index) => {
        setOpenSubmenu(openSubmenu === index ? null : index);
    };

    return (
        <>
            {/* Hamburger Button */}
            <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Slide-out Menu */}
            <div
                role="dialog"
                aria-modal="true"
                className={`fixed inset-y-0 left-0 h-screen w-80 max-w-[85vw] bg-background border-r shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:hidden`}
            >
                <div className="flex flex-col h-full overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                        <h2 className="text-lg font-semibold">Menu</h2>
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* User Info */}
                    <div className="p-4 border-b bg-muted/30">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium">{currentUser?.name || 'Guest'}</p>
                                <p className="text-xs text-muted-foreground capitalize">{currentUser?.role || 'User'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <nav className="flex-1 overflow-y-auto p-4">
                        <ul className="space-y-2">
                            {menuItems.map((item, index) => (
                                <li key={index}>
                                    <button
                                        onClick={() => {
                                            if (item.submenu) {
                                                toggleSubmenu(index);
                                            } else {
                                                item.onClick?.();
                                                setIsOpen(false);
                                            }
                                        }}
                                        className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-accent transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            {item.icon}
                                            <span className="font-medium">{item.label}</span>
                                        </div>
                                        {item.submenu && (
                                            <span className={`transform transition-transform ${openSubmenu === index ? 'rotate-90' : ''}`}>
                                                ›
                                            </span>
                                        )}
                                    </button>

                                    {/* Submenu */}
                                    {item.submenu && openSubmenu === index && (
                                        <ul className="ml-8 mt-2 space-y-1">
                                            {item.submenu.map((subItem, subIndex) => (
                                                <li key={subIndex}>
                                                    <button
                                                        onClick={() => {
                                                            subItem.onClick?.();
                                                            setIsOpen(false);
                                                        }}
                                                        className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                                                    >
                                                        {subItem.label}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Logout */}
                    <div className="p-4 border-t">
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => {
                                onLogout();
                                setIsOpen(false);
                            }}
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HamburgerMenu;
