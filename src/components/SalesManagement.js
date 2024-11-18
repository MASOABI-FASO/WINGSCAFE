
import React, { useState } from 'react';

const SalesManagement = ({ products, setSales }) => {
    const [selectedProductIndex, setSelectedProductIndex] = useState(0);
    const [quantityToSell, setQuantityToSell] = useState(1);
    const [message, setMessage] = useState('');

    /*const sellProduct = async () => {
        if (quantityToSell > 0 && quantityToSell <= products[selectedProductIndex].stock) {
            // Save sale to database
            const productToSell = products[selectedProductIndex];
            try {
                await fetch('http://localhost:5000/api/sales', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ productId: productToSell.id, quantity: quantityToSell }),
                });

                // Update the sales state locally and notify the user
                setSales(prevSales => {
                    const newSales = Array.isArray(prevSales) ? prevSales : [];
                    return [...newSales, { product_id: productToSell.id, quantity: quantityToSell }];
                });

                // Update the message and reset quantity to sell
                setMessage(`Sold ${quantityToSell} of ${productToSell.name}`);
                setQuantityToSell(1); // Reset quantity after sale

            } catch (error) {
                console.error('Error selling product:', error);
            }
        } else {
            setMessage('Invalid quantity. Please check stock levels.');
        }
    };*/
    const sellProduct = async () => {
        if (quantityToSell > 0 && quantityToSell <= products[selectedProductIndex].stock) {
            // Save sale to database
            const productToSell = products[selectedProductIndex];
            try {
                // First, create the sale entry
                await fetch('http://localhost:5000/api/sales', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ productId: productToSell.id, quantity: quantityToSell }),
                });
    
                // Now, update the product's stock (decrease the stock)
                await fetch(`http://localhost:5000/api/products/${productToSell.id}/stock`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ quantity: -quantityToSell }), // Sending negative quantity to deduct stock
                });
    
                // Update the sales state locally and notify the user
                setSales(prevSales => {
                    const newSales = Array.isArray(prevSales) ? prevSales : [];
                    return [...newSales, { product_id: productToSell.id, quantity: quantityToSell }];
                });
    
                // Update the message and reset quantity to sell
                setMessage(`Sold ${quantityToSell} of ${productToSell.name}`);
                setQuantityToSell(1); // Reset quantity after sale
    
            } catch (error) {
                console.error('Error selling product:', error);
                setMessage('Error processing the sale. Please try again.');
            }
        } else {
            setMessage('Invalid quantity. Please check stock levels.');
        }
    };

    return (
        <div>
            <h2>Sales Management</h2>
            <h3>Product List</h3>
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
                    {products.map((product, index) => (
                        <tr key={index}>
                            <td>{product.name || 'Unnamed Product'}</td>
                            <td>{product.description || 'No Description'}</td>
                            <td>{product.category || 'Uncategorized'}</td>
                            <td>{product.price }</td>
                            <td>{product.stock}</td>
                            <td>
                                <button onClick={() => setSelectedProductIndex(index)}>Sell</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {products[selectedProductIndex] && (
                <div>
                    <h3>Sell Product: {products[selectedProductIndex].name}</h3>
                    <input
                        type="number"
                        value={quantityToSell}
                        onChange={(e) => setQuantityToSell(Number(e.target.value))}
                        min="1"
                        max={products[selectedProductIndex].stock}
                        placeholder="Quantity"
                    />
                    <button onClick={sellProduct}>Confirm Sell</button>
                </div>
            )}
            {message && <div className="message">{message}</div>}
        </div>
    );
};

export default SalesManagement;
