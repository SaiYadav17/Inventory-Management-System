import Inventory from '../models/Inventory.js';

export const getInventory = async (req, res) => {
    const items = await Inventory.find({});
    res.json(items);
};

export const createInventory = async (req, res) => {
    const { itemName, category, quantity, price, supplier, status } = req.body;

    const item = new Inventory({
        itemName,
        category,
        quantity,
        price,
        supplier,
        status,
    });

    const createdItem = await item.save();
    res.status(201).json(createdItem);
};

export const updateInventory = async (req, res) => {
    const { itemName, category, quantity, price, supplier, status } = req.body;

    const item = await Inventory.findById(req.params.id);

    if (item) {
        item.itemName = itemName || item.itemName;
        item.category = category || item.category;
        item.quantity = quantity !== undefined ? quantity : item.quantity;
        item.price = price !== undefined ? price : item.price;
        item.supplier = supplier || item.supplier;
        item.status = status || item.status;

        const updatedItem = await item.save();
        res.json(updatedItem);
    } else {
        res.status(404).json({ message: 'Item not found' });
    }
};

export const deleteInventory = async (req, res) => {
    const item = await Inventory.findById(req.params.id);

    if (item) {
        await Inventory.deleteOne({ _id: req.params.id });
        res.json({ message: 'Item removed' });
    } else {
        res.status(404).json({ message: 'Item not found' });
    }
};
