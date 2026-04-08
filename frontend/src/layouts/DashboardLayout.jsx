import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    UploadCloud,
    History,
    Diff,
    ClipboardList,
    Settings,
    LogOut,
    Activity,
    User,
    Bell,
    Search,
    ChevronRight,
    Menu,
    X,
    Stethoscope,
    Brain,
    Droplets,
    Utensils,
    BarChart2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import SearchOverlay from '../components/SearchOverlay';
import NotificationsPanel from '../components/NotificationsPanel';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isOpen, setIsOpen }) => {
    const location = useLocation();
    const { logout } = useApp();

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/app/dashboard' },
        { name: 'Upload Report', icon: UploadCloud, path: '/app/upload' },
        { name: 'Report History', icon: History, path: '/app/history' },
        { name: 'Daily Overview', icon: BarChart2, path: '/app/overview' },
        { name: 'Comparative Analysis', icon: Diff, path: '/app/compare' },
        { name: 'Care & Recovery', icon: ClipboardList, path: '/app/care' },
        { name: 'Diet & Nutrition', icon: Utensils, path: '/app/nutrition' },
        { name: 'Water Tracking', icon: Droplets, path: '/app/water' },
        { name: 'Medical Data', icon: Stethoscope, path: '/app/medical-data' },
        { name: 'Profile', icon: User, path: '/app/profile' },
        { name: 'Settings', icon: Settings, path: '/app/settings' },
    ];

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={`
        fixed top-0 left-0 h-full w-72 bg-stone-50 border-r border-stone-200 z-50 transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-8 flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Activity className="w-6 h-6 text-primary" />
                        </div>
                        <span className="text-2xl font-display font-bold">REVA</span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-grow px-4 space-y-1 mt-4">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`
                                        relative flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 group
                                        ${isActive
                                            ? 'text-primary font-bold'
                                            : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'}
                                    `}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {isActive && (
                                        <motion.div 
                                            layoutId="activeSidebar"
                                            className="absolute inset-0 bg-primary/10 rounded-xl -z-10"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-stone-500 group-hover:text-stone-800 transition-colors'}`} />
                                    <span className="font-medium text-sm">{item.name}</span>
                                    {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout */}
                    <div className="p-6 border-t border-stone-200">
                        <button
                            onClick={logout}
                            className="flex items-center space-x-4 px-4 py-3.5 w-full rounded-xl text-stone-600 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

const Header = ({ setIsOpen, setIsSearchOpen, setIsNotificationsOpen, user }) => {
    return (
        <header className="h-20 bg-stone-1000 backdrop-blur-xl border-b border-stone-200 sticky top-0 z-30 px-4 md:px-8">
            <div className="h-full flex items-center justify-between max-w-7xl mx-auto">
                <button onClick={() => setIsOpen(true)} className="p-2 text-stone-800/70 md:hidden">
                    <Menu className="w-6 h-6" />
                </button>

                <div
                    onClick={() => setIsSearchOpen(true)}
                    className="hidden md:flex items-center bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 w-96 cursor-pointer group hover:border-primary/50 transition-all shadow-sm"
                >
                    <Search className="w-4 h-4 text-stone-500 mr-3 group-hover:text-primary transition-colors" />
                    <span className="text-sm text-stone-500 flex-grow">Search medical records...</span>
                    <div className="flex items-center space-x-1 px-1.5 py-0.5 bg-white rounded border border-stone-200 text-[10px] font-bold text-stone-400">
                        <span>⌘</span>
                        <span>K</span>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setIsNotificationsOpen(true)}
                        className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-600 hover:text-stone-800 transition-colors relative group"
                    >
                        <Bell className="w-5 h-5 group-hover:animate-bounce" />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-surface shadow-glow"></span>
                    </button>

                    <div className="flex items-center space-x-3 pl-4 border-l border-stone-200">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-stone-800">{user?.name || 'Patient'}</p>
                            <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest leading-tight">Premium Member</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20 flex items-center justify-center text-primary font-bold">
                            {user?.name?.[0] || 'P'}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const { user } = useApp();
    const location = useLocation();

    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="min-h-screen bg-transparent text-stone-800 selection:bg-primary/30 selection:text-primary">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            <NotificationsPanel isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />

            <div className="md:ml-72 flex flex-col min-h-screen">
                <Header
                    setIsOpen={setIsSidebarOpen}
                    setIsSearchOpen={setIsSearchOpen}
                    setIsNotificationsOpen={setIsNotificationsOpen}
                    user={user}
                />

                <main className="flex-grow p-4 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={location.pathname}
                                initial={{ opacity: 0, y: 10, scale: 0.99 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.99 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                            >
                                <Outlet />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>

                {/* Floating AI Bubble */}
                <Link to="/app/brain" className="fixed bottom-8 right-8 p-4 bg-primary text-background rounded-2xl shadow-glow hover:scale-110 active:scale-95 transition-all z-40 group">
                    <Brain className="w-6 h-6" />
                    <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        <p className="text-xs font-bold text-stone-800 ">Consult REVA Brain</p>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default DashboardLayout;
