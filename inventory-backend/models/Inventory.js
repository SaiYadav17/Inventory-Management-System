import mongoose from 'mongoose';

const inventorySchema = mongoose.Schema(
    {
        itemName: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            default: 0,
        },
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        supplier: {
            type: String,
        },
        status: {
            type: String,
            required: true,
            enum: ['In Stock', 'Low Stock', 'Out of Stock'],
            default: 'In Stock',
        },
    },
    {
        timestamps: true,
    }
);

const Inventory = mongoose.model('Inventory', inventorySchema);

export default Inventory;
