import React, { useState, useRef } from 'react';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HamburgerMenu from './HamburgerMenu';

const Header = ({ currentUser, onLogout }) => {
    const [activeMenu, setActiveMenu] = useState(null);
    const closeTimeout = useRef(null);

    const openMenu = (index) => {
        if (closeTimeout.current) {
            clearTimeout(closeTimeout.current);
            closeTimeout.current = null;
        }
        setActiveMenu(index);
    };

    const scheduleCloseMenu = () => {
        if (closeTimeout.current) clearTimeout(closeTimeout.current);
        closeTimeout.current = setTimeout(() => {
            setActiveMenu(null);
            closeTimeout.current = null;
        }, 200); // small delay to allow cursor to move to submenu
    };

    const menuItems = [
        {
            label: 'Dashboard',
            submenu: [
                { label: 'Overview', onClick: () => console.log('Overview') },
                { label: 'Analytics', onClick: () => console.log('Analytics') },
            ]
        },
        {
            label: 'Employees',
            submenu: [
                { label: 'All Employees', onClick: () => console.log('All Employees') },
                { label: 'Departments', onClick: () => console.log('Departments') },
            ]
        },
        {
            label: 'Reports',
            submenu: [
                { label: 'Monthly', onClick: () => console.log('Monthly') },
                { label: 'Quarterly', onClick: () => console.log('Quarterly') },
            ]
        },
        {
            label: 'Settings',
            onClick: () => console.log('Settings')
        },
    ];

    return (
        <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Left: Logo + Hamburger */}
                    <div className="flex items-center gap-4">
                        <HamburgerMenu currentUser={currentUser} onLogout={onLogout} />

                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                                <span className="text-white font-bold text-lg">E</span>
                            </div>
                            <h1 className="text-xl font-bold hidden sm:block">
                                <span className="text-gradient">Employee</span> Management
                            </h1>
                        </div>
                    </div>

                    {/* Center: Horizontal Menu (Desktop) */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {menuItems.map((item, index) => (
                            <div
                                key={index}
                                className="relative"
                                onMouseEnter={() => item.submenu ? openMenu(index) : undefined}
                                onMouseLeave={() => item.submenu ? scheduleCloseMenu() : undefined}
                            >
                                <button
                                    onClick={() => {
                                        if (!item.submenu) {
                                            item.onClick?.();
                                        }
                                    }}
                                    className="px-4 py-2 rounded-md hover:bg-accent transition-colors flex items-center gap-1 font-medium"
                                >
                                    {item.label}
                                    {item.submenu && <ChevronDown className="w-4 h-4" />}
                                </button>

                                {/* Dropdown Submenu */}
                                {item.submenu && activeMenu === index && (
                                    <div
                                        className="absolute top-full left-0 mt-1 w-48 bg-popover border rounded-md shadow-lg py-1 animate-fade-in"
                                        onMouseEnter={openMenu.bind(null, index)}
                                        onMouseLeave={scheduleCloseMenu}
                                    >
                                        {item.submenu.map((subItem, subIndex) => (
                                            <button
                                                key={subIndex}
                                                onClick={() => {
                                                    subItem.onClick?.();
                                                    setActiveMenu(null);
                                                }}
                                                className="w-full text-left px-4 py-2 hover:bg-accent transition-colors"
                                            >
                                                {subItem.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Right: User Info */}
                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="w-4 h-4 text-primary" />
                            </div>
                            <div className="text-sm">
                                <p className="font-medium">{currentUser?.name || 'Guest'}</p>
                                <p className="text-xs text-muted-foreground capitalize">{currentUser?.role || 'User'}</p>
                            </div>
                        </div>

                        <Button variant="ghost" size="icon" onClick={onLogout} className="hidden md:flex">
                            <LogOut className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
