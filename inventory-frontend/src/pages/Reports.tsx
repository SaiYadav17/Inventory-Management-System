import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { getInventory } from '../api/inventoryService';
import { motion } from 'framer-motion';

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981'];

const Reports: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const inventory = await getInventory();
                setData(inventory);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Process data for charts
    const categoryData = data.reduce((acc: any[], item: any) => {
        const found = acc.find(a => a.name === item.category);
        if (found) { found.value += 1; }
        else { acc.push({ name: item.category, value: 1 }); }
        return acc;
    }, []);

    const stockLevelData = data.map(item => ({
        name: item.itemName,
        quantity: item.quantity,
        price: item.price
    })).slice(0, 10); // Show top 10 for bar chart

    if (loading) return <div className="loading">Analyzing Data...</div>;

    return (
        <div className="reports-page">
            <div className="reports-grid">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="report-card glass"
                >
                    <h3>Category Distribution</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="report-card glass"
                >
                    <h3>Stock Levels (Top 10)</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={stockLevelData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                                <Bar dataKey="quantity" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="report-card glass"
                    style={{ gridColumn: 'span 2' }}
                >
                    <h3>Inventory Value vs Stock</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <LineChart data={stockLevelData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis yAxisId="left" stroke="#6366f1" />
                                <YAxis yAxisId="right" orientation="right" stroke="#a855f7" />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                                <Legend />
                                <Line yAxisId="left" type="monotone" dataKey="quantity" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
                                <Line yAxisId="right" type="monotone" dataKey="price" stroke="#a855f7" strokeWidth={2} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Reports;
