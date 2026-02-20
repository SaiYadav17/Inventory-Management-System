import React, { useEffect, useState } from 'react';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    X
} from 'lucide-react';
import { getInventory, createInventory, updateInventory, deleteInventory } from '../api/inventoryService';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Inventory: React.FC = () => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        itemName: '',
        category: '',
        quantity: 0,
        price: 0,
        supplier: '',
        status: 'In Stock'
    });

    const fetchItems = async () => {
        setLoading(true);
        try {
            const data = await getInventory();
            setItems(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await updateInventory(editingItem._id, formData);
            } else {
                await createInventory(formData);
            }
            setShowModal(false);
            setEditingItem(null);
            setFormData({ itemName: '', category: '', quantity: 0, price: 0, supplier: '', status: 'In Stock' });
            fetchItems();
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (item: any) => {
        setEditingItem(item);
        setFormData({
            itemName: item.itemName,
            category: item.category,
            quantity: item.quantity,
            price: item.price,
            supplier: item.supplier || '',
            status: item.status
        });
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await deleteInventory(id);
                fetchItems();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const filteredItems = items.filter(item =>
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="inventory-page">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="page-actions"
            >
                <div className="search-bar glass">
                    <Search size={20} className="text-muted" />
                    <input
                        type="text"
                        placeholder="Search intelligence..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="glass-input"
                    />
                </div>
                {user?.role === 'admin' && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="add-btn"
                        onClick={() => { setEditingItem(null); setShowModal(true); }}
                    >
                        <Plus size={20} />
                        <span>Deploy Item</span>
                    </motion.button>
                )}
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="table-container glass"
            >
                <table className="inventory-table">
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Category</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Status</th>
                            {user?.role === 'admin' && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {filteredItems.map((item, idx) => (
                                <motion.tr
                                    key={item._id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <td>{item.itemName}</td>
                                    <td>{item.category}</td>
                                    <td>{item.quantity}</td>
                                    <td>₹{item.price}</td>
                                    <td>
                                        <span className={`status-badge ${item.status.toLowerCase().replace(' ', '-')}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    {user?.role === 'admin' && (
                                        <td className="actions-cell">
                                            <button onClick={() => handleEdit(item)} className="icon-btn edit">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(item._id)} className="icon-btn delete">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    )}
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
                {loading && <div className="loading">Processing...</div>}
                {!loading && filteredItems.length === 0 && (
                    <div className="empty-state">No matches found in database.</div>
                )}
            </motion.div>

            <AnimatePresence>
                {showModal && (
                    <div className="modal-overlay">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 20 }}
                            className="modal-content glass"
                        >
                            <div className="modal-header">
                                <h2>{editingItem ? 'Edit Protocol' : 'New Deployment'}</h2>
                                <button onClick={() => setShowModal(false)} className="close-btn"><X size={20} /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="modal-form">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Item Name</label>
                                        <input name="itemName" value={formData.itemName} onChange={handleChange} required className="glass-input" />
                                    </div>
                                    <div className="form-group">
                                        <label>Category</label>
                                        <input name="category" value={formData.category} onChange={handleChange} required className="glass-input" />
                                    </div>
                                    <div className="form-group">
                                        <label>Quantity</label>
                                        <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required className="glass-input" />
                                    </div>
                                    <div className="form-group">
                                        <label>Price</label>
                                        <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required className="glass-input" />
                                    </div>
                                    <div className="form-group">
                                        <label>Supplier</label>
                                        <input name="supplier" value={formData.supplier} onChange={handleChange} className="glass-input" />
                                    </div>
                                    <div className="form-group">
                                        <label>Status</label>
                                        <select name="status" value={formData.status} onChange={handleChange} className="glass-input">
                                            <option value="In Stock">In Stock</option>
                                            <option value="Low Stock">Low Stock</option>
                                            <option value="Out of Stock">Out of Stock</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">Abort</button>
                                    <button type="submit" className="save-btn">Confirm Changes</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Inventory;
