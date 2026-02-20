import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

import { motion, AnimatePresence } from 'framer-motion';

const Layout: React.FC = () => {
    const { user, loading } = useAuth();
    const location = useLocation().pathname;

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content">
                <header className="main-header">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={location}
                    >
                        {location.split('/').pop()?.toUpperCase() || 'Dashboard'}
                    </motion.h1>
                </header>
                <div className="content-inner">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default Layout;
