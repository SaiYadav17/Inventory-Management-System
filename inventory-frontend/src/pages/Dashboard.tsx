import React, { useEffect, useState } from 'react';
import { Package, AlertTriangle, TrendingUp, DollarSign, Activity, Zap, Layers } from 'lucide-react';
import { getInventory } from '../api/inventoryService';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState({
        totalItems: 0,
        lowStock: 0,
        outOfStock: 0,
        totalValue: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getInventory();
                if (Array.isArray(data)) {
                    const totalItems = data.length;
                    const lowStock = data.filter((item: any) => item.status === 'Low Stock').length;
                    const outOfStock = data.filter((item: any) => item.status === 'Out of Stock').length;
                    const totalValue = data.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
                    setStats({ totalItems, lowStock, outOfStock, totalValue });
                }
            } catch (err) {
                console.error('Dashboard API error:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const cards = [
        { title: 'Total Inventory', value: stats.totalItems, icon: <Package size={26} />, color: 'blue' },
        { title: 'Low Stock Alert', value: stats.lowStock, icon: <AlertTriangle size={26} />, color: 'orange' },
        { title: 'Out of Stock', value: stats.outOfStock, icon: <TrendingUp size={26} />, color: 'red' },
        { title: 'Net Asset Value', value: `₹${stats.totalValue.toLocaleString()}`, icon: <DollarSign size={26} />, color: 'green' },
    ];

    if (loading) return <div className="loading">Initializing Core Systems...</div>;

    return (
        <div className="dashboard-page animate-in">
            {error && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '12px',
                        padding: '1rem 1.5rem',
                        marginBottom: '1.5rem',
                        color: '#fca5a5',
                        fontSize: '0.9rem'
                    }}
                >
                    ⚠️ Backend server is not responding. Showing cached data. Please ensure the backend is running on port 5000.
                </motion.div>
            )}

            <div className="stats-grid">
                {cards.map((card, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ scale: 1.02, translateY: -5 }}
                        className={`stat-card ${card.color} glass`}
                    >
                        <div className="stat-icon-container">
                            <div className="stat-icon">{card.icon}</div>
                        </div>
                        <div className="stat-info">
                            <h3>{card.title}</h3>
                            <p>{card.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="dashboard-content"
            >
                <div className="intelligence-card glass">
                    <div className="intel-header">
                        <Activity size={24} style={{ color: 'var(--primary)' }} />
                        <h2>Operational Intelligence</h2>
                    </div>
                    <div className="intel-grid">
                        <div className="intel-item">
                            <div className="intel-label-group">
                                <Zap size={14} />
                                <span className="intel-label">System Performance</span>
                            </div>
                            <span className="intel-value">{error ? 'Offline' : '99.9% Stable'}</span>
                        </div>
                        <div className="intel-item">
                            <div className="intel-label-group">
                                <AlertTriangle size={14} />
                                <span className="intel-label">Critical Protocols</span>
                            </div>
                            <span className="intel-value">{stats.lowStock + stats.outOfStock > 0 ? 'Action Needed' : 'Nominal'}</span>
                        </div>
                        <div className="intel-item">
                            <div className="intel-label-group">
                                <Layers size={14} />
                                <span className="intel-label">Data Synchronization</span>
                            </div>
                            <span className="intel-value">{error ? 'Disconnected' : 'Verified'}</span>
                        </div>
                    </div>
                    <div className="intel-footer">
                        <p>Total units tracked: <strong>{stats.totalItems}</strong> | Last analysis: <strong>Just now</strong></p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;
