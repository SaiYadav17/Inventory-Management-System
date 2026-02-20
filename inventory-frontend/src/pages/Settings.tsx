import React, { useState } from 'react';
import { User, Shield, Moon, Sun, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const Settings: React.FC = () => {
    const { user } = useAuth();
    const { darkMode, toggleTheme } = useTheme();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [notifications, setNotifications] = useState(true);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="settings-page">
            <div className="settings-grid">
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="settings-section glass"
                >
                    <div className="section-header">
                        <User size={24} />
                        <h2>Profile Settings</h2>
                    </div>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} className="glass-input" />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} className="glass-input" />
                    </div>
                    <button onClick={handleSave} className="save-btn">
                        <Save size={18} />
                        <span>Save Profile</span>
                    </button>
                </motion.div>

                <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="settings-section glass"
                >
                    <div className="section-header">
                        <Shield size={24} />
                        <h2>Preferences</h2>
                    </div>
                    <div className="setting-toggle">
                        <div className="toggle-info">
                            <h3>Email Notifications</h3>
                            <p>Receive alerts for low stock items</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={notifications}
                            onChange={() => setNotifications(!notifications)}
                        />
                    </div>
                    <div className="setting-toggle">
                        <div className="toggle-info">
                            <h3>Dark Mode</h3>
                            <p>Toggle between light and dark themes</p>
                        </div>
                        <button
                            className={`mode-toggle ${darkMode ? 'dark' : 'light'}`}
                            onClick={toggleTheme}
                        >
                            {darkMode ? <Moon size={18} /> : <Sun size={18} />}
                        </button>
                    </div>
                </motion.div>
            </div>

            {saved && (
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="save-toast"
                >
                    Settings saved successfully!
                </motion.div>
            )}
        </div>
    );
};

export default Settings;
