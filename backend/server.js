// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 5000;

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'MASOABI', 
    database: 'wingscafe' 
});

db.connect((err) => {
    if (err) {
        console.error('Could not connect to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL Database');
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API to get users
app.get('/api/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).send(err);
        }
        console.log('Fetched users:', results); // Log the results to console
        res.json(results);
    });
});

// User Registration Route
app.post('/api/users/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error('Database error during user check:', err);
            return res.status(500).json({ message: 'Internal server error.' });
        }

        if (results.length > 0) {
            return res.status(409).json({ message: 'Username already exists.' });
        }

        db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err, results) => {
            if (err) {
                console.error('Database error during user insertion:', err);
                return res.status(500).json({ message: 'Failed to add user. Please try again.' });
            }
            res.status(201).json({ message: 'User registered successfully' });
        });
    });
});

// Delete User Route
app.delete('/api/users/:username', (req, res) => {
    const { username } = req.params;

    db.query('DELETE FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error('Database error during user deletion:', err);
            return res.status(500).json({ message: 'Internal server error.' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.json({ message: 'User deleted successfully.' });
    });
});

// Product Routes
app.post('/api/products', (req, res) => {
    const { name, description, category, price, stock } = req.body;
    db.query('INSERT INTO products (name, description, category, price, stock) VALUES (?, ?, ?, ?, ?)',
        [name, description, category, price, stock], (err, results) => {
            if (err) {
                console.error('Database error during product insertion:', err);
                return res.status(500).json(err);
            }
            res.status(201).json({ message: 'Product added' });
        });
});

app.get('/api/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) {
            console.error('Database error fetching products:', err);
            return res.status(500).json(err);
        }
        res.json(results);
    });
});

app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM products WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Database error during product deletion:', err);
            return res.status(500).json(err);
        }
        res.json({ message: `Product ${id} deleted` });
    });
});

// Sales Routes
app.post('/api/sales', (req, res) => {
    const { productId, quantity } = req.body;

    // First, deduct the stock for the sold product in the products table
    db.query('UPDATE products SET stock = stock - ? WHERE id = ?', [quantity, productId], (err, updateResult) => {
        if (err) {
            console.error('Database error during stock update:', err);
            return res.status(500).json({ message: 'Failed to update product stock. Internal server error.' });
        }
        
        // Check if the product still has stock available
        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found or insufficient stock.' });
        }

        // If stock is successfully updated, record the sale
        db.query('INSERT INTO sales (product_id, quantity) VALUES (?, ?)', [productId, quantity], (err, results) => {
            if (err) {
                console.error('Database error during sale insertion:', err);
                return res.status(500).json(err);
            }
            res.status(201).json({ message: 'Sale recorded and stock updated.' });
        });
    });
});

app.get('/api/sales', (req, res) => {
    db.query('SELECT * FROM sales', (err, results) => {
        if (err) {
            console.error('Database error fetching sales:', err);
            return res.status(500).json(err);
        }
        res.json(results);
    });
});

// Update Product Route
app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, category, price, stock } = req.body;

    // Create an array for the fields to be updated
    const updates = [];
    const values = [];
    
    // Check which fields are provided in the request and prepare the query accordingly
    if (name !== undefined) {
        updates.push('name = ?');
        values.push(name);
    }
    if (description !== undefined) {
        updates.push('description = ?');
        values.push(description);
    }
    if (category !== undefined) {
        updates.push('category = ?');
        values.push(category);
    }
    if (price !== undefined) {
        updates.push('price = ?');
        values.push(price);
    }
    if (stock !== undefined) {
        updates.push('stock = ?');
        values.push(stock);
    }

    // Ensure there's at least one field to update
    if (updates.length === 0) {
        return res.status(400).json({ message: 'No fields to update.' });
    }

    // Construct the SQL query
    const sqlQuery = `UPDATE products SET ${updates.join(', ')} WHERE id = ?`;
    values.push(id);

    // Execute the update query
    db.query(sqlQuery, values, (err, results) => {
        if (err) {
            console.error('Database error during product update:', err);
            return res.status(500).json({ message: 'Internal server error.' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        res.json({ message: 'Product updated successfully.' });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// User Registration Route
app.post('/api/users/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error('Database error during user check:', err);
            return res.status(500).json({ message: 'Internal server error.' });
        }

        if (results.length > 0) {
            return res.status(409).json({ message: 'Username already exists.' });
        }

        db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err, results) => {
            if (err) {
                console.error('Database error during user insertion:', err);
                return res.status(500).json({ message: 'Failed to add user. Please try again.' });
            }
            res.status(201).json({ message: 'User registered successfully' });
        });
    });
});

// Delete User Route
app.delete('/api/users/:username', (req, res) => {
    const { username } = req.params;

    db.query('DELETE FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error('Database error during user deletion:', err);
            return res.status(500).json({ message: 'Internal server error.' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.json({ message: 'User deleted successfully.' });
    });
});