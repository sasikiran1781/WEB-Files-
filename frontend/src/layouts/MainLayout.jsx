import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Activity, Shield, Menu, X } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const location = useLocation();

    const navLinks = [
        { name: 'Features', path: '/features' },
        { name: 'How It Works', path: '/how-it-works' },
        { name: 'About', path: '/about' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-stone-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                            <Activity className="w-6 h-6 text-primary" />
                        </div>
                        <span className="text-2xl font-display font-bold text-stone-800">REVA</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === link.path ? 'text-primary' : 'text-stone-800/70'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link to="/login" className="text-sm font-medium text-stone-800/70 hover:text-stone-800 transition-colors">
                            Login
                        </Link>
                        <Link to="/signup" className="btn-primary py-2 px-5">
                            Get Started
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-stone-800/70">
                            {isOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className="md:hidden bg-stone-50 border-b border-stone-200 p-4 space-y-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className="block text-base font-medium text-stone-800/70 py-2"
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link to="/login" className="block text-base font-medium text-stone-800/70 py-2" onClick={() => setIsOpen(false)}>
                        Login
                    </Link>
                    <Link to="/signup" className="btn-primary block text-center py-3" onClick={() => setIsOpen(false)}>
                        Get Started
                    </Link>
                </div>
            )}
        </nav>
    );
};

const Footer = () => (
    <footer className="bg-stone-50 border-t border-stone-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center space-x-2 mb-6">
                        <Activity className="w-6 h-6 text-primary" />
                        <span className="text-xl font-display font-bold">REVA</span>
                    </div>
                    <p className="text-stone-600 max-w-sm mb-8">
                        Revolutionizing healthcare diagnostics through AI-driven medical report analysis and personalized recovery monitoring.
                    </p>
                    <div className="flex items-center space-x-2 text-stone-600 text-sm">
                        <Shield className="w-4 h-4 text-emerald-500" />
                        <span>Healthcare-grade data encryption & privacy</span>
                    </div>
                </div>
                <div>
                    <h4 className="font-display font-semibold mb-6">Product</h4>
                    <ul className="space-y-4 text-stone-600 text-sm">
                        <li><Link to="/features" className="hover:text-primary transition-colors">AI Analysis</Link></li>
                        <li><Link to="/features" className="hover:text-primary transition-colors">Recovery Tracking</Link></li>
                        <li><Link to="/how-it-works" className="hover:text-primary transition-colors">How It Works</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-display font-semibold mb-6">Company</h4>
                    <ul className="space-y-4 text-stone-600 text-sm">
                        <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                        <li className="flex flex-col space-y-2 mt-4 pt-4 border-t border-stone-200">
                            <span className="font-bold text-stone-800">Contact Us</span>
                            <a href="mailto:karrisasikiranchintu@gmail.com" className="hover:text-primary transition-colors truncate">karrisasikiranchintu@gmail.com</a>
                            <a href="tel:9390226214" className="hover:text-primary transition-colors">+91 9390226214</a>
                        </li>
                        <li><Link to="/legal" className="hover:text-primary transition-colors mt-4 block">Privacy Policy</Link></li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-stone-200 pt-8 flex flex-col md:flex-row justify-between items-center text-stone-500 text-xs">
                <p>© 2026 REVA Healthcare AI solutions. All rights reserved.</p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                    <span>Twitter</span>
                    <span>LinkedIn</span>
                    <span>Github</span>
                </div>
            </div>
        </div>
    </footer>
);

const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow pt-20">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
