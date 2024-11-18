

import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

const SoldProducts = ({ soldProducts }) => {
    return (
        <div>
            <h2>Sold Products</h2>
            <table>
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Quantity Sold</th>
                        <th>Total Price (M)</th> {/* Added currency symbol for clarity */}
                    </tr>
                </thead>
                <tbody>
                    {soldProducts.length > 0 ? (
                        soldProducts.map((sale, index) => (
                            <tr key={index}>
                                <td>{sale.name}</td>
                                <td>{sale.quantity}</td>
                                <td>{`M${sale.totalPrice.toFixed(2)}`}</td> {/* Format as currency */}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No products sold yet.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default SoldProducts;
