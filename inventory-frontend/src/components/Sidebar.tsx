import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    BarChart3,
    Settings,
    LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar: React.FC = () => {
    const { user, logout } = useAuth();

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={22} /> },
        { name: 'Inventory', path: '/inventory', icon: <Package size={22} /> },
        { name: 'Reports', path: '/reports', icon: <BarChart3 size={22} /> },
        { name: 'Settings', path: '/settings', icon: <Settings size={22} /> },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="brand-logo pulse">
                    <Package size={28} />
                </div>
                <h2 className="brand-name">StockMaster</h2>
            </div>

            <nav className="sidebar-nav">
                <div className="nav-group">
                    <p className="nav-label">Menu</p>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-text">{item.name}</span>
                        </NavLink>
                    ))}
                </div>
            </nav>

            <div className="sidebar-footer">
                <div className="user-profile glass">
                    <div className="avatar">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-details">
                        <p className="u-name">{user?.name}</p>
                        <p className="u-role">{user?.role}</p>
                    </div>
                </div>
                <button onClick={logout} className="logout-button">
                    <LogOut size={18} />
                    <span>Terminate Session</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
