
import React, { useEffect, useState } from 'react';

const ProductManagement = ({ setProducts }) => {
    const [productDetails, setProductDetails] = useState({
        id: null,
        name: '',
        description: '',
        category: '',
        price: '',
        stock: ''
    });
    const [editIndex, setEditIndex] = useState(null);
    const [products, setProductsState] = useState([]);
    const [showInventory, setShowInventory] = useState(true);
    const [message, setMessage] = useState('');

    // Fetch products from the database on component mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/products');
                const data = await response.json();
                setProductsState(data);
                setProducts(data);  // Set parent state
            } catch (error) {
                console.error('Error fetching products:', error);
                setMessage('Failed to fetch products.');
            }
        };

        fetchProducts();
    }, [setProducts]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newProduct = { ...productDetails };

        if (editIndex === null) {
            // Add new product
            try {
                const response = await fetch('http://localhost:5000/api/products', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newProduct),
                });
                const addedProduct = await response.json();
                setProductsState((prevProducts) => [...prevProducts, { ...newProduct, id: addedProduct.id }]);
                setProducts((prevProducts) => [...prevProducts, { ...newProduct, id: addedProduct.id }]);
                setMessage('Product added successfully!');
            } catch (error) {
                console.error('Error adding product:', error);
                setMessage('Error adding product.');
            }
        } else {
            // Edit existing product
            try {
                await fetch(`http://localhost:5000/api/products/${productDetails.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newProduct),
                });
                setProductsState((prevProducts) =>
                    prevProducts.map((product, index) =>
                        index === editIndex ? newProduct : product
                    )
                );
                setProducts((prevProducts) =>
                    prevProducts.map((product) =>
                        product.id === productDetails.id ? newProduct : product
                    )
                );
                setMessage('Product updated successfully!');
                setEditIndex(null);
            } catch (error) {
                console.error('Error updating product:', error);
                setMessage('Error updating product.');
            }
        }
        resetProductDetails();
    };

    const resetProductDetails = () => {
        setProductDetails({ id: null, name: '', description: '', category: '', price: '', stock: '' });
    };

    const handleEdit = (index) => {
        const productToEdit = products[index];
        setEditIndex(index);
        setProductDetails(productToEdit);
    };

    const handleDelete = async (index) => {
        const product = products[index]; // Get the product
        if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
            try {
                await fetch(`http://localhost:5000/api/products/${product.id}`, {
                    method: 'DELETE',
                });
                setProductsState((prevProducts) => prevProducts.filter((_, i) => i !== index));
                setProducts((prevProducts) => prevProducts.filter((p) => p.id !== product.id));
                setMessage('Product deleted successfully!');
            } catch (error) {
                console.error('Error deleting product:', error);
                setMessage('Error deleting product.');
            }
        }
    };

    return (
        <div>
            <h2>Product Management</h2>
            {message && <div className="message">{message}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Product Name"
                    value={productDetails.name}
                    onChange={(e) => setProductDetails({ ...productDetails, name: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={productDetails.description}
                    onChange={(e) => setProductDetails({ ...productDetails, description: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Category"
                    value={productDetails.category}
                    onChange={(e) => setProductDetails({ ...productDetails, category: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={productDetails.price}
                    onChange={(e) => setProductDetails({ ...productDetails, price: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Stock Level"
                    value={productDetails.stock}
                    onChange={(e) => setProductDetails({ ...productDetails, stock: e.target.value })}
                    required
                />
                <button type="submit">{editIndex === null ? 'Add Product' : 'Update Product'}</button>
            </form>

            <button onClick={() => setShowInventory(!showInventory)}>
                {showInventory ? 'Hide Inventory' : 'View Inventory'}
            </button>

            {showInventory && (
                <>
                    <h3>Inventory</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Category</th>
                                <th>Price (M)</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length > 0 ? (
                                products.map((product, index) => (
                                    <tr key={product.id}>
                                        <td>{product.name}</td>
                                        <td>{product.description}</td>
                                        <td>{product.category}</td>
                                        <td>{product.price}</td>
                                        <td>{product.stock}</td>
                                        <td>
                                            <button onClick={() => handleEdit(index)}>Edit</button>
                                            <button onClick={() => handleDelete(index)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="6">No products in inventory.</td></tr>
                            )}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default ProductManagement;
