import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, BookOpen, BarChart2, Sprout, Award, LogOut } from 'lucide-react';

const Navbar = () => {
    const { logout, user } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { name: 'Dashboard', path: '/', icon: <Home size={20} /> },
        { name: 'History', path: '/history', icon: <BookOpen size={20} /> },
        { name: 'Analytics', path: '/analytics', icon: <BarChart2 size={20} /> },
        { name: 'Garden', path: '/garden', icon: <Sprout size={20} /> },
        { name: 'Achievements', path: '/achievements', icon: <Award size={20} /> },
    ];

    return (
        <nav className="glass-panel sticky top-4 mx-4 mb-8 z-50 px-6 py-4 flex justify-between items-center text-slate-100">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/30">
                    <Sprout className="text-white" size={24} />
                </div>
                <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                    2-Minute Journal
                </h1>
            </div>

            <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl backdrop-blur-sm border border-white/5">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${isActive(item.path)
                            ? 'bg-indigo-600 shadow-lg shadow-indigo-500/25 text-white'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        {item.icon}
                        <span className="font-medium">{item.name}</span>
                    </Link>
                ))}
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden md:block text-right">
                    <p className="text-sm font-semibold text-white">{user?.name}</p>
                    <p className="text-xs text-slate-400">{user?.growthStage || 'Seed'}</p>
                </div>
                <button
                    onClick={logout}
                    className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 text-slate-400 transition-colors"
                    title="Logout"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
